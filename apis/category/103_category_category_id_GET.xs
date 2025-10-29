// Get category record
query "category/{category_id}" verb=GET {
  input {
    int category_id? filters=min:1
  }

  stack {
    db.get category {
      field_name = "id"
      field_value = $input.category_id
    } as $model
  
    precondition ($model != null) {
      error_type = "notfound"
      error = "Not Found"
    }
  
    db.query theme {
      where = $db.theme.category == $input.category_id
      return = {type: "count"}
    } as $number_of_subject
  }

  response = {result1: $model, number_of_subject: $number_of_subject}
}