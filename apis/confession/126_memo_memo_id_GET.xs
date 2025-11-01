// Get memo record
query "memo/{memo_id}" verb=GET {
  input {
    int memo_id? filters=min:1
  }

  stack {
    db.get memo {
      field_name = "id"
      field_value = $input.memo_id
    } as $memo
  
    precondition ($memo != null) {
      error_type = "notfound"
      error = "Not Found."
    }
  }

  response = $memo
}