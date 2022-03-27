import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployBox: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

    const { getNamedAccounts, deployments } = hre;
    const { deploy, log, get } = deployments;
    const { deployer } = await getNamedAccounts();

    log("Deploying Box ...");

    const box = await deploy("Box", {
        from: deployer,
        args: [],
        log: true
    })

    const timeLock = await ethers.getContract("TimeLock");
    const boxContract = await ethers.getContractAt("Box", box.address);

    const transferTx = await boxContract.transferOwnership(timeLock.address);
    await transferTx.wait(1);

    log("Done!");
    
}

export default deployBox;