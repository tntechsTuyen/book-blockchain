const tokenController = require("./controller/token.controller")

async function test(){
	const a = await tokenController.buyHistory()
	console.log(a)
}

test()