// import redis from "redis";
import Web3 from "web3";
import WebSocket from "ws";
import { getContracts, getTotalTLV } from "./computeTLV";

// Project id should be hidden but whatever, I have a free account that is worthless
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://mainnet.infura.io/v3/a94d8fec07d14f058824938b13ad64b3"
  )
);
const web3ws = new Web3(
  new Web3.providers.WebsocketProvider(
    "wss://mainnet.infura.io/ws/v3/a94d8fec07d14f058824938b13ad64b3"
  )
);
const contracts = getContracts(web3);

const wss = new WebSocket.Server({ port: Number(process.env.PORT ?? '8080') });
function broadcast(message: any) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

let lastTLV: number = 0;
wss.on("connection", (ws) => {
  ws.send(lastTLV);
});
getTotalTLV(contracts).then((tlv) => {
  lastTLV = tlv;
});

/*
const redisUrl = process.env.REDIS_URL;

let redisClient: redis.RedisClient;
if (redisUrl === undefined) {
  console.log("Using a local version of redis, as 'REDIS_URL' was not found");
  redisClient = redis.createClient();
} else {
  redisClient = redis.createClient(redisUrl);
}
// For debugging purposes
redisClient.on("error", (error) => {
  console.error(error);
});
*/

web3ws.eth
  .subscribe("newBlockHeaders", (error) => {
    if (error) {
      console.error(error);
    }
  })
  .on("data", () => {
    console.log("new");
    getTotalTLV(contracts).then((tlv) => {
      lastTLV = tlv;
      broadcast(tlv);
    });
  })
  .on("error", console.error);
