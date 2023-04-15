export const listForSaleTx = `
import sbMarketplace from 0x9e278db07c2cc744

transaction(id: UInt64, price: UFix64) {

  prepare(acct: AuthAccount) {
    let saleCollection = acct.borrow<&sbMarketplace.SaleCollection>(from: /storage/sbNFTSaleCollection)
                            ?? panic("This SaleCollection does not exist")
    saleCollection.listForSale(id: UInt64(id), price: price)
  }

  execute {
    log("A user listed an NFT for Sale")
  }
}
`