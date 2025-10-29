// Get theme record
query "theme/{theme_id}" verb=GET {
  input {
    int theme_id? filters=min:1
  }

  stack {
    db.get theme {
      field_name = "id"
      field_value = $input.theme_id
    } as $model
  
    precondition ($model != null) {
      error_type = "notfound"
      error = "Not Found"
    }
  
    db.query confession {
      where = $db.confession.theme == $input.theme_id
      return = {type: "count"}
    } as $number_of_confessions
  }

  response = {
    result1              : $model
    number_of_confessions: $number_of_confessions
  }
}