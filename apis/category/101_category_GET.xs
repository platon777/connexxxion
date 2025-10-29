// Query all category records
query category verb=GET {
  input {
  }

  stack {
    db.query category {
      return = {type: "list"}
      addon = [
        {
          name : "theme_of_category_2"
          input: {category: $output.id}
          as   : "_theme_of_category_2"
        }
      ]
    } as $model
  }

  response = $model
}