export const transferTx = `
import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7

transaction (Recipient: Address, amount: UFix64) {

  prepare(acct: AuthAccount) {
    let sender = acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
                  ?? panic ("Could not borrow reference to the owner's Vault!")

    let RecipientVault = getAccount(Recipient).getCapability(/public/flowTokenReceiver)
                          .borrow<&FlowToken.Vault{FungibleToken.Receiver}>()
                          ?? panic("Could not get Recipient Vault reference")

    RecipientVault.deposit(from: <- sender.withdraw(amount: amount))
  }

  execute {
    log("Token Transfer Successfully")    
  }
}
`
