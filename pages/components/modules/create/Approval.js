import { ThunderFiAddress, USDCABI, USDCAddress } from "@/constants/info";
import { useState } from "react";

import Create from "./Create";

import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

export default function Approval({
  cid,
  purchaser,
  expiryDate,
  paymentToken,
  amount,
}) {
  const [approved, setApproved] = useState(false);
  const [firstCall, setFirstCall] = useState(true);
  const [usdcFunctionPrepared, setUsdcFunctionPrepared] = useState(false);

  /// APPROVAL CONFIG ===============

  const { config: usdcConfig } = usePrepareContractWrite({
    address: USDCAddress,
    abi: USDCABI,
    functionName: "approve",
    args: [ThunderFiAddress, 1000000n],
    onSuccess() {
      setUsdcFunctionPrepared(true);
    },
  });
  const { data: usdcData, write: usdcApprovalWrite } =
    useContractWrite(usdcConfig);

  const usdcWaitObj = useWaitForTransaction({
    hash: usdcData?.hash,
    onSuccess() {
      setApproved(true);
    },
  });

  if (usdcFunctionPrepared && firstCall) {
    setFirstCall(false);
    usdcApprovalWrite();
  }

  return (
    <>
      {approved ? (
        <Create
          cid={cid}
          purchaser={purchaser}
          expiryDate={expiryDate}
          paymentToken={paymentToken}
          amount={amount}
        />
      ) : null}
    </>
  );
}
