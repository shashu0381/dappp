
# Metacrafters ATM DApp

This project is a decentralized application (DApp) that interacts with an Ethereum smart contract to simulate an ATM. It allows users to connect their MetaMask wallet, view their balance, deposit and withdraw Ether, and track their income and expenses.

## Features

- **Wallet Integration**: Connect your MetaMask wallet to interact with the DApp.
- **View Balance**: Check your Ethereum balance through the smart contract.
- **Deposit & Withdraw**: Deposit or withdraw Ether (1 ETH at a time).
- **Track Financial Transactions**: Log and display income and expenses with descriptions.
- **Transaction Management**: Add and remove income/expense entries.

## Technology Stack

- **Frontend**: React.js
- **Ethereum Interaction**: Ethers.js
- **Smart Contract**: Solidity
- **Ethereum Network**: Local Ethereum environment or any testnet
- **Wallet Integration**: MetaMask

## Prerequisites

- Node.js
- MetaMask installed on your browser
- Ethereum node provider (e.g., Ganache, Hardhat, or a testnet like Rinkeby)

## Usage

1. Open the DApp in your browser.
2. Connect your MetaMask wallet.
3. Once connected, you can:
   - View your account balance.
   - Deposit and withdraw 1 ETH.
   - Add income or expense transactions.
   - Remove existing transactions.

## Code Structure

- **HomePage.js**: Contains the main logic for interacting with the Ethereum smart contract, handling wallet connection, and managing financial transactions.
- **Smart Contract (Assessment.sol)**: The Solidity smart contract that handles deposits, withdrawals, and balance tracking.

## MetaMask Integration

To use the DApp, ensure MetaMask is installed in your browser. MetaMask will automatically prompt users to connect their wallet.

## Styles

The application uses inline styles within the JSX to create a clean and responsive user interface. The main style components include a gradient background, styled buttons, and tables for transaction records.

## License

This project is open-source under the [MIT License](LICENSE).

