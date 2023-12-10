import { Flex, Button } from "@chakra-ui/react";

import { useContractWrite } from "wagmi";
import { ThunderFiAddress, ThunderFIABI } from "@/constants/info";

import { toast } from "react-toastify";

export default function HomeHero() {
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: ThunderFiAddress,
    abi: ThunderFIABI,
    functionName: "init",
    onSuccess(data) {
      toast.success("Signed Up Successfully!");
    },
  });

  return (
    <>
      <Flex align={"center"} justify={"center"} minH={"500px"}>
        <Button onClick={() => write()}>Sign Up</Button>
      </Flex>
    </>
  );
}
