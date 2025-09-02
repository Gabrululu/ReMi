const hre = require("hardhat");

async function main() {
  console.log("🎯 Setting up weekly missions...");

  try {
    // Get the signer
    const signers = await hre.ethers.getSigners();
    const deployer = signers[0];
    console.log(`Using account: ${deployer.address}`);

    // Get the RemiProgress contract
    const RemiProgress = await hre.ethers.getContractFactory("RemiProgress");
    const remiProgress = RemiProgress.attach("0xa89fb8A3f72C77cA15cfb8a1903f6Ef4D48bed82");

    // Week 1 missions
    const weekId = 1;
    const titulos = [
      "Completa 5 tareas esta semana",
      "Alcanza 1 meta semanal", 
      "Mantén 3 días de racha"
    ];
    const descripciones = [
      "Suma constancia con tareas pequeñas",
      "Enfócate en un objetivo claro",
      "Pequeños pasos todos los días"
    ];
    const objetivos = [5, 1, 3];
    const recompensas = [50, 100, 75];

    console.log("\n📝 Setting up Week 1 missions...");
    console.log("Mission 1:", titulos[0]);
    console.log("Mission 2:", titulos[1]);
    console.log("Mission 3:", titulos[2]);

    const tx = await remiProgress.setWeeklyMissions(
      weekId,
      titulos,
      descripciones,
      objetivos,
      recompensas
    );

    await tx.wait();
    console.log("✅ Weekly missions set successfully!");
    console.log("Transaction hash:", tx.hash);

  } catch (error) {
    console.error("❌ Error setting up missions:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
