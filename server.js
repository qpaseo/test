import { ApolloServer, gql } from "apollo-server";
import fetch from "node-fetch";

const tweets = [
  {
    id: "1",
    text: "1 hello",
    userId: "2",
  },
  {
    id: "2",
    text: "2 hello",
    userId: "1",
  },
];

let users = [
  {
    id: "1",
    firstName: "seo",
    lastName: "0209",
  },
  {
    id: "2",
    firstName: "sei",
    lastName: "0208",
  },
];

// 1. GraphQL 스키마 정의 (보내는 쿼리)

const typeDefs = gql`
  type User {
    id: ID
    firstName: String
    lastName: String
    """
    user fullName  firstName + lastName
    """
    fullName: String
  }

  """
  Tweet obejct type
  """
  type Tweet {
    id: ID!
    text: String!
    author: User!
  }

  # get 요청만 여기에
  type Query {
    allTweets: [Tweet!]
    allUsers: [User!]!
    tweet(id: ID!): Tweet
    ping: String!
    allMovies: [Movie!]!
    movie(id: ID): Movie
  }

  # 나머지 요청은 여기에
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet
    deleteTweet(id: ID!): Boolean!
  }

  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String]!
    summary: String
    description_full: String!
    synopsis: String
    yt_trailer_code: String!
    language: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
  }
`;

// 2. Resolvers (쿼리 처리 함수[서버가 받아 처리하는 로직])
const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },

    allUsers() {
      console.log("alluser called");
      return users;
    },

    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },

    allMovies() {
      return fetch("https://yts.mx/api/v2/list_movies.json")
        .then((r) => r.json())
        .then((json) => json.data.movies);
    },

    movie(_, { id }) {
      return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
        .then((r) => r.json())
        .then((json) => json.data.movie);
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      const user = users.find((user) => user.id === userId);
      if (user) {
        const newTweet = {
          id: tweets.length + 1,
          text,
          userId,
        };
        tweets.push(newTweet);
        return newTweet;
      }
      return null;
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
  User: {
    fullName({ firstName, lastName }) {
      // root(불러올 당시의 user값)에서 정보 추출해서 연산
      return `${firstName} ${lastName}`;
    },
  },

  Tweet: {
    author({ userId }) {
      return users.find((user) => user.id === userId);
    },
  },
};

// 3. Apollo Server 생성 (typeDefs와 resolvers 포함)
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
