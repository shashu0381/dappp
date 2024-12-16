import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [newAmount, setNewAmount] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isIncome, setIsIncome] = useState(true);

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
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

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
        <p>Your Balance: {balance}</p>
        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>
        <div>
          <h2>Financial Transactions</h2>
          <label>
            <input
              type="radio"
              name="transactionType"
              checked={isIncome}
              onChange={() => setIsIncome(true)}
            />
            Income
          </label>
          <label>
            <input
              type="radio"
              name="transactionType"
              checked={!isIncome}
              onChange={() => setIsIncome(false)}
            />
            Expense
          </label>
          <form onSubmit={addTransaction}>
            <input
              type="number"
              placeholder="Enter amount"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
            <button type="submit">Add Transaction</button>
          </form>
          <div className="transaction-tables">
            <div className="transaction-column">
              <h3>Incomes</h3>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Amount</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {incomes.map((income, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{income.amount}</td>
                      <td>{income.description}</td>
                      <td>
                        <button onClick={() => removeTransaction(index, false)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="transaction-column">
              <h3>Expenses</h3>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Amount</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{expense.amount}</td>
                      <td>{expense.description}</td>
                      <td>
                        <button onClick={() => removeTransaction(index, true)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const addTransaction = (e) => {
    e.preventDefault();
    const transaction = {
      amount: newAmount,
      description: newDescription,
    };

    if (isIncome) {
      setIncomes([...incomes, transaction]);
    } else {
      setExpenses([...expenses, transaction]);
    }

    setNewAmount("");
    setNewDescription("");
  };

  const removeTransaction = (index, isExpense) => {
    if (isExpense) {
      const updatedExpenses = [...expenses];
      updatedExpenses.splice(index, 1);
      setExpenses(updatedExpenses);
    } else {
      const updatedIncomes = [...incomes];
      updatedIncomes.splice(index, 1);
      setIncomes(updatedIncomes);
    }
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
          background: linear-gradient(135deg, #f3ec78, #af4261);
          padding: 20px;
          font-family: "Arial", sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        h1 {
          font-size: 3em;
          color: #fff;
          margin-bottom: 20px;
        }
        p {
          font-size: 1.5em;
          color: #fff;
        }
        button {
          background-color: #007bff;
          border: none;
          border-radius: 5px;
          padding: 15px 30px;
          font-size: 1.2em;
          color: white;
          margin: 10px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        button:hover {
          background-color: #0056b3;
        }
        form {
          margin-bottom: 20px;
        }
        input[type="number"], input[type="text"] {
          padding: 10px;
          margin-right: 10px;
          border-radius: 5px;
          border: 1px solid #ccc;
          font-size: 1.2em;
        }
        button[type="submit"] {
          padding: 10px 20px;
          font-size: 1.2em;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 5px;
        }
        .transaction-tables {
          display: flex;
          justify-content: space-around;
          width: 100%;
        }
        .transaction-column {
          width: 45%;
          background-color: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        }
        h3 {
          color: #333;
          margin-bottom: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 10px;
          border: 1px solid #ddd;
          text-align: left;
        }
        th {
          background-color: #007bff;
          color: white;
        }
        td {
          background-color: #f9f9f9;
        }
        button {
          margin-left: 10px;
        }
      `}</style>
    </main>
  );
}
