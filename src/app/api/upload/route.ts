import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import os from "os";

const execAsync = promisify(exec);

export const runtime = "nodejs";
export const maxDuration = 300;

interface AnalysisResult {
  lufs: number | null;
  peak: number | null;
  noiseFloor: number | null;
  dynamicRange: number | null;
  lra: number | null;
  clipCount: number;
  codec: string;
  bitrate: number;
  sampleRate: number;
  lowEnergy: number;
  midEnergy: number;
  highEnergy: number;
  issues: Array<{ id: string; name: string; description: string; severity: "critical" | "warning" | "info"; filter: string }>;
}

function parseLufsFromStderr(stderr: string): number | null {
  const match = stderr.match(/"input_i"\s*:\s*"([-\d.]+)"/);
  return match ? parseFloat(match[1]) : null;
}

function parseAstatsStats(stderr: string): { peak: number | null; noiseFloor: number | null; clipCount: number } {
  const lines = stderr.split("\n").reverse();
  let peak: number | null = null;
  let noiseFloor: number | null = null;
  let clipCount = 0;

  for (const line of lines) {
    if (peak === null) {
      const m = line.match(/Peak level dB(?:FS)?:\s*([-\d.]+)/);
      if (m) peak = parseFloat(m[1]);
    }
    if (noiseFloor === null) {
      const m = line.match(/Noise floor dB(?:FS)?:\s*([-\d.]+)/);
      if (m) noiseFloor = parseFloat(m[1]);
    }
    const cm = line.match(/Abs_Peak_count:\s*([\d.]+)/);
    if (cm) clipCount += parseInt(cm[1]);
  }

  return { peak, noiseFloor, clipCount };
}

function parseEbur128(stderr: string): { lufs: number | null; lra: number | null } {
  let lufs: number | null = null;
  let lra: number | null = null;

  for (const line of stderr.split("\n")) {
    const m1 = line.match(/lavfi\.r128\.I\s*=\s*([-\d.]+)/);
    if (m1) lufs = parseFloat(m1[1]);
    const m2 = line.match(/lavfi\.r128\.LRA\s*=\s*([-\d.]+)/);
    if (m2) lra = parseFloat(m2[1]);
  }

  return { lufs, lra };
}

function parseBitprobe(stderr: string): { codec: string; bitrate: number; sampleRate: number } {
  let codec = "unknown";
  let bitrate = 0;
  let sampleRate = 44100;

  for (const line of stderr.split("\n")) {
    const m = line.match(/codec_name\s*=\s*(\w+)/);
    if (m) codec = m[1];
    const b = line.match(/bit_rate\s*=\s*(\d+)/);
    if (b) bitrate = parseInt(b[1]);
    const s = line.match(/sample_rate\s*=\s*(\d+)/);
    if (s) sampleRate = parseInt(s[1]);
  }

  return { codec, bitrate, sampleRate };
}

async function runCommand(cmd: string, timeout = 60): Promise<{ stdout: string; stderr: string }> {
  try {
    return await execAsync(cmd, { timeout: timeout * 1000 });
  } catch (e: any) {
    return { stdout: e.stdout || "", stderr: e.stderr || String(e) };
  }
}

