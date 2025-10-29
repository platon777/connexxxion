query "confession/{confession_id}" verb=PATCH {
  input {
    int confession_id? filters=min:1
    dblink {
      table = "confession"
    }
  }

  stack {
    util.get_raw_input {
      encoding = "json"
      exclude_middleware = false
    } as $raw_input
  
    db.patch confession {
      field_name = "id"
      field_value = $input.confession_id
      data = `$input|pick:($raw_input|keys)`|filter_null|filter_empty_text
    } as $model
  
    // Broadcast the updated confession to a real-time channel
    api.realtime_event {
      channel = "confessions"
      data = $model
      auth_table = ""
      auth_id = ""
    }
  }

  response = $model
}