// Edit theme record
query "theme/{theme_id}" verb=PATCH {
  input {
    int theme_id? filters=min:1
    dblink {
      table = "theme"
    }
  }

  stack {
    util.get_raw_input {
      encoding = "json"
      exclude_middleware = false
    } as $raw_input
  
    db.patch theme {
      field_name = "id"
      field_value = $input.theme_id
      data = `$input|pick:($raw_input|keys)`|filter_null|filter_empty_text
    } as $model
  }

  response = $model
}