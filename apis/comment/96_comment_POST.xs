query comment verb=POST {
  input {
    // ID of the user making the comment
    int user
  
    // ID of the confession the comment belongs to
    int confession
  
    // Content of the comment
    text content
  
    // Initial like count for the comment
    int like_count?
  }

  stack {
    db.add comment {
      data = {
        created_at: "now"
        user      : $input.user
        confession: $input.confession
        content   : $input.content
        like_count: $input.like_count
      }
    } as $model
  
    // Broadcast the new comment to the single existing channel in the workspace.
    // IMPORTANT: Replace "your_single_channel_name" with the actual name of your channel.
    api.realtime_event {
      channel = "comment"
      data = $model
      auth_table = "user"
      auth_id = $input.user
    }
  
    db.get confession {
      field_name = "id"
      field_value = $input.confession
    } as $confession1
  }

  response = $model
}