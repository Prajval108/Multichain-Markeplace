import Container from "react-bootstrap/Container";
import Link from "next/link";
import Nav from "react-bootstrap/Nav";
import { Navbar } from "react-bootstrap";
import { Button } from "@chakra-ui/react";
import { ethers } from "ethers";
import Wallet from "../components/Wallets/WalletConnect";
import { ContractContext } from "../context/contractContext";
import { useContext, useEffect, useState } from "react";
import Modal from "../components/modal";
import { useDispatch, useSelector } from "react-redux";
import { apiNft } from "../services/api/nft";
import { UpdateFlow } from "../store/Flow";
import * as fcl from "@onflow/fcl";


function ColorSchemesExample() {
  const dispatch = useDispatch();
  const [toggle, setToggle] = useState(false);
  const [CurrentUser, setCurrentUser]:any = useState()

  const connectFlowWallet = async () => {
    try {
      const user = await fcl.authenticate();
      if (user?.loggedIn === true) {
        setCurrentUser(user?.addr);
        localStorage.setItem("flow", user?.addr);
        dispatch(UpdateFlow(user?.addr));
      } else {
        setCurrentUser(null);
        dispatch(UpdateFlow(null));
        localStorage.setItem("flow", "");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const disconnectFlowWallet= async()=> {
    fcl.unauthenticate()
    setCurrentUser(null);
    localStorage.setItem("flow", "");
    dispatch(UpdateFlow(null));
  }

  useEffect(()=> {
    if (toggle) {
      connectFlowWallet()
    }
    disconnectFlowWallet()
  }, [toggle])

  

  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container fluid>
          <Link
            href="/"
            className="mx-3"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "26px",
              fontStyle: "oblique",
              fontFamily: "fantasy",
            }}
          >
            Marketplace
          </Link>
          <Nav className="me-auto">
            <>
              <Link
                href="/form"
                className="mx-1"
                style={{ color: "white", textDecoration: "none" }}
              >
                Create NFT
              </Link>
            </>
            <Button borderRadius={"20px"} variant="outline" textColor={"white"} style={{"position": "absolute", "right": "182px", "top": "8px"}} onClick= {()=> setToggle(!toggle)}>
              {CurrentUser? "Flow: "+ CurrentUser:" Connect Flow Wallet"}
              </Button>
            <Wallet network="ethereum" />
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default ColorSchemesExample;