async function analyzeAudio(filePath: string): Promise<AnalysisResult> {
  const baseName = filePath.replace(/\.\w+$/, "");

  // Run all analysis commands in parallel
  const [lufsResult, astatsResult, eburResult, bitprobeResult, lowEnergyResult, midEnergyResult, highEnergyResult] =
    await Promise.all([
      runCommand(`ffmpeg -i "${filePath}" -af loudnorm=I=-16:print_format=json -f null - 2>&1`),
      runCommand(`ffmpeg -i "${filePath}" -af astats=metadata=1:measure_perchannel=RMS_level+Peak_level+Noise_floor+Abs_Peak_count -f null - 2>&1`),
      runCommand(`ffmpeg -i "${filePath}" -af ebur128=metadata=1 -f null - 2>&1`),
      runCommand(`ffprobe -v quiet -show_format -show_streams "${filePath}" 2>&1`),
      // Frequency bands
      runCommand(`ffmpeg -i "${filePath}" -af "lowpass=f=250,astats=metadata=1:measure_perchannel=RMS_level" -f null - 2>&1`, 60),
      runCommand(`ffmpeg -i "${filePath}" -af "highpass=f=250,lowpass=f=4000,astats=metadata=1:measure_perchannel=RMS_level" -f null - 2>&1`, 60),
      runCommand(`ffmpeg -i "${filePath}" -af "highpass=f=4000,astats=metadata=1:measure_perchannel=RMS_level" -f null - 2>&1`, 60),
    ]);

  // Parse LUFS (from loudnorm JSON in stderr)
  let lufs: number | null = null;
  const lufsMatch = lufsResult.stderr.match(/"input_i"\s*:\s*"([-\d.]+)"/);
  if (lufsMatch) {
    lufs = parseFloat(lufsMatch[1]);
  } else {
    // Fallback: use ebur128 I
    const eburLufs = parseEbur128(eburResult.stderr).lufs;
    lufs = eburLufs;
  }


  // Parse astats
  const { peak, noiseFloor, clipCount } = parseAstatsStats(astatsResult.stderr);

  // Parse ebur128
  const { lra } = parseEbur128(eburResult.stderr);

  // Parse bitprobe
  const { codec, bitrate, sampleRate } = parseBitprobe(bitprobeResult.stderr);

  // Dynamic range (LRA used as proxy; true DR needs a separate tool)
  const dynamicRange = lra;

  // Parse frequency energies
  function extractRMSFromAstats(stderr: string): number | null {
    for (const line of stderr.split("\n").reverse()) {
      const m = line.match(/RMS level dB\s*:\s*([-\d.]+)/);
      if (m) return parseFloat(m[1]);
    }
    return null;
  }

  const lowEnergy = extractRMSFromAstats(lowEnergyResult.stderr) ?? -60;
  const midEnergy = extractRMSFromAstats(midEnergyResult.stderr) ?? -60;
  const highEnergy = extractRMSFromAstats(highEnergyResult.stderr) ?? -60;

  // Build issues list
  const issues: AnalysisResult["issues"] = [];

  if (clipCount > 0) {
    issues.push({
      id: "clipping",
      name: "Clipping Detected",
      description: `${clipCount} samples above 0 dBFS — causes distortion on playback`,
      severity: "critical",
      filter: "alimiter",
    });
  }

  if (lufs !== null) {
    if (lufs > -12) {
      issues.push({
        id: "loudness",
        name: "Excessive Loudness",
        description: `Track is ${lufs.toFixed(1)} LUFS — too hot for streaming platforms`,
        severity: "warning",
        filter: "loudnorm",
      });
    } else if (lufs < -18) {
      issues.push({
        id: "loudness",
        name: "Low Loudness",
        description: `Track is ${lufs.toFixed(1)} LUFS — below streaming target (-16 LUFS)`,
        severity: "warning",
        filter: "loudnorm",
      });
    }
  }

  if (noiseFloor !== null && noiseFloor > -40) {
    issues.push({
      id: "noise",
      name: "Elevated Noise Floor",
      description: `Noise floor at ${noiseFloor.toFixed(1)} dBFS — audible hiss/hum`,
      severity: "warning",
      filter: "afftdn",
    });
  }

  if (dynamicRange !== null && dynamicRange < 6) {
    issues.push({
      id: "dynamic-range",
      name: "Compressed Dynamics",
      description: `Dynamic range only ${dynamicRange.toFixed(1)} LU — sounds flat and fatiguing`,
      severity: "warning",
      filter: "compand",
    });
  } else if (dynamicRange !== null && dynamicRange > 15) {
    issues.push({
      id: "dynamic-range",
      name: "Wild Dynamics",
      description: `Dynamic range ${dynamicRange.toFixed(1)} LU — may need gentle compression`,
      severity: "warning",
      filter: "compand",
    });
  }

  if (peak !== null && peak > -1) {
    issues.push({
      id: "peak",
      name: "High Peak Level",
      description: `Peaks at ${peak.toFixed(1)} dBFS — risk of clipping on limiting`,
      severity: "warning",
      filter: "alimiter",
    });
  }

  // Frequency balance (compare energy ratios)
  if (lowEnergy > -50 && midEnergy > -50 && highEnergy > -50) {
    const lowMidRatio = lowEnergy - midEnergy;
    const highLowRatio = highEnergy - lowEnergy;
    if (highLowRatio > 6) {
      issues.push({
        id: "freq-balance",
        name: "Excessive Brightness",
        description: "High frequencies dominate — may sound harsh on some systems",
        severity: "info",
        filter: "eq",
      });
    } else if (lowMidRatio > 6) {
      issues.push({
        id: "freq-balance",
        name: "Boominess",
        description: "Low frequencies dominate — sounds muddy on smaller speakers",
        severity: "info",
        filter: "eq",
      });
    }
  }

  // Bitrate warning (lossy codec)
  if (["mp3", "aac", "ogg", "opus"].includes(codec)) {
    issues.push({
      id: "bitrate",
      name: "Lossy Source Codec",
      description: `${codec.toUpperCase()} source — re-upload WAV/FLAC/AIFF for best results`,
      severity: "info",
      filter: "none",
    });
  }

  return {
    lufs,
    peak,
    noiseFloor,
    dynamicRange,
    lra,
    clipCount,
    codec,
    bitrate,
    sampleRate,
    lowEnergy,
    midEnergy,
    highEnergy,
    issues,
  };
}

export async function POST(request: NextRequest) {
  let filePath: string | null = null;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      "audio/wav", "audio/x-wav",
      "audio/flac", "audio/x-flac",
      "audio/aiff", "audio/x-aiff",
      "audio/mpeg", "audio/mp3",
    ];
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const allowedExts = ["wav", "flac", "aiff", "aif", "mp3"];

    if (!allowedTypes.includes(file.type) && !allowedExts.includes(ext)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    if (file.size > 500 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 500MB)" }, { status: 400 });
    }

    // Write to temp file
    const tmpDir = os.tmpdir();
    filePath = path.join(tmpDir, `strip-${Date.now()}-${file.name}`);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Analyze
    const analysis = await analyzeAudio(filePath);

    return NextResponse.json({ analysis, filename: file.name });
  } catch (error: any) {
    console.error("Analysis error:", error);
    return NextResponse.json({ error: error.message || "Analysis failed" }, { status: 500 });
  } finally {
    if (filePath) {
      await unlink(filePath).catch(() => {});
    }
  }
}
