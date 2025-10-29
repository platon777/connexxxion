addon confession_like_of_confession_1 {
  input {
    int confession_like_id? {
      table = "confession_like"
    }
  
    int confession? {
      table = "confession"
    }
  }

  stack {
    db.query confession_like {
      where = $db.confession_like.id == $input.confession_like_id && $db.confession_like.confession == $input.confession
      return = {type: "exists"}
    }
  }
}