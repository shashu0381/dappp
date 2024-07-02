// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;
    string public networkAddress;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event NetworkAddressChanged(string oldAddress, string newAddress);

    constructor(uint initBalance, string memory initialAddress) payable {
        owner = payable(msg.sender);
        balance = initBalance;
        networkAddress = initialAddress;
    }

    function getBalance() public view returns (uint256) {
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

    function changeNetworkAddress(string memory newAddress) public {
        require(msg.sender == owner, "You are not the owner of this account");
        string memory oldAddress = networkAddress;
        networkAddress = newAddress;
        emit NetworkAddressChanged(oldAddress, newAddress);
    }

    function getNetworkAddress() public view returns (string memory) {
        return networkAddress;
    }

    function generateQRCode() public view returns (string memory) {
        // This function generates a URL for a QR code using Google's Chart API.
        // However, this URL must be processed on the client side to display the QR code.
        return string(abi.encodePacked("https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=", networkAddress));
    }
}

