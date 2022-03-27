import { ethers, network } from "hardhat";
import { developmentChains, FUNC, NEW_STORE_VALUE, PROPOSAL_DESCRIPTION, VOTING_DELAY, proposalsFile } from "../helper-hardhat-config";
import { moveBlocks } from "../utils/move_blocks";
import * as fs from "fs";

export async function propose( 
    args: any[], 
    functionToCall: string,
    proposalDescription: string
    
    ) {

    const governor = await ethers.getContract("Governors");
    const box = await ethers.getContract("Box");

    const encodeFunctionCall = box.interface.encodeFunctionData(functionToCall, args);
    console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`)
    console.log(`Proposal Description:\n  ${proposalDescription}`);

    const proposeTx = await governor.propose(
        [box.address],
        [0],
        [encodeFunctionCall],
        proposalDescription
    )

    const proposeReceipt = await proposeTx.wait(1);

    if(developmentChains.includes(network.name)){
        await moveBlocks(VOTING_DELAY + 1);
    }

    const proposalId = proposeReceipt.events[0].args.proposalId;
    console.log(`Proposed with proposal ID:\n  ${proposalId}`);



    let proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
    proposals[network.config.chainId!.toString()].push(proposalId.toString())
    fs.writeFileSync(proposalsFile, JSON.stringify(proposals))
}

propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
    .then(() => process.exit(0))
    .catch((error) => {
        console.log("error: ", error);
        process.exit(1);
    });

