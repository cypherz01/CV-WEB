# Site content (source for `src/data/resume.ts`)

Content for the website. It follows the spec's rules: 2–4 bullets per role,
project summaries of 140 characters or less, and a pitch under 160 characters. M1 #9 copies this into `resume.ts`.
After that, `resume.ts` is the source of truth and this file is only a record.

## Identity

- **Name:** Tom Cuthbertson
- **Roles (rotating):** Software Engineer · AI Engineer · Full-Stack Developer
- **Location:** Belfast, United Kingdom
- **Avatar:** GitHub profile photo (`https://github.com/cypherz01.png`), saved as `public/avatar.webp`, alt "Tom Cuthbertson"
- **Pitch (hero line and meta description, 139 chars):**
  Software engineer building AI and backend systems from start to finish, and explaining them clearly to technical and non-technical people.

## About (personal statement)

I'm a software engineer in Belfast who builds software from start to finish, from APIs and AI systems to games, and
explains it clearly to technical and non-technical people. Recently I built a Python RAG assistant on Azure OpenAI
that answers questions from GOV.UK guidance with citations and "I don't know" guardrails, and a Java margin service
that publishes events to Kafka. Before that I built Spring Boot microservices for critical insurance systems at
Allstate, co-founded two game studios that raised £85,000 in funding, and now teach games development at South West
College. I write tests first, keep designs simple, and care about getting software into production.

## Stats

| Label | Value | Display |
|---|---|---|
| Years building software | 5 | 5+ |
| Players in playtests | 202 | 202 |
| Funding raised | 85 | £85k |

`Stat` therefore needs optional `prefix` and `suffix` fields (M1).

## Experience (newest first)

### Associate Lecturer, Games Development · South West College · 2024-09 – Present
- Teach game development to students of all experience levels, explaining technical subjects clearly.
- Promoted from part-time lecturer (Sept 2024) to permanent Associate Lecturer (Sept 2026).

### Founder & Lead Programmer · Monitr · 2024 – Present
- Ran online playtests with 202 players and turned their defect reports and feedback into a prioritised backlog.
- Lead development of Unreal Engine 5 game prototypes from concept to release, planning work with agile methods.
- Run structured QA: reproducible defect reports, triage by severity, and regression checks before every build.
- Report progress and technical plans to funding bodies and external stakeholders.

Tech: Unreal Engine 5, Blueprints, Git, Steamworks

### Co-Founder & Senior Programmer · Sure Why Not? · 2022 – 2024
- Secured £85,000 from Northern Ireland Screen and regional funds by pitching the game's audience, USPs and delivery plan.
- Built and maintained production game systems in C# (Unity), and took part in technical design, code reviews and architecture decisions.
- Designed an event-driven architecture with C# events and the observer pattern, keeping gameplay logic separate from the UI.
- Ran structured QA on development builds, and managed freelance artists from concept art to 3D models.

Tech: Unity, C#, Git, Steamworks

### Full-Stack Developer · Allstate Northern Ireland · 2021 – 2022
- Designed, built, tested and maintained 3 REST API microservices supporting critical insurance systems.
- Raised test coverage above 70% of production code by writing tests first with JUnit, using clean code and SOLID principles.
- Built enterprise insurance applications with Java SE 16, Spring Boot and React, packaged in Docker containers.
- Worked in an agile team of 24: sprint planning, estimates and backlog refinement in Jira, design docs in Confluence, and Jenkins CI/CD.

Tech: Java SE 16, Spring Boot, React 17, Docker, Jenkins, REST APIs, JUnit, SQL, Git

## Skills

- **Languages & frameworks:** Python, Java (SE 16, 21), C#, JavaScript (React), SQL, FastAPI, Spring Boot, REST APIs, Microservices, pytest, JUnit
- **AI & cloud:** LLMs and RAG, Azure OpenAI, Azure AI Search, Hybrid search, Guardrails, Azure Container Apps, Azure Blob Storage, Managed identity, Bicep and azd, AI-assisted development (Claude Code)
- **Engineering:** API design (OpenAPI, AsyncAPI), Event-driven design (Kafka), Defect analysis and repair, TDD, Clean code and SOLID, Code reviews
- **Delivery & people:** Stakeholder and funder communication, Technical teaching, User feedback to backlog, Agile (Scrum, Kanban), Jira, Confluence
- **Tooling:** Docker, Jenkins, GitHub Actions CI/CD, Git, Maven

## Projects

The grid supports 1–6 projects, so more can be added later by adding entries to `resume.ts`.

### GOV.UK RAG Assistant (featured) · 2026
- **Summary (128 chars):** Azure RAG assistant that answers UK employee-rights questions from GOV.UK guidance, with citations and "I don't know" guardrails.
- **Tech:** Python, FastAPI, Azure OpenAI, Azure AI Search, Bicep
- **Repo:** https://github.com/cypherz01/govuk-rag-assistant
- **Image:** none for now (card shows text and the repo link)

### Margin Service · 2026
- **Summary (120 chars):** Spring Boot microservice that calculates portfolio margin and collateral, with OpenAPI specs and Kafka margin-call events.
- **Tech:** Java 21, Spring Boot 3, Kafka, Docker
- **Repo:** https://github.com/cypherz01/margin-service
- **Image:** none for now (card shows text and the repo link)

## Education

- BSc Computer Science (First-Class Honours) · Ulster University · 2016–2020
- PGDip International Business · Ulster University · 2024–2025

## Contact

- **Email:** mrtomcuthbertson@gmail.com (as a `mailto:` link only)
- **GitHub:** https://github.com/cypherz01
- **LinkedIn:** none for now
- **Phone:** deliberately not on the site
- **Availability line:** "Open to software engineering roles in Belfast or remote."

## Logos

None yet. The Avatar falls back to company initials.
