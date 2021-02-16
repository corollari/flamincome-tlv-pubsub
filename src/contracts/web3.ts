import Web3 from "web3";

const alchemyId = process.env.ALCHEMY_TOKEN;
// Project id should be hidden but whatever, I have a free account that is worthless
export const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://eth-mainnet.alchemyapi.io/v2/${alchemyId}`
  )
);
export const web3ws = new Web3(
  new Web3.providers.WebsocketProvider(
    `wss://eth-mainnet.ws.alchemyapi.io/v2/${alchemyId}`
  )
);
