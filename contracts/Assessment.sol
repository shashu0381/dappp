// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;

    struct Question {
        string question;
        uint256 answer; // The answer will be a number
        uint256 points; // Points awarded for the correct answer
    }

    Question[] public quiz;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event QuestionRemoved(uint256 index);
    event ScoreCalculated(uint256 score);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;

        // Initialize with some questions
        quiz.push(Question("How many years is a typical mortgage?", 30, 1));
        quiz.push(Question("What is the minimum credit score to get a good mortgage rate?", 700, 1));
        quiz.push(Question("What is the average annual return of the S&P 500?", 10, 1));
        quiz.push(Question("How many years does it take for a bond to mature?", 10, 1));
        quiz.push(Question("What is the typical down payment percentage for a house?", 20, 1));
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

    function calculateScore(uint256[] memory answers) public view returns (uint256) {
        require(answers.length == quiz.length, "Number of answers must match number of questions");
        uint256 score = 0;

        for (uint256 i = 0; i < quiz.length; i++) {
            if (answers[i] == quiz[i].answer) {
                score += quiz[i].points;
            }
        }

        return score;
    }

    function removeQuestion(uint256 index) public {
        require(msg.sender == owner, "You are not the owner of this account");
        require(index < quiz.length, "Invalid question index");

        // Remove the question by shifting all subsequent questions left
        for (uint256 i = index; i < quiz.length - 1; i++) {
            quiz[i] = quiz[i + 1];
        }
        quiz.pop();

        emit QuestionRemoved(index);
    }
}
