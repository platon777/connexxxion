// Delete theme record
query "theme/{theme_id}" verb=DELETE {
  input {
    int theme_id? filters=min:1
  }

  stack {
    db.del theme {
      field_name = "id"
      field_value = $input.theme_id
    }
  }

  response = null
}