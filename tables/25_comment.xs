// Stocke les commentaires laissés sur les confessions.
table comment {
  auth = false

  schema {
    int id
    timestamp created_at?=now
  
    // Référence à l'utilisateur qui a posté le commentaire.
    int user? {
      table = "user"
    }
  
    // Référence à la confession sur laquelle le commentaire a été posté.
    int confession? {
      table = "confession"
    }
  
    // Contenu du commentaire.
    text content? filters=trim
  
    // Nombre de likes pour ce commentaire.
    int like_count?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]
}