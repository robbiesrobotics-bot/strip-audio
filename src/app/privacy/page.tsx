import type { Metadata } from "next";
import LegalPage, { CONTACT_EMAIL } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy — MediaFix",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy">
      <p>MediaFix is operated by Robbies Robotics LLC.</p>
      <p>
        When you upload a file, it is processed to produce the fixed file. The upload is held in
        temporary storage only while processing runs and is deleted when processing finishes.
      </p>
      <p>
        If you buy a paid plan, payment is handled by our payment processor. We keep a record of the
        purchase and the email address you provide so we can deliver what you bought and answer
        questions about it.
      </p>
      <p>Questions about privacy: {CONTACT_EMAIL}</p>
    </LegalPage>
  );
}
