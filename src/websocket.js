const WebSocket = require('ws');

const dotenv = require('dotenv');

const websocketAddressMethods = require('../src/websocket/address');
const websocketBlockMethods = require('../src/websocket/blocks');
const websocketTransactionMethods = require('../src/websocket/transactions');
const websocketNetworkMethods = require('../src/websocket/network');

dotenv.config();
dotenv.config();

const wss = new WebSocket.WebSocketServer({ port: process.env.WEBSOCKET_PORT });

wss.on('connection', (ws, req) => {
    console.log(`New connection from IP: ${req.socket.remoteAddress}`);

    ws.on('message', (jsonData) => {
        let message;

        try {
            message = JSON.parse(jsonData);
        } catch (error) {
            ws.send('Wrong message format - must be JSON');
            return;
        }

        switch(message.method) {
            case 'getAddressInfoByHash':
                websocketAddressMethods.getAddressInfoByHash(ws, message.params.hash);
                break;
            case 'getBlockByHash':
                websocketBlockMethods.getBlockByHash(ws, message.params.hash);
                break;
            case 'getBlockByNumber':
                websocketBlockMethods.getBlockByNumber(ws, message.params.blocknumber);
                break;
            case 'getXBlocksFromNthFromCChain':
                websocketBlockMethods.getXBlocksFromNthFromCChain(ws, message.params.blocknumber, message.params.blockcount);
                break;
            case 'getTransactionByHash':
                websocketTransactionMethods.getTransactionByHash(ws, message.params.hash);
                break;
            case 'getXTransactionsAfterNthFromAddress':
                websocketTransactionMethods.getXTransactionsAfterNthFromAddress(ws, message.params.address, message.params.n, message.params.x);
                break;
            case 'getXPendingTransactionsAfterNth':
                websocketTransactionMethods.getXPendingTransactionsAfterNth(ws, message.params.n, message.params.x);
                break;
            case 'getRecentTransactionsFromXChain':
                websocketTransactionMethods.getRecentTransactionsFromXChain(ws);
                break;
            case 'getRecentTransactionsFromPChain':
                websocketTransactionMethods.getRecentTransactionsFromPChain(ws);
                break;
            case 'getNetWorkActivity':
                websocketNetworkMethods.getNetWorkActivity(ws);
                break;
        }
    });
});