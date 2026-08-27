# OpsMate Test Record

Tested on August 27, 2026 against Xano Workspace ID `1`, live branch `v1`.

## Backend API

| Scenario | Expected | Result |
| --- | --- | --- |
| Create basic incident | `open`, null AI fields before AI stage | Passed during backend stage |
| Required `service_name` empty | `400` | Passed |
| List incidents | `200`, newest first | Passed |
| Get existing incident | `200` and stored record | Passed |
| Get missing incident | `404` with `Incident not found.` | Passed |
| Resolve open incident | `resolved` plus `resolved_at` | Passed |
| Resolve same incident again | Same `resolved_at` | Passed |
| Invalid PATCH status | `400` | Passed |

## AI + Database

Input:

```text
Service: nginx
Error: 502 Bad Gateway connect() failed (111: Connection refused)
```

Verified:

- Non-empty plain-language summary
- Four possible causes returned as a JSON array
- Five recommended actions returned as a JSON array
- Severity value `high`, within the allowed enum
- Complete result persisted and matched `GET /incidents/{id}`
- AI result parsing and field types are checked before database insertion

## Deployed Frontend — Dev

URL: `https://opsmate-dev-fdab0e-xq4b-bkh8-ih5r.k7.xano.io`

Browser flow:

1. Loaded existing persistent history.
2. Submitted a PostgreSQL connection exhaustion error for `payments-api`.
3. Observed loading completion and a structured AI result.
4. Verified the new incident appeared first in history.
5. Opened the incident detail dialog.
6. Marked it resolved.
7. Verified `resolved_at` was displayed.
8. Reloaded the page and verified the resolved state persisted.
9. Tested at 390×844 viewport; no horizontal overflow was present.

## Deployed Frontend — Production

URL: `https://opsmate-prod-fdab0e-xq4b-bkh8-ih5r.k7.xano.io`

Input:

```text
Service: checkout-api
Error: Docker container exited with code 137 and the checkout service is unavailable
```

Verified:

- AI analysis rendered successfully with `high` severity.
- The incident appeared first in persistent history.
- Detail and resolve controls worked.
- Reload preserved the resolved incident.
- Browser console contained no errors during the tested flow.

## Notes

- Xano returns `200` for successful creation with the current endpoint configuration.
- Test incidents remain in the dedicated hackathon Workspace as demo data.
- Provider-level AI outage injection was not performed. Runtime/JSON structure failures are handled by aborting before database insertion and returning an error.
