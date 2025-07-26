// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Zeno is ERC20 {
    constructor(uint256 intialSupply) ERC20("Zeno", "ZNO") {
        _mint(msg.sender, intialSupply);
    }
}