addon theme_of_category_1 {
  input {
    int category? {
      table = "category"
    }
  }

  stack {
    db.query theme {
      where = $db.theme.category == $input.category
      return = {type: "list"}
    }
  }
}