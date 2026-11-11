import { ImageResponse } from "next/og";
import { resume } from "@/data/resume";

// The link-preview card, rendered once at build time (no client JS). 1200 x 630 is what most sites expect.
export const dynamic = "force-static";
const size = { width: 1200, height: 630 };

// The id becomes the file name: "opengraph-image/card.png". GitHub Pages picks Content-Type from the
// extension, and an extensionless file would be served as application/octet-stream.
export function generateImageMetadata() {
  return [{ id: "card.png", size, contentType: "image/png", alt: `${resume.name}, ${resume.roles[0]}` }];
}

// Fixed colours: the image is a file, so it can't follow the CSS tokens. Light theme, indigo accent.
const BG = "#ffffff";
const FG = "#09090b";
const MUTED = "#52525b";
const ACCENT = "#4f46e5";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: BG,
          borderTop: `16px solid ${ACCENT}`,
        }}
      >
        <div style={{ fontSize: 84, fontWeight: 700, color: FG, letterSpacing: "-0.02em" }}>{resume.name}</div>
        <div style={{ fontSize: 38, color: ACCENT, marginTop: 12 }}>{resume.roles.join(" · ")}</div>
        <div style={{ fontSize: 32, color: MUTED, marginTop: 40, lineHeight: 1.4, maxWidth: 1000 }}>{resume.pitch}</div>
        <div style={{ fontSize: 28, color: MUTED, marginTop: 48 }}>{resume.location}</div>
      </div>
    ),
    size,
  );
}
