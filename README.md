# github-scanner

## Installation

```bash
npm ci
npm run build

# Run the server
npm start

# Run the server in development mode
npm run dev
```

## Get list example
```graphql
query($account: String, $token: String) {
  list(account: $account, token: $token) {
    name
    owner
    size
  }
}
```

## Get detailed example
```graphql
query Details($account: String, $repo: String, $token: String) {
  details(account: $account, repo: $repo, token: $token) {
    name
    size
    owner
    private
    files
    yml
    webhooks
  }
}
```
