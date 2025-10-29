// Edit confession_like record
query "confession_like/{confession_like_id}" verb=PATCH {
  input {
    int confession_like_id? filters=min:1
    dblink {
      table = "confession_like"
    }
  }

  stack {
    util.get_raw_input {
      encoding = "json"
      exclude_middleware = false
    } as $raw_input
  
    db.patch confession_like {
      field_name = "id"
      field_value = $input.confession_like_id
      data = `$input|pick:($raw_input|keys)`|filter_null|filter_empty_text
    } as $confession_like
  }

  response = $confession_like
}