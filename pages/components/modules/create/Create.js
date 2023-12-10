import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { useState } from "react";

import {
  ThunderFIABI,
  ThunderFiAddress,
  tokenToAddress,
} from "@/constants/info";

import { toast } from "react-toastify";

export default function Create({
  purchaser,
  expiryDate,
  paymentToken,
  amount,
}) {
  // string memory _agreementCID,
  // address _purchaser,
  // address _paymentToken,
  // uint _amount,
  // uint _expiry

  const [success, setSuccess] = useState(false);
  const [createFunctionPrepared, setCreateFunctionPrepared] = useState(false);

  /// APPROVAL CONFIG ===============

  const { config: createConfig } = usePrepareContractWrite({
    address: ThunderFiAddress,
    abi: ThunderFIABI,
    functionName: "createAgreement",
    args: [
      "",
      purchaser,
      tokenToAddress[paymentToken],
      amount * 1000000,
      expiryDate,
    ],
    onSuccess() {
      setCreateFunctionPrepared(true);
    },
  });
  const { data: createData, write: createWrite } =
    useContractWrite(createConfig);

  const createWaitObj = useWaitForTransaction({
    hash: createData?.hash,
    onSuccess() {
      toast.success("Successfully created an invoice!s");
    },
  });

  if (createFunctionPrepared) createWrite();
}
