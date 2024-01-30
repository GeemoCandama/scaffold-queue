import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployVideoQueue: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("VideoQueue", {
    from: deployer,
    // Contract constructor arguments
    args: [ethers.utils.parseEther("0.001")],
    log: true,
    autoMine: true,
  });
};

export default deployVideoQueue;

deployVideoQueue.tags = ["VideoQueue"];
