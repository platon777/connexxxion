// Add memo record
query memo verb=POST {
  input {
    dblink {
      table = "memo"
    }
  }

  stack {
    db.add memo {
      data = {
        created_at : "now"
        user_name  : $input.user_name
        description: $input.description
        image      : $input.image
        user       : $input.user
      }
    } as $memo
  }

  response = $memo
}