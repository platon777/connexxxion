// Delete comment record
query "comment/{comment_id}" verb=DELETE {
  input {
    int comment_id? filters=min:1
  }

  stack {
    db.del comment {
      field_name = "id"
      field_value = $input.comment_id
    }
  }

  response = null
}