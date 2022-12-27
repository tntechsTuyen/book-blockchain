const tokenController = require("./controller/token.controller")

async function test(){
	const a = await tokenController.buy()
	console.log(a)
}

test()