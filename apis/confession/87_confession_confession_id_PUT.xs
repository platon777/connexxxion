// Update confession record
query "confession/{confession_id}" verb=PUT {
  input {
    int confession_id? filters=min:1
    dblink {
      table = "confession"
    }
  }

  stack {
    db.edit confession {
      field_name = "id"
      field_value = $input.confession_id
      data = {
        user      : $input.user
        theme     : $input.theme
        title     : $input.title
        content   : $input.content
        view_count: $input.view_count
        like_count: $input.like_count
      }
    } as $model
  }

  response = $model
}