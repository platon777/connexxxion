// Stocke les différentes thématiques pour les confessions.
table theme {
  auth = false

  schema {
    int id
    timestamp created_at?=now
  
    // Nom de la thématique (ex: 'Fantasy', 'Roleplay').
    text name? filters=trim
  
    // Référence à la catégorie à laquelle ce thème appartient.
    int category? {
      table = "category"
    }
  
    // Detailed description of the theme.
    text description? filters=trim
  
    int number_of_confess?
    bool Active?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]
}