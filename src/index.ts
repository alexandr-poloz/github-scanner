import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { pino } from 'pino';

const logger = pino({ name: 'Scanner' });


const typeDefs = `
  type Query {
    test: String
  }
`;

const resolvers = {
  Query: {
    test: () => 'test',
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
