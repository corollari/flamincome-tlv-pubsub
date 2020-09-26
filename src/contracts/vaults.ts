import deployedAddresses from "./deployedAddresses";
import {web3} from './web3'
import vaultABI from "./ABIs/vault.json";
import { VaultContract } from "./ethereum";
import type { AbiItem } from "web3-utils";

export const tokens = [
  "USDT",
  "wBTC",
  "renBTC",
  "wETH",
  "TUSD",
  "yCRV",
  "sBTC",
  "USDC",
  "yDAI",
  "crvBTC",
  "DAI",
];

const vaults = tokens.reduce(
  (acc, token) => {
    const address = deployedAddresses[`VaultBaseline${token}`];
    const contract = new web3.eth.Contract(
      vaultABI as AbiItem[],
      address
    ) as VaultContract;
    acc[token] = {
      address,
      contract
    };
    return acc;
  },
  {} as {
    [token: string]: {
      address: string;
      contract: VaultContract
    };
  }
);

export default vaults;
