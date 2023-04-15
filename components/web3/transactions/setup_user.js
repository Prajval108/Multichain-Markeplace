export const setupUserTx = `
import NonFungibleToken from 0x631e88ae7f1d7c20
import sbNFT from 0x9e278db07c2cc744
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868
import sbMarketplace from 0x9e278db07c2cc744

transaction {

  prepare(acct: AuthAccount) {
    acct.save(<- sbNFT.createEmptyCollection(), to: /storage/sbNFTCollection)
    acct.link<&sbNFT.Collection{sbNFT.CollectionPublic, NonFungibleToken.CollectionPublic}>(/public/sbNFTCollection, target: /storage/sbNFTCollection)
    acct.link<&sbNFT.Collection>(/private/sbNFTCollection, target: /storage/sbNFTCollection)
    
    let sbNFTCollection = acct.getCapability<&sbNFT.Collection>(/private/sbNFTCollection)
    let FlowTokenVault = acct.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)
    
    acct.save(<- sbMarketplace.createSaleCollection(sbNFTCollection: sbNFTCollection, FlowVault: FlowTokenVault), to: /storage/sbNFTSaleCollection)
    acct.link<&sbMarketplace.SaleCollection{sbMarketplace.SaleCollectionPublic}>(/public/sbNFTSaleCollection, target: /storage/sbNFTSaleCollection)
  }

  execute {
    log("A user stored a Collection and a SaleCollection inside their account")
  }
}

`