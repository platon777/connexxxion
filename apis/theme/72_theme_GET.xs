// Query all theme records
query theme verb=GET {
  input {
  }

  stack {
    db.query theme {
      return = {type: "list"}
      addon = [
        {
          name : "confession_of_theme"
          input: {theme: $output.id}
          as   : "_confession_of_theme"
        }
      ]
    } as $model
  }

  response = $model
}