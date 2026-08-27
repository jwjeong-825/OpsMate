// Returns one incident or a 404 response.
query "incidents/{incident_id}" verb=GET {
  api_group = "OpsMate"

  input {
    int incident_id
  }

  stack {
    db.get incident {
      field_name = "id"
      field_value = $input.incident_id
    } as $incident

    precondition ($incident != null) {
      error_type = "notfound"
      error = "Incident not found."
    }
  }

  response = $incident
  guid = "lpg6DiR6gMO9EOSQxemrxIbG3HI"
}
