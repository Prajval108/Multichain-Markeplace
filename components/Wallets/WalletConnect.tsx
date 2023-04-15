import React from "react";
import { ethers } from "ethers";
import { updateAccount } from "../../store/Account";
// import axios from "axios";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import * as fcl from "@onflow/fcl";
// import { type } from "@testing-library/user-event/dist/type";
import { WalletButton, NoButton, FlowWalletButton } from "./WalletButton";

const WalletConnect = (props: any) => {
  const { utils } = require("ethers");
  // const Token = localStorage.getItem("Token");
  const Token = "test";
  // const [userAcc, setuserAcc] = useState(localStorage.getItem("metamask"));
  const [bloctoUser, setbloctoUser] = useState(null);
  const [userAcc, setuserAcc]: any = useState();
  const [CurrentUser, setCurrentUser]: any = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    setuserAcc(localStorage.getItem("metamask"));
    setCurrentUser(localStorage.getItem("flow"));
  }, []);

  const [Signature, setSignature]: any = useState();
  const [Address, setAddress]: any = useState();
  const [verifyAddress, setVerifyAddress]: any = useState();
  const [VerificationStatus, setVerificationStatus]: any = useState();

  const handleSign = async () => {
    try {
      const message = "good morning";
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(message);
      const address = await signer.getAddress();
      setSignature(signature);
      setAddress(address);
      console.log("sig : " + signature);
    } catch (error) {
      console.log("error", error);
    }
  };

  const verify = () => {
    try {
      const actualAddress = utils.verifyMessage("good morning", Signature);
      console.log(actualAddress);
      setVerifyAddress(actualAddress);
      if (actualAddress !== Address) {
        console.log("invalid");
        setVerificationStatus(false);
        alert("Invalid account");
      } else {
        console.log("valid");
        setVerificationStatus(true);
        alert("Successfully Validated");
      }
    } catch (error) {
      console.log("verifying error", error);
    }
  };

  useEffect(() => {
    if (Signature) {
      verify();
    }
  }, [Signature]);

  const netwotkCheck = async (chainId: any) => {
    if (chainId !== "0x13881") {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x13881" }],
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x13881",
                  chainName: "Mumbai Testnet",
                  rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
                  nativeCurrency: {
                    name: "MATIC",
                    symbol: "MATIC",
                    decimals: 18,
                  },
                  blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
                },
              ],
            });
          } catch (addError) {
            console.log("error", addError);
          }
        }
        // handle other "switch" errors
      }
    }
  };

  const connectMetamask = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const chainId = window.ethereum?.chainId;

      const accounts = await provider.send("eth_requestAccounts", []);
      // if (VerificationStatus !== true) {
      //   handleSign();
      // }
      dispatch(updateAccount(accounts[0]));
      console.log("provider", chainId);
      localStorage.setItem("metamask", accounts[0]);
      setuserAcc(accounts[0]);
      netwotkCheck(chainId);
      // window.location.reload();

      window.ethereum.on("accountsChanged", async function (acc: any) {
        // setAccount(acc[0]);
        if (acc.length == 0) {
          console.log("length is 0");
          dispatch(updateAccount(null));
          localStorage.setItem("metamask", "");
          setuserAcc(null);

          netwotkCheck(chainId);
          // localStorage.removeItem("metamask");
        } else {
          dispatch(updateAccount(acc[0]));
          localStorage.setItem("metamask", acc[0]);
          setuserAcc(acc[0]);
        }
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  const connectFlowWallet = async () => {
    try {
      const user = await fcl.authenticate();
      if (user?.loggedIn === true) {
        setCurrentUser(user?.addr);
        localStorage.setItem("flow", user?.addr);
      } else {
        setCurrentUser(null);
        localStorage.setItem("flow", "");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const disconnectFlowWallet = async () => {
    const user = await fcl.unauthenticate();
    setCurrentUser(null);
    localStorage.setItem("flow", "");
  };

  // useEffect(() => {
  //   if (Token && props.network === "ethereum") {
  //     connectMetamask();
  //   }
  // }, []);

  if (props.network === "ethereum") {
    return (
      <WalletButton Token={Token} userAcc={userAcc} wallet={connectMetamask} />
    );
  } else if (props.network === "flow") {
    return (
      <FlowWalletButton
        Token={Token}
        userAcc={CurrentUser}
        wallet={connectFlowWallet}
        disconnectWallet={disconnectFlowWallet}
      />
    );
  } else {
    return <NoButton Token={Token} />;
  }
};

export default WalletConnect;
