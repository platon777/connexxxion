// Delete confession_view record.
query "confession_view/{confession_view_id}" verb=DELETE {
  input {
    int confession_view_id? filters=min:1
  }

  stack {
    db.del confession_view {
      field_name = "id"
      field_value = $input.confession_view_id
    }
  }

  response = null
}