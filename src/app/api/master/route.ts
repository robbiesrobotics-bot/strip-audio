import { NextRequest, NextResponse } from "next/server";
import { mkdtemp, writeFile, unlink, readFile } from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import os from "os";

const execAsync = promisify(exec);

export const runtime = "nodejs";
export const maxDuration = 300;

interface MasterRequest {
  filename: string;
  fileBase64: string;
  analysis: {
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
  };
  enabledFilters: string[];
}

function buildFilterChain(req: Omit<MasterRequest, "fileBase64">): string {
  const { analysis } = req;
  const filters: string[] = [];

  // Base chain (always)
  filters.push("highpass=f=80");
  filters.push("lowpass=f=18000");

  // aecho: apply only if audio has substance — very short or silent files
  // can produce NaN/Inf with high in_gain or pipe-formatted decay values.
  // Using safer single-delay decay and requiring meaningful content/duration.
  const hasContent =
    analysis.dynamicRange !== null &&
    analysis.dynamicRange > 1 &&
    analysis.noiseFloor !== null &&
    analysis.noiseFloor > -70;
  if (hasContent) {
    // Safer echo: moderate in_gain (0.5), single delay (400ms), conservative decay (0.3)
    filters.push("aecho=0.5:0.9:400:0.3");
  }

  const isEnabled = (id: string) => req.enabledFilters.includes(id);

  // Compand (dynamic range)
  if (isEnabled("compand")) {
    const dr = analysis.dynamicRange ?? 10;
    if (dr < 6) {
      filters.push("compand=0.01:-50,-20:-8:-4:0.01:2:-90:0.1");
    } else if (dr > 15) {
      filters.push("compand=0.05:-40,-10:-5:-2:0.02:4:-70:0.15");
    } else {
      filters.push("compand=0.03:-40,-15:-6:-3:0.01:3:-80:0.1");
    }
  }

  // Noise reduction
  if (isEnabled("afftdn")) {
    const nf = analysis.noiseFloor ?? -50;
    if (nf >= -30) {
      filters.push("afftdn=nf=-30");
    } else if (nf < -40) {
      // Skip — very quiet noise floor
    } else {
      filters.push("afftdn=nf=-40");
    }
  }

  // Frequency balance EQ
  if (isEnabled("eq")) {
    if (analysis.lowEnergy > -50 && analysis.midEnergy > -50 && analysis.highEnergy > -50) {
      const highLowRatio = analysis.highEnergy - analysis.lowEnergy;
      const lowMidRatio = analysis.lowEnergy - analysis.midEnergy;
      if (highLowRatio > 6) {
        // Too bright — skip high boost
      } else if (lowMidRatio > 6) {
        // Too boomy — cut low
        filters.push("equalizer=f=100:width_type=h:width=0.5:gain=-3");
      } else if (lowMidRatio < -6) {
        // Too thin — boost low-mid
        filters.push("equalizer=f=150:width_type=h:width=0.8:gain=+2");
      }
    }
  }

  // Loudness normalization
  if (isEnabled("loudnorm")) {
    const lufs = analysis.lufs;
    if (lufs !== null) {
      if (lufs >= -12) {
        // Already loud — skip loudnorm, just limit
      } else if (lufs >= -15 && lufs <= -13) {
        filters.push("volume=+2dB");
      } else if (lufs >= -18 && lufs < -15) {
        filters.push("volume=+3dB");
      } else {
        filters.push("loudnorm=I=-14:TP=-1.5:LRA=11");
      }
    } else {
      filters.push("loudnorm=I=-14:TP=-1.5:LRA=11");
    }
  } else if (isEnabled("volume")) {
    const lufs = analysis.lufs;
    if (lufs !== null && lufs < -15) {
      filters.push("volume=+3dB");
    }
  }

  // Limiter (always for safety)
  if (isEnabled("alimiter")) {
    const limit = analysis.clipCount > 0 ? "0.9" : "0.95";
    filters.push(`alimiter=limit=${limit}`);
  }

  return filters.join(",");
}

export async function POST(request: NextRequest) {
  let tmpDir: string | null = null;
  let inputPath: string | null = null;
  let processedPath: string | null = null;
  let outputPath: string | null = null;

  try {
    const body: MasterRequest = await request.json();
    const { filename, fileBase64, analysis, enabledFilters } = body;

    if (!fileBase64) {
      return NextResponse.json({ error: "No file data" }, { status: 400 });
    }

    tmpDir = await mkdtemp(path.join(os.tmpdir(), "strip-"));
    inputPath = path.join(tmpDir, filename);
    await writeFile(inputPath, Buffer.from(fileBase64, "base64"));

    const filterChain = buildFilterChain({ filename, analysis, enabledFilters });

    // First pass: measure current LUFS for accurate loudnorm
    try {
      const pass1 = await execAsync(
        `ffmpeg -i "${inputPath}" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1`,
        { timeout: 120 * 1000 }
      );
      const match = pass1.stderr.match(/"input_i"\s*:\s*"([-\d.]+)"/);
      if (!match) throw new Error("loudnorm pass1 failed");
    } catch (e) {
      console.warn("loudnorm pass1 warning:", e);
    }

    // Apply filter chain with loudnorm
    processedPath = path.join(tmpDir, "processed.wav");
    const masterCmd = `ffmpeg -y -i "${inputPath}" -af "${filterChain},loudnorm=I=-14:TP=-1.5:LRA=11" -ar 48000 -ac 2 "${processedPath}" 2>&1`;
    const masterResult = await execAsync(masterCmd, { timeout: 180 * 1000 });

    // Output MP3 320kbps
    outputPath = path.join(tmpDir, "mastered.mp3");
    const mp3Cmd = `ffmpeg -y -i "${processedPath}" -codec:a libmp3lame -b:a 320k -ar 48000 -ac 2 "${outputPath}" 2>&1`;
    await execAsync(mp3Cmd, { timeout: 60 * 1000 });

    const mp3Buffer = await readFile(outputPath);
    const mp3Base64 = mp3Buffer.toString("base64");

    return NextResponse.json({
      success: true,
      mp3: mp3Base64,
      filename: filename.replace(/\.\w+$/, "") + "_mastered.mp3",
      filters: filterChain,
    });
  } catch (error: any) {
    console.error("Master error:", error);
    return NextResponse.json(
      { error: error.message || "Mastering failed" },
      { status: 500 }
    );
  } finally {
    // Cleanup
    if (inputPath) await unlink(inputPath).catch(() => {});
    if (processedPath) await unlink(processedPath).catch(() => {});
    if (outputPath) await unlink(outputPath).catch(() => {});
    if (tmpDir) {
      const { rmdir } = await import("fs/promises");
      await rmdir(tmpDir).catch(() => {});
    }
  }
}
