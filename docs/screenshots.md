# Screenshot Plan

Capture screenshots from the production URL at a desktop viewport, using consistent browser dimensions and no private tabs or credentials in view.

## 1. Main Analyze Screen

- Hero title and explanation
- Service Name input
- Error Log textarea
- Analyze Incident button
- Enough of Incident History to establish the page structure

Suggested filename: `opsmate-analyze.png`

## 2. AI Analysis Result

- Completed analysis for the nginx 502 example
- Severity badge
- Summary
- At least two possible causes
- At least three recommended actions

Suggested filename: `opsmate-ai-result.png`

## 3. Incident History

- Several demo incidents
- Different services
- Visible open and resolved states
- Created timestamps

Suggested filename: `opsmate-history.png`

## 4. Resolved Incident Detail

- Detail dialog
- Original error
- AI analysis
- Resolved status and `resolved_at`

Suggested filename: `opsmate-resolved-detail.png`

## 5. Xano Backend

- `incident` table schema or records
- `OpsMate` API group with the four endpoints
- `OpsMate Incident Analyst` agent
- Do not show credentials, tokens, environment secret values, or unrelated workspace data

Suggested filename: `opsmate-xano-backend.png`

## Recommended Devpost Order

1. AI Analysis Result
2. Main Analyze Screen
3. Resolved Incident Detail
4. Incident History
5. Xano Backend
