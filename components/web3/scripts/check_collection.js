export const checkCollectionTx = `
import sbNFT from 0x9e278db07c2cc744
import NonFungibleToken from 0x631e88ae7f1d7c20

pub fun main(account: Address): Bool {

    let CollectionCheck = getAccount(account).getCapability<&sbNFT.Collection{NonFungibleToken.CollectionPublic}>(/public/sbNFTCollection).check()
    return CollectionCheck
}
`
