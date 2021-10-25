const dotenv = require('dotenv');

dotenv.config();

const cChainMethods = require('../services/c-chain');
const xChainMethods = require('../services/x-chain');
const pChainMethods = require('../services/p-chain');

const X_CHAIN = 'X';
const P_CHAIN = 'P';
const C_CHAIN = '0x';

exports.getTransactionByHash = async (clientWs, hash) => {
    let xChainTransaction;
    let cChainTransaction;
    let pChainTransaction;

    xChainTransaction = await xChainMethods.getTransactionByIdFromXChain(hash);
    cChainTransaction = await cChainMethods.getTransactionByHashFromCChain(hash);
    pChainTransaction = await pChainMethods.getTransactionByIdFromPChain(hash);

    if (xChainTransaction == 1 && cChainTransaction[0] == 1 && pChainTransaction == 1) {
        clientWs.send(JSON.stringify('{"result":"connection refused to avalanche client or api call rejected"}'));
    } else if (xChainTransaction != 1) {
        clientWs.send(JSON.stringify(xChainTransaction));
    } else if (cChainTransaction[0] != 1) {
        clientWs.send(JSON.stringify(cChainTransaction[1]));
    } else if (pChainTransaction != 1) {
        clientWs.send(JSON.stringify(pChainTransaction));
    }

};

exports.getXTransactionsAfterNthFromAddress = async (clientWs, address, n, x) => {
    let xChainTransactions;
    let pChainTransactions;
    let cChainTransactions;

    if ((address).charAt(0) == X_CHAIN) {
        xChainTransactions = await xChainMethods.getXTransactionsAfterNthFromAddressFromXChain(address, n, x);

        if (xChainTransactions[0] == 1) {
            clientWs.send(JSON.stringify(xChainTransactions[1]));
        } else {
            clientWs.send(JSON.stringify(xChainTransactions[1]));
        }
    } else if ((address).charAt(0) == P_CHAIN) {
        pChainTransactions = await pChainMethods.getXTransactionsAfterNthFromAddressFromPChain(address, n, x);
        
        if (pChainTransactions == 1) {
            clientWs.send(JSON.stringify('{"result":"api call rejected or not enough transactions"}'));
        } else {
            clientWs.send(JSON.stringify(pChainTransactions));
        }
    } else if ((address).slice(0, 2) == C_CHAIN) {
        cChainTransactions = await cChainMethods.getXTransactionsAfterNthFromAddressFromCChain(address, n, x);

        clientWs.send(JSON.stringify(cChainTransactions));
    } else {
        clientWs.send(JSON.stringify('{"result":"wrong chain"}'));
    }
};

exports.getXPendingTransactionsAfterNth = async (clientWs, n, x) => {
    if (n > 0 && x > 0) {
        cChainTransactions = await cChainMethods.getXPendingTransactionsAfterNthFromCChain(n, x);

        if (cChainTransactions[0] == 1) {
            clientWs.send(JSON.stringify(cChainTransactions[1]));
        } else {
            clientWs.send(JSON.stringify(cChainTransactions[1]));
        }
    } else {
        clientWs.send(JSON.stringify('{"result":"n and x < 0"}'));
    }

};

exports.getRecentTransactionsFromXChain = async (clientWs) => {
    xChainTransaction = await xChainMethods.getRecentTransactions();

    if (xChainTransaction[0] == 1) {
        clientWs.send(JSON.stringify(xChainTransaction[1]));
    } else {
        clientWs.send(JSON.stringify(xChainTransaction[1]));
    }
};

exports.getRecentTransactionsFromPChain = async (clientWs) => {
    pChainTransaction = await pChainMethods.getRecentTransactions();

    if (pChainTransaction[0] == 1) {
        clientWs.send(JSON.stringify(pChainTransaction[1]));
    } else {
        clientWs.send(JSON.stringify(pChainTransaction[1]));
    }
};