// Delete category record
query "category/{category_id}" verb=DELETE {
  input {
    int category_id? filters=min:1
  }

  stack {
    db.del category {
      field_name = "id"
      field_value = $input.category_id
    }
  }

  response = null
}