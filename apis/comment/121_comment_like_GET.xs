// Query all comment_like records
query comment_like verb=GET {
  input {
  }

  stack {
    db.query comment_like {
      return = {type: "list"}
    } as $comment_like
  }

  response = $comment_like
}