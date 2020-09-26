import Web3 from "web3";

// Project id should be hidden but whatever, I have a free account that is worthless
export const web3 = new Web3(
    new Web3.providers.HttpProvider(
      "https://mainnet.infura.io/v3/a94d8fec07d14f058824938b13ad64b3"
    )
  );
export const web3ws = new Web3(
    new Web3.providers.WebsocketProvider(
      "wss://mainnet.infura.io/ws/v3/a94d8fec07d14f058824938b13ad64b3"
    )
  );