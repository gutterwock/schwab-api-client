const callApi = require("../common/callApi");

const getAccountsBalances = ({ token }) => {
	return callApi({
		method: "get",
		path: "/trader/v1/accounts",
		token,
		urlQueryParams: { fields: "positions" },
	});
};

const getAccountNumbers = ({ token }) => {
	return callApi({
		method: "get",
		path: "/trader/v1/accounts/accountNumbers",
		token,
	});
};

// types: TRADE, RECEIVE_AND_DELIVER, DIVIDEND_OR_INTEREST, ACH_RECEIPT, ACH_DISBURSEMENT, CASH_RECEIPT, CASH_DISBURSEMENT, ELECTRONIC_FUND, WIRE_OUT, WIRE_IN, JOURNAL, MEMORANDUM, MARGIN_CALL, MONEY_MARKET, SMA_ADJUSTMENT
const getTransactions = ({ token, accountNumber, endDate, startDate, symbol, types }) => {
	return callApi({
		method: "get",
		path: `/trader/v1/accounts/${accountNumber}/transactions`,
		token,
		urlQueryParams: {
			endDate,
			startDate,
			symbol,
			types: types.join(","),
		}
	});
};

module.exports = {
	getAccountsBalances,
	getAccountNumbers,
	getTransactions,
};
