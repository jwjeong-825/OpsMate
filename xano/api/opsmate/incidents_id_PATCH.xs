// Resolves an open incident without changing an existing resolved_at value.
query "incidents/{incident_id}" verb=PATCH {
  api_group = "OpsMate"

  input {
    int incident_id
    enum status {
      values = ["resolved"]
    }
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

    var $result {
      value = $incident
    }

    conditional {
      if ($incident.status == "open") {
        db.edit incident {
          field_name = "id"
          field_value = $input.incident_id
          data = {
            status      : "resolved"
            resolved_at : now
          }
        } as $resolved_incident

        var.update $result {
          value = $resolved_incident
        }
      }
    }
  }

  response = $result
  guid = "BBJl40vUUnyf3CqSGL7GZOr2LOk"
}
