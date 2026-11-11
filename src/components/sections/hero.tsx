import Image from "next/image";
import { Download, Mail, MapPin } from "lucide-react";
import type { Resume } from "@/data/types";
import { withBasePath } from "@/lib/base-path";
import { Button } from "@/components/ui/button";

export function Hero({ cv }: { cv: Resume }) {
  return (
    <section id="top" aria-labelledby="hero-name" className="flex flex-col gap-5 pt-10 pb-6 sm:pt-16 print:gap-3 print:pt-0 print:pb-2">
      <Image
        src={withBasePath(cv.avatar)}
        alt={cv.name}
        width={96}
        height={96}
        priority
        className="size-20 rounded-full object-cover ring-1 ring-border sm:size-24"
      />
      <div className="flex flex-col gap-2">
        <h1 id="hero-name" className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {cv.name}
        </h1>
        <p className="text-xl font-medium text-accent-brand">{cv.roles[0]}</p>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin aria-hidden="true" className="size-4" />
          <span>{cv.location}</span>
        </p>
      </div>
      <p className="max-w-prose text-base text-muted-foreground">{cv.pitch}</p>
      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg" className="bg-accent-brand text-background hover:bg-accent-brand/85">
          <a href="#contact">
            <Mail aria-hidden="true" />
            Contact
          </a>
        </Button>
        <Button asChild size="lg" variant="outline">
          <a href={withBasePath(cv.cvPdf)} download>
            <Download aria-hidden="true" />
            Download CV
          </a>
        </Button>
      </div>
    </section>
  );
}
