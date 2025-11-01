// Query all memo records
query memo verb=GET {
  input {
  }

  stack {
    db.query memo {
      return = {type: "list"}
    } as $memo
  }

  response = $memo
}