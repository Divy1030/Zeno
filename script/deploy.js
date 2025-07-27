const hre = require("hardhat");


async function main() {
    const ZenoToken = await hre.ethers.getContractFactory("Zeno");
    const Zeno = await ZenoToken.deploy(10000000000000, 50); // Initial supply of 10^16 tokens (assuming 18 decimals)
    
    await Zeno.waitForDeployment();
    
    console.log("Zeno deployed to:", Zeno.target); // Use .target for ethers v6
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});