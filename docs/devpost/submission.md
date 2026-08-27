# Devpost Submission Copy

## Project Name

OpsMate

## Elevator Pitch

An AI-assisted Incident Management Workflow on Xano that turns error logs into structured, persistent, and trackable Incident records.

## Inspiration

Incident management and observability products are essential at scale, but their dashboards, terminology, and configuration can overwhelm beginners and small teams. When a developer encounters a 502 response, a database connection timeout, or a stopped container, the first question is often not “Which dashboard should I configure?” but “What does this mean, and what should I check next?”

We built OpsMate to make that first response immediate and approachable, then carry it into a lightweight incident management workflow. The goal is not to claim a better foundation model than a general-purpose LLM. It is to turn AI analysis into a repeatable product flow backed by Xano.

## What It Does

A user enters a service name and pastes an error log or incident description. OpsMate sends the input to a Xano backend, where an AI agent generates:

- A beginner-friendly summary
- A list of possible causes
- Recommended diagnostic and recovery actions
- A severity classification

Xano validates the result and stores the incident. The web app displays the analysis, maintains a persistent incident history, provides a detail view, and lets the user mark an open incident as resolved. Resolution time is recorded once and remains stable if the action is repeated.

A developer can paste the same log into a general-purpose LLM and ask for an explanation. That interaction is usually centered on producing an answer. OpsMate connects the answer to an operational record: structured output, severity classification, validation, database persistence, history retrieval, open/resolved state, and a stable `resolved_at` timestamp. The distinction is not whether an LLM can generate those fields; it is that OpsMate implements them as one consistent Incident Management Workflow.

## How We Built It

Xano is the complete backend rather than a thin proxy. It provides:

- The Incident database table
- Four REST endpoints
- Required input validation
- Newest-first queries and not-found handling
- Open-to-resolved business logic
- The Xano Free AI agent and prompt
- JSON parsing and AI output validation
- Persistent storage
- Static frontend hosting

The frontend is a dependency-free responsive single-page application built with HTML, CSS, and JavaScript. It calls the live Xano API and is deployed through Xano Static Hosting.

The frontend does not call an AI provider directly. It sends Incident input to the Xano REST API. Xano runs validation and business logic, invokes the Xano AI agent, validates the structured JSON result, writes the complete Incident to the Xano database, and returns the stored record to the deployed app. The history, detail, and resolve views all use that same backend.

Codex was the primary development agent. It generated and validated XanoScript, previewed Workspace changes before applying them, ran live API tests, implemented the frontend, completed browser-based production testing, and maintained feature-sized Git commits.

## Challenges We Ran Into

The most important integration issue was understanding the exact object returned by `ai.agent.run`. The agent response wraps the generated text in a `result` field; attempting to JSON-decode the whole response caused a backend error. We inspected the actual live response, updated the workflow to parse `result`, validated its structure and severity, and retested database persistence.

We also kept resolve behavior idempotent. A second resolve request returns the stored incident without replacing its original `resolved_at` timestamp.

## Accomplishments That We're Proud Of

- The complete input-to-AI-to-database workflow runs inside Xano.
- AI analysis is integrated into a persistent Incident workflow rather than ending as a one-time chat response.
- The live public frontend supports the full incident lifecycle.
- AI output is validated before persistence instead of being trusted blindly.
- Both backend and browser-based production tests cover failure and persistence scenarios.
- The project uses no frontend framework, build pipeline, authentication system, or paid external AI integration.

## What We Learned

XanoScript makes backend configuration reviewable alongside normal source code. Keeping table, API, and AI definitions in Git made it possible to validate changes, preview Workspace diffs, and preserve a clear development history.

We also learned that a useful AI workflow needs more than a prompt: it needs a strict output contract, validation, persistence rules, and clear failure behavior.

## What's Next for OpsMate

The MVP deliberately avoids scope expansion. Future work could add opt-in authentication and per-user data isolation, pagination for larger histories, provider fallback, and richer incident collaboration. Automatic remediation and monitoring would only be considered after preserving the simple beginner-first experience.

## Xano Challenge Build Story

### What business software category did we rebuild?

Incident management and operations dashboard software.

### Why this category?

It solves an important problem, but many products are optimized for mature operations teams. Their dashboards, query languages, integrations, and alert configuration can be too much for someone who simply needs to understand an error.

### How does OpsMate simplify it?

OpsMate replaces the initial dashboard workflow with two inputs and one action. It returns an explanation and a practical checklist, stores the structured result as an Incident, and keeps a lightweight history until the incident is resolved.

### How does AI improve the experience?

AI translates raw infrastructure and application errors into beginner-friendly language, proposes plausible causes, prioritizes next steps, and supplies a consistent severity label. Xano turns that output into a validated, persistent Incident record that the frontend can retrieve and update through the REST API.

### How is Xano used?

Xano owns the Incident database, REST API, validation, business logic, AI execution, AI result validation, persistence, live backend, and static frontend hosting.

### How was Codex used?

Codex acted as the primary coding agent for XanoScript, frontend implementation, API/browser tests, debugging, Git workflow, and submission documentation.

### Development time

The tracked build work occurred across August 26–27, 2026. We intentionally report the observed calendar period rather than inventing an hour estimate.

### What would have taken longer without AI + Xano?

Provisioning a database and API runtime, implementing the AI provider integration and structured workflow, deploying a frontend, and repeatedly testing the full system would have required substantially more infrastructure and integration work.

## Links

- Live app: `https://opsmate-prod-fdab0e-xq4b-bkh8-ih5r.k7.xano.io`
- GitHub: `https://github.com/jwjeong-825/OpsMate`
