// Edit category record
query "category/{category_id}" verb=PATCH {
  input {
    int category_id? filters=min:1
    dblink {
      table = "category"
    }
  }

  stack {
    util.get_raw_input {
      encoding = "json"
      exclude_middleware = false
    } as $raw_input
  
    db.patch category {
      field_name = "id"
      field_value = $input.category_id
      data = `$input|pick:($raw_input|keys)`|filter_null|filter_empty_text
    } as $model
  }

  response = $model
}