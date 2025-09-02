const fs = require("fs");

const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying ReMi contracts...");

  // Get the network name
  const networkName = hre.network.name;
  console.log(`\n📦 Deploying to ${networkName}...`);

  try {
    // Get the signer
    const signers = await hre.ethers.getSigners();
    console.log(`Found ${signers.length} signers`);
    
    if (signers.length === 0) {
      throw new Error("No signers found. Check your PRIVATE_KEY configuration.");
    }
    
    const deployer = signers[0];
    console.log(`Deploying with account: ${deployer.address}`);
    
    // Check balance
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log(`Account balance: ${hre.ethers.formatEther(balance)} ETH`);
    
    // Get current gas price
    const gasPrice = await hre.ethers.provider.getFeeData();
    console.log(`Current gas price: ${hre.ethers.formatUnits(gasPrice.gasPrice || 0, 'gwei')} gwei`);
    
    const deploymentInfo = {
      network: networkName,
      deployedAt: new Date().toISOString(),
      contracts: {}
    };

    // Deploy RemiToken
    console.log("\n📝 Deploying RemiToken...");
    const RemiToken = await hre.ethers.getContractFactory("RemiToken", deployer);
    const remiToken = await RemiToken.deploy({
      gasPrice: gasPrice.gasPrice
    });
    await remiToken.waitForDeployment();
    
    const remiTokenAddress = await remiToken.getAddress();
    console.log(`✅ RemiToken deployed to: ${remiTokenAddress}`);
    deploymentInfo.contracts.remiToken = remiTokenAddress;

    // Deploy RemiProgress
    console.log("\n📊 Deploying RemiProgress...");
    const RemiProgress = await hre.ethers.getContractFactory("RemiProgress", deployer);
    const remiProgress = await RemiProgress.deploy({
      gasPrice: gasPrice.gasPrice
    });
    await remiProgress.waitForDeployment();
    
    const remiProgressAddress = await remiProgress.getAddress();
    console.log(`✅ RemiProgress deployed to: ${remiProgressAddress}`);
    deploymentInfo.contracts.remiProgress = remiProgressAddress;

    // Verify contracts (only for supported networks)
    if (networkName === "baseSepolia" || networkName === "celoAlfajores") {
      console.log("\n🔍 Verifying contracts...");
      
      // Verify RemiToken
      try {
        await hre.run("verify:verify", {
          address: remiTokenAddress,
          constructorArguments: [],
        });
        console.log(`✅ RemiToken verified on ${networkName}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes("Already Verified")) {
          console.log(`✅ RemiToken already verified on ${networkName}`);
        } else {
          console.log(`⚠️ RemiToken verification failed:`, errorMessage);
        }
      }

      // Verify RemiProgress
      try {
        await hre.run("verify:verify", {
          address: remiProgressAddress,
          constructorArguments: [],
        });
        console.log(`✅ RemiProgress verified on ${networkName}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes("Already Verified")) {
          console.log(`✅ RemiProgress already verified on ${networkName}`);
        } else {
          console.log(`⚠️ RemiProgress verification failed:`, errorMessage);
        }
      }
    }

    console.log("\n🎉 Deployment completed!");
    console.log(`Network: ${networkName}`);
    console.log(`RemiToken: ${remiTokenAddress}`);
    console.log(`RemiProgress: ${remiProgressAddress}`);
    
    // Save deployment info
    const fileName = `deployment-${networkName}.json`;
    fs.writeFileSync(fileName, JSON.stringify(deploymentInfo, null, 2));
    console.log(`📄 Deployment info saved to ${fileName}`);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Deployment failed:", errorMessage);
    if (errorMessage.includes("insufficient funds")) {
      console.log("💡 Make sure your wallet has enough funds for gas fees");
    }
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Script failed:", errorMessage);
    process.exit(1);
  });
