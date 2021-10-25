const dotenv = require('dotenv');

const axios = require('axios');


const cChainMethods = require('../services/c-chain')
const pChainMethods = require('../services/p-chain')
const xChainMethods = require('../services/x-chain')


dotenv.config();


  module.exports = function (app) {



    //////////////// NETWORK //////////////////
    app.get('/network',async function (req, res) {

  
        let result = [];
      
        await axios.post(process.env.P_CHAIN_BC_CLIENT_BLOCK_ENDPOINT, {
          jsonrpc: '2.0',
          id: 1,
          method: 'platform.getTotalStake',
          params: {}
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
        }).then(response => {
          result.push(response.data.result.stake);
        }).catch(error => {
          if(!error.response) {
            console.log('connection refused to avalanche client');
            res.send(JSON.parse('{"result":"connection refused to avalanche client"}'));
            return;
          } else {
            console.log(error.response.data);
            res.send(error.response.data);
            return;
          }
        });
      
        await axios.post(process.env.P_CHAIN_BC_CLIENT_BLOCK_ENDPOINT, {
          jsonrpc: '2.0',
          id: 1,
          method: 'platform.getCurrentValidators',
          params: {}
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
        }).then(response => {
          result.push(response.data.result.validators.length);
        }).catch(error => {
          if(!error.response) {
            console.log('connection refused to avalanche client');
            res.send(JSON.parse('{"result":"connection refused to avalanche client"}'));
            return;
          } else {
            console.log(error.response.data);
            res.send(error.response.data);
            return;
          }
        });
      
        await axios.post(process.env.C_CHAIN_BC_CLIENT_BLOCK_ENDPOINT, {
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_blockNumber',
          params: []
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
        }).then(response => {
          result.push(parseInt(response.data.result));
        }).catch(error => {
          if(!error.response) {
            console.log('connection refused to avalanche client');
            res.send(JSON.parse('{"result":"connection refused to avalanche client"}'));
            return;
          } else {
            console.log(error.response.data);
            res.send(error.response.data);
            return;
          }
        });
      
        await axios.post(process.env.P_CHAIN_BC_CLIENT_BLOCK_ENDPOINT, {
          jsonrpc: '2.0',
          id: 1,
          method: 'platform.getHeight',
          params: {}
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
        }).then(response => {
          result.push(response.data.result.height);
        }).catch(error => {
          if(!error.response) {
            console.log('connection refused to avalanche client');
            res.send(JSON.parse('{"result":"connection refused to avalanche client"}'));
            return;
          } else {
            console.log(error.response.data);
            res.send(error.response.data);
            return;
          }
        });
      
        res.send(result);
    })


    /////////////////////////// BLOCKS //////////////////////////////////
    
    app.get('/blocks/hash/:hash', async function (req, res) {

      const blockFromCChain = await cChainMethods.getBlockByHashFromCChain(
        req.params.hash
      )
    
      if (blockFromCChain[0] == 1) {
        res.send(blockFromCChain[1])
      }
      res.send(blockFromCChain[1])
    
    })


    app.get('/blocks/number/:blocknumber', async function (req, res) {

      const cChainNumber = await cChainMethods.getBlockByNumberFromCChain(
        req.params.blocknumber
      )
    
      if (cChainNumber[0] == 1) {
        res.send(cChainNumber[1])
      }
      res.send(cChainNumber[0])
    
    })



    app.get('/blocks/numbers/:blocknumber/:count', async function (req, res) {

      const cChainArray = []
      let k = 0

      const blockNumber = req.params.blocknumber
      const count = req.params.count

      for (let i = blockNumber - count; i < blockNumber; ++i) {
        let hashValue = await cChainMethods.getBlockByNumberFromCChain(i)

        if (hashValue[0] == 1) {
          return hashValue[1]
        } else {
          cChainArray[k] = hashValue[1]
          k++
        }
      }

      res.send(cChainArray)
      
  })

  

  /////////////////////////// TRANSACTIONS //////////////////////////////////

    app.get('/transactions/hash/:hash', async function (req, res) {
   
  })

    app.get('/transactions/:address/:n/:x', async function (req, res) {
   
    })
    app.get('/transactions/:n/:x', async function (req, res) {
   
    })
    app.get('/transactions/recentxchain', async function (req, res) {
   
    })

    app.get('/transactions/recentpchain', async function (req, res) {
   
    })

    ///////////////////// ADDRESS ////////////////////

    app.get('/address/hash/:hash', async function (req, res) {
   
    })



};
