const tokenController = require("./controller/token.controller")

async function test(){
	const a = await tokenController.deploy()
	console.log(a)
}

test()