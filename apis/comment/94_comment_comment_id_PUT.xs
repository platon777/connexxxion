// Update comment record
query "comment/{comment_id}" verb=PUT {
  input {
    int comment_id? filters=min:1
    dblink {
      table = "comment"
    }
  }

  stack {
    db.edit comment {
      field_name = "id"
      field_value = $input.comment_id
      data = {
        user      : $input.user
        confession: $input.confession
        content   : $input.content
        like_count: $input.like_count
      }
    } as $model
  }

  response = $model
}