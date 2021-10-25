const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

//GET transaction info by hash/id - Ortelius API
exports.getTransactionByIdFromXChain = async (txId) => {
  let response;

  try {
    response = await axios.get(`${process.env.ORTELIUS_API_ENDPOINT + `transactions/${txId}`}`);
  } catch (error) {
    return 1;
  }
    
  return response.data;
};

//GET address info by hash
exports.getAddressInfoByHashFromXChain = async (address) => {
  let balanceResult;

  await axios.post(process.env.X_CHAIN_BC_CLIENT_BLOCK_ENDPOINT, {
    jsonrpc: '2.0',
    id: 1,
    method: 'avm.getAllBalances',
    params: {
      address: `${address}`
    }
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
  }).then(response => {
    balanceResult = [0, response.data.result];
  }).catch(error => {
    if(!error.response) {
      console.log('connection refused to avalanche client');
      balanceResult = [1, JSON.parse('{"result":"connection refused to avalanche client"}')];
    } else {
      console.log(error.response.data);
      balanceResult = [1, error.response.data];
    }
  });

  if (balanceResult[0] == 1 || typeof balanceResult[1] == 'undefined') {
    balanceResult[0] = 1;
    return balanceResult;
  }

  let responseForAssets;

  if (balanceResult[1].balances.length <= 0) {
    return [balanceResult[1].balances, 'AVAX'];
  }

  for(let i = 0; i < balanceResult[1].balances.length; i++) {
    responseForAssets = await axios.post(process.env.X_CHAIN_BC_CLIENT_BLOCK_ENDPOINT, {
      jsonrpc: '2.0',
      id: 1,
      method: 'avm.getAssetDescription',
      params: {
        'assetID' :`${balanceResult[1].balances[i].asset}`
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  }
    
  return [balanceResult[1].balances, responseForAssets.data.result];
};

//GET X transaction from address after N-th transaction
exports.getXTransactionsAfterNthFromAddressFromXChain = async (address, n, x) => {
  let response;

  try {
    response = await axios.get(`${process.env.ORTELIUS_API_ENDPOINT + `transactions?address=${address}&limit=1&sort=timestamp-desc`}`);
  } catch (error) {
        
    return [1, error];
  }
    
  return [0, response.data.transactions];
};

exports.getRecentTransactions = async () => {
  let response;

  try {
    response = await axios.get(`${process.env.ORTELIUS_API_ENDPOINT + 'transactions?chainID=2JVSBoinj9C2J33VntvzYtVJNZdN2NKiwwKjcumHUWEb5DbBrm&limit=1&sort=timestamp-desc'}`);
  } catch (error) {
    return [1];
  }
    
  return [0, response.data.transactions[0]];
};