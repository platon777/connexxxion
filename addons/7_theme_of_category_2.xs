addon theme_of_category_2 {
  input {
    int category? {
      table = "category"
    }
  }

  stack {
    db.query theme {
      where = $db.theme.category == $input.category
      return = {type: "count"}
    }
  }
}