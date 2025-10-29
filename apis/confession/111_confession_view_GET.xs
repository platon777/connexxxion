// Query all confession_view records
query confession_view verb=GET {
  input {
  }

  stack {
    db.query confession_view {
      return = {type: "list"}
    } as $confession_view
  }

  response = $confession_view
}