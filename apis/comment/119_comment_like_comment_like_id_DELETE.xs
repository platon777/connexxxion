// Delete comment_like record.
query "comment_like/{comment_like_id}" verb=DELETE {
  input {
    int comment_like_id? filters=min:1
  }

  stack {
    db.del comment_like {
      field_name = "id"
      field_value = $input.comment_like_id
    }
  }

  response = null
}