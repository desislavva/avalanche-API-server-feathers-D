const dotenv = require('dotenv');

const axios = require('axios');


const cChainMethods = require('../services/c-chain')
const pChainMethods = require('../services/p-chain')
const xChainMethods = require('../services/x-chain')

const X_CHAIN = 'X'
const P_CHAIN = 'P'
const C_CHAIN = '0x'


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

      let xChainTransaction
      let cChainTransaction
      let pChainTransaction

      xChainTransaction = await xChainMethods.getTransactionByIdFromXChain(
        req.params.hash
      )
      cChainTransaction = await cChainMethods.getTransactionByHashFromCChain(
        req.params.hash
      )
      pChainTransaction = await pChainMethods.getTransactionByIdFromPChain(
        req.params.hash
      )

      if (xChainTransaction != 1) {
        res.send(xChainTransaction)
      } else if (cChainTransaction[0] != 1) {
        res.send(cChainTransaction[1])
      } else if (pChainTransaction != 1) {
        res.send(pChainTransaction)
      }
      res.send(JSON.parse(
        '{"result":"connection refused to avalanche client or api call rejected"}'))
      

    })

    app.get('/transactions/:address/:n/:x', async function (req, res) {

      let xChainTransactions
      let pChainTransactions
      let cChainTransactions

      if (req.params.address.charAt(0) == X_CHAIN) {
        xChainTransactions =
          await xChainMethods.getXTransactionsAfterNthFromAddressFromXChain(
            req.params.address,
            req.params.n,
            req.params.x
          )

        if (xChainTransactions[0] == 1) {
          res.send(xChainTransactions[1])      
          }
        return xChainTransactions[1]
      } else if (req.params.address.charAt(0) == P_CHAIN) {
          pChainTransactions =
          await pChainMethods.getXTransactionsAfterNthFromAddressFromPChain(
            req.params.address,
            req.params.n,
            req.params.x
          )

        if (pChainTransactions == 1) {
          res.send(JSON.parse(
            '{"result":"api call rejected or not enough transactions"}')
          )
        }
        res.send(pChainTransactions)

      } else if (req.params.address.slice(0, 2) == C_CHAIN) {
         cChainTransactions =
          await cChainMethods.getXTransactionsAfterNthFromAddressFromCChain(
            req.params.address,
            req.params.n,
            req.params.x
          )

          res.send(cChainTransactions)
      }
      res.send(JSON.parse('{"result":"wrong chain"}'))
    })


    app.get('/transactions/:n/:x', async function (req, res) {

      if (req.params.n > 0 && req.params.x > 0) {
        cChainTransactions =
          await cChainMethods.getXPendingTransactionsAfterNthFromCChain(
            req.params.n,
            req.params.x
          )
    
        if (cChainTransactions[0] == 1) {
          res.send(cChainTransactions[1])
        }
          res.send(cChainTransactions[1])
      }
    
      res.send(JSON.parse('{"result":"n and x < 0"}'))
   
    })


    app.get('/transactions/recentxchain', async function (req, res) {

      xChainTransaction = await xChainMethods.getRecentTransactions()

      if (xChainTransaction[0] == 1) {
        res.send(xChainTransaction[1])
      }
        res.send(xChainTransaction[1])
    
   
    })

    app.get('/transactions/recentpchain', async function (req, res) {

      pChainTransaction = await pChainMethods.getRecentTransactions()

      if (pChainTransaction[0] == 1) {
        res.send(pChainTransaction[1])
      }
        res.send(pChainTransaction[1])
   
    })

    ///////////////////// ADDRESS ////////////////////

    app.get('/address/hash/:hash', async function (req, res) {

    let addressInfoFromXChain
    let addressInfoFromCChain
    let addressInfoFromPChain

    if (req.params.hash.charAt(0) == X_CHAIN) {
      addressInfoFromXChain = await xChainMethods.getAddressInfoByHashFromXChain(
        req.params.hash
      )

      if (addressInfoFromXChain[0] == 1) {
        res.send(addressInfoFromXChain[1])    
        }
        res.send(addressInfoFromXChain)
    } else if (req.params.hash.charAt(0) == P_CHAIN) {
      addressInfoFromPChain = await pChainMethods.getAddressInfoFromPChain(
        req.params.hash
      )

      if (addressInfoFromPChain[0] == 1) {
        res.send(addressInfoFromPChain[1])      
      }
      res.send(addressInfoFromPChain[1])
    } else if (req.params.hash.slice(0, 2) == C_CHAIN) {
      addressInfoFromCChain = await cChainMethods.getAddressInfoFromCChain(
        req.params.hash
      )

      if (addressInfoFromCChain[0] == 1) {
        res.send(addressInfoFromCChain[1])
      }
      res.send(addressInfoFromCChain)
    }
    res.send(JSON.parse('{"result":"wrong input"}'))
    
      })



};
