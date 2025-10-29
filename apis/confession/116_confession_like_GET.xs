// Query all confession_like records
query confession_like verb=GET {
  input {
    int confession_id? {
      table = "confession"
    }
  
    text? device_id? filters=trim
  }

  stack {
    db.query confession_like {
      where = $db.confession_like.confession == $input.confession_id && $db.confession_like.device_id == $input.device_id
      return = {type: "list"}
    } as $confession_like
  }

  response = $confession_like
}