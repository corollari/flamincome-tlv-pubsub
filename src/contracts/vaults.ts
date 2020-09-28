import type { AbiItem } from "web3-utils";
import deployedAddresses from "./deployedAddresses";
import { web3 } from "./web3";
import vaultABI from "./ABIs/vault.json";
import { VaultContract } from "./ethereum";
import univ2ABI from "./ABIs/univ2.json";
import underlyingTokens from "./tokens";

export const tokens = [
  "USDT",
  "wBTC",
  // "renBTC",
  "wETH",
  // "TUSD",
  // "yCRV",
  // "sBTC",
  // "USDC",
  // "yDAI",
  // "crvBTC",
  // "DAI",
  "UNI-V2[WBTC]",
  // "OKB",
  // "crvRenWBTC",
  // "crvRenWSBTC"
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
      contract,
    };
    return acc;
  },
  {} as {
    [token: string]: {
      address: string;
      contract: VaultContract;
    };
  }
);

export default vaults;

export const uniContract = new web3.eth.Contract(
  univ2ABI as AbiItem[],
  underlyingTokens["UNI-V2[WBTC]"].address
) as {
  methods: {
    getReserves(): {
      call(): Promise<{
        _reserve0: string;
        _reserve1: string;
      }>;
    };
  };
};
