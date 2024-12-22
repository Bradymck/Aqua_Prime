const hre = require("hardhat");

async function main() {
  const tokenAddress = "0xB52C9825eE572d03FFA390aDD32B3B93F7cB3802";
  const [deployer] = await hre.ethers.getSigners();

  console.log("Minting tokens with account:", deployer.address);

  const MoonstoneToken = await hre.ethers.getContractAt("MoonstoneToken", tokenAddress);

  // Mint 1000 tokens (with 18 decimals)
  const amount = hre.ethers.parseEther("1000");
  const tx = await MoonstoneToken.mint(deployer.address, amount);
  await tx.wait();

  console.log("Minted 1000 MOON tokens to:", deployer.address);

  const balance = await MoonstoneToken.balanceOf(deployer.address);
  console.log("New balance:", hre.ethers.formatEther(balance), "MOON");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });