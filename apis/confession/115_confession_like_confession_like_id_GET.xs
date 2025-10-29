// Get confession_like record
query "confession_like/{confession_like_id}" verb=GET {
  input {
    int confession_like_id? filters=min:1
  }

  stack {
    db.get confession_like {
      field_name = "id"
      field_value = $input.confession_like_id
    } as $confession_like
  
    precondition ($confession_like != null) {
      error_type = "notfound"
      error = "Not Found."
    }
  }

  response = $confession_like
}