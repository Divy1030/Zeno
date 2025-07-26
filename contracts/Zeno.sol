// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract Zeno is ERC20, ERC20Capped, ERC20Burnable {
    address payable public owner;
    uint8 private constant DECIMALS = 18;
    uint256 public blockReward;

    constructor(uint256 cap, uint256 reward) ERC20("Zeno", "ZNO") ERC20Capped(cap * (10 ** DECIMALS)) {
        owner = payable(msg.sender);
        _mint(msg.sender, 7000000 * (10 ** DECIMALS));
        blockReward = reward * (10 ** DECIMALS);
    }

    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Capped) {
        super._update(from, to, value);
    }

    function mintminereward() internal {
        _mint(block.coinbase, blockReward);
    }

  // Withdraw contract's Ether balance to the owner
  function withdraw() public onlyOwner {
    uint256 balance = address(this).balance;
    require(balance > 0, "No Ether to withdraw");
    (bool success, ) = owner.call{value: balance}("");
    require(success, "Transfer failed");
}
 
    function setblockReward(uint256 reward) public onlyOwner {
        blockReward = reward * (10 ** DECIMALS);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
}