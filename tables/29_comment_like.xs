// Stores records of unique comment likes by device.
table comment_like {
  auth = false

  schema {
    int id
    timestamp created_at?=now
  
    // Reference to the comment that was liked.
    int comment? {
      table = "comment"
    }
  
    // Unique identifier of the client device that liked the comment.
    text device_id? filters=trim
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
    {
      type : "btree|unique"
      field: [{name: "comment", op: "asc"}, {name: "device_id", op: "asc"}]
    }
  ]
}