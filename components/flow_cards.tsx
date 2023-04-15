// import Button from "react-bootstrap/Button";
// import Card from "react-bootstrap/Card";
// import Modal from "./modal";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import * as fcl from "@onflow/fcl";
import { listForSaleTx } from "../components/web3/transactions/list_for_sale.js";
import { purchaseTx } from "../components/web3/transactions/purchase.js";
import Transaction from "./TransactionBar";
import Form from "react-bootstrap/Form";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Center,
  Divider,
  Flex,
  Heading,
  Image,
  Stack,
} from "@chakra-ui/react";

function BasicExample({ nftData, data, address }: any) {
  const [user, setUser]: any = useState();
  const [_nftData, set_nftData]: any = useState();
  useEffect(() => {
    // sets the `user` variable to the person that is logged in through Blocto
    fcl.currentUser().subscribe((res: any) => {
      setUser(res);
      console.log("userInfo", data);
    });
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch(nftData.uri);
    const metadata = await response.json();
    set_nftData(metadata);
  };

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);
  const [price, setPrice] = useState();

  const [txId, setTxId] = useState();
  const [txInProgress, setTxInProgress] = useState(false);
  const [txStatus, setTxStatus] = useState(-1);
  const [txStatusCode, setTxStatusCode] = useState(0);

  const listForSale = async (id: any) => {
    setTxInProgress(true);
    setTxStatus(-1);
    try {
      const amount = Number(price).toFixed(2);
      const transactionId = await fcl.mutate({
        cadence: listForSaleTx,
        args: (arg: any, t: any) => [
          arg(parseInt(id), t.UInt64),
          arg(amount, t.UFix64),
        ],
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 999,
      });
      console.log("Transaction ID", transactionId);

      setTxId(transactionId);
      fcl.tx(transactionId).subscribe((res: any) => {
        setTxStatus(res.status);
        setTxStatusCode(res.statusCode);
        console.log("error", res.errorMessage);
        console.log("response", res);
      });
    } catch (error) {
      setTxInProgress(false);
      console.log("error", error);
      alert(error);
    }
  };

  const purchase = async (id: any) => {
    setTxInProgress(true);
    setTxStatus(-1);
    handleShow1();
    try {
      const transactionId = await fcl.mutate({
        cadence: purchaseTx,
        args: (arg: any, t: any) => [
          arg("TTxnId", t.String),
          arg(address, t.Address),
          arg(parseInt(id), t.UInt64),
        ],
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 999,
      });
      console.log("Transaction ID", transactionId);

      setTxId(transactionId);
      fcl.tx(transactionId).subscribe((res: any) => {
        setTxStatus(res.status);
        setTxStatusCode(res.statusCode);
        console.log("error", res.errorMessage);
        console.log("response", res);
      });
    } catch (error) {
      console.log("error in listin", error);
      handleClose1();
      setTxInProgress(false);
      alert(error);
    }
  };

  return (
    <>
      <Card variant="outline" m={2} maxW="xs" flexWrap="wrap">
        <CardBody>
          <Image
            src={_nftData?.fileUrl}
            alt="nft image"
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
            {data[nftData?.id] ? (
              address !== user?.addr ? (
                <Button
                  variant="solid"
                  colorScheme="yellow"
                  onClick={() => purchase(nftData?.id)}
                >
                  Buy @{Number(data[nftData?.id])} FLOW
                </Button>
              ) : (
                <Button isDisabled variant="solid" colorScheme="pink">
                  Owned
                </Button>
              )
            ) : address === user?.addr ? (
              <Button variant="solid" colorScheme="green" onClick={handleShow}>
                List for Sale
              </Button>
            ) : (
              <Button isDisabled variant="solid" colorScheme="blue">
                Not Listed
              </Button>
            )}
          </CardFooter>
        </Center>
      </Card>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>NFT Listing</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="my-2" style={{ paddingLeft: "18px" }}>
            Set price for selling NFT
          </h5>
          <Form className="d-flex container my-2">
            <Form.Control
              type="number"
              placeholder="Enter amount in Rumble"
              className="me-2"
              aria-label="Search"
              // value={address.trim()}
              onChange={(e: any) => setPrice(e.target.value)}
            />
            <Button
              variant="outline-success"
              onClick={() => {
                listForSale(Number(nftData?.id));
              }}
            >
              Submit
            </Button>
          </Form>
          <Transaction
            txId={txId}
            txInProgress={txInProgress}
            txStatus={txStatus}
            txStatusCode={txStatusCode}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show1} onHide={handleClose1}>
        <Modal.Header closeButton>
          <Modal.Title>NFT Purchase</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Transaction
            txId={txId}
            txInProgress={txInProgress}
            txStatus={txStatus}
            txStatusCode={txStatusCode}
          />
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
}

export default BasicExample;
