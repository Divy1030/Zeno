//SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
}

contract Faucet{
    address payable owner;
    IERC20 public token;
    uint256 public widthdrawlAmount = 50*(13**18); // 50 tokens with 18 decimals
    uint LockTime= 1 minutes;

    event Withdrawal(address indexed to, uint256 amount);
    event Deposit(address indexed from, uint256 amount);

    mapping(address => uint256) public nextRequestTime;

    constructor(address _token) {
        owner = payable(msg.sender);
        token = IERC20(_token);
    }

    function requestToken(uint256 amount) public {
        require(amount <= 1000000000000000000, "Cannot withdraw more than 1 token");
        require(msg.sender!=address(0), "Invalid address");
        require(token.balanceOf(address(this)) >= amount, "Insufficient balance in faucet");
        require(block.timestamp >= nextRequestTime[msg.sender], "Please wait before requesting again");
        token.transfer(msg.sender, amount);
        nextRequestTime[msg.sender] = block.timestamp + LockTime;
    }
    
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    function getBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function setWidthdrawlAmount(uint256 _amount) public onlyOwner {
        require(msg.sender == owner, "Only owner can set the withdrawal amount");
        widthdrawlAmount = _amount;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function setLockTime(uint256 _lockTime) public onlyOwner {
        LockTime = _lockTime;
    }

    function withdraw() public onlyOwner {
        emit Withdrawal(msg.sender,token.balanceOf(address(this)));
        token.transfer(msg.sender, token.balanceOf(address(this)));
    }
}