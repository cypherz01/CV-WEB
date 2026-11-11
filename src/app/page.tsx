import { CvPage } from "@/components/cv-page";
import { resume } from "@/data/resume";
import { toPersonJsonLd } from "@/lib/cv";

// "<" escaped so text in the CV can never close the script tag early.
const jsonLd = JSON.stringify(toPersonJsonLd(resume)).replace(/</g, "\\u003c");

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <CvPage cv={resume} />
    </>
  );
}
