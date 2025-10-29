addon confession {
  input {
    int confession_id? {
      table = "confession"
    }
  }

  stack {
    db.query confession {
      where = $db.confession.id == $input.confession_id
      return = {type: "single"}
    }
  }
}