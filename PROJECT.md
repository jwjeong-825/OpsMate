# OpsMate

## 1. Project Overview

OpsMate is a lightweight AI-powered incident management assistant for developers and small teams.

Developers often encounter server errors, application logs, Docker failures, API errors, or database connection problems but may not immediately understand what caused them or what they should check first.

Existing incident management and observability tools can be powerful, but they may be too complex for beginners, students, solo developers, or small teams.

OpsMate simplifies this process.

A user pastes an error log or incident description.
OpsMate uses AI to explain the issue in simple language, suggest possible causes and next steps, estimate severity, and store the incident so it can be tracked until resolution.

This project is being built for the DevNetwork API + Cloud + AI Hackathon 2026, specifically for the Xano "Rebuild a SaaS Tool You Hate" challenge.

---

## 2. Challenge Fit

The Xano challenge asks participants to take an existing business software category and rebuild a better version using AI.

OpsMate reimagines complex incident management and operations dashboard software as a simple AI-first tool for beginner developers and small teams.

Xano must be used meaningfully as the backend.

Xano should handle:

- Incident data model
- REST API endpoints
- Business logic
- Incident status management
- AI analysis workflow or AI integration
- Persistent data storage
- Frontend hosting through Xano static hosting

Xano must not be used only for a trivial API call.

---

## 3. Target User

Primary users:

- Beginner developers
- Students
- Solo developers
- Small development teams

Example situation:

A developer sees:

502 Bad Gateway
connect() failed (111: Connection refused)

Instead of searching the error manually, the developer pastes it into OpsMate.

OpsMate returns:

- Simple explanation
- Possible causes
- Recommended checks
- Severity
- Incident status

The incident is then stored for later reference.

---

## 4. MVP Features

The MVP must remain intentionally small.

### Feature 1 — Create Incident

The user enters:

- Service name
- Error log or incident description

Example:

Service:
nginx

Error:
502 Bad Gateway
connect() failed (111: Connection refused)

The incident is submitted to the backend.

---

### Feature 2 — AI Incident Analysis

AI analyzes the incident and returns structured information:

- Summary
- Possible causes
- Recommended actions
- Severity

Severity values:

- Low
- Medium
- High
- Critical

The explanation should be understandable by beginner developers.

---

### Feature 3 — Incident History

All incidents are stored in Xano.

The user can see a list containing:

- Service
- Error summary
- Severity
- Status
- Created date

---

### Feature 4 — Resolve Incident

An incident can be marked:

Open → Resolved

The user should be able to update the status from the frontend.

---

## 5. Explicitly Out of Scope

Do NOT add these unless all MVP functionality is finished and tested:

- User authentication
- Teams or organizations
- Billing
- Notifications
- Slack integration
- Kubernetes integration
- Monitoring agents
- Automatic server log collection
- Mobile application
- Complex dashboards
- Charts
- Terraform
- CI/CD
- Multi-cloud infrastructure
- Advanced analytics

Do not expand the project scope without explicit approval.

---

## 6. Initial Data Model

### Incident

Fields:

- id
- service_name
- raw_error
- ai_summary
- possible_causes
- recommended_actions
- severity
- status
- created_at
- resolved_at

Status:

- open
- resolved

---

## 7. Initial API Design

Possible endpoints:

POST /incidents
- Create and analyze a new incident

GET /incidents
- Retrieve incident history

GET /incidents/{id}
- Retrieve one incident

PATCH /incidents/{id}
- Update incident status

Do not implement unnecessary endpoints.

---

## 8. User Flow

1. User opens OpsMate.
2. User enters a service name and error log.
3. User clicks "Analyze Incident".
4. Frontend sends the incident to Xano.
5. AI analyzes the error.
6. Xano stores the original error and analysis.
7. Frontend displays the result.
8. User can later view the incident in the history.
9. User can mark the incident as resolved.

---

## 9. Frontend

Keep the frontend minimal.

Required screens:

### Main / Analyze

- OpsMate title
- Service name input
- Error log textarea
- Analyze button
- AI analysis result

### Incident History

- Incident list
- Severity
- Status
- Open incident details

A single-page application is acceptable.

Visual polish is secondary to working functionality.

---

## 10. Development Principles

This is a short hackathon project.

Priority order:

1. Working Xano backend
2. Working incident creation
3. Working AI analysis
4. Persistent storage
5. Incident retrieval
6. Resolve functionality
7. Functional frontend
8. Xano static hosting
9. Testing
10. README / Devpost submission materials

Always prefer a simple working implementation over a larger incomplete implementation.

---

## 11. Xano Development Rules

Xano CLI and Developer MCP are already installed and authenticated.

The current workspace is the dedicated hackathon workspace.

Direct workspace push is enabled.

Before pushing any changes to the Xano workspace:

1. Show the relevant git diff.
2. Explain what will change.
3. Wait for explicit approval.
4. Push only after approval.
5. Test the live backend after every push.

Do not modify unrelated development environments or global system settings unnecessarily.

Track hackathon-specific environment changes in SETUP_CHANGES.md.

---

## 12. AI Coding Agent

Codex is the primary AI coding agent used for this project.

AI assistance is allowed and encouraged by the Xano hackathon workflow.

However:

- Do not hide implementation decisions.
- Explain major architecture decisions.
- Keep the project understandable to the developer.
- Avoid unnecessary abstractions.
- Do not introduce technologies that are not needed for the MVP.

---

## 13. Hackathon Submission Requirements

Final submission must include:

- Project name
- One-line pitch
- Public repository or shared project
- 2–4 minute end-to-end demo video
- Build story

The build story should explain:

- What software category OpsMate replaces
- Why incident management software was selected
- How AI improves the experience
- How Xano is used
- Which AI coding tools were used
- Approximate development time
- What would have taken significantly longer without AI + Xano

---

## 14. One-Line Pitch

OpsMate is an AI-powered incident assistant that helps developers understand, track, and resolve system errors faster.

---

## 15. Success Criteria

The project is considered complete when:

1. A user can enter an error.
2. AI analyzes the error.
3. The analysis is stored in Xano.
4. Stored incidents can be retrieved.
5. An incident can be marked resolved.
6. The frontend works against the live Xano backend.
7. The application is publicly accessible.
8. A 2–4 minute demo can show the entire flow without manual intervention.

Do not consider additional features until all eight criteria are satisfied.