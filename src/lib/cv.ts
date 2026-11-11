import type { Resume, Stat } from "@/data/types";

/** A CV date: "YYYY" or "YYYY-MM". */
export type CvDate = string;

export type DateRange = { start: CvDate; end?: CvDate };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

function formatDate(date: CvDate): string {
  const [year, month] = date.split("-");
  return month ? `${MONTHS[Number(month) - 1]} ${year}` : year;
}

export function formatDateRange({ start, end }: DateRange): string {
  return `${formatDate(start)} – ${end ? formatDate(end) : "Present"}`;
}

/** "2024" sorts before "2024-01": a year-only date carries no month, so treat it as month 00. */
const sortable = (date: CvDate) => (date.length === 4 ? `${date}-00` : date);

/** Newest start first; for equal starts an ongoing role (no end) comes first, then the later end. */
export function sortRolesNewestFirst<T extends DateRange>(roles: readonly T[]): T[] {
  return [...roles].sort((a, b) => {
    const byStart = sortable(b.start).localeCompare(sortable(a.start));
    if (byStart !== 0) return byStart;
    if (!a.end || !b.end) return a.end ? 1 : b.end ? -1 : 0;
    return sortable(b.end).localeCompare(sortable(a.end));
  });
}

const CV_DATE = /^\d{4}(-(0[1-9]|1[0-2]))?$/;
/** A bare address (the page adds "mailto:"): no spaces, one @, a dot in the domain. */
const EMAIL = /^[^\s@:]+@[^\s@]+\.[^\s@]+$/;

/**
 * Checks the CV against the content rules in the design spec.
 * Returns one message per problem, each starting with the field path; [] means valid.
 */
export function validateResume(cv: Resume): string[] {
  const errors: string[] = [];
  const checkDate = (path: string, date: string | undefined) => {
    if (date !== undefined && !CV_DATE.test(date)) {
      errors.push(`${path}: "${date}" is not YYYY or YYYY-MM`);
    }
  };

  if (cv.pitch.length > 160) {
    errors.push(`pitch: ${cv.pitch.length} characters, max 160 (it is also the meta description)`);
  }
  if (!EMAIL.test(cv.contact.email)) {
    errors.push(`contact.email: "${cv.contact.email}" is not a plain email address`);
  }

  cv.work.forEach((role, i) => {
    checkDate(`work[${i}].start`, role.start);
    checkDate(`work[${i}].end`, role.end);
    const bullets = role.highlights.length;
    if (bullets < 2 || bullets > 4) {
      errors.push(`work[${i}].highlights: has ${bullets} bullets, needs 2-4`);
    }
  });
  if (cv.projects.length < 1 || cv.projects.length > 6) {
    errors.push(`projects: has ${cv.projects.length}, needs 1-6`);
  }
  const featured = cv.projects.filter((p) => p.featured).length;
  if (featured > 1) {
    errors.push(`projects: ${featured} featured, at most 1 allowed`);
  }
  cv.projects.forEach((project, i) => {
    if (project.summary.length > 140) {
      errors.push(`projects[${i}].summary: ${project.summary.length} characters, max 140`);
    }
  });
  cv.education.forEach((entry, i) => {
    checkDate(`education[${i}].start`, entry.start);
    checkDate(`education[${i}].end`, entry.end);
  });

  return errors;
}

/** The final, human-readable value of a stat, e.g. "£85k". Also what NumberTicker settles on. */
export function formatStat({ value, prefix = "", suffix = "" }: Stat): string {
  return `${prefix}${value.toLocaleString("en-GB")}${suffix}`;
}

/** schema.org Person for the page's JSON-LD script. Location "Town, Country" splits on the first comma. */
export function toPersonJsonLd(cv: Resume) {
  const [locality, ...country] = cv.location.split(",").map((part) => part.trim());
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: cv.name,
    jobTitle: cv.roles[0],
    description: cv.pitch,
    email: `mailto:${cv.contact.email}`,
    address: { "@type": "PostalAddress", addressLocality: locality, addressCountry: country.join(", ") },
    sameAs: [cv.contact.github, cv.contact.linkedin].filter((url): url is string => Boolean(url)),
  };
}
