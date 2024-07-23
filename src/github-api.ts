import { request } from "@octokit/request";
import { pino } from 'pino';

export interface Repository {
  name: string;
  owner: string;
  size: number;
  private?: boolean;
  defaultBranch?: string;
}

const logger = pino({ name: 'GitHubAPI' });

export async function getRepositoriesList(owner: string, token: string): Promise<Repository[]> {
  try {
    logger.info(`Fetching repositories for ${owner}`);

    const result = await request("GET /orgs/{org}/repos", {
      headers: {
        authorization: `token ${token}`,
      },
      org: owner,
    });

    logger.info(`Fetched ${result.data.length} repositories`);

    return result.data.map(({name, owner, size}) => ({
      name,
      owner: owner.login,
      size,
    }));
  } catch (error) {
    logger.error(error);

    throw new Error("Failed to fetch repositories");
  }
}

export async function getRepository(owner: string, repo: string, token: string): Promise<Repository> {
  try {
    logger.info(`Fetching repository ${owner}/${repo}`);

    const result = await request("GET /repos/{owner}/{repo}", {
      headers: {
        authorization: `token ${token}`,
      },
      owner,
      repo,
    });

    logger.info(`Fetched repository ${owner}/${repo}`);

    return {
      name: result.data.name,
      owner: result.data.owner.login,
      size: result.data.size,
      private: result.data.private,
      defaultBranch: result.data.default_branch,
    };
  } catch (error) {
    logger.error(error);

    throw new Error("Failed to fetch repository");
  }
}

export async function getRepositoryFiles(owner: string, repo: string, branch: string, token: string): Promise<string[]> {
  try {
    logger.info(`Fetching files for repository ${owner}/${repo}`);

    const result = await request("GET /repos/{owner}/{repo}/git/trees/{branch}?recursive=1", {
      headers: {
        authorization: `token ${token}`,
      },
      branch,
      owner,
      repo,
    });

    logger.info(`Fetched ${result.data.tree.length} files for repository ${owner}/${repo}`);

    return result.data.tree
      .filter((entry: any) => entry.type === "blob")
      .map((entry: any) => entry.path);
  } catch (error) {
    logger.error(error);

    throw new Error("Failed to fetch files");
  }
}

export async function getFileContent(owner: string, repo: string, path: string, token: string): Promise<string> {
  try {
    logger.info(`Fetching content for file ${owner}/${repo}/${path}`);

    const result = await request("GET /repos/{owner}/{repo}/contents/{path}", {
      headers: {
        authorization: `token ${token}`,
      },
      owner,
      repo,
      path,
    });

    logger.info(`Fetched content for file ${owner}/${repo}/${path}`);

    const { content } = result.data as any;

    return Buffer.from(content, "base64").toString();
  } catch (error) {
    logger.error(error);

    throw new Error("Failed to fetch file content");
  }
}
