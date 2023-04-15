function Transaction({txId, txInProgress, txStatus, txStatusCode}) {
    if (txInProgress && txStatusCode === 0) {
      return (
        
        <article >
          {txStatus < 0
          ?
          <div>
            <span className="txId">
              Transaction Status: <kbd>Initializing</kbd>
              <br />
              <small style={{"display": "flex"}}>Waiting for transaction approval.</small>
            </span>
           
            <progress style={{"display": "block"}} indeterminate="true">Initializing</progress>
          </div>
          : txStatus < 2
          ? 
          <div>
            <span>
              Transaction Status: 
              <span className="txId">
              </span>
              <kbd>Awaiting Finalization</kbd>
              <br />
              <a href={`https://testnet.flowscan.org/transaction/${txId}`} target="_blank">{txId?.slice(0,8)+ "..."+ txId?.slice(57,65)}</a>

              <small style={{"display": "flex"}}>The transaction is currently pending.</small>
            </span>
            <progress style={{"display": "block"}} indeterminate="true">Awaiting Finalization...</progress>
          </div>
          : txStatus === 2
          ? 
          <div>
            <span>
              Transaction Status: 
              <span className="txId">
              </span>
              <kbd>Awaiting Execution</kbd>
              <br />
              <a href={`https://testnet.flowscan.org/transaction/${txId}`} target="_blank">{txId?.slice(0,8)+ "..."+ txId?.slice(57,65)}</a>

              <small style={{"display": "flex"}}>The transaction is currently executing.</small>
            </span>
            <progress style={{"display": "block"}} min="0" max="100" value="60">Awaiting Execution</progress>
          </div>
          : txStatus === 3
          ?
          <div>
            <span>
              Transaction Status: 
              <span className="txId">
              </span>
              <kbd>Awaiting Sealing</kbd>
              <br />
              <a href={`https://testnet.flowscan.org/transaction/${txId}`} target="_blank">{txId?.slice(0,8)+ "..."+ txId?.slice(57,65)}</a>

              <small style={{"display": "flex"}}>The transaction is currently sealing.</small>
            </span>
            <progress style={{"display": "block"}} min="0" max="100" value="80">Sealing...</progress>
          </div>
          : txStatus === 4
          ? 
          <div>
            <span>
              Transaction Status:  
              <span className="txId">
              </span>
              <kbd>Completed</kbd>
              <br />
              <a href={`https://testnet.flowscan.org/transaction/${txId}`} target="_blank">{txId?.slice(0,8)+ "..."+ txId?.slice(57,65)}</a>
              <small style={{"display": "flex"}}>The Transaction is completed.</small>

              <progress style={{"display": "block"}} min="0" max="100" value="100">Sealing!</progress>
            </span>
            
          </div>
          : null}
        </article>
      )
    } else if (txStatusCode === 1) {
       return (
        <article style={{"color": "red"}}>Transaction Error - Please open console see the errorMessage <span className="txId">
        <a href={`https://testnet.flowscan.org/transaction/${txId}`} target="_blank">{txId?.slice(0,8)+ "..."+ txId?.slice(57,65)}</a>
      </span></article>
       )
    } else {
      return <></>
    }
  }
  
  export default Transaction;