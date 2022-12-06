const tokenService = require("../service/token.service")

const controller = {
	info: async function(){
		return tokenService.info()
	},
	deploy: async function(){
		const data = await tokenService.deploy(1, 1000)
		return data
	},
	createWallet: async function(){
		const data = await tokenService.createWallet()
		return data
	},
	buy: async function(){
		const film = "0x1E63749E1714Fe779a51a2242AD445d8e1D6e709"
		const buyer = "0xd331ACFc0518E095dE8313F3C4AFdcd337B373d3"
		const data = await tokenService.buy(film, buyer, "1", "1", "1", "1", Date.now())
		return data
	},
	cancel: async function(){
		const film = "0x1E63749E1714Fe779a51a2242AD445d8e1D6e709"
		const buyer = "0xd331ACFc0518E095dE8313F3C4AFdcd337B373d3"
		const data = await tokenService.cancel(film, buyer, "1", "1", "1", "1", Date.now())
		return data
	},
	charge: async function(){
		const data = await tokenService.charge("0xd331ACFc0518E095dE8313F3C4AFdcd337B373d3", 3000)
		return data
	},
	chargeHistory: async function(){
		const data = await tokenService.chargeHistory("0xd331ACFc0518E095dE8313F3C4AFdcd337B373d3")
		return data
	},
	buyHistory: async function(){
		const data = await tokenService.buyHistory("0xd331ACFc0518E095dE8313F3C4AFdcd337B373d3")
		return data
	}
}

module.exports = controller