// Retrieves today's football matches from an external API using an API key.
query "football/today_matches" verb=GET {
  input {
  }

  stack {
    // Make an API request to the external football data service
    api.request {
      url = "https://api.football-data.org/v4/matches"
      method = "GET"
      headers = []
        |push:("X-Auth-Token: " ~ $env.FOOTBALL_API_KEY)
      timeout = 30
    } as $football_api_response
  
    // Extract the 'matches' array from the API response, defaulting to an empty array if not found
    var $today_matches {
      value = $football_api_response.response.result.matches ?? []
    }
  }

  response = $today_matches
}