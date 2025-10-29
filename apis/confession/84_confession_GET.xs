// Query all confession records
query confession verb=GET {
  input {
    text device_id? filters=trim
  }

  stack {
    db.query confession {
      join = {
        confession_like: {
          table: "confession_like"
          type : "left"
          where: $db.confession.id == $db.confession_like.confession && $input.device_id == $db.confession_like.device_id
        }
      }
    
      eval = {
        confession_like_id       : $db.confession_like.id
        confession_like_device_id: $db.confession_like.device_id
      }
    
      return = {type: "list"}
      addon = [
        {
          name : "real_like_count"
          input: {confession: $output.id}
          as   : "_real_like_count"
        }
      ]
    } as $model
  }

  response = $model
}