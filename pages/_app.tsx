import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import type { AppProps } from "next/app";
import NavBar from "../components/navbar";
import { ContractContext } from "../context/contractContext";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import nftJson from "../src/contractData/nft-minter.json";
import marketplaceJson from "../src/contractData/marketplace.json";
import { ToastContainer } from "react-toastify";
import account from "../store/Account";
import { combineReducers, createStore } from "redux";
import { Provider } from "react-redux";
import { ChakraProvider, useToast, extendTheme } from "@chakra-ui/react";
import { StepsTheme as Steps } from "chakra-ui-steps";
import { setupUserTx } from "../components/web3/transactions/setup_user";
import { checkCollectionTx } from "../components/web3/scripts/check_collection";
import * as fcl from "@onflow/fcl";

const theme = extendTheme({
  components: {
    Steps,
  },
});

fcl.config({
  "app.detail.title": "Flow NFT Marketplace",
  "app.detail.icon": "https://i.ibb.co/j3ccDcv/image-removebg-preview.png",
  "accessNode.api": "https://rest-testnet.onflow.org", // Mainnet: "https://rest-mainnet.onflow.org"
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn", // Mainnet: "https://fcl-discovery.onflow.org/authn",
  "flow.network": "testnet",
  "0xProfile": "0xb7edc0f0ea3fbf8c",
});

const userApp = combineReducers({
  account,
});
const store = createStore(userApp);

export default function App({ Component, pageProps }: AppProps) {
  const toast = useToast();
  const [nftMinter, setnftMinter] = useState();
  const [marketplace, setmarketplace] = useState();

  const web3Handler = async () => {
    if (window.ethereum) {
      // Get provider from Metamask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // Set signer
      const signer = provider.getSigner();
      console.log("provider", window.ethereum?.chainId);

      window.ethereum.on("chainChanged", (chainId: any) => {
        if (chainId !== "0x13881") {
          window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x13881" }],
          });
        }
        window.location.reload();
      });
      try {
        if (window.ethereum?.chainId === "0x13881") {
          loadContracts(signer);
        }
      } catch (error) {
        console.log("error", error);
      }

      // localStorage.setItem("status", true)
    } else {
      toast({
        title: "Wallet Error",
        description:
          "Non-Ethereum browser detected. You should consider trying MetaMask!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      // localStorage.setItem("status", false)
    }
  };

  const loadContracts = async (signer: any) => {
    const _nftMinter: any = new ethers.Contract(
      nftJson.address,
      nftJson.abi,
      signer
    );
    setnftMinter(_nftMinter);

    const _marketplace: any = new ethers.Contract(
      marketplaceJson.address,
      marketplaceJson.abi,
      signer
    );
    setmarketplace(_marketplace);
    // dispatch(updatemarketplace(marketplace));
  };

  useEffect(() => {
    web3Handler();
    document.title = "Marketplace";
  }, []);

  //Flow
  const [User, setUser]: any = useState("");

  useEffect(() => {
    fcl.currentUser().subscribe((newUser: any) => {
      if (newUser?.loggedIn) {
        setUser(newUser);
      } else {
        setUser(null);
      }
    });
  }, []);

  const setupCollection = async () => {
    try {
      const transactionId = await fcl.mutate({
        cadence: setupUserTx,
        args: (arg: any, t: any) => [],
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 999,
      });
      var response = await fcl.tx(transactionId).onceSealed();
      toast({
        title: "Collection successfully created",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      // CommonHelperMethods.showSuccessToast(toast, "Vault successfully created");
    } catch (error) {
      console.log("error", error)
      fcl.unauthenticate();
      toast({
        title: "Failed creating vault",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const [CStatus, setCStatus]: any = useState(true);
  console.log("collectionStatus", CStatus, User?.addr, User?.loggedIn);
  const CollectionStatus = async () => {
    if (User?.addr)
      try {
        const result = await fcl.query({
          cadence: checkCollectionTx,
          args: (arg: any, t: any) => [arg(User?.addr, t.Address)],
        });

        setCStatus(result);
      } catch (error) {}
  };

  useEffect(() => {
    if (User?.addr) {
      CollectionStatus();
    }
  }, [User]);

  useEffect(() => {
    if (!CStatus) {
      setupCollection();
      toast({
        title: "Creating Collection...",
        description: "We've not found any Collection",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  }, [CStatus]);

  return (
    <>
      <ChakraProvider theme={theme}>
        <Provider store={store}>
          <ContractContext.Provider value={{ nftMinter, marketplace }}>
            <NavBar />
            <ToastContainer />
            <Component {...pageProps} />
          </ContractContext.Provider>
        </Provider>
      </ChakraProvider>
    </>
  );
}
