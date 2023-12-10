import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { subgraphEndpoint } from "@/constants/info";

export default function DashboardHero() {


    
  const client = new ApolloClient({
    uri: subgraphEndpoint,
    cache: new InMemoryCache(),
  });
}
