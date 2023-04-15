export const accountInfoTx = `

import MyToken from 0xd24d0ba563378253
import FungibleToken from 0x9a0766d93b6608b7

pub fun main(account: Address, keyIndex: Int):AnyStruct {

    let accountKey = getAccount(account).keys.get(keyIndex: 0) ?? panic("This keyIndex does not exist in this account")
  
    return accountKey
}
`