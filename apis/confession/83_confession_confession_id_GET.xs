// Get confession record
query "confession/{confession_id}" verb=GET {
  input {
    int confession_id? filters=min:1
    text device_id? filters=trim
  }

  stack {
    db.get confession {
      field_name = "id"
      field_value = $input.confession_id
      addon = [
        {
          name : "user_10"
          input: {user_id: $output.user}
          as   : "_user_10"
        }
      ]
    } as $model
  
    precondition ($model != null) {
      error_type = "notfound"
      error = "Not Found"
    }
  
    db.query comment {
      where = $db.comment.confession == $input.confession_id
      return = {type: "count"}
    } as $number_of_comments
  
    db.query confession_like {
      where = $db.confession_like.confession == $input.confession_id && $db.confession_like.device_id == $input.device_id
      return = {type: "exists"}
    } as $is_liked
  
    db.query confession_like {
      where = $db.confession_like.confession == $input.confession_id
      return = {type: "count"}
    } as $number_of_like
  }

  response = {
    result1           : $model
    number_of_comments: $number_of_comments
    is_liked          : $number_of_like
    number_of_like    : $number_of_like
  }
}