# OpsMate — Three-Minute Demo Script

## 0:00–0:20 — The Problem

“Incident management tools are powerful, but they can be overwhelming for beginners and small teams. When you see an error like a 502 or a crashed Docker container, you often need a clear explanation and a starting point—not another dashboard to configure.”

## 0:20–0:40 — Introduce OpsMate

“OpsMate is an AI-powered incident assistant. You paste a service name and an error log, and it explains the incident, suggests likely causes and actions, assigns severity, and keeps the incident until it is resolved.”

Show the production homepage and briefly point out the Analyze form and Incident History.

## 0:40–1:30 — Analyze a Real Error

Enter:

```text
Service: nginx
Error: 502 Bad Gateway connect() failed (111: Connection refused)
```

Click **Analyze incident**.

“The request goes to the live Xano backend. Xano validates the input and runs the OpsMate Incident Analyst using its AI workflow.”

When the response appears:

“The result is structured into a plain-language summary, possible causes, recommended actions, and one of four allowed severity values. Xano validates this structure before saving it.”

Briefly read one cause and one recommended action.

## 1:30–2:00 — History and Detail

Scroll to Incident History.

“The new incident is stored in Xano and appears first in the history. This is persistent data, not browser state.”

Open the incident.

“The detail view includes the original error, complete AI analysis, severity, status, and timestamps.”

## 2:00–2:20 — Resolve

Click **Mark as resolved**.

“Resolving the incident updates its status and records `resolved_at`. The backend is idempotent, so repeating the request does not replace the original resolution time.”

Refresh the page and reopen the incident.

“The resolved state remains after refresh because Xano is the system of record.”

## 2:20–2:45 — Xano Architecture

Show the Xano table, API group, and AI agent, or show the README architecture diagram.

“Xano is the core backend: it hosts the Incident table, four REST endpoints, validation, business logic, AI execution, structured output checks, persistent storage, and the static frontend. The critical input-to-AI-to-database workflow runs entirely inside Xano.”

## 2:45–3:00 — Close

“OpsMate rebuilds incident management for the moment before a team needs a full observability platform. It gives developers a clear explanation, practical next steps, and a simple record of what happened. OpsMate was built with Xano, Xano Free AI, vanilla JavaScript, GitHub, and Codex.”

End on the production homepage with the live URL visible.
