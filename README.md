# Metacrafters ATM DApp

A simple decentralized application (DApp) for interacting with an Ethereum smart contract that allows users to deposit and withdraw Ether. The DApp uses React for the frontend and ethers.js for Ethereum blockchain interactions. It also leverages Bootstrap for styling.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Smart Contract](#smart-contract)
- [License](#license)

## Introduction

This project demonstrates a decentralized ATM application using Ethereum smart contracts. Users can connect their MetaMask wallet, view their balance, deposit Ether, and withdraw Ether.

## Features

- Connect to MetaMask wallet
- View account balance
- Deposit Ether into the contract
- Withdraw Ether from the contract
- Dynamic UI with Bootstrap

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed
- MetaMask extension installed on your browser
- An Ethereum development environment (like Hardhat or Truffle)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/metacrafters-atm-dapp.git
    cd metacrafters-atm-dapp
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Configure the Ethereum smart contract:

    - Ensure you have a local Ethereum network running (using Hardhat or Ganache).
    - Deploy your smart contract and update the contract address in the React code.

4. Update the contract ABI and address in the React project:

    - Replace the ABI file at `artifacts/contracts/Assessment.sol/Assessment.json`.
    - Update the contract address in `pages/index.js`.

## Usage
1. Inside the project directory, in the terminal type:
    ```bash
    npm i
    ```

2. Open two additional terminals in your VS code

3. In the second terminal type:
   ```bash
   npm run hardhat node
   ```

4. In the third terminal, type:
   ```bash
   npx hardhat run --network localhost scripts/deploy.js
   ```

5. Back in the first terminal, type ```
                 run dev```
            to launch the front-end.

6. Interact with the DApp:
    - View your account balance
    - Deposit Ether by entering the amount and selecting an account
    - Withdraw Ether by entering the amount and selecting an account

## Smart Contract

Here is the Solidity code for the smart contract used in this project:

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // emit the event
        emit Withdraw(_withdrawAmount);
    }
}

