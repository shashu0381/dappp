# Metacrafters ATM and Finance Quiz DApp

This decentralized application (DApp) allows users to interact with a simple ATM contract on the Ethereum blockchain using MetaMask and participate in a finance-themed quiz. The project is built using React and ethers.js, with the smart contract written in Solidity.

## Features

- **MetaMask Integration**: Connect your MetaMask wallet to interact with the Ethereum blockchain.
- **ATM Contract**: Deposit and withdraw ETH using a deployed smart contract.
- **Finance Quiz**: Test your financial knowledge with a simple quiz. Submit answers and track your score.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 12 or higher)
- [MetaMask](https://metamask.io/) extension installed in your browser
- [Ethereum Test Network](https://ethereum.org/en/developers/docs/networks/) (e.g., Rinkeby, Ropsten) for testing


3. **Set up environment variables** (if necessary):
   - Create a `.env` file at the root of your project.
   - Add any necessary environment variables such as your Ethereum network or API keys.

4. **Deploy the Smart Contract**:
   - Compile and deploy the `Assessment.sol` smart contract using your preferred method (e.g., Hardhat, Remix).
   - Update the `contractAddress` variable in the `HomePage` component with your deployed contract address.

5. **Run the DApp**:
   ```bash
   npm run dev
   ```
   - Open [http://localhost:3000](http://localhost:3000) in your browser.

### Usage

- **Connect MetaMask**: Click the "Please connect your Metamask wallet" button to connect your MetaMask wallet.
- **Deposit/Withdraw ETH**: After connecting your wallet, use the deposit or withdraw buttons to interact with the ATM contract.
- **Participate in the Quiz**: Select a question from the dropdown, enter your answer, and submit it to earn points. You can also remove quiz questions by entering their number.

### Code Structure

- **`/pages/index.js`**: Main entry point for the application. Contains the `HomePage` component, which integrates the MetaMask wallet, interacts with the ATM smart contract, and manages the quiz functionality.
- **`/artifacts/contracts/Assessment.sol/Assessment.json`**: ABI file for the deployed ATM contract.
- **`/components/HomePage.js`**: React component containing the core logic for the MetaMask connection, ATM interaction, and quiz management.

### Smart Contract

- **`Assessment.sol`**: Simple Solidity smart contract for handling deposits and withdrawals of ETH.

### Customization

- **Quiz Questions**: You can customize the quiz questions and answers in the `HomePage` component by modifying the `quiz` state array.
- **Styling**: Custom styling is added through JSX styles within the `HomePage` component. Modify these styles to customize the appearance of the DApp.


2. Deploy the build directory to your preferred hosting service.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

-
