import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

import { Flex, Spacer, Box } from "@chakra-ui/react";

import Link from "next/link";

export default function HomeHeader() {
  const { isConnected } = useAccount();

  return (
    <>
      <Flex direction="row" margin={10} align="center" justify="center">
        <Box fontFamily="Barlow" fontSize={50}>
          ThunderFi
        </Box>
        <Spacer />
        {isConnected ? (
          <>
            <Flex direction="row" gap={10} mr={10}>
              <Link href="/create">Create</Link>
              <Link href="/dashboard">Dashboard</Link>
            </Flex>
          </>
        ) : null}
        <ConnectButton label="Connect" showBalance={false} />
      </Flex>
    </>
  );
}
