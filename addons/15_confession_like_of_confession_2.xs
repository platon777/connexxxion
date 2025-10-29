addon confession_like_of_confession_2 {
  input {
    int confession? {
      table = "confession"
    }
  }

  stack {
    db.query confession_like {
      where = $db.confession_like.confession == $input.confession
      return = {type: "count"}
    }
  }
}