const tokenService = require("../service/token.service")

const controller = {
	info: async function(){
		return tokenService.info()
	},
	deploy: async function(){
		const data = await tokenService.deploy(1, 1000)
		return data
	}
}

module.exports = controller