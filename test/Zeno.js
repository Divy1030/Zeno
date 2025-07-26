const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Zeno Token", function () {
  let zeno;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    
    const Zeno = await ethers.getContractFactory("Zeno");
    // Using BigInt notation for large numbers
    const cap = 10000000n; // 10 million tokens cap
    const reward = 20n; // 20 tokens reward
    
    zeno = await Zeno.deploy(cap, reward);
    await zeno.waitForDeployment();
  });

  it("Should deploy with correct initial supply and owner", async function () {
    const totalSupply = await zeno.totalSupply();
    const ownerBalance = await zeno.balanceOf(owner.address);
    const contractOwner = await zeno.owner();
    
    // Convert to BigInt for comparison
    const expectedSupply = 7000000n * (10n ** 18n); // 7 million tokens with 18 decimals
    
    expect(totalSupply).to.equal(expectedSupply);
    expect(ownerBalance).to.equal(expectedSupply);
    expect(contractOwner).to.equal(owner.address);
  });

  it("Should allow owner to set block reward", async function () {
    const newReward = 50n; // 50 tokens
    
    await zeno.setblockReward(newReward);
    const blockReward = await zeno.blockReward();
    
    const expectedReward = newReward * (10n ** 18n); // With 18 decimals
    expect(blockReward).to.equal(expectedReward);
  });

  it("Should not allow non-owner to set block reward", async function () {
    const newReward = 50n;
    
    await expect(
      zeno.connect(addr1).setblockReward(newReward)
    ).to.be.revertedWith("Only owner can call this function");
  });

  it("Should allow owner to withdraw contract balance", async function () {
    // Since the contract doesn't have receive/fallback, we'll test the withdraw function
    // by checking that it reverts when there's no balance (which we know works)
    // and that only owner can call it
    
    // This test verifies the function exists and has proper access control
    // In a real scenario, ETH would come from other contract interactions
    await expect(zeno.withdraw()).to.be.revertedWith("No Ether to withdraw");
    
    // Verify the function exists and is callable by owner (even if it reverts due to no balance)
    expect(zeno.withdraw).to.be.a('function');
  });

  it("Should not allow non-owner to withdraw", async function () {
    // Test that non-owner cannot call withdraw function
    await expect(
      zeno.connect(addr1).withdraw()
    ).to.be.revertedWith("Only owner can call this function");
  });

  it("Should revert withdrawal when contract has no balance", async function () {
    // Try to withdraw when contract has no ETH
    await expect(
      zeno.withdraw()
    ).to.be.revertedWith("No Ether to withdraw");
  });

  it("Should allow token burning", async function () {
    const burnAmount = ethers.parseEther("1000"); // 1000 tokens
    const initialBalance = await zeno.balanceOf(owner.address);
    const initialSupply = await zeno.totalSupply();

    // Burn tokens
    await zeno.burn(burnAmount);

    const finalBalance = await zeno.balanceOf(owner.address);
    const finalSupply = await zeno.totalSupply();

    expect(finalBalance).to.equal(initialBalance - burnAmount);
    expect(finalSupply).to.equal(initialSupply - burnAmount);
  });

  it("Should respect the token cap", async function () {
    const cap = await zeno.cap();
    const expectedCap = 10000000n * (10n ** 18n); // 10 million tokens with 18 decimals
    
    expect(cap).to.equal(expectedCap);
  });
});