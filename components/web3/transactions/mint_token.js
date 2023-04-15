export const mintTokenTx = `

import Rumble from 0x342967d90036e986
import FungibleToken from 0x9a0766d93b6608b7

transaction (amount: UFix64) {

  prepare(acct: AuthAccount) {
    let minter = acct.borrow<&Rumble.Minter>(from: /storage/RumbleAdmin)
                  ?? panic ("Could not borrow the Minter Resources")
    let newvault <- minter.mintTokens(amount: amount)
    let RecipientVault = getAccount(0x342967d90036e986).getCapability(/public/RumblePublic)
                          .borrow<&Rumble.Vault{FungibleToken.Receiver}>()
                          ?? panic("Could not get Recipient Vault reference")
    RecipientVault.deposit(from: <- newvault)
  }
  execute {
    log("Token Minted Successfully")    
  }
}
`
