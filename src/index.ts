// import redis from "redis";
import WebSocket from "ws";
import express from "express";
import { web3ws } from "./contracts/web3";
import { getTotalTLV } from "./computeTLV";
import computeAPYs from "./computeAPYs";
const cors = require('cors');

const app = express();
app.use(cors());
const server = app.listen(Number(process.env.PORT ?? "8080"));

const wss = new WebSocket.Server({ server, path: "/tlv" });
function broadcast(message: any) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

let lastTLV: number = 0;
let APYs: {
  token: string;
  percentageAPY: number;
}[];
wss.on("connection", (ws) => {
  ws.send(lastTLV);
});
app.get("/apy", (_, res) => {
  res.send(APYs);
});

getTotalTLV().then((tlv) => {
  lastTLV = tlv;
});
async function updateAPYs() {
  APYs = await computeAPYs();
}
updateAPYs();

web3ws.eth
  .subscribe("newBlockHeaders", (error) => {
    if (error) {
      console.error(error);
    }
  })
  .on("data", () => {
    console.log("new");
    updateAPYs();
    getTotalTLV().then((tlv) => {
      lastTLV = tlv;
      broadcast(tlv);
    });
  })
  .on("error", console.error);

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
