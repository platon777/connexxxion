// Add theme record
query theme verb=POST {
  input {
    dblink {
      table = "theme"
    }
  }

  stack {
    db.add theme {
      data = {created_at: "now", name: $input.name}
    } as $model
  }

  response = $model
}