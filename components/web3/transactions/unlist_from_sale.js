export const unlistFromSaleTx = `
import sbMarketplace from 0x9e278db07c2cc744

transaction(id: UInt64) {

  prepare(acct: AuthAccount) {
    let saleCollection = acct.borrow<&sbMarketplace.SaleCollection>(from: /storage/sbNFTSaleCollection)
                            ?? panic("This SaleCollection does not exist")

    saleCollection.unlistFromSale(id: id)
  }

  execute {
    log("A user unlisted an NFT for Sale")
  }
}

`