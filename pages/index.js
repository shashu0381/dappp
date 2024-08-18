import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [questionNumber, setQuestionNumber] = useState('');
  const [score, setScore] = useState(0);
  const [quiz, setQuiz] = useState([
    {
      question: "How many years is a typical mortgage?",
      answer: "30",
      points: 1
    },
    {
      question: "What is the minimum credit score to get a good mortgage rate?",
      answer: "700",
      points: 1
    },
    {
      question: "What is the average annual return of the S&P 500?",
      answer: "10",
      points: 1
    },
    {
      question: "How many years does it take for a bond to mature?",
      answer: "10",
      points: 1
    },
    {
      question: "What is the typical down payment percentage for a house?",
      answer: "20",
      points: 1
    }
  ]);

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
  }

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

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
  }

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const deposit = async (amount) => {
    if (atm) {
      if (amount < 25) {
        alert("Minimum deposit amount is 25 ETH.");
        return;
      }
      let tx = await atm.deposit(amount);
      await tx.wait()
      getBalance();
    }
  }

  const withdraw = async (amount) => {
    if (atm) {
      if (amount < 20) {
        alert("Minimum withdrawal amount is 20 ETH.");
        return;
      }
      let tx = await atm.withdraw(amount);
      await tx.wait()
      getBalance();
    }
  }

  const handleQuestionSelection = (event) => {
    const selectedQuestion = event.target.value;
    setSelectedQuestion(selectedQuestion);
  }

  const handleAnswerSubmission = () => {
    const selectedQuiz = quiz.find(q => q.question === selectedQuestion);
    if (selectedQuiz && selectedQuiz.answer === userAnswer) {
      setScore(score + selectedQuiz.points);
    } else {
      alert("Incorrect answer.");
    }
    setUserAnswer('');
  }

  const handleRemoveQuestion = () => {
    const questionIndex = parseInt(questionNumber) - 1;
    if (!isNaN(questionIndex) && questionIndex >= 0 && questionIndex < quiz.length) {
      const updatedQuiz = [...quiz];
      updatedQuiz.splice(questionIndex, 1);
      setQuiz(updatedQuiz);
    } else {
      alert("Please enter a valid question number to remove the quiz question.");
    }
  }

  useEffect(() => { getWallet(); }, []);

  return (
    <main className="container">
      <header><h1>Welcome to the Metacrafters ATM!</h1></header>
      <div className="atm-container">
        <div className="atm">
          <div>
            {ethWallet ? (
              <div>
                <p>Your Account: {account}</p>
                <p>Your Balance: {balance}</p>
                <button onClick={() => deposit(prompt("Enter deposit amount:"))}>Deposit</button>
                <button onClick={() => withdraw(prompt("Enter withdrawal amount:"))}>Withdraw</button>
              </div>
            ) : (
              <p>Please install Metamask in order to use this ATM.</p>
            )}
            {!account && (
              <button onClick={connectAccount}>Please connect your Metamask wallet</button>
            )}
          </div>
        </div>
        <div className="quiz">
          <h2>Finance Quiz</h2>
          <div>
            <select onChange={handleQuestionSelection}>
              <option value="">Select a Question</option>
              {quiz.map((q, index) => (
                <option key={index} value={q.question}>{q.question}</option>
              ))}
            </select>
          </div>
          {selectedQuestion && (
            <div>
              <p>Question: {selectedQuestion}</p>
              <input
                type="text"
                placeholder="Enter your answer"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
              />
              <button onClick={handleAnswerSubmission}>Submit Answer</button>
            </div>
          )}
          <div>
            <input
              type="number"
              placeholder="Enter question number to remove"
              value={questionNumber}
              onChange={(e) => setQuestionNumber(e.target.value)}
            />
            <button onClick={handleRemoveQuestion}>Remove Question</button>
          </div>
          <p>Score: {score} / 5</p>
        </div>
      </div>
      <style jsx>{`
        .container {
          text-align: center;
          font-family: Arial, sans-serif;
          color: #333;
          background-color: green;
          padding: 20px;
          border-radius: 10px;
        }
        header h1 {
          color: #fff;
        }
        .atm-container {
          display: flex;
          justify-content: space-between;
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 10px;
          margin-top: 20px;
        }
        .atm, .quiz {
          flex: 1;
          padding: 20px;
          border-radius: 10px;
          background-color: #fff;
          margin: 0 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .atm p, .quiz p {
          font-size: 1.2em;
          color: #555;
        }
        .quiz h2 {
          background-color: #007bff;
          color: #fff;
          padding: 10px;
          border-radius: 5px;
          font-size: 1.5em;
        }
        .quiz select, .quiz input {
          font-size: 1.2em;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #ccc;
          border-radius: 5px;
          width: 100%;
        }
        .quiz button {
          background-color: #007bff;
          color: #fff;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1.2em;
        }
        .quiz button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </main>
  )
}
