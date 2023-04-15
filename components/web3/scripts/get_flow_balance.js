export const getTokenBalance = `
import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7

pub fun main(account: Address): UFix64 {
    let RecipientVault = getAccount(account).getCapability(/public/flowTokenBalance)
                            .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
                            ?? panic("Could not get Recipient Vault reference")
    return RecipientVault.balance
}
`