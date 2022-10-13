import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { NetworkUserConfig } from "hardhat/types";
import "hardhat-deploy";

const getRPC = (networkName: string) => {
  if (networkName) {
    const uri = process.env[networkName.toUpperCase() + "_RPC_URL"];
    if (uri && uri !== "") {
      return uri;
    }
  }
  return "http://localhost:8545";
};

const getPrivatekey = (networkName: string) => {
  if (networkName) {
    const privateKey = process.env[networkName.toUpperCase() + "_PRIVATE_KEY"];
    if (privateKey && privateKey !== "") {
      return [privateKey];
    }
  }

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey === "") {
    return [];
  }

  return [privateKey];
};

const createConfig = (network: string): NetworkUserConfig => {
  return {
    url: getRPC(network),
    accounts: getPrivatekey(network),
    gasPrice: "auto",
  };
};

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    bttc: createConfig("bttc"),
    tron: createConfig("tron"),
    rinkeby: createConfig("rinkeby"),
    ropsten: createConfig("ropsten"),
  },
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
    ],
  },
  namedAccounts: {
    deployer: "0x51685d226F643814EC3081593f0753CC8b2C38D1",
    admin: "0x51685d226F643814EC3081593f0753CC8b2C38D1",
  },
};

export default config;
