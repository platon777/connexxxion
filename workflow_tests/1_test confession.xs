workflow_test "test confession" {
  stack {
    api.call "" verb=GET {
      api_group = ""
      input = {
        content       : ""
        views_count   : 0
        comments_count: 0
        topic_id      : ""
        likes_count   : 0
        created_by    : ""
        updated_by    : ""
        updated_at    : ""
        created_at    : ""
      }
    } as $endpoint1
  }
}