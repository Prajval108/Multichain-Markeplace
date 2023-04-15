export const bulkListingTx = `
import NFTMarketplace from 0xc540e5e9a1fea4ff

transaction(price: UFix64) {

  prepare(acct: AuthAccount) {


    let saleCollection = acct.borrow<&NFTMarketplace.SaleCollection>(from: /storage/T3MySaleCollection)
                            ?? panic("This SaleCollection does not exist")

    let array = [13,5,15]
    for i in array {
    saleCollection.listForSale(id: UInt64(i), price: price)
  }}

  execute {
    log("A user listed an NFT for Sale")
  }
}
`