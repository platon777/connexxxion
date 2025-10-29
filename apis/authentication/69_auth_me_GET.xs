// Get the record belonging to the authentication token
query "auth/me" verb=GET {
  auth = "user"

  input {
  }

  stack {
    db.get user {
      field_name = "id"
      field_value = $auth.id
      output = ["id", "created_at", "name", "email", "role"]
    } as $user
  }

  response = $user
}