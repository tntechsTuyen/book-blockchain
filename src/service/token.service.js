const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');
const promisify = require("../utils/promisify.config")
require('dotenv').config()

// Get Path and Load Contract
const source = fs.readFileSync('./contracts/Film.sol', 'utf8');


// Compile Contract
const input = {
   language: 'Solidity',
   sources: {
      'Film.sol': {
         content: source,
      },
   },
   settings: {
      outputSelection: {
         '*': {
            '*': ['*'],
         },
      },
   },
};
const solcData = solc.compile(JSON.stringify(input));
const tempFile = JSON.parse(solcData);
const contractFile = tempFile.contracts['Film.sol']['Film'];

const web3 = new Web3(process.env.WEB3_RPC); //Change to correct network

const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;
const service = {
   info: function(){
      return web3;
   },
   deploy: async function(id, price){
      const incrementer = new web3.eth.Contract(abi);

      // Create Constructor Tx
      const incrementerTx = await incrementer.deploy({data: bytecode,arguments: [id, price]})

      // Sign Transacation and Send
      const createTransaction = await web3.eth.accounts.signTransaction({data: incrementerTx.encodeABI(),gas: await incrementerTx.estimateGas()},process.env.OWNER_PRIVATE_KEY)
      console.log(await incrementerTx.estimateGas());

      const createReceipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction)
      return {
         "id": id*1,
         "wallet_address": process.env.OWNER_ADDRESS, 
         "wallet_private_key": "", 
         "contract_address": createReceipt['contractAddress'],
         "transaction_hash": createReceipt['transactionHash']
      };
   }
}

module.exports = service