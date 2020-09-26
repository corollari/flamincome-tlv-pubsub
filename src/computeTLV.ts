import type { AbiItem } from "web3-utils";
import Web3 from "web3";
import fetch from "node-fetch";
import { ERC20Contract } from "./contracts/ethereum";
import vaults from "./contracts/vaults";
import vaultABI from "./contracts/ABIs/vault.json";
import tokens from "./contracts/tokens";

type CoingeckoAPIResponse = { [adress: string]: { usd: number } };

export function getContracts(web3: Web3) {
  return Object.entries(vaults).map(([token, { address }]) => {
    const vaultContract = new web3.eth.Contract(
      vaultABI as AbiItem[],
      address
    ) as ERC20Contract;
    const decimals = vaultContract.methods.decimals().call();
    const tokenAddress = tokens[token].address;
    // const decimals = Promise.resolve(tokens[token].decimals);
    const getPrice = async () => {
      if (token === "yDAI") {
        return Promise.resolve(1);
      }
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
    };

    return {
      getPrice,
      vaultContract,
      decimals,
      token,
    };
  });
}

type Contract = ReturnType<typeof getContracts>[0];

async function getVaultTLV(contract: Contract) {
  const totalSupply = contract.vaultContract.methods
    .totalSupply()
    .call()
    .then((res) => Number(res));
  const price = contract.getPrice();
  const decimals = contract.decimals.then((res) => Number(res));
  const normalizedSupply = (await totalSupply) / 10 ** (await decimals); // Integer division, we are losing the decimals
  console.log(contract.token, await totalSupply, normalizedSupply);
  return normalizedSupply * (await price);
}

export async function getTotalTLV(contracts: Contract[]) {
  const tlvs = await Promise.all(contracts.map(getVaultTLV));
  return tlvs.reduce((totalTLV, vaultTLV) => totalTLV + vaultTLV);
}
