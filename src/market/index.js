const callApi = require("../common/callApi");

const queryPriceHistory = (token, params) => {
	return callApi({
		method: "get",
		path: "/marketdata/v1/pricehistory",
		token,
		urlQueryParams: params
	});
};

const getQuotes = (token, symbols = [], fields = ["quote"]) => {
	return callApi({
		method: "get",
		path: "/marketdata/v1/quotes",
		token,
		urlQueryParams: {
			symbols: symbols.join(","),
			fields: fields.join(",")
		}
	});
};

module.exports = {
	getQuotes,
	queryPriceHistory
};
