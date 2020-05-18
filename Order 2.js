Exempel där en beställare vill ha en licens av 27-12345-6 och laromedelsportalen ska kontakta lararen. 

{
	clientId: "laromedia.se",
	serviceProviderId : "nok.se",
	clientOrderNumber : "2751234",
	replyToUrl: "www.laromedia.se/bolapi",
	notifyReference: false,
	isPrivatePurchase: true,

	reference: {
		name: "För Efternamn",
		email: "larare@kommun.se",
	},

	account: {
		id: "12346",
		identitySource: "EGIL",
		schoolUnitCode: "7654321",
		organizationNumber: "21200000000",
		name: "Kommunen",
	},

	orderRows: [{
		orderRowId: "12345",
		articleNumber: "9789127543210",
		quantity: 18,
	},
	{
		orderRowId: "12346",
		articleNumber: "9789127543221",
		quantity: 18,
	}]
}