addon confession_of_theme_1 {
  input {
    int theme? {
      table = "theme"
    }
  }

  stack {
    db.query confession {
      where = $db.confession.theme == $input.theme
      return = {type: "count"}
    }
  }
}