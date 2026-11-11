import type { Resume } from "./types";

/**
 * The single source of truth for all CV content on the site.
 * Components only read from here. `npm run test:unit` checks it against the content rules
 * (2-4 bullets per role, summaries <= 140 chars, pitch <= 160 chars, valid dates and email).
 */
export const resume: Resume = {
  name: "Tom Cuthbertson",
  roles: ["Software Engineer", "AI Engineer", "Full-Stack Developer"],
  location: "Belfast, United Kingdom",
  pitch:
    "Software engineer building AI and backend systems from start to finish, and explaining them clearly to technical and non-technical people.",
  avatar: "/avatar.webp",
  cvPdf: "/cv.pdf",

  stats: [
    { label: "Years building software", value: 5, suffix: "+" },
    { label: "Players in playtests", value: 202 },
    { label: "Funding raised", value: 85, prefix: "£", suffix: "k" },
  ],

  about:
    "I'm a software engineer in Belfast who builds software from start to finish, from APIs and AI systems to games, and explains it clearly to technical and non-technical people. " +
    'Recently I built a Python RAG assistant on Azure OpenAI that answers questions from GOV.UK guidance with citations and "I don\'t know" guardrails, and a Java margin service that publishes events to Kafka. ' +
    "Before that I built Spring Boot microservices for critical insurance systems at Allstate, co-founded two game studios that raised £85,000 in funding, and now teach games development at South West College. " +
    "I write tests first, keep designs simple, and care about getting software into production.",

  work: [
    {
      company: "South West College",
      title: "Associate Lecturer, Games Development",
      start: "2024-09",
      highlights: [
        "Teach game development to students of all experience levels, explaining technical subjects clearly.",
        "Promoted from part-time lecturer (Sept 2024) to permanent Associate Lecturer (Sept 2026).",
      ],
    },
    {
      company: "Monitr",
      title: "Founder & Lead Programmer",
      start: "2024",
      highlights: [
        "Ran online playtests with 202 players and turned their defect reports and feedback into a prioritised backlog.",
        "Lead development of Unreal Engine 5 game prototypes from concept to release, planning work with agile methods.",
        "Run structured QA: reproducible defect reports, triage by severity, and regression checks before every build.",
        "Report progress and technical plans to funding bodies and external stakeholders.",
      ],
      tech: ["Unreal Engine 5", "Blueprints", "Git", "Steamworks"],
    },
    {
      company: "Sure Why Not?",
      title: "Co-Founder & Senior Programmer",
      start: "2022",
      end: "2024",
      highlights: [
        "Secured £85,000 from Northern Ireland Screen and regional funds by pitching the game's audience, USPs and delivery plan.",
        "Built and maintained production game systems in C# (Unity), and took part in technical design, code reviews and architecture decisions.",
        "Designed an event-driven architecture with C# events and the observer pattern, keeping gameplay logic separate from the UI.",
        "Ran structured QA on development builds, and managed freelance artists from concept art to 3D models.",
      ],
      tech: ["Unity", "C#", "Git", "Steamworks"],
    },
    {
      company: "Allstate Northern Ireland",
      title: "Full-Stack Developer",
      start: "2021",
      end: "2022",
      highlights: [
        "Designed, built, tested and maintained 3 REST API microservices supporting critical insurance systems.",
        "Raised test coverage above 70% of production code by writing tests first with JUnit, using clean code and SOLID principles.",
        "Built enterprise insurance applications with Java SE 16, Spring Boot and React, packaged in Docker containers.",
        "Worked in an agile team of 24: sprint planning, estimates and backlog refinement in Jira, design docs in Confluence, and Jenkins CI/CD.",
      ],
      tech: ["Java SE 16", "Spring Boot", "React 17", "Docker", "Jenkins", "REST APIs", "JUnit", "SQL", "Git"],
    },
  ],

  skills: {
    "Languages & frameworks": [
      "Python", "Java (SE 16, 21)", "C#", "JavaScript (React)", "SQL", "FastAPI",
      "Spring Boot", "REST APIs", "Microservices", "pytest", "JUnit",
    ],
    "AI & cloud": [
      "LLMs and RAG", "Azure OpenAI", "Azure AI Search", "Hybrid search", "Guardrails",
      "Azure Container Apps", "Azure Blob Storage", "Managed identity", "Bicep and azd",
      "AI-assisted development (Claude Code)",
    ],
    Engineering: [
      "API design (OpenAPI, AsyncAPI)", "Event-driven design (Kafka)", "Defect analysis and repair",
      "TDD", "Clean code and SOLID", "Code reviews",
    ],
    "Delivery & people": [
      "Stakeholder and funder communication", "Technical teaching", "User feedback to backlog",
      "Agile (Scrum, Kanban)", "Jira", "Confluence",
    ],
    Tooling: ["Docker", "Jenkins", "GitHub Actions CI/CD", "Git", "Maven"],
  },

  projects: [
    {
      name: "GOV.UK RAG Assistant",
      summary:
        'Azure RAG assistant that answers UK employee-rights questions from GOV.UK guidance, with citations and "I don\'t know" guardrails.',
      tech: ["Python", "FastAPI", "Azure OpenAI", "Azure AI Search", "Bicep"],
      year: "2026",
      repoUrl: "https://github.com/cypherz01/govuk-rag-assistant",
      featured: true,
    },
    {
      name: "Margin Service",
      summary:
        "Spring Boot microservice that calculates portfolio margin and collateral, with OpenAPI specs and Kafka margin-call events.",
      tech: ["Java 21", "Spring Boot 3", "Kafka", "Docker"],
      year: "2026",
      repoUrl: "https://github.com/cypherz01/margin-service",
    },
  ],

  education: [
    { qualification: "BSc Computer Science (First-Class Honours)", institution: "Ulster University", start: "2016", end: "2020" },
    { qualification: "PGDip International Business", institution: "Ulster University", start: "2024", end: "2025" },
  ],

  contact: {
    email: "mrtomcuthbertson@gmail.com",
    github: "https://github.com/cypherz01",
  },
  availability: "Open to software engineering roles in Belfast or remote.",
  lastUpdated: "2026-11-11",
};
