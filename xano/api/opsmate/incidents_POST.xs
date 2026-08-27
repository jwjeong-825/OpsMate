// Analyzes a submitted error and stores the incident with structured AI output.
query "incidents" verb=POST {
  api_group = "OpsMate"

  input {
    text service_name filters=trim
    text raw_error filters=trim
  }

  stack {
    ai.agent.run "OpsMate Incident Analyst" {
      args = {}|set:"service_name":$input.service_name|set:"raw_error":$input.raw_error
      allow_tool_execution = false
    } as $analysis_text

    var $analysis {
      value = $analysis_text.result|json_decode
    }

    precondition (($analysis|is_object) && ($analysis.ai_summary|is_text) && ($analysis.possible_causes|is_array) && ($analysis.recommended_actions|is_array) && ($analysis.severity == "low" || $analysis.severity == "medium" || $analysis.severity == "high" || $analysis.severity == "critical")) {
      error_type = "standard"
      error = "Incident analysis failed. Please try again."
    }

    db.add incident {
      data = {
        created_at          : now
        service_name        : $input.service_name
        raw_error           : $input.raw_error
        ai_summary          : $analysis.ai_summary
        possible_causes     : $analysis.possible_causes
        recommended_actions : $analysis.recommended_actions
        severity            : $analysis.severity
        status              : "open"
        resolved_at         : null
      }
    } as $incident
  }

  response = $incident
  guid = "bkQTspzPtHDH4O_xEzyMgQPh8rA"
}
