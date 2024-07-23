import { pino } from 'pino';
import { getFileContent, getRepository, getRepositoryFiles } from '../github-api.js';
import { Queue, Worker } from '../queue.js';

const logger = pino({ name: 'DetailsResolver' });

interface DetailsArgs {
  account: string;
  repo: string;
  token: string;
}

interface Details {
  name: string;
  size: number;
  owner: string;
  private: boolean;
  files: number;
  yml: string;
  webhooks: string[];
}

class DetailsWorker implements Worker<DetailsArgs, Details> {
  async run(options: DetailsArgs): Promise<Details> {
    const {account, repo, token} = options;

    const repository = await getRepository(account, repo, token);
    const files = await getRepositoryFiles(account, repo, repository.defaultBranch, token);
    const yamlFile = files.find((file) => file.endsWith('.yml'));

    const details: Details = {
      name: repository.name,
      size: repository.size,
      owner: repository.owner,
      private: repository.private,
      files: files.length,
      yml: null,
      webhooks: [],
    }

    if (yamlFile) {
      details.yml = await getFileContent(account, repo, yamlFile, token);
    }

    return details;
  }
}

const queue = new Queue<DetailsWorker>();

// There are 2 workers only available
queue.enqueue(new DetailsWorker());
queue.enqueue(new DetailsWorker());

export async function detailsResolver(_parent: unknown, args: DetailsArgs): Promise<Details> {
  try {
    const { account, repo } = args;

    logger.info(`Fetching details for ${account}/${repo}`);

    // Dequeue a worker
    const worker = await queue.dequeue();

    logger.info(`Running worker for ${account}/${repo}`);

    // Run the worker job
    const details = await worker.run(args);

    logger.info(`Fetched details for ${account}/${repo}`);

    // Enqueue the worker again
    queue.enqueue(worker);

    return details;
  } catch (error) {
    logger.error(error);
    throw error;
  }
}
