// Stores user-submitted incidents and their AI analysis.
table incident {
  auth = false

  schema {
    int id
    timestamp created_at?=now
    text service_name filters=trim
    text raw_error filters=trim
    text? ai_summary
    json possible_causes?
    json recommended_actions?
    text? severity
    text status?="open"
    timestamp? resolved_at
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]
  guid = "b2TMSxKx5R4ckP1s6luOMOd3HQc"
}
