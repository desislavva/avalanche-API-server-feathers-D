const dotenv = require('dotenv');

const cChainMethods = require('../services/c-chain');

dotenv.config();

//get block by hash 
exports.getBlockByHash = async (clientWs, hash) => {
    const blockFromCChain = await cChainMethods.getBlockByHashFromCChain(hash);

    if (blockFromCChain[0] == 1) {
        clientWs.send(JSON.stringify(blockFromCChain[1]));
    } else {
        clientWs.send(JSON.stringify(blockFromCChain[1]));
    }
};


//get block by number 
exports.getBlockByNumber = async (clientWs, blocknumber) => {
    const cChainNumber = await cChainMethods.getBlockByNumberFromCChain(blocknumber);

    if (cChainNumber[0] == 1) {
        clientWs.send(JSON.stringify(cChainNumber[1]));
    } else {
        clientWs.send(JSON.stringify(cChainNumber[0]));
    }
};


//GET X blocks after N-th
exports.getXBlocksFromNthFromCChain = async (clientWs, blocknumber, blockcount) => {
    const cChainArray = [];
    let k = 0;

    const blockNumber = parseInt(blocknumber);
    const count = parseInt(blockcount);

    for (let i = blockNumber - count; i < blockNumber; ++i)
    {
        let hashValue = await cChainMethods.getBlockByNumberFromCChain(i);
        
        if (hashValue[0] == 1) {
            return clientWs.send(JSON.stringify(hashValue[1]));
        } else {
            cChainArray[k] = hashValue[1];
            k++;
        }
    }

    clientWs.send(JSON.stringify(cChainArray));
};
