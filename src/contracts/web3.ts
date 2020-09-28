import Web3 from "web3";

const infuraId = process.env['INFURA_TOKEN'];
// Project id should be hidden but whatever, I have a free account that is worthless
export const web3 = new Web3(
  new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${infuraId}`)
);
export const web3ws = new Web3(
  new Web3.providers.WebsocketProvider(
    `wss://mainnet.infura.io/ws/v3/${infuraId}`
  )
);
