import { Button } from "react-bootstrap";
import * as fcl from "@onflow/fcl";
import { useState } from "react";

export function WalletButton(props: any) {
  return (
    <>
      {props.Token ? (
        <div
          style={{
            position: "absolute",
            right: "5px",
            top: "10px",
            color: "white",
          }}
        >
          {props?.userAcc ? (
            <Button
              id="site-header"
              variant="outline-light"
              style={{ borderRadius: "20px" }}
              disabled
            >
              <span>
                {props?.userAcc?.slice(0, 7) +
                  "..." +
                  props?.userAcc?.slice(33, 42)}
              </span>
            </Button>
          ) : (
            <Button
              variant="success"
              onClick={props?.wallet}
              className=""
              id="site-header"
              style={{ borderRadius: "20px" }}
            >
              <span>Wallet connect</span>
            </Button>
          )}
        </div>
      ) : null}
    </>
  );
}

export function FlowWalletButton(props: any) {
  return (
    <>
      {props.Token ? (
        <div
          style={{
            position: "absolute",
            right: "5px",
            top: "10px",
            color: "white",
          }}
        >
          {props?.userAcc ? (
            <Button
              id="site-header"
              variant="outline-light"
              style={{ borderRadius: "20px" }}
              onClick={() => props?.disconnectWallet()}
            >
              <span>{props?.userAcc}</span>
            </Button>
          ) : (
            <Button
              variant="success"
              onClick={props?.wallet}
              className=""
              id="site-header"
              style={{ borderRadius: "20px" }}
            >
              <span>Wallet connect</span>
            </Button>
          )}
        </div>
      ) : null}
    </>
  );
}

export function NoButton(props: any) {
  return (
    <>
      {props.Token ? (
        <div className="" id="site-header">
          <Button variant="outline-danger" className="" id="site-header">
            <span>No Wallet To Connect </span>
          </Button>
        </div>
      ) : null}
    </>
  );
}
