import type { CvDate } from "@/lib/cv";

export type Role = {
  company: string;
  logo?: string; // /logos/acme.svg; omitted = initials fallback
  title: string;
  start: CvDate; // "2024-09" or "2024"
  end?: CvDate; // omitted = "Present"
  location?: string;
  highlights: string[]; // 2-4 achievement bullets, lead with a number
  tech?: string[];
};

export type Project = {
  name: string;
  summary: string; // max 140 characters
  image?: string; // 1200x750 WebP; omitted = text-only card
  tech: string[];
  year?: string;
  liveUrl?: string;
  repoUrl?: string;
  featured?: boolean; // at most one: gets BorderBeam and the large bento cell
};

export type Stat = {
  label: string;
  value: number; // the number NumberTicker counts to
  prefix?: string; // "£"
  suffix?: string; // "+", "k"
};

export type Education = {
  qualification: string;
  institution: string;
  start?: CvDate;
  end: CvDate;
};

export type Resume = {
  name: string;
  roles: string[]; // fed to WordRotate; the first is the headline role
  location: string;
  pitch: string; // hero line and meta description, max 160 characters
  avatar: string;
  cvPdf: string;
  stats: Stat[];
  about: string;
  work: Role[];
  skills: Record<string, string[]>; // group label -> skills, rendered in insertion order
  projects: Project[];
  education: Education[];
  contact: { email: string; github?: string; linkedin?: string };
  availability: string;
  lastUpdated: string; // "YYYY-MM-DD"
};
