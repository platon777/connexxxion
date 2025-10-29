addon confession_of_theme {
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