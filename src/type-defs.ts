export const typeDefs = `
  type Repo {
    name: String
    size: Int
    owner: String
  }
  
  type Details {
    name: String
    size: Int
    owner: String
    private: Boolean
    files: Int
    yml: String
    webhooks: String
  }

  type Query {
    list(account: String, key: String): [Repo]
    details(account: String, repo: String, key: String): Details
  }
`;
