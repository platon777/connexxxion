// Stores records of unique confession likes by device.
table confession_like {
  auth = false

  schema {
    int id
    timestamp created_at?=now
  
    // Reference to the confession that was liked.
    int confession? {
      table = "confession"
    }
  
    // Unique identifier of the client device that liked the confession.
    text device_id? filters=trim
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
    {
      type : "btree|unique"
      field: [
        {name: "confession", op: "asc"}
        {name: "device_id", op: "asc"}
      ]
    }
  ]
}