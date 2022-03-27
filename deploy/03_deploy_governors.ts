import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { MIN_DELAY, VOTING_PERIOD, QUORUM_PERCENTAGE } from "../helper-hardhat-config";

const deployGovernors: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {

    const { getNamedAccounts, deployments } = hre;
    const { deploy, log, get } = deployments;
    const { deployer } = await getNamedAccounts();

    const governorToken = await get("GovernanceToken");
    const timeLock = await get("TimeLock");

    const governors = await deploy("Governors", {
        from: deployer,
        args: [governorToken.address, timeLock.address,QUORUM_PERCENTAGE, MIN_DELAY, VOTING_PERIOD ],
        log: true
    });

    log("Deploying Governors ...");

    
};

export default deployGovernors;