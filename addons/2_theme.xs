addon theme {
  input {
    int theme_id? {
      table = "theme"
    }
  }

  stack {
    db.query theme {
      where = $db.theme.id == $input.theme_id
      return = {type: "single"}
    }
  }
}