addon comment_like_of_comment {
  input {
    int comment? {
      table = "comment"
    }
  }

  stack {
    db.query comment_like {
      where = $db.comment_like.comment == $input.comment
      return = {type: "count"}
    }
  }
}