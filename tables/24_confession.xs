// Stocke les confessions érotiques publiées par les utilisateurs.
table confession {
  auth = false

  schema {
    int id
    timestamp created_at?=now
  
    // Référence à l'utilisateur qui a posté la confession.
    int user? {
      table = "user"
    }
  
    // Référence à la thématique de la confession.
    int theme? {
      table = "theme"
    }
  
    // Titre de la confession.
    text title? filters=trim
  
    // Contenu détaillé de la confession.
    text content? filters=trim
  
    // Nombre de fois que la confession a été vue.
    int view_count?
  
    // Nombre de likes pour cette confession.
    int like_count?
  
    int comment_count?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]
}