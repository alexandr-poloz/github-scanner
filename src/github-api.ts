import { graphql } from "@octokit/graphql";
import {pino} from 'pino';

export interface SearchRepoOwner {
  login: string;
}

export interface SearchRepoNode {
  name: string;
  owner: SearchRepoOwner;
  diskUsage: number;
}

export interface SearchRepoResponse {
  search: {
    nodes: SearchRepoNode[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    }
  }
}

const logger = pino({ name: 'GitHubAPI' });

export async function searchRepositories(account: string, key: string, cursor?: string): Promise<SearchRepoNode[]> {
  const query = `
    query($cursor: String, $searchQuery: String!, $first: Int!) {
      search (after: $cursor, first: $first, type: REPOSITORY, query: $searchQuery) {
        nodes {
          ... on Repository {
            name
            owner {
             login
            }
            diskUsage
          }
        }
        pageInfo {
          hasNextPage,
          endCursor
        }
      }
    }
  `;

  const params: any = {
    searchQuery: `org:${account}`,
    first: 50,
    headers: {
      authorization: `token ${key}`,
    },
  };

  if (cursor) {
    params.cursor = cursor;
  }

  const response: SearchRepoResponse = await graphql(query, params);
  const { search: { nodes, pageInfo: { endCursor, hasNextPage } } } = response;

  if (!hasNextPage) {
    return nodes;
  }

  const nextNodes = await searchRepositories(account, key, endCursor);

  return [...nodes, ...nextNodes];
}
