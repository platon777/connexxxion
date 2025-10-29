// Delete confession_like record.
query "confession_like/{confession_like_id}" verb=DELETE {
  input {
    int confession_like_id? filters=min:1
  }

  stack {
    db.del confession_like {
      field_name = "id"
      field_value = $input.confession_like_id
    }
  }

  response = null
}