import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import QRCode from "qrcode.react";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [network, setNetwork] = useState("ethereum");
  const [address, setAddress] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const ethAddress = "Your Ethereum Address";
  const solanaAddress = "42drw25242dgbrvsde478fh3b3y9565bfv972fv27fv";
  const bitcoinAddress = "08d5j857bd63gvbbwudnj9ni9203gjf347";
  const baseAddress = "fb4g7964gfv82vf7v23f827fv6829of8921ff8b1o2";

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account && account.length > 0) {
      console.log("Account connected: ", account);
      setAccount(account[0]);
      if (network === "ethereum") {
        setAddress(account[0]);
      }
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait();
      getBalance();
    }
  };

  const handleNetworkChange = (event) => {
    setNetwork(event.target.value);
    switch (event.target.value) {
      case "ethereum":
        setAddress(account || ethAddress);
        break;
      case "solana":
        setAddress(solanaAddress);
        break;
      case "bitcoin":
        setAddress(bitcoinAddress);
        break;
      case "base":
        setAddress(baseAddress);
        break;
      default:
        setAddress("");
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
        <button onClick={connectAccount}>Please connect your Metamask wallet</button>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <label>
          Select Network:
          <select value={network} onChange={handleNetworkChange}>
            <option value="ethereum">Ethereum</option>
            <option value="solana">Solana</option>
            <option value="bitcoin">Bitcoin</option>
            <option value="base">Base</option>
          </select>
        </label>
        <p>Selected Address: {address}</p>
        <QRCode value={address} />
        <p>Your Balance: {balance}</p>
        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}
