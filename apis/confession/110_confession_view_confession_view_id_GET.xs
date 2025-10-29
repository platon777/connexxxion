// Get confession_view record
query "confession_view/{confession_view_id}" verb=GET {
  input {
    int confession_view_id? filters=min:1
  }

  stack {
    db.get confession_view {
      field_name = "id"
      field_value = $input.confession_view_id
    } as $confession_view
  
    precondition ($confession_view != null) {
      error_type = "notfound"
      error = "Not Found."
    }
  }

  response = $confession_view
}