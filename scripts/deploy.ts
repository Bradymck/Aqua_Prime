import { ethers } from "hardhat";

async function main() {
  // Deploy Moonstone Token
  const MoonstoneToken = await ethers.getContractFactory("MoonstoneToken");
  const moonstone = await MoonstoneToken.deploy();
  await moonstone.waitForDeployment();
  console.log("MoonstoneToken deployed to:", await moonstone.getAddress());

  // Deploy Platypus Profile
  const PlatypusProfile = await ethers.getContractFactory("PlatypusProfile");
  const platypusProfile = await PlatypusProfile.deploy(await moonstone.getAddress());
  await platypusProfile.waitForDeployment();
  console.log("PlatypusProfile deployed to:", await platypusProfile.getAddress());

  // For testing: Mint some Moonstones to the deployer
  const [deployer] = await ethers.getSigners();
  const mintAmount = ethers.parseEther("100"); // 100 Moonstones
  await moonstone.mint(deployer.address, mintAmount);
  console.log("Minted", ethers.formatEther(mintAmount), "Moonstones to", deployer.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});