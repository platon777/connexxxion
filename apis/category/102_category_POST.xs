// Add category record
query category verb=POST {
  input {
    dblink {
      table = "category"
    }
  }

  stack {
    db.add category {
      data = {created_at: "now", name: $input.name}
    } as $model
  }

  response = $model
}