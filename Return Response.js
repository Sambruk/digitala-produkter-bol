Example of a response to a resellers return to its digital warehouse.

{
	clientId: "gleerups.se",
	serviceProviderId:"goteborgsregionen.se",
		
	licenses: [{
		orderRowId: "64b879b1-1fdc-4a42-ae7c-b4f9b287a2cc",
		articleNumber: "9789140123456",
		status: "Ok",
		reason: "",
		licenseKey:"235572d0-a26d-4975-97f4-72e4734ff341",
		brokenRules:[]
	},{
		orderRowId: "64b879b1-1fdc-4a42-ae7c-b4f9b287a2cc",
		articleNumber: "9789140123456",
		status: "NotOk",
		reason: "Returns not allowed after 6 months.",
		licenseKey:"61893cba-5572-458b-ba91-53320be8bb44",
		brokenRules:["unassigned"]
	}]
}