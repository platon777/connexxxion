// Add comment_like record
query comment_like verb=POST {
  input {
    dblink {
      table = "comment_like"
    }
  }

  stack {
    db.query comment_like {
      where = $db.comment_like.device_id == $input.device_id && $db.comment_like.comment == $input.comment
      return = {type: "list"}
    } as $comment_like1
  
    conditional {
      if ($comment_like1 != null) {
        db.bulk.delete comment_like {
          where = $db.comment_like.comment == $input.comment && $db.comment_like.device_id == $input.device_id
        }
      
        return {
          value = "removed!!!!"
        }
      }
    
      else {
        db.add comment_like {
          data = {
            created_at: "now"
            comment   : $input.comment
            device_id : $input.device_id
          }
        } as $comment_like
      }
    }
  }

  response = $comment_like
}