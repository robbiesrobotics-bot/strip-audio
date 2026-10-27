import type { Metadata } from "next";
import LegalPage, { CONTACT_EMAIL } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Terms — MediaFix",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms">
      <p>MediaFix is operated by Robbies Robotics LLC.</p>
      <p>
        When you upload a file, it is processed to produce the fixed file. Only upload files you have
        the right to use. You keep whatever rights you have in your files.
      </p>
      <p>
        MediaFix helps prepare files for platform upload, but each platform sets its own requirements.
        We do not guarantee that a processed file will be accepted by any platform or will meet any
        specific technical standard.
      </p>
      <p>Questions about these terms: {CONTACT_EMAIL}</p>
    </LegalPage>
  );
}
