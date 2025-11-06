// Stocke les différentes catégories pour regrouper les thèmes de confessions.
table category {
  auth = false

  schema {
    int id
    timestamp created_at?=now
  
    // Nom de la catégorie (ex: 'Genres', 'Scénarios').
    text name? filters=trim
  
    int theme_count?
    int order?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]
}