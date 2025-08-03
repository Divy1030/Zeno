const hre = require("hardhat");


async function main() {
    const Faucet = await hre.ethers.getContractFactory("Faucet");
    const faucet = await Faucet.deploy("0xc49dad66F2c38e7Bf0A267Fc1e1a26132c7eC372"); // Initial supply of 10^16 tokens (assuming 18 decimals)
    
    await faucet.waitForDeployment();
    
    console.log("Faucet deployed to:", faucet.target); // Use .target for ethers v6
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});