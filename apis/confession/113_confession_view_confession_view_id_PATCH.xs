// Edit confession_view record
query "confession_view/{confession_view_id}" verb=PATCH {
  input {
    int confession_view_id? filters=min:1
    dblink {
      table = "confession_view"
    }
  }

  stack {
    util.get_raw_input {
      encoding = "json"
      exclude_middleware = false
    } as $raw_input
  
    db.patch confession_view {
      field_name = "id"
      field_value = $input.confession_view_id
      data = `$input|pick:($raw_input|keys)`|filter_null|filter_empty_text
    } as $confession_view
  }

  response = $confession_view
}