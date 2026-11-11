import Image from "next/image";
import { Code, ExternalLink as ExternalIcon } from "lucide-react";
import type { Project, Resume } from "@/data/types";
import { withBasePath } from "@/lib/base-path";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ExternalLink } from "./external-link";
import { Section } from "./section";
import { TechBadges } from "./tech-badges";

/**
 * 1 column on phones; from md up, 2 columns with the featured project spanning both.
 * Works for 1-6 projects with no layout changes (see tests/e2e/layout.spec.ts).
 */
export function Projects({ cv }: { cv: Resume }) {
  const projects = [...cv.projects].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  return (
    <Section id="projects" title="Projects">
      <div data-testid="projects-grid" className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </Section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={cn(project.featured && "md:col-span-2")} data-featured={project.featured || undefined}>
      <Card className="h-full">
        {project.image && (
          <Image
            src={withBasePath(project.image)}
            alt={`Screenshot of ${project.name}`}
            width={1200}
            height={750}
            className="aspect-[1200/750] w-full object-cover"
          />
        )}
        <CardHeader>
          <CardTitle>
            <h3 className="font-semibold">{project.name}</h3>
          </CardTitle>
          <CardDescription>
            {project.summary}
            {project.year && <span className="sr-only"> ({project.year})</span>}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TechBadges items={project.tech} />
        </CardContent>
        {(project.liveUrl || project.repoUrl) && (
          <CardFooter className="gap-4 border-t-0 bg-transparent pt-0">
            {project.liveUrl && (
              <ExternalLink href={project.liveUrl} className="link inline-flex items-center gap-1.5 text-sm font-medium">
                <ExternalIcon aria-hidden="true" className="size-4" />
                Live site<span className="sr-only"> for {project.name}</span>
              </ExternalLink>
            )}
            {project.repoUrl && (
              <ExternalLink href={project.repoUrl} className="link inline-flex items-center gap-1.5 text-sm font-medium">
                <Code aria-hidden="true" className="size-4" />
                Code<span className="sr-only"> for {project.name}</span>
              </ExternalLink>
            )}
          </CardFooter>
        )}
      </Card>
    </article>
  );
}
