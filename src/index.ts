import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { pino } from 'pino';
import { typeDefs } from './type-defs.js';
import {listResolver} from './resolvers/list.js';
import {detailsResolver} from './resolvers/details.js';

const logger = pino({ name: 'Scanner' });

export const resolvers = {
  Query: {
    list: listResolver,
    details: detailsResolver,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

logger.info(`🚀 Server ready at ${url}`);
