// This tool performs targeted web searches, retrieves the most relevant results, and summarizes them according to the user request. Ideal for gathering up-to-date football match data, betting odds, or industry best practices.
// 
tool research_on_the_internet {
  instructions = """
    Use this tool whenever you need to search for up-to-date information that may not be contained in your current knowledge. 
    Appropriate use cases:
    - Retrieving the latest football match schedules, odds, or statistics.
    - Gathering current news or industry best practices.
    - Finding supporting information for analysis tasks.
    
    Input:
    - A clear and specific search query string, written in natural language, describing what information to look for.
    
    Behavior:
    - Pass the query to the search engine or API endpoint.
    - Collect the most relevant results.
    - Summarize or extract the requested information in the format specified by the user.
    
    Output:
    - A concise, well-structured summary or data extract, directly relevant to the query.
    - If the query cannot be fulfilled, explain why and suggest alternative approaches.
    """

  input {
    text api_key? filters=trim
  }

  stack {
    api.request {
      url = "https://api.openai.com/v1/chat/completions"
      method = "POST"
      params = {}
        |set:"model":"gpt-5"
        |set:"messages":([]
          |push:({}
            |set:"role":"system"
            |set:"content":"Tu es un assistant expert en recherche sur le web."
          )
          |push:({}
            |set:"role":"user"
            |set:"content":"Recherche sur le web : \"Meilleures pratiques pour architecturer un SaaS multi-tenant\" et r\303\251sume les r\303\251sultats en 3 points."
          )
        )
      headers = []
        |push:"Content-Type: application/json"
        |push:"Authorization: Bearer "~ $input.api_key
    } as $api1
  }

  response = $api1
  tags = ["web_search", "data_gathering", "information_retrieval"]
}