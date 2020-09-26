import deployedAddresses from "./deployedAddresses";

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
    acc[token] = {
      address: deployedAddresses[`VaultBaseline${token}`],
    };
    return acc;
  },
  {} as {
    [token: string]: {
      address: string;
    };
  }
);

export default vaults;
