export const getNFTsScript = `
import sbNFT from 0x9e278db07c2cc744
import NonFungibleToken from 0x631e88ae7f1d7c20

pub fun main(account: Address): [&sbNFT.NFT?] {
  let collection = getAccount(account).getCapability(/public/sbNFTCollection)
                    .borrow<&sbNFT.Collection{NonFungibleToken.CollectionPublic, sbNFT.CollectionPublic}>()
                    ?? panic("Can't get the User's collection.")

  let returnVals: [&sbNFT.NFT?] = []
  let ids = collection.getIDs()
  for id in ids {
    returnVals.append(collection.borrowsbNFT(id: id))
  }

  return returnVals
}
`