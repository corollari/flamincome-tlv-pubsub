import vaults from "./contracts/vaults";
import {web3} from "./contracts/web3"
import BN from "bn.js";

function pow10(power:number){
    return  new BN(10).pow(new BN(power))
}

const precision = 4;
const blocksPerDay = 24*60*(60/15) // Assumes 15-sec block times
export default async function computeAllAPYs(){
    const APYs = Object.entries(vaults).map(async ([token, {contract}])=>{
        // Minus one to ensure that the block will be available for getBlock()
        const currentBlockHeight = await web3.eth.getBlockNumber() - 1;
        const previousBlockHeight = currentBlockHeight-blocksPerDay;

        const currentBlock = web3.eth.getBlock(currentBlockHeight)
        const previousBlock = web3.eth.getBlock(previousBlockHeight)

        const currentSharePrice = contract.methods.priceE18().call({}, currentBlockHeight);
        const previousSharePrice = contract.methods.priceE18().call({}, previousBlockHeight)
        const increaseSharePrice = new BN(await currentSharePrice).mul(pow10(18)).div(new BN(await previousSharePrice))
        
        const diffBlockTime = Number((await currentBlock).timestamp) - Number((await previousBlock).timestamp)
        const fractionOfYear = new BN(365*24*60*60).div(new BN(diffBlockTime))

        // increaseSharePrice^fractionOfYear
        const yearlyIncrease = increaseSharePrice.pow(fractionOfYear)
        const yearUnit = fractionOfYear.mul(new BN(18)).toNumber()
        const APY = yearlyIncrease.sub(pow10(yearUnit))
        const percentageAPY = APY.div(pow10(yearUnit-precision)).toNumber()/(10**(precision-2))
        return {
            token,
            percentageAPY
        }
    })
    return Promise.all(APYs)
}