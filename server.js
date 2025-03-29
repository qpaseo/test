import { ApolloServer, gql } from "apollo-server";

// 1. GraphQL 스키마 정의 (보내는 쿼리)

const typeDefs = gql`
  type User {
    id: ID
    username: String
  }

  type Tweet {
    id: ID!
    text: String!
    author: User!
  }

  type Query {
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet!
  }

  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
`;

// 2. Resolvers (쿼리 처리 함수[서버가 받아 처리하는 로직])
const resolvers = {
  Query: {},
};

// 3. Apollo Server 생성 (typeDefs와 resolvers 포함)
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
