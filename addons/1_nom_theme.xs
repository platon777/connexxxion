addon nom_theme {
  input {
    int theme_id? {
      table = "theme"
    }
  
    int category? {
      table = "category"
    }
  }

  stack {
    db.query theme {
      where = $db.theme.id == $input.theme_id && $db.theme.category == $input.category
      return = {type: "single"}
    }
  }
}