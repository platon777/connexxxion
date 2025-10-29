// Stores records of unique confession views by device.
table confession_view {
  auth = false

  schema {
    int id
    timestamp created_at?=now
  
    // Reference to the confession that was viewed.
    int confession? {
      table = "confession"
    }
  
    // Unique identifier of the client device that viewed the confession.
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