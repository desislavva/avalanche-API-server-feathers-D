const dotenv = require('dotenv');

dotenv.config();

const cChainMethods = require('../services/c-chain');
const xChainMethods = require('../services/x-chain');
const pChainMethods = require('../services/p-chain');

const X_CHAIN = 'X';
const P_CHAIN = 'P';
const C_CHAIN = '0x';

//GET address info by hash
exports.getAddressInfoByHash = async (clientWs, hash) => {
    let addressInfoFromXChain;
    let addressInfoFromCChain;
    let addressInfoFromPChain;

    if ((hash).charAt(0) == X_CHAIN) {
        addressInfoFromXChain = await xChainMethods.getAddressInfoByHashFromXChain(hash);

        if (addressInfoFromXChain[0] == 1) {
            clientWs.send(JSON.stringify(addressInfoFromXChain[1]));
        } else {
            clientWs.send(JSON.stringify(addressInfoFromXChain));
        }
    } else if ((hash).charAt(0) == P_CHAIN) {
        addressInfoFromPChain = await pChainMethods.getAddressInfoFromPChain(hash);

        if (addressInfoFromPChain[0] == 1) {
            clientWs.send(JSON.stringify(addressInfoFromPChain[1]));
        } else {
            clientWs.send(JSON.stringify(addressInfoFromPChain[1]));
        }
    } else if ((hash).slice(0, 2) == C_CHAIN){
        addressInfoFromCChain = await cChainMethods.getAddressInfoFromCChain(hash);

        if (addressInfoFromCChain[0] == 1) {
            clientWs.send(JSON.stringify(addressInfoFromCChain[1]));
        } else {
            clientWs.send(JSON.stringify(addressInfoFromCChain));
        }
    } else {
        clientWs.send(JSON.stringify('result: wrong input'));
    }
};