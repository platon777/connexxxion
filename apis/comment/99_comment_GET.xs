// Query all comment records
query comment verb=GET {
  input {
  }

  stack {
    db.query comment {
      return = {type: "list"}
      addon = [
        {
          name : "comment_like_of_comment"
          input: {comment: $output.id}
          as   : "_comment_like_of_comment"
        }
      ]
    } as $model
  }

  response = $model
}