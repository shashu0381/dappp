import { useState, useEffect } from "react";
import { ethers } from "ethers";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [accounts, setAccounts] = useState([]);
  const [action, setAction] = useState(null); // 'deposit' or 'withdraw'
  const [amount, setAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts && accounts.length > 0) {
      console.log("Accounts connected: ", accounts);
      setAccount(accounts[0]);
      setAccounts(accounts);
    } else {
      console.log("No accounts found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }

    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
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
      const balanceBN = await atm.getBalance();
      setBalance(ethers.utils.formatEther(balanceBN)); // Convert BigNumber to Ether string
    }
  };

  const deposit = async () => {
    if (atm && selectedAccount) {
      let tx = await atm.deposit(ethers.utils.parseEther(amount));
      await tx.wait();
      getBalance();
      resetAction();
    }
  };

  const withdraw = async () => {
    if (atm && selectedAccount) {
      let tx = await atm.withdraw(ethers.utils.parseEther(amount));
      await tx.wait();
      getBalance();
      resetAction();
    }
  };

  const resetAction = () => {
    setAction(null);
    setAmount("");
    setSelectedAccount("");
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button className="btn btn-primary" onClick={connectAccount}>Please connect your Metamask wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div className="card text-center">
        <div className="card-header">
          Your Account Information
        </div>
        <div className="card-body">
          <p className="card-text">Account: {account}</p>
          <p className="card-text">Balance: {balance} ETH</p>
          <button className="btn btn-success m-2" onClick={() => setAction('deposit')} disabled={action !== null}>Deposit</button>
          <button className="btn btn-warning m-2" onClick={() => setAction('withdraw')} disabled={action !== null}>Withdraw</button>
          {action && (
            <div>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Enter amount (in ETH)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <select
                className="form-select mb-2"
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
              >
                <option value="">Select Account</option>
                {accounts.map((acc) => (
                  <option key={acc} value={acc}>{acc}</option>
                ))}
              </select>
              <button className={`btn ${action === 'deposit' ? 'btn-success' : 'btn-warning'}`} onClick={action === 'deposit' ? deposit : withdraw}>
                {action === 'deposit' ? 'Send' : 'Withdraw'}
              </button>
              <button className="btn btn-secondary ml-2" onClick={resetAction}>Cancel</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container mt-5">
      <header className="mb-4">
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          max-width: 600px;
          margin: auto;
          text-align: center;
        }
        .card {
          margin-top: 20px;
        }
      `}</style>
    </main>
  );
}
