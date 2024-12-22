const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying Moonstone token with account:", deployer.address);

  const MoonstoneToken = await hre.ethers.getContractFactory("MoonstoneToken");
  const moonstone = await MoonstoneToken.deploy(deployer.address);
  await moonstone.waitForDeployment();

  const address = await moonstone.getAddress();
  console.log("MoonstoneToken deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
