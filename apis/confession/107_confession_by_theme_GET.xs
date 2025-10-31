query confession_by_theme verb=GET {
  input {
    int theme_id?
  
    // Optional unique identifier for the client device.
    text? device_id?
  }

  stack {
    db.query confession {
      where = $db.confession.theme == $input.theme_id
      return = {type: "list"}
      addon = [
        {
          name : "theme"
          input: {theme_id: $input.theme_id}
          as   : "_theme"
        }
        {
          name : "comment_of_confession"
          input: {confession: $output.id}
          as   : "_comment_of_confession"
        }
        {
          name : "confession_like_of_confession_2"
          input: {confession: $output.id}
          as   : "real_like_count"
        }
        {
          name : "user_confession"
          input: {user_id: $output.user}
          as   : "_user_confession"
        }
      ]
    } as $model
  }

  response = $model
}