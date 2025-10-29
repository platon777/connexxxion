query confession verb=POST {
  input {
    dblink {
      table = "confession"
    }
  }

  stack {
    // Add confession record
    db.add confession {
      data = {
        created_at: "now"
        user      : $input.user
        theme     : $input.theme
        title     : $input.title
        content   : $input.content
        view_count: $input.view_count
        like_count: $input.like_count
      }
    } as $model
  
    db.get theme {
      field_name = "id"
      field_value = $input.theme
    } as $theme2
  
    // Broadcast the new confession to a channel
    api.realtime_event {
      channel = "confessions"
      data = $model
      auth_table = "user"
      auth_id = $input.user
    }
  
    db.edit theme {
      field_name = "id"
      field_value = $theme2.id
      data = {number_of_confess: $var.theme2.number_of_confess + 1}
    } as $theme1
  }

  response = {result1: $model, theme2: $theme2}
}