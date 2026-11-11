import type { Resume } from "@/data/types";

// UTC so the date never shifts by a day between the build machine and the reader.
const LONG_DATE = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export function Footer({ cv }: { cv: Resume }) {
  return (
    <footer className="mx-auto w-full max-w-3xl px-4 pt-8 pb-24 text-sm text-muted-foreground sm:px-6 print:max-w-none print:px-0 print:pt-4 print:pb-0">
      <p>
        © {cv.name}. Last updated <time dateTime={cv.lastUpdated}>{LONG_DATE.format(new Date(cv.lastUpdated))}</time>
      </p>
    </footer>
  );
}
