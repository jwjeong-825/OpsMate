// Returns incidents newest first.
query "incidents" verb=GET {
  api_group = "OpsMate"

  input {}

  stack {
    db.query incident {
      sort = {created_at: "desc"}
      return = {type: "list"}
    } as $incidents
  }

  response = $incidents
  guid = "654xfzgJqLGgy5ESgH6SZXYB_NM"
}
