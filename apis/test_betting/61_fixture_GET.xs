query fixture verb=GET {
  input {
  }

  stack {
    api.request {
      url = "https://api-football-v1.p.rapidapi.com/v3/fixtures"
      method = "GET"
      params = {}|set:"date":"2025-08-11"
      headers = []
        |push:"x-rapidapi-host: api-football-v1.p.rapidapi.com"
        |push:"x-rapidapi-key: 9c457fc3eemshb8f49e7ab2b6c2dp120d23jsn0e64203539a3"
    } as $api1
  }

  response = $api1
}