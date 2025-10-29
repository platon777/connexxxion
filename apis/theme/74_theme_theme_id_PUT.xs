// Update theme record
query "theme/{theme_id}" verb=PUT {
  input {
    int theme_id? filters=min:1
    dblink {
      table = "theme"
    }
  }

  stack {
    db.edit theme {
      field_name = "id"
      field_value = $input.theme_id
      data = {name: $input.name}
    } as $model
  }

  response = $model
}