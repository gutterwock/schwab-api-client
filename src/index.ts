// import axios = require("axios");
import readline = require("readline");
import fs = require("fs");
// import url = require("url");

const configDir: string = process.env["CONFIG_DIR"] || "./config";

const rl = readline.createInterface(
	process.stdin,
	process.stdout
);

interface AuthConfig {
	callbackUrl: string,
	clientId: string,
	clientSecret: string,
	oauthUrl: string,
};

const authConfig: AuthConfig = JSON.parse(fs.readFileSync(configDir + "/config.json").toString());

console.log(authConfig);

const main = async (outputFile: string) => {
	try {


		console.log(`Token saved to ${outputFile}`);
	} catch (err) {

	} finally {
		rl.close();
	}
};

const outputFile: string = "./config/token.json";

main(outputFile);