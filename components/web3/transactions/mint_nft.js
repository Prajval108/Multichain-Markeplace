export const mintNFT = `
import sbNFT from 0x9e278db07c2cc744

transaction(uri: String, counter: UInt64) {
prepare(acct: AuthAccount) {

  let collection = acct.borrow<&sbNFT.Collection>(from: /storage/sbNFTCollection)
                      ?? panic("This collection does not exist here")

  var a = counter
    while a > 0 {
        a = a - 1
        let nft <- sbNFT.mintNFT(uri: uri)
        collection.deposit(token: <- nft)
    }}

execute {
  log("Your NFT is successully Minted")
}
}
`
 