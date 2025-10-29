// Add confession_like record
query confession_like verb=POST {
  input {
    dblink {
      table = "confession_like"
    }
  }

  stack {
    db.query confession_like {
      where = $db.confession_like.confession == $input.confession && $db.confession_like.device_id == $input.device_id
      return = {type: "list"}
    } as $confession_like2
  
    conditional {
      if ($confession_like2 != null) {
        db.bulk.delete confession_like {
          where = $db.confession_like.confession == $input.confession && $db.confession_like.device_id == $input.device_id
        } as $confession_like1
      
        return {
          value = "removed!!!!!"
        }
      }
    
      else {
        db.add confession_like {
          data = {
            created_at: "now"
            confession: $input.confession
            device_id : $input.device_id
          }
        } as $confession_like
      
        db.get confession {
          field_name = "id"
          field_value = $input.confession
        } as $confession2
      
        db.edit confession {
          field_name = "id"
          field_value = $confession2.id
          data = {like_count: $var.confession2.like_count+1}
        } as $confession1
      }
    }
  }

  response = {confession_like2: $confession_like}
}