import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployGovernanceToken: DeployFunction = async function (hre:HardhatRuntimeEnvironment) {

    const { getNamedAccounts, deployments, network } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    console.log("Deploy Gavernance Token ...");

    const governanceToken = await deploy("GovernanceToken", {
        from: deployer,
        args: [],
        log: true,
        // waitConfirmations : true
    })

    log(`deploy governance token to address : ${governanceToken.address}`);

    await delegate(governanceToken.address, deployer);
    log("Delegated!");

};

const delegate = async ( governanceTokenAddress: string, delegatedAccount: string ) => {

    const governanceToken = await ethers.getContractAt("GovernanceToken", governanceTokenAddress);
    const txResponse = await governanceToken.delegate(delegatedAccount);
    await txResponse.wait(1);

    console.log(`Checkpoints: ${await governanceToken.numCheckpoints(delegatedAccount)}`);

}

export default deployGovernanceToken;