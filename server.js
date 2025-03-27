import { ApolloServer, gql } from "apollo-server";

// 1. GraphQL 스키마 정의 (보내는 쿼리)
const typeDefs = gql`
  type Query {
    text: String
    hello: String
  }
`;

// 2. Resolvers (쿼리 처리 함수[서버가 받아 처리하는 로직])
const resolvers = {
  Query: {
    text: () => "This is a text field",
    hello: () => "Hello, GraphQL!",
  },
};

// 3. Apollo Server 생성 (typeDefs와 resolvers 포함)
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
