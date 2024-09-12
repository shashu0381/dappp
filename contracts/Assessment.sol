// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;

    struct Transaction {
        uint256 amount;
        string description;
    }

    Transaction[] public incomes;
    Transaction[] public expenses;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event IncomeAdded(uint256 amount, string description);
    event ExpenseAdded(uint256 amount, string description);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        require(msg.sender == owner, "You are not the owner of this account");

        balance += _amount;

        assert(balance == _previousBalance + _amount);

        emit Deposit(_amount);
    }

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

        balance -= _withdrawAmount;

        assert(balance == (_previousBalance - _withdrawAmount));

        emit Withdraw(_withdrawAmount);
    }

    // Add income to the smart contract
    function addIncome(uint256 _amount, string memory _description) public {
        require(msg.sender == owner, "You are not the owner of this account");
        
        incomes.push(Transaction(_amount, _description));
        
        emit IncomeAdded(_amount, _description);
    }

    // Add expense to the smart contract
    function addExpense(uint256 _amount, string memory _description) public {
        require(msg.sender == owner, "You are not the owner of this account");
        
        expenses.push(Transaction(_amount, _description));

        emit ExpenseAdded(_amount, _description);
    }

    // Get all incomes
    function getIncomes() public view returns (Transaction[] memory) {
        return incomes;
    }

    // Get all expenses
    function getExpenses() public view returns (Transaction[] memory) {
        return expenses;
    }
}
