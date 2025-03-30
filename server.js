import { ApolloServer, gql } from "apollo-server";

const tweets = [
  {
    id: "1",
    text: "1 hello",
  },
  {
    id: "2",
    text: "2 hello",
  },
];

// 1. GraphQL 스키마 정의 (보내는 쿼리)

const typeDefs = gql`
  type User {
    id: ID
    username: String
  }

  type Tweet {
    id: ID
    text: String
    author: User
  }

  # get 요청만 여기에
  type Query {
    allTweets: [Tweet!]
    tweet(id: ID!): Tweet
    ping: String!
  }

  # 나머지 요청은 여기에
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
`;

// 2. Resolvers (쿼리 처리 함수[서버가 받아 처리하는 로직])
const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },

    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      const newTweet = {
        id: tweets.length + 1,
        text,
      };
      tweets.push(newTweet);
      return newTweet;
    },

    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id == id);
      if (!tweet) {
        return false;
      }
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
};

// 3. Apollo Server 생성 (typeDefs와 resolvers 포함)
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
