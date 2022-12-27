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
		const film = "0x3d1Fd0D36D35FD16c4884BdBD22bF987f52B9Ed3"
		const privateKey = "1f749a0ef88e6d50d07edeab51aed8210898b0304cce34304a3f1923e87af261"
		const data = await tokenService.buy(film, privateKey, "1", "1", "1", "1", Date.now())
		return data
	},
	cancel: async function(){
		const film = "0x3d1Fd0D36D35FD16c4884BdBD22bF987f52B9Ed3"
		const privateKey = "1f749a0ef88e6d50d07edeab51aed8210898b0304cce34304a3f1923e87af261"
		const data = await tokenService.cancel(film, privateKey, "1", "1", "1", "1", Date.now())
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