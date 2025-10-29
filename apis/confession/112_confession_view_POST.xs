// Add confession_view record
query confession_view verb=POST {
  input {
    dblink {
      table = "confession_view"
    }
  }

  stack {
    db.add confession_view {
      data = {
        created_at: "now"
        confession: $input.confession
        device_id : $input.device_id
      }
    } as $confession_view
  }

  response = $confession_view
}