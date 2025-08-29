const callApi = require("../common/callApi");

const getAccountsBalances = (token) => {
	return callApi({
		method: "get",
		path: "/trader/v1/accounts",
		token,
		urlQueryParams: { fields: "positions" },
	});
};

const getAccountNumbers = (token) => {
	return callApi({
		method: "get",
		path: "/trader/v1/accounts/accountNumbers",
		token,
	});
};


module.exports = {
	getAccountsBalances,
	getAccountNumbers,
};
