import vaults from "./contracts/vaults";
import { web3 } from "./contracts/web3";

const blocksPerDay = 24 * 60 * (60 / 15); // Assumes 15-sec block times
export default async function computeAllAPYs() {
  const currentBlockHeight = (await web3.eth.getBlockNumber()) - 1;
  // Minus one to ensure that the block will be available for getBlock()
  const previousBlockHeight = currentBlockHeight - blocksPerDay;
  const currentBlock = web3.eth.getBlock(currentBlockHeight);
  const previousBlock = web3.eth.getBlock(previousBlockHeight);
  const APYs = Object.entries(vaults).map(async ([token, { contract }]) => {
    const currentSharePrice = contract.methods
      .priceE18()
      .call({}, currentBlockHeight);
    const previousSharePrice = contract.methods
      .priceE18()
      .call({}, previousBlockHeight);
    const increaseSharePrice =
      Number(await currentSharePrice) / Number(await previousSharePrice);

    const diffBlockTime =
      Number((await currentBlock).timestamp) -
      Number((await previousBlock).timestamp);
    const fractionOfYear = (365 * 24 * 60 * 60) / diffBlockTime;
    // increaseSharePrice^fractionOfYear
    const yearlyIncrease = increaseSharePrice ** fractionOfYear;
    const APY = yearlyIncrease - 1;
    const percentageAPY = Number((APY * 100).toFixed(2));

    return {
      token,
      percentageAPY,
    };
  });
  return Promise.all(APYs);
}
