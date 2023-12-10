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
  const [purchaserAddress, setPurchaserAddress] = useState("");
  const [paymentToken, setPaymentToken] = useState("");
  const [amount, setAmount] = useState(0);
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [agreementFile, setAgreementFile] = useState(null);
  const [formError, setFormError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = () => {
    setIsSubmitting(true);
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
          onChange={(e) => uploadFile(e.target.files)}
        />
      </FormControl>

      <Flex direction={"row"}>
        <Button mt="4" colorScheme="blue" onClick={handleFormSubmit}>
          Send
        </Button>
        <Spacer />
      </Flex>
    </Box>
    // {isSubmitting ? <}
  );
}
