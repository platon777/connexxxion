// Delete confession record
query "confession/{confession_id}" verb=DELETE {
  input {
    int confession_id? filters=min:1
  }

  stack {
    db.del confession {
      field_name = "id"
      field_value = $input.confession_id
    }
  }

  response = null
}