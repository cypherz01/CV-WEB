import { CvPage } from "@/components/cv-page";
import { resume } from "@/data/resume";

export default function Home() {
  return <CvPage cv={resume} />;
}
