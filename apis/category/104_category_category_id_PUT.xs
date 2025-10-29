// Update category record
query "category/{category_id}" verb=PUT {
  input {
    int category_id? filters=min:1
    dblink {
      table = "category"
    }
  }

  stack {
    db.edit category {
      field_name = "id"
      field_value = $input.category_id
      data = {name: $input.name}
    } as $model
  }

  response = $model
}