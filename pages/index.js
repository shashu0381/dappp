import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

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
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
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

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p className="info-text">Please install Metamask to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
        <button className="btn" onClick={connectAccount}>
          Connect Metamask Wallet
        </button>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div className="account-info">
        <div className="account-balance">
          <p>Your Account: {account}</p>
          <p>Your Balance: {balance} ETH</p>
        </div>
        <div className="btn-group">
          <button className="btn" onClick={deposit}>
            Deposit 1 ETH
          </button>
          <button className="btn" onClick={withdraw}>
            Withdraw 1 ETH
          </button>
        </div>
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
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #1f1c2c 0%, #928dab 100%);
          color: #fff;
          font-family: 'Roboto', sans-serif;
          padding: 20px;
          text-align: center;
        }
        header {
          margin-bottom: 40px;
        }
        header h1 {
          font-size: 2.5rem;
          margin: 0;
        }
        .info-text {
          font-size: 1.2rem;
        }
        .account-info {
          background: rgba(255, 255, 255, 0.1);
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .account-balance {
          background: rgba(255, 255, 255, 0.2);
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 20px;
          width: 100%;
          box-sizing: border-box;
          text-align: center;
          transition: background 0.3s;
        }
        .account-balance:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        .account-balance p {
          margin: 10px 0;
        }
        .btn-group {
          display: flex;
          gap: 20px;
          justify-content: center;
        }
        .btn {
          background: #00c6ff;
          background: linear-gradient(135deg, #0072ff 0%, #00c6ff 100%);
          border: none;
          color: #fff;
          padding: 10px 20px;
          border-radius: 25px;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.3s;
          font-weight: bold;
        }
        .btn:hover {
          transform: scale(1.05);
          background: #0056b3;
        }
        .btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </main>
  );
}
