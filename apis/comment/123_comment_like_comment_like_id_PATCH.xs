// Edit comment_like record
query "comment_like/{comment_like_id}" verb=PATCH {
  input {
    int comment_like_id? filters=min:1
    dblink {
      table = "comment_like"
    }
  }

  stack {
    util.get_raw_input {
      encoding = "json"
      exclude_middleware = false
    } as $raw_input
  
    db.patch comment_like {
      field_name = "id"
      field_value = $input.comment_like_id
      data = `$input|pick:($raw_input|keys)`|filter_null|filter_empty_text
    } as $comment_like
  }

  response = $comment_like
}