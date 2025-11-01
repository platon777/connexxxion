// Edit memo record
query "memo/{memo_id}" verb=PATCH {
  input {
    int memo_id? filters=min:1
    dblink {
      table = "memo"
    }
  }

  stack {
    util.get_raw_input {
      encoding = "json"
      exclude_middleware = false
    } as $raw_input
  
    db.patch memo {
      field_name = "id"
      field_value = $input.memo_id
      data = `$input|pick:($raw_input|keys)`|filter_null|filter_empty_text
    } as $memo
  }

  response = $memo
}