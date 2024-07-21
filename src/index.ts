import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { pino } from 'pino';
import { resolvers } from './resolvers';
import { typeDefs } from './type-defs';

const logger = pino({ name: 'Scanner' });

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

logger.info(`🚀 Server ready at ${url}`);
