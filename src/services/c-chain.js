const axios = require('axios');
const dotenv = require('dotenv');
const web3 = require('web3-utils');

dotenv.config();

//GET block info by hash from C-chain
exports.getBlockByHashFromCChain = async (hash) => {
  let result;

  await axios.post(process.env.C_CHAIN_BC_CLIENT_BLOCK_ENDPOINT, {
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_getBlockByHash',
    params: [`${hash}`, true]
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
  }).then(response => {
    result = [0, response.data];
  }).catch(error => {
    if(!error.response) {
      console.log('connection refused to avalanche client');
      result = [1, JSON.parse('{"result":"connection refused to avalanche client"}')];
    } else {
      console.log(error.response.data);
      result = [1, error.response.data];
    }
  });
    
  return result;
};

//GET block info by number from C-chain
exports.getBlockByNumberFromCChain = async (number) => {
  let hexNumber;
    
  if (number == 'latest') {
    hexNumber = number;
  } else {
    hexNumber = '0x' + parseInt(number).toString(16);
  }
    
  let result;

  await axios.post(process.env.C_CHAIN_BC_CLIENT_BLOCK_ENDPOINT, {
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_getBlockByNumber',
    params: [`${hexNumber}`, true]
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
  }).then(response => {
    result = [response.data, response.data.result.hash];
  }).catch(error => {
    if(!error.response) {
      result = [1, JSON.parse('{"result":"connection refused to avalanche client"}')];
    } else {
      console.log(error.response.data);
      result = [1, error.response.data];
    }
  });
    
  return result;
};

//GET transaction by hash from C-chain
exports.getTransactionByHashFromCChain = async (hash) => {
  let result;

  await axios.post(process.env.C_CHAIN_BC_CLIENT_BLOCK_ENDPOINT, {
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_getTransactionByHash',
    params: [`${hash}`]
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
  }).then(response => {
    result = [0, response.data];
  }).catch(error => {
    if(!error.response) {
      console.log('connection refused to avalanche client');
      result = [1];
    } else {
      console.log(error.response.data);
      result = [1];
    }
  });

  return result;
};


//GET address info by hash from C-chain
exports.getAddressInfoFromCChain = async (cChainAddress) => {
  let balanceResult;

  await axios.post(process.env.C_CHAIN_BC_CLIENT_BLOCK_ENDPOINT, {
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_getBalance',
    params: [`${cChainAddress}`, 'latest']
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
    
  if (balanceResult[0] == 1) {
    return balanceResult;
  }

  const responseForTransactionCount = await axios.post(process.env.C_CHAIN_BC_CLIENT_BLOCK_ENDPOINT, {
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_getTransactionCount',
    params: [`${cChainAddress}`, 'latest']
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
  });

  return [web3.fromWei(`${balanceResult[1]}`, 'ether'), parseInt(responseForTransactionCount.data.result)];
};


//GET X transactions from address after N-th transaction from C-chain - Ortelius API
exports.getXTransactionsAfterNthFromAddressFromCChain = async (address, n, x) => {
  let response;

  try {
    response = await axios.get(`${process.env.ORTELIUS_API_ENDPOINT}` + `ctransactions?address=${address}`);
  } catch (error) {
    return 1;
  }

  return (response.data.transactions).slice(n - x, n);
};

//GET X unaccepted transactions after N-th transaction from C-chain
exports.getXPendingTransactionsAfterNthFromCChain = async (n, x) => {
  let result;

  await axios.post(process.env.C_CHAIN_BC_CLIENT_BLOCK_ENDPOINT, {
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_getBlockByNumber',
    params: ['pending', true]
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
  }).then(response => {
    result = [0, (response.data.result.transactions).slice(n - x, n)];
  }).catch(error => {
    if(!error.response) {
      console.log('connection refused to avalanche client');
      result = [1, JSON.parse('{"result":"connection refused to avalanche client"}')];
    } else {
      console.log('api call rejected or not enough transactions');
      result = [1, JSON.parse('{"result":"api call rejected or not enough transactions"}')];
    }
  });
    
  return result;
};