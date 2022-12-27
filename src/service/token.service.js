const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');
const promisify = require("../utils/promisify.config")
require('dotenv').config()

// Get Path and Load Contract
const FILM = {
   abi: JSON.parse(fs.readFileSync("./contracts/film.abi.json")),
   bytecode: JSON.parse(fs.readFileSync("./contracts/film.byte.json"))
}

const VND = {
   abi: JSON.parse(fs.readFileSync("./contracts/vnd.abi.json")),
   bytecode: JSON.parse(fs.readFileSync("./contracts/vnd.byte.json"))
}
var web3 = new Web3(process.env.WEB3_RPC); //Change to correct network
var contract = new web3.eth.Contract(VND.abi, process.env.CONTRACT_ADDRESS, {from: process.env.OWNER_ADDRESS, gas: 3000000});
web3.eth.accounts.wallet.add(process.env.OWNER_PRIVATE_KEY);
web3.eth.defaultAccount = web3.eth.accounts.wallet[0].address;

const service = {
   info: function(){
      return web3;
   },
   createWallet: async function(){
      const wallet = await web3.eth.accounts.create()
      return {
         privateKey: wallet.privateKey,
         walletAddress: wallet.address
      }
   },
   importWallet: async function(privateKey){
      const wallet = await web3.eth.accounts.privateKeyToAccount(privateKey)
      return {
         privateKey: privateKey,
         walletAddress: wallet.address
      }
   },
   deploy: async function(id, price){
      //Tạo hợp đồng cho phim
      const incrementer = new web3.eth.Contract(FILM.abi);
      const incrementerTx = await incrementer.deploy({data: FILM.bytecode.object,arguments: [id, price]})
      const createTransaction = await web3.eth.accounts.signTransaction({data: incrementerTx.encodeABI(), gas: await incrementerTx.estimateGas()}, process.env.OWNER_PRIVATE_KEY)
      const createReceipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction)
      return {
         "id": id*1,
         "wallet_address": process.env.OWNER_ADDRESS, 
         "wallet_private_key": "", 
         "contract_address": createReceipt['contractAddress'],
         "transaction_hash": createReceipt['transactionHash']
      };
   },
   totalSupply: async function(){
      //Lượng cung lưu hành
      const data = await contract.methods.totalSupply().call()
      return data
   },
   balance: async function(owner){
      //Số dư
      const data = await contract.methods.balanceOf(owner).call()
      return data
   },
   charge: async function(to, amount){
      //Nạp tiền
      const data = await contract.methods.transfer(to, amount).send({from: process.env.OWNER_ADDRESS})
      return data
   },
   buy: async function(film, privateKey, cluster, cinema, room, position, timestamp){
      //Booking
      web3.eth.accounts.wallet.clear()
      web3.eth.accounts.wallet.add(privateKey);
      var tmpContract = new web3.eth.Contract(VND.abi, process.env.CONTRACT_ADDRESS, {from: web3.eth.accounts.wallet[0].address, gas: 3000000});
      web3.eth.defaultAccount = web3.eth.accounts.wallet[0].address;

      const data = await tmpContract.methods.buy(film, cluster, cinema, room, position, timestamp).send()

      web3.eth.accounts.wallet.clear()
      web3.eth.accounts.wallet.add(process.env.OWNER_PRIVATE_KEY)
      web3.eth.defaultAccount = web3.eth.accounts.wallet[0].address;
      return data
   },
   cancel: async function(film, privateKey, cluster, cinema, room, position, timestamp){
      //Cancel booking
      web3.eth.accounts.wallet.clear()
      web3.eth.accounts.wallet.add(privateKey)
      const data = await contract.methods.cancel(film, cluster, cinema, room, position, timestamp).send()
      web3.eth.accounts.wallet.clear()
      web3.eth.accounts.wallet.add(process.env.OWNER_PRIVATE_KEY)
      return data
   },
   chargeHistory: async function(owner){
      //Lịch sử nạp tiền
      const histories = await contract.getPastEvents("Transfer", {fromBlock: 0, toBlock: "latest"});
      var results = []
      histories.forEach((el, i) => {
         results.push({
            number: el.blockNumber,
            txid: el.transactionHash,
            from: el.returnValues.from,
            to: el.returnValues.to,
            value: el.returnValues.value
         })
      })
      return results
   },
   buyHistory: async function(owner){
      //Lịch sử mua vé
      const histories = await contract.getPastEvents("Buy", {fromBlock: 0, toBlock: "latest"});
      var results = []
      histories.forEach((el, i) => {
         results.push({
            number: el.blockNumber,
            txid: el.transactionHash,
            film: el.returnValues.film,
            buyer: el.returnValues.buyer,
            cluster: el.returnValues.cluster,
            cinema: el.returnValues.cinema,
            room: el.returnValues.room,
            position: el.returnValues.position,
            timestamp: el.returnValues.timestamp,
            price: el.returnValues.price
         })
      })
      return results
   },
   cancelHistory: async function(owner){
      //Lịch sử hủy vé
      const histories = await contract.getPastEvents("Cancel", {fromBlock: 0, toBlock: "latest"});
      var results = []
      histories.forEach((el, i) => {
         results.push({
            number: el.blockNumber,
            txid: el.transactionHash,
            film: el.returnValues.film,
            buyer: el.returnValues.buyer,
            cluster: el.returnValues.cluster,
            cinema: el.returnValues.cinema,
            room: el.returnValues.room,
            position: el.returnValues.position,
            timestamp: el.returnValues.timestamp,
            price: el.returnValues.price
         })
      })
      return results
   }
}

module.exports = service