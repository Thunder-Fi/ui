import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

import { subgraphEndpoint } from "@/constants/info";

import { useAccount } from "wagmi";

import { useEffect, useState } from "react";

export default function DashboardHero() {
  const { address } = useAccount();

  const query = `{ \nagreementStatusUpdates(where: {purchaser: ${address}, or: {seller: ${address}}}) {\n      agreementId\n      seller\n      purchaser\n      status\n      timestamp\n    }\n  }`;
  const client = new ApolloClient({
    uri: subgraphEndpoint,
    cache: new InMemoryCache(),
  });

  useEffect(() => {
    async function execute() {
      var { data } = await client.query({
        query: gql`
          ${query}
        `,
      });
      console.log(data);
    }

    execute();
  }, []);
}
