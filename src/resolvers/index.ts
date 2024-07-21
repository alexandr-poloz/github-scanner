import {listResolver} from './list';

export const resolvers = {
  Query: {
    list: listResolver,
    details: (parent, arg) => console.log(arg.name),
  },
};
