import { pino } from 'pino';
import { getRepositoriesList } from '../github-api.js';

const logger = pino({ name: 'ListResolver' });

export interface ListArgs {
  account: string;
  token: string;
}

export interface Repo {
  name: string;
  size: number;
  owner: string;
}

export async function listResolver(_parent: any, args: ListArgs): Promise<Repo[]> {
  try {
    const {account, token} = args;

    logger.info('Fetching repositories list');

    const nodes = await getRepositoriesList(account, token);

    logger.info('Fetched repositories list');

    return nodes.map((node) => ({
      name: node.name,
      size: node.size,
      owner: node.owner,
    }));
  } catch (error) {
    logger.error(error);

    throw error
  }
}
