Exempel där en beställare vill ha en licens av 27-12345-6 och laromedelsportalen ska kontakta lararen. 

{
	clientId: "laromedia.se",
	serviceProviderId : "nok.se",
	clientOrderNumber : "2756534",
	replyToUrl: "www.laromedia.se/bolapi",
	notifyReference: true,
	isPrivatePurchase: true,

	reference: {
		name: "För Efternamn",
		email: "larare@kommun.se",
	},

	account: {
		id: "85423",
		identitySource: "client",
		schoolUnitCode: 1234567,
		organizationNumber: "21200000000",
		name: "Kommunen",
	},

	orderRows: [{
		orderRowId: "1",
		articleNumber: "9789127123456",
		quantity: 1,
		fromDate:"2020-08-15"
	}]
}