import fetch from "node-fetch";
import tokens from "./contracts/tokens";
import vaults, { uniContract } from "./contracts/vaults";

function getTokenAddress(token: string) {
  return tokens[token].address;
}

type CoingeckoAPIResponse = { [adress: string]: { usd: number } };
async function getPrice(token: string) {
  if (token === "yDAI") {
    return Promise.resolve(1);
  }

  const tokenAddress = getTokenAddress(token);

  return fetch(
    `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${tokenAddress}&vs_currencies=usd`
  )
    .then((res) => {
      if (!res.ok) {
        res.text().then(console.error);
        throw new Error("Coingecko request failed");
      }
      return res.json();
    })
    .then((res: CoingeckoAPIResponse) => Object.values(res)[0].usd);
}

const contracts = Object.entries(vaults).map(([token, { contract }]) => {
  return {
    vaultContract: contract,
    token,
  };
});

type Contract = typeof contracts[0];

async function getVaultTLV(contract: Contract) {
  const totalSupply = contract.vaultContract.methods
    .totalSupply()
    .call()
    .then((res) => Number(res));
  const decimals = tokens[contract.token].decimals;
  const normalizedSupply = (await totalSupply) / 10 ** decimals;
  if (contract.token === "UNI-V2[WBTC]") {
    const price = getPrice("wBTC");
    const uniPairReserves = await uniContract.methods.getReserves().call();
    const wBTCHeldInUNI = Number(uniPairReserves._reserve0) / 10 ** 8;
    return normalizedSupply * wBTCHeldInUNI * (await price);
  }
  const price = getPrice(contract.token);
  return normalizedSupply * (await price);
}

export async function getTotalTLV() {
  const tlvs = await Promise.all(contracts.map(getVaultTLV));
  return tlvs.reduce((totalTLV, vaultTLV) => totalTLV + vaultTLV);
}
