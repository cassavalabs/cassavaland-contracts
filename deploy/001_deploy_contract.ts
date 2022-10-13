import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const main: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { admin, deployer } = await getNamedAccounts();

  //deploy treasury contract
  const treasury = await deploy("CassavaLandTreasury", {
    from: deployer,
    args: [admin],
    log: true,
  });

  //deploy Nft escrow transfer manager
  const nftTransferProxy = await deploy("NftTransferProxy", {
    from: deployer,
    args: [treasury.address],
    log: true,
  });

  //deploy Wrapped Native token bidding escrow
  const wnative = await deploy("WNATIVE", {
    from: deployer,
    args: [treasury.address],
    log: true,
  });

  //deploy Exchange
  await deploy("CassavaLandExchange", {
    from: deployer,
    args: [wnative.address, nftTransferProxy.address, 20, treasury.address],
    log: true,
  });

  //deploy NFT collection Factory
  await deploy("CassavaLandNFTFactory", {
    from: deployer,
    args: [nftTransferProxy.address],
    log: true,
  });
};

export default main;
