// Get comment_like record
query "comment_like/{comment_like_id}" verb=GET {
  input {
    int comment_like_id? filters=min:1
  }

  stack {
    db.get comment_like {
      field_name = "id"
      field_value = $input.comment_like_id
    } as $comment_like
  
    precondition ($comment_like != null) {
      error_type = "notfound"
      error = "Not Found."
    }
  }

  response = $comment_like
}