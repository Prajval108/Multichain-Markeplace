import { useEffect, useState, useContext } from "react";
import { ContractContext } from "../context/contractContext";
import * as fcl from "@onflow/fcl";
import Modal from "../components/modal";
import { toast } from "react-toastify";

import {
  Card,
  CardBody,
  CardFooter,
  Heading,
  Stack,
  Divider,
  Button,
  Image,
  Center,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";

function BasicExample({ data }: any) {
  const chakraToast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isListed, setisListed] = useState();
  const [Price, setPrice] = useState(0);
  const [Owner, setOwner]: any = useState();
  const currentUser = useSelector((state: any) => state.account);
  const { nftMinter, marketplace }: any = useContext(ContractContext);
  const [Loading, setLoading] = useState(false);

  const getError = (data: any) => {
    let result1 = data.indexOf("(");
    let result = data.slice(0, result1);
    return result;
  };
  const getPrice = async () => {
    const price = await marketplace.getTotalPrice(data?.nftId);
    setPrice(Number(price));
  };

  const getListingStatus = async () => {
    const status = await marketplace.isNftListed(data?.nftId);
    setisListed(status);
    getPrice();
  };

  const getOwnerofNFT = async () => {
    const owner = await nftMinter.ownerOf(data?.nftId);
    setOwner(owner);
  };

  useEffect(() => {
    setisListed(data?.isListed);
    getListingStatus();
    getOwnerofNFT();
  }, []);

  const evm_PurchaseNFT = async () => {
    setLoading(true);
    try {
      const response = await marketplace.purchaseNFT(data?.nftId, {
        value: String(Price),
      });
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
      getOwnerofNFT();
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

  return (
    <>
      <Card variant="outline" m={2} maxW="xs" flexWrap="wrap">
        <CardBody>
          <Image
            src={data?.image}
            alt="Green double couch with wooden legs"
            borderRadius="lg"
            width={300}
            height={150}
          />

          <Stack mt="3" spacing="2">
            <Heading textAlign={"center"} size="md">
              {data?.name}
            </Heading>
          </Stack>
        </CardBody>
        <Divider />
        <Center>
          <CardFooter>
            {!isListed ? (
              Owner?.toLowerCase() === currentUser ? (
                <Button variant="solid" colorScheme="yellow" onClick={onOpen}>
                  List for Sale
                </Button>
              ) : (
                <Button isDisabled variant="solid" colorScheme="pink">
                  Not Listed
                </Button>
              )
            ) : Owner?.toLowerCase() !== currentUser ? (
              <Button
                variant="solid"
                colorScheme="green"
                onClick={() => evm_PurchaseNFT()}
              >
                Buy @ {Price} Wei
              </Button>
            ) : (
              <Button isDisabled variant="solid" colorScheme="blue">
                Owned
              </Button>
            )}
          </CardFooter>
        </Center>
      </Card>
      <Modal
        isOpen={isOpen}
        OnClose={onClose}
        data={data}
        onComplete={() => getListingStatus()}
      />
    </>
  );
}

export default BasicExample;
