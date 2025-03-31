import { ApolloCache, InMemoryCache } from "@apollo/client";

const client = new ApolloCache({
  uri: "http://localhost:4000/",
  cache: new InMemoryCache(),
});

export default client;
