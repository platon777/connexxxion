// Get comment record
query "comment/{comment_id}" verb=GET {
  input {
    int comment_id? filters=min:1
  }

  stack {
    db.get comment {
      field_name = "id"
      field_value = $input.comment_id
    } as $model
  
    precondition ($model != null) {
      error_type = "notfound"
      error = "Not Found"
    }
  }

  response = $model
}