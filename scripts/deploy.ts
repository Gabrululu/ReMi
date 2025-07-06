import { ethers } from "hardhat";
import * as fs from "fs";

const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying ReMi Token contract...");

  // Get the network name
  const networkName = hre.network.name;
  console.log(`\n📦 Deploying to ${networkName}...`);

  try {
    // Get the signer
    const signers = await ethers.getSigners();
    console.log(`Found ${signers.length} signers`);
    
    if (signers.length === 0) {
      throw new Error("No signers found. Check your PRIVATE_KEY configuration.");
    }
    
    const deployer = signers[0];
    console.log(`Deploying with account: ${deployer.address}`);
    
    // Check balance
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log(`Account balance: ${ethers.formatEther(balance)} ETH`);
    
    // Deploy the contract with automatic gas estimation
    const RemiToken = await ethers.getContractFactory("RemiToken", deployer);
    
    // Get current gas price
    const gasPrice = await ethers.provider.getFeeData();
    console.log(`Current gas price: ${ethers.formatUnits(gasPrice.gasPrice || 0, 'gwei')} gwei`);
    
    const remiToken = await RemiToken.deploy({
      gasPrice: gasPrice.gasPrice
    });
    await remiToken.waitForDeployment();
    
    const contractAddress = await remiToken.getAddress();
    console.log(`✅ ReMi Token deployed to ${networkName}: ${contractAddress}`);

    // Verify contract (only for supported networks)
    if (networkName === "baseSepolia" || networkName === "celoAlfajores") {
      console.log("\n🔍 Verifying contract...");
      
      try {
        await hre.run("verify:verify", {
          address: contractAddress,
          constructorArguments: [],
        });
        console.log(`✅ ${networkName} contract verified`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes("Already Verified")) {
          console.log(`✅ ${networkName} contract already verified`);
        } else {
          console.log(`⚠️ ${networkName} verification failed:`, errorMessage);
        }
      }
    }

    console.log("\n🎉 Deployment completed!");
    console.log(`Network: ${networkName}`);
    console.log(`Contract Address: ${contractAddress}`);
    
    // Save deployment info
    const deploymentInfo = {
      network: networkName,
      address: contractAddress,
      deployedAt: new Date().toISOString(),
    };
    
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