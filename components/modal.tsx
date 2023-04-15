import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ethers } from "ethers";
// import Button from "react-bootstrap/Button";
import { ContractContext } from "../context/contractContext";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { list, useDisclosure, useToast } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Progress
} from "@chakra-ui/react";

export default function Example(props: any) {
  const chakraToast = useToast();
  const { contractInstance }: any = useContext(ContractContext);
  const [Loading, setLoading] = useState(false);
  const [ApprovalLoader, setApprovalLoader] = useState(false)
  const [Price, setPrice] = useState(0);
  const { nftMinter, marketplace }: any = useContext(ContractContext);
  const marketplaceContractAddress = "0xA8434c382D06e49b7277d3cd3e508392fA6466ce"

  const getError = (data: any) => {
    let result1 = data.indexOf("(");
    let result = data.slice(0, result1);
    return result;
  };

  const evm_ListNFT = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      // const listingPrice = ethers.utils.parseUnits(String(Price));
      const getApproved = await nftMinter.getApproved(props?.data?.nftId)
      if (getApproved !== marketplaceContractAddress){
        setApprovalLoader(true)
        await nftMinter.approve(marketplaceContractAddress, props?.data?.nftId)
        setApprovalLoader(false)
      }
      console.log("approval", getApproved)
      const response = await marketplace.listNFT(
        props?.data?.nftId,
        props?.data?.uri,
        Price,
        "1",
        false
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
      props?.onComplete();
      props.OnClose();
    } catch (error: any) {
      setLoading(false);
      console.log("error", error);
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

  return (
    <>
      <Modal size={"2xl"} isOpen={props.isOpen} onClose={props.OnClose}>
        <ModalOverlay />
        <form onSubmit={evm_ListNFT}>
          <ModalContent>
            <ModalHeader>NFT Listing</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isRequired>
                <FormLabel>Price</FormLabel>
                <Input
                  type="number"
                  placeholder="enter amount in flow"
                  onChange={(e: any) => setPrice(e.target.value)}
                />
              </FormControl>
              {Loading && <Progress mt={2} size='sm' isIndeterminate= {ApprovalLoader} value= {50}/>}

            </ModalBody>


            <ModalFooter>
              <Button isLoading={Loading} loadingText="Submitting" variant="solid" type="submit">
                Submit
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
}
