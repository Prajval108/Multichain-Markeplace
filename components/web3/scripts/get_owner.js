export const getCreatorScript = `
import sbNFT from 0x9e278db07c2cc744
import NonFungibleToken from 0x631e88ae7f1d7c20

pub fun main(id: UInt64, account: Address): AnyStruct {
    let collection = getAccount(account).getCapability(/public/sbNFTCollection)
                      .borrow<&sbNFT.Collection{NonFungibleToken.CollectionPublic, sbNFT.CollectionPublic}>()
                      ?? panic("Can't get the User's collection.")

    let datas = collection.borrowsbNFT(id: id)

    return datas
  }
`