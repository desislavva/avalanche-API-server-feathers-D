const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

//GET transaction by hash from P-chain - Ortelius API
exports.getTransactionByIdFromPChain = async (txId) => {
  let response;

  try {
    response = await axios.get(`${process.env.ORTELIUS_API_ENDPOINT + `transactions/${txId}`}`);
  } catch (error) {
    return 1;
  }
    
  return response.data;
};

//GET address balance by hash from P-chain
exports.getAddressInfoFromPChain = async (address) => {
  let balanceResult;

  await axios.post(process.env.P_CHAIN_BC_CLIENT_BLOCK_ENDPOINT, {
    jsonrpc: '2.0',
    id: 1,
    method: 'platform.getBalance',
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

  return balanceResult;
};

//GET X transactions from address after N-th transaction from P-chain - Ortelius API
exports.getXTransactionsAfterNthFromAddressFromPChain = async (address, n, x) => {
  let response;

  try {
    response = await axios.get(`${process.env.ORTELIUS_API_ENDPOINT}` + `transactions?address=${address}`);
  } catch (error) {
    return 1;
  }

  return (response.data.transactions).slice(n - x, n);
};

exports.getRecentTransactions = async () => {
  let response;

  try {
    response = await axios.get(`${process.env.ORTELIUS_API_ENDPOINT + 'transactions?chainID=11111111111111111111111111111111LpoYY&limit=1&sort=timestamp-desc'}`);
  } catch (error) {
    return [1];
  }
    
  return [0, response.data.transactions[0]];
};

