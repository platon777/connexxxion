// Stores donation memos with user details and an optional image.
table memo {
  auth = false

  schema {
    int id
    timestamp created_at?=now
  
    // Name of the user associated with the memo.
    text user_name? filters=trim
  
    // Detailed description of the donation memo.
    text description? filters=trim
  
    // Optional image related to the memo.
    image image?
  
    // Reference to the user who created this memo.
    int user? {
      table = "user"
    }
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]
}