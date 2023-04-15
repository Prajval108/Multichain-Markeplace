import { useState } from "react";
import { create } from "ipfs-http-client";
import { Buffer } from "buffer";
import { useEffect, useContext } from "react";
import { ContractContext } from "../context/contractContext";
import { apiNft } from "../services/api/nft";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Select from "react-select";
import * as fcl from "@onflow/fcl";
import { mintNFT } from "../components/web3/transactions/mint_nft";

import {
  Center,
  FormControl,
  FormLabel,
  Input,
  Box,
  Text,
  Button,
  InputGroup,
  useToast,
  RadioGroup,
  Stack,
  Radio,
} from "@chakra-ui/react";

function BasicExample() {
  const chakraToast = useToast();
  const { nftMinter }: any = useContext(ContractContext);

  const projectId = "2DOvbfvzvxiMrIR8zw5qgs4v2mF"; // <---------- your Infura Project ID
  const projectSecret = "4fb093a8defe6d6d25da8357d764d34a"; // <---------- your Infura Secret
  const auth =
    "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

  const [fileUrl, updateFileUrl] = useState(``);
  const [Loading, setLoading] = useState(false);
  const [Uploading, setUploading] = useState(false);
  const [NftId, setNftId]: any = useState(0);
  const [Name, setName] = useState("");
  const [Description, setDescription] = useState("");
  const [Blockchain, setBlockchain] = useState("EVM");
  const [Type, setType] = useState("STANDARD");
  const currentUser = useSelector((state: any) => state.account);

  const client = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
    },
  });

  const onChange = async (e: any) => {
    const file = e.target.files[0];
    setUploading(true);
    try {
      const added = await client.add(file);
      const url = `https://prajval.infura-ipfs.io/ipfs/${added.path}`;
      setUploading(false);
      updateFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
      setUploading(false);
    }
  };

  console.log("fileURL", fileUrl);

  const getError = (data: any) => {
    let result1 = data.indexOf("(");
    let result = data.slice(0, result1);
    return result;
  };

  const handleSubmit = (e: any) => {
    if (Blockchain === "EVM") {
      evm_MintNFT(e);
    } else {
      flow_mintNFT(e);
    }
  };

  const evm_MintNFT = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const ipfsHash = await client.add(
        JSON.stringify({ Name, Description, fileUrl })
      );
      const uri = `https://prajval.infura-ipfs.io/ipfs/${ipfsHash.path}`;
      const response = await nftMinter.bulkMint(
        [NftId],
        currentUser,
        uri,
        1,
        currentUser
      );
      toast.promise(
        response?.wait(),
        {
          pending: "Transaction Submitting ...",
          success: "Transaction Successfull",
          error: "Transaction Failed",
        },
        {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          theme: "dark",
        }
      );
      await response.wait();
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log("error", error);
      // alert(getError(error.message));
      chakraToast({
        position: "top",
        title: "Error",
        description: getError(error.message),
        status: "error",
        duration: 4500,
        isClosable: true,
      });
    }
  };

  const flow_mintNFT = async (e: any) => {
    e.preventDefault();
    try {
      const ipfsHash = await client.add(
        JSON.stringify({ Name, Description, fileUrl })
      );
      const uri = `https://prajval.infura-ipfs.io/ipfs/${ipfsHash.path}`;
      const transactionId = await fcl.mutate({
        cadence: mintNFT,
        args: (arg: any, t: any) => [arg(uri, t.String), arg(1, t.UInt64)],
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 999,
      });
      console.log(transactionId);
      const response = await fcl.tx(transactionId).onceSealed();
      console.log("sealed", response);
      chakraToast({
        position: "top",
        title: "NFT Minted",
        description: "Your Flow NFT successfully Minted",
        status: "success",
        duration: 4500,
        isClosable: true,
      });
    } catch (error) {
      console.log("Error minting", error);
      chakraToast({
        position: "top",
        title: "Minting Error",
        description: `${error}`,
        status: "error",
        duration: 4500,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Text fontWeight={"bold"} fontSize={"3xl"} className="text-center mt-5">
        MINT NFT
      </Text>
      <Center>
        <Box width={"700px"} p="5">
          <form onSubmit={handleSubmit}>
            <FormControl isRequired my={5}>
              <FormLabel>NFT Name</FormLabel>
              <Input
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter NFT Name"
              />
            </FormControl>

            <FormControl isRequired my={5}>
              <FormLabel>Blockchain Network</FormLabel>
              <RadioGroup
                onChange={(data: any) => setBlockchain(data)}
                defaultValue="EVM"
              >
                <Stack spacing={4} direction="row">
                  <Radio value="EVM">EVM</Radio>
                  <Radio value="Flow">Flow</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            {Blockchain === "EVM" && (
              <>
                <FormControl isRequired my={5}>
                  <FormLabel>Mint type</FormLabel>
                  <RadioGroup
                    onChange={(data: any) => setType(data)}
                    defaultValue="STANDARD"
                  >
                    <Stack spacing={4} direction="row">
                      <Radio value="STANDARD">Standard</Radio>
                      <Radio value="LAZY">Lazy</Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>

                <FormControl isRequired my={5}>
                  <FormLabel>NFT ID</FormLabel>
                  <Input
                    onChange={(e) => setNftId(e.target.value)}
                    type="number"
                    placeholder="Enter NFT ID"
                  />
                </FormControl>
              </>
            )}

            <FormControl isRequired my={5}>
              <FormLabel>NFT Description</FormLabel>
              <Input
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter Description"
              />
            </FormControl>

            <FormControl isRequired my={5}>
              <FormLabel>Upload File</FormLabel>
              <InputGroup>
                <Input
                  type="file"
                  onChange={onChange}
                  style={{ paddingTop: "4px" }}
                />
                {Uploading && (
                  <Button
                    ml={2}
                    isLoading={Uploading}
                    onClick={() => {
                      document.getElementById("file")?.click();
                    }}
                    roundedRight="10"
                    roundedLeft="10"
                    colorScheme={"yellow"}
                  >
                    {Uploading ? "Uploading" : "Upload"}
                  </Button>
                )}
              </InputGroup>
            </FormControl>
            <Box display={"flex"} justifyContent={"center"}>
              <Button
                colorScheme={"teal"}
                type="submit"
                isLoading={Loading}
                loadingText="Submitting"
                isDisabled={Uploading}
              >
                Submit
              </Button>
            </Box>
          </form>
        </Box>
      </Center>
    </>
  );
}

export default BasicExample;
