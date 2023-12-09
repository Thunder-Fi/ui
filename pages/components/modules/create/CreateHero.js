import lighthouse from "@lighthouse-web3/sdk";
import { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  Flex,
  Spacer,
} from "@chakra-ui/react";

export default function CreateHero() {
  const apiKey = process.env.LIGHTHOUSE_API;

  const [purchaserAddress, setPurchaserAddress] = useState("");
  const [paymentToken, setPaymentToken] = useState("");
  const [amount, setAmount] = useState(0);
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [agreementFile, setAgreementFile] = useState(null);
  const [formError, setFormError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to sign the authentication message using Wallet
  const signAuthMessage = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts.length === 0) {
          throw new Error("No accounts returned from Wallet.");
        }
        const signerAddress = accounts[0];
        const { message } = (await lighthouse.getAuthMessage(signerAddress))
          .data;
        const signature = await window.ethereum.request({
          method: "personal_sign",
          params: [message, signerAddress],
        });
        return { signature, signerAddress };
      } catch (error) {
        console.error("Error signing message with Wallet", error);
        return null;
      }
    } else {
      console.log("Please install Wallet!");
      return null;
    }
  };

  // Function to upload the encrypted file
  async function uploadEncryptedFile() {
    if (!agreementFile) {
      console.error("No file selected.");
      return;
    }

    try {
      // This signature is used for authentication with encryption nodes
      // If you want to avoid signatures on every upload refer to JWT part of encryption authentication section
      const encryptionAuth = await signAuthMessage();
      if (!encryptionAuth) {
        console.error("Failed to sign the message.");
        return;
      }

      const { signature, signerAddress } = encryptionAuth;

      // Upload file with encryption
      const output = await lighthouse.uploadEncrypted(
        agreementFile,
        apiKey,
        signerAddress,
        signature,
        progressCallback
      );
      console.log("Encrypted File Status:", output);
      /* Sample Response
        {
          data: [
            Hash: "QmbMkjvpG4LjE5obPCcE6p79tqnfy6bzgYLBoeWx5PAcso",
            Name: "izanami.jpeg",
            Size: "174111"
          ]
        }
      */
      // If successful, log the URL for accessing the file
      console.log(
        `Decrypt at https://decrypt.mesh3.network/evm/${output.data[0].Hash}`
      );
    } catch (error) {
      console.error("Error uploading encrypted file:", error);
    }
  }

  const handleFormSubmit = () => {
    setIsSubmitting(true);
    uploadEncryptedFile();
  };

  const validatePurchaserAddress = () => {
    if (!purchaserAddress.startsWith("0x") || purchaserAddress.length !== 42) {
      setFormError(
        'Purchaser\'s Address should start with "0x" and have 42 characters.'
      );
    } else {
      setFormError("");
    }
  };

  return (
    <Box
      maxWidth="700px"
      mx="auto"
      mt="10"
      border="1px solid black"
      p={10}
      borderRadius={10}
    >
      <FormControl isRequired isInvalid={formError !== ""}>
        <FormLabel>Purchaser's Address</FormLabel>
        <Input
          type="text"
          value={purchaserAddress}
          disabled={isSubmitting}
          onChange={(e) => setPurchaserAddress(e.target.value)}
          onBlur={validatePurchaserAddress}
        />
        <FormErrorMessage>{formError}</FormErrorMessage>

        <FormLabel mt={5}>Payment Token</FormLabel>
        <Select
          value={paymentToken}
          disabled={isSubmitting}
          onChange={(e) => setPaymentToken(e.target.value)}
          placeholder="Select payment token"
        >
          <option value="USDC">USDC</option>
          <option value="USDT">USDT</option>
          <option value="DAI">DAI</option>
        </Select>

        <FormLabel mt={5}>Amount</FormLabel>
        <NumberInput
          precision={2}
          step={0.01}
          disabled={isSubmitting}
          value={amount}
          onChange={(value) => setAmount(value)}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>

        <FormLabel mt={5}>Due Date</FormLabel>
        <Input
          min={new Date()}
          disabled={isSubmitting}
          type="date"
          onChange={(e) => setExpiryDate(e.target.value)}
        />

        <FormLabel mt={5}>Agreement (PDF)</FormLabel>
        <Input
          type="file"
          disabled={isSubmitting}
          onChange={(e) => setAgreementFile(e.target.files[0])}
        />
      </FormControl>

      <Flex direction={"row"}>
        <Button mt="4" colorScheme="blue" onClick={handleFormSubmit}>
          Send
        </Button>
        <Spacer />
      </Flex>
    </Box>
  );
}
