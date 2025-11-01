// Delete memo record.
query "memo/{memo_id}" verb=DELETE {
  input {
    int memo_id? filters=min:1
  }

  stack {
    db.del memo {
      field_name = "id"
      field_value = $input.memo_id
    }
  }

  response = null
}