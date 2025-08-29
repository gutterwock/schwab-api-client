const equityLimitOrder = ({ instruction, price, quantity, symbol }) => {
	return {
		orderType: "LIMIT", 
		session: "NORMAL", 
		price,
		duration: "DAY", 
		orderStrategyType: "SINGLE", 
		orderLegCollection: [{ 
			instruction, 
			quantity, 
			instrument: { 
			 symbol, 
			 assetType: "EQUITY" 
			} 
		}] 
	}
};

export default equityLimitOrder;
