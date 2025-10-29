query theme_by_category verb=GET {
  input {
    int category_id?
  }

  stack {
    db.query theme {
      where = $input.category_id == $db.theme.category
      return = {type: "list"}
      addon = [
        {
          name : "category"
          input: {category_id: $input.category_id}
          as   : "_category"
        }
        {
          name : "confession_of_theme_1"
          input: {theme: $output.id}
          as   : "_confession"
        }
      ]
    } as $model
  }

  response = $model
}