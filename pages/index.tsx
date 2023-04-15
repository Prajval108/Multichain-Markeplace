import Head from "next/head";
import styles from "../styles/Home.module.css";
import { ContractContext } from "../context/contractContext";
import { useContext, useEffect, useState } from "react";
import { getNFTsScript } from "../components/web3/scripts/get_nfts";
import { getSaleNFTsScript } from "../components/web3/scripts/get_sale_nfts";
import FlowCard from "../components/flow_cards";
import * as fcl from "@onflow/fcl";
import { useSelector } from "react-redux";
import {
  Text,
  Button,
  Divider,
  useToast,
  Center,
  Box,
  Flex,
  useDisclosure,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Spinner,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import Card from "../components/cards";
import Modal from "../components/modal";

export default function Home() {
  const [Ids, setIds] = useState([]);
  const [NftData, setNftdData] = useState({});
  const [Loading, setLoading] = useState(false);
  const [FlowLoading, setFlowLoading] = useState(false)
  const currentUser = useSelector((state: any) => state.account);
  const { nftMinter, marketplace }: any = useContext(ContractContext);

  const [Address, setAddress] = useState();
  const [Trigger, setTrigger] = useState(false);
  const [nftData, setnftData]: any = useState({});
  const [salenfts, setsalenfts]: any = useState({});

  const getData = async () => {
    const ids = await nftMinter?.getIds();
    setIds(ids);
  };

  useEffect(() => {
    if (nftMinter) getData();
  }, [nftMinter]);

  useEffect(() => {
    if (Ids) getNFTData();
  }, [Ids]);

  const getNFTData = async () => {
    try {
      setLoading(true);
      let items = [];
      for (let i = 0; i < Ids.length; i++) {
        let nftId = String(Ids[i]);
        const status = await marketplace.isNftListed(nftId);
        const uri = await nftMinter.tokenURI(nftId);
        const response = await fetch(uri);
        const metadata = await response.json();
        items.push({
          nftId: nftId,
          uri: uri,
          name: metadata.Name,
          description: metadata.Description,
          image: metadata.fileUrl,
          isListed: status,
        });
        console.log("ca", nftId, uri);
      }
      setNftdData(items);
      setLoading(false);
    } catch (error) {
      console.log("error while fetching nfts", error)
    }
  };

  // flow
  const getnftData = async (address: any) => {
    try {
      setFlowLoading(true)
      const result = await fcl.query({
        cadence: getNFTsScript,
        args: (arg: any, t: any) => [arg(address, t.Address)],
      });
      console.log("minted NFT", result);
      setnftData({ ...nftData, [address]: result });
      setFlowLoading(false)
    } catch (error) {
      setFlowLoading(false)
      console.log("error", error);
    }
  };

  const getUserSaleNFTs = async (address: any) => {
    try {
      const result = await fcl.query({
        cadence: getSaleNFTsScript,
        args: (arg: any, t: any) => [arg(address, t.Address)],
      });
      setsalenfts({ ...salenfts, [address]: result });
      console.log("listedNFT", salenfts);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getnftData(Address);
    getUserSaleNFTs(Address);
  }, [Trigger]);

  // useEffect(() => {
  //   getAddress().map((i) => {
  //     getnftData(i);
  //     getUserSaleNFTs(i);
  //   });
  // }, []);

  return (
    <>
      <Tabs
        mt={3}
        mr={3}
        variant="soft-rounded"
        colorScheme="green"
        align="end"
      >
        <TabList>
          <Tab>Ethereum</Tab>
          <Tab>Flow</Tab>
        </TabList>

        <TabPanels p="2rem">
          <TabPanel>
            <Text
              mb={5}
              fontWeight={"bold"}
              fontSize={"3xl"}
              className="text-center"
            >
              NFTs
            </Text>
            <Center flexWrap="wrap">
              {Loading && (
                <Spinner
                  thickness="5px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                />
              )}
              <Flex>
                {NftData &&
                  Object.values(NftData).map((data: any, index: Number) => (
                    <Card key={index} data={data} />
                  ))}
              </Flex>
            </Center>
          </TabPanel>

          <TabPanel>
            <Center flexWrap="wrap">
              <Box>
                <Center>
                <Box
                  width={"700px"}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  height="1vh"
                >
                  <FormControl pb={3} isRequired my={5}>
                    <FormLabel>Blocto Address</FormLabel>
                    <Select placeholder='Select account' onChange={(e:any)=> setAddress(e.target.value)}>
                      <option value='0x25e5545494f5b704'>0x25e5545494f5b704</option>
                      <option value='0x9e278db07c2cc744'>0x9e278db07c2cc744</option>
                    </Select>
                    {/* <Input
                      onChange={(e: any) => setAddress(e.target.value)}
                      placeholder="Enter blocto address"
                    /> */}
                  </FormControl>

                  <Button
                    mx={2}
                    mt={5}
                    colorScheme={"teal"}
                    type="submit"
                    onClick={() => setTrigger(!Trigger)}
                    isLoading = {FlowLoading}
                    loadingText = "Fetching"
                  >
                    Submit
                  </Button>
                </Box>
                </Center>
                <Box mt={"80px"}>
                  <Center flexWrap="wrap">
                    <Flex>
                      {Object.entries(nftData).map(
                        ([key, value]: any) =>
                          salenfts[key] &&
                          value &&
                          value.map((nft: any, index: Number) => (
                            <FlowCard
                              key={index}
                              nftData={nft}
                              data={salenfts[key]}
                              address={key}
                            />
                          ))
                      )}
                    </Flex>
                  </Center>
                </Box>
              </Box>
            </Center>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
