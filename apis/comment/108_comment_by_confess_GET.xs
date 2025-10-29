query comment_by_confess verb=GET {
  input {
    int confession_id? {
      table = "confession"
    }
  
    text device_id? filters=trim
  }

  stack {
    db.query comment {
      join = {
        comment_like: {
          table: "comment_like"
          type : "left"
          where: $db.comment.id == $db.comment_like.comment && $db.comment_like.device_id == $input.device_id
        }
      }
    
      where = $db.comment.confession == $input.confession_id
      sort = {comment.like_count: "desc", comment.created_at: "desc"}
      return = {type: "list"}
      addon = [
        {
          name : "confession"
          input: {confession_id: $input.confession_id}
          as   : "_confession"
        }
        {
          name : "user_object2"
          input: {user_id: $output.user}
          as   : "_user_object2"
        }
        {
          name : "is_liked_comment"
          input: {comment: $output.id}
          as   : "_is_liked_comment"
        }
        {
          name : "number_like_comment"
          input: {comment: $output.id}
          as   : "_number_like_comment"
        }
      ]
    } as $model
  }

  response = {result1: $model}
}