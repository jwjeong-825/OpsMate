// Creates an incident. AI fields are populated in the next implementation stage.
query "incidents" verb=POST {
  api_group = "OpsMate"

  input {
    text service_name filters=trim
    text raw_error filters=trim
  }

  stack {
    db.add incident {
      data = {
        created_at          : now
        service_name        : $input.service_name
        raw_error           : $input.raw_error
        ai_summary          : null
        possible_causes     : []
        recommended_actions : []
        severity            : null
        status              : "open"
        resolved_at         : null
      }
    } as $incident
  }

  response = $incident
  guid = "bkQTspzPtHDH4O_xEzyMgQPh8rA"
}
