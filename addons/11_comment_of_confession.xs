addon comment_of_confession {
  input {
    int confession? {
      table = "confession"
    }
  }

  stack {
    db.query comment {
      where = $db.comment.confession == $input.confession
      return = {type: "count"}
    }
  }
}