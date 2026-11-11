import type { Resume } from "@/data/types";
import { About } from "./sections/about";
import { Contact } from "./sections/contact";
import { Education } from "./sections/education";
import { Experience } from "./sections/experience";
import { Footer } from "./sections/footer";
import { Hero } from "./sections/hero";
import { Projects } from "./sections/projects";
import { Skills } from "./sections/skills";

/** The whole CV, rendered from one Resume. Updating the CV means editing src/data/resume.ts only. */
export function CvPage({ cv }: { cv: Resume }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-background px-4 py-2 font-medium focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-3xl flex-1 px-4 outline-none sm:px-6 print:max-w-none print:px-0">
        <Hero cv={cv} />
        <About cv={cv} />
        <Experience cv={cv} />
        <Skills cv={cv} />
        <Projects cv={cv} />
        <Education cv={cv} />
        <Contact cv={cv} />
      </main>
      <Footer cv={cv} />
    </>
  );
}
