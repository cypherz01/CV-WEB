import type { Resume } from "@/data/types";

/**
 * Invented, known-good CV used by tests. Deliberately NOT derived from src/data/resume.ts,
 * so tests assert against literal values and never pass just because they read the same data.
 * Use `fixture()` to get a fresh copy you can mutate.
 */
const RESUME_FIXTURE: Resume = {
  name: "Alex Example",
  roles: ["Platform Engineer", "Data Engineer"],
  location: "Derry, United Kingdom",
  pitch: "Platform engineer who ships reliable data systems.",
  avatar: "/avatar.webp",
  cvPdf: "/cv.pdf",
  stats: [
    { label: "Years shipping", value: 7, suffix: "+" },
    { label: "Budget managed", value: 40, prefix: "£", suffix: "k" },
  ],
  about: "Alex builds data platforms. Alex likes boring technology.",
  work: [
    {
      company: "Northwind",
      title: "Senior Platform Engineer",
      start: "2023-03",
      highlights: ["Cut deploy time by 60%.", "Led 4 engineers."],
      tech: ["Go", "Kubernetes"],
    },
    {
      company: "Contoso",
      title: "Data Engineer",
      start: "2019",
      end: "2023",
      highlights: ["Built 12 pipelines.", "Halved warehouse costs.", "Mentored 3 juniors."],
    },
  ],
  skills: { Languages: ["Go", "SQL"], Tools: ["Terraform"] },
  projects: [
    {
      name: "Pipeline Kit",
      summary: "Toolkit for testing data pipelines locally.",
      tech: ["Go"],
      repoUrl: "https://github.com/alex-example/pipeline-kit",
      featured: true,
    },
    {
      name: "Cost Lens",
      summary: "Dashboard that explains cloud bills.",
      tech: ["TypeScript"],
      liveUrl: "https://costlens.example.com",
    },
  ],
  education: [{ qualification: "BSc Mathematics", institution: "Example University", start: "2012", end: "2016" }],
  contact: { email: "alex@example.com", github: "https://github.com/alex-example" },
  availability: "Open to platform roles.",
  lastUpdated: "2026-01-15",
};

export const fixture = (): Resume => structuredClone(RESUME_FIXTURE);
