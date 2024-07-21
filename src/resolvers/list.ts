import { pino } from 'pino';
import { searchRepositories } from '../github-api';

const logger = pino({ name: 'ListResolver' });

export interface ListArgs {
  account: string;
  key: string;
}

export interface Repo {
  name: string;
  size: number;
  owner: string;
}

export async function listResolver(_parent: any, args: ListArgs): Promise<Repo[]> {
  const { account, key } = args;

  const nodes = await searchRepositories(account, key);

  return nodes.map((node) => ({
    name: node.name,
    size: node.diskUsage,
    owner: node.owner?.login,
  }));
}
