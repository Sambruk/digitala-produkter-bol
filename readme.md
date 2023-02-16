

# API for Order and Delivery (of digital educational resources)

##  Background  
The taskforce "Beställning och Leverans" was given the assignment of developing a series of APIs that enables webshop and producers of digital educational resources to exchange data, and simplify the administration of licenses after the purchase of said licenses.


FYI: Some terms have the Swedish name in parenthesis and the file names of the sample files are still in Swedish. 

**[1. Order](#1-order)**: Used by the webshop to place an order with the producer for a specific customer.

**[2. Assignment](#2-assignment)**: After the purchase has been completed, the customer can use a license administration portal to perform an assignment. The admin portal can either be a part of the webshop or completely separate entity. To perform an assignment the license portal simply sends the information required from the license portal to the producer regarding who should be given access to which licenses.

**[3. Statistics](#3-statistics)**: A license portal can fetch data from the producers and present the customer with how many licenses that have been acquired and how many that are actually being used. The data includes information on when the licenses were purchased and when they expire.

Samples files are available via GitHub together with the most up to date information.

# 1. Order

## Call from webshop

```javascript
{
	clientId: "",
	serviceProviderId : "",
	siteId: "",
	clientOrderNumber : "",
	replyToUrl: "",
	notifyReference: true,
	deliveryLocation: "",
	isPrivatePurchase: true,

	reference: {
		name: "",
		email: "",
	},

	account: {
		id: "",
		identitySource: "",
		schoolUnitCode: "",
		organizationNumber: "",
		name: "",
	},

	orderRows: [{
		orderRowId: "",
		articleNumber: "",
		quantity: 1,
		fromDate:"",
		discountPercent:"",
		discountCode:"",
		EndCustomerOrderNumber:"",
		articleCampaignPrice:""
	}]
}
```

| Property | Type | Mandatory | Description |
| --- | --- | --- | --- |
| clientId | string | x | Webshop id, E.g. goteborgsregionen.se |
| serviceProviderId | string | x | Supplier id, E.g. nok.se |
| siteId | integer |  | Id of a certain sub-section at the supplier |
| clientOrderNumber | string | x | Customer order number |
| replyToUrl | string | x | The URL to use if the supplier needs to perform additional order replies |
| notifyReference | boolean |  | If the customer does not have a license management system this can be set to "true" and the delivery will go directly to the customers, if set to false the customer expects the license to be delivered to the license management system |
| deliveryLocation | string | Name of the license management system |
| isPrivatePurchase | boolean | | Set to true in case of a private individual and not a business transaction |
| reference | object | | Name and e-mail to the customer. In case notifyReference is set to true this is the recipient of the license |
| reference.name | string | | Customer name |
| reference.email | string | | Customer e-mail |
| account | object | x | Principal organization, commonly a school unit |
| account.id | string | x | Customer ID, e.g. account number |
| account.identitySource | string | x | Type of id. E.g. if it is the account number of the customer it should be set to "client" |
| account.schoolUnitCode | string |  | School unit code |
| account.organizationNumber | string | x | Organization number |
| account.name | string | x | Name of the school unit |
| orderRows | array | x| The articles that are being ordered |
| orderRows.orderRowId | string | x | Row ID, used to match order replys with the order |
| orderRows.articleNumber | string | x | Article number of the product being ordered |
| orderRows.quantity | number | x | Number of copies being ordered |
| orderRows.fromDate | date | | The date when the order should become active. Can be used if the license is activated at purchase. If supported, the supplier can reply with "backordered" and the date. If not supported the supplier should reply with "canceled" |
| orderRows.discountPercent | number |  | Deviating discount for this particular orderrow. Should be followed by a discount code |
| orderRows.discountCode | string |  | Code that explains the deviating discount on the row above. Can be used for campaigns or offers targeting a specific customer |
| orderRows.endCustomerOrderNumber | string |  | Customer order number. Can be used to pass along the customer order number or some other reference that could be useful to the supplier |
| orderRows.articleCampaignPrice | number |  | If the price deviates from the list price. Used with quotes or campigns. |

### Value list for Order
| identitySource | Description |
| --- | --- |
| client | Webshop prorietary id |
| EGIL | EGIL-client id |
| Google | Google-id |
| Microsoft | Microsoft-id |

## Order reply

The supplier is expected to reply directly. For backorders the supplier can make an asynchronous call to the URL specified in replyToUrl segment. Both scenarios expect to receive the same JSON (see below). 

During asynchronous  replies only order lines that have been updated should be sent. The status "Delivered" is final and can not be updated.

```javascript
{
	serviceProviderId: "",
	clientId: "",
	clientOrderNumber: "",
		
	orderRows:[{
		orderRowId:"",
		articleNumber: "",
		quantity:1,
		unitPrice: "",
		discountPercent:"",
		vatPercent:"",
		status:"",
		errorMessage: "",
		deliveryDate: "",
		licenseKeys:[""]
	}],
}

```

| Property | Type | Mandatory | Description |
| --- | --- | --- | --- |
| clientId | string | x | Webshop id, e.g. goteborgsregionen.se |
| serviceProviderId | string | x | Supplier id, t.ex. nok.se |
| clientOrderNumber | string | x | Customer order number. |
| orderRows | array | x | The articles have been ordered |
| orderRows.orderRowId | string | x | Row ID, used to match order replys with the order |
| orderRows.articleNumber | string | x | Article number of the product being ordered |
| orderRows.quantity | number | x | Number of copies accepted |
| orderRows.unitPrice | number | | Net list price |
| orderRows.discountPercent | number | | Discount percent |
| orderRows.vatPercent | number | | VAT percent |
| orderRows.status | string | x | beingProcessed, backordered, delivered or canceled. See value list below. |
| orderRows.errorMessage | string | | Used with status canceled  |
| orderRows.deliveryDate | string | | Used with status backordered |
| orderRows.licenseKeys | array | * | License keys that can be used when assigning. An array of strings. Number of licenses should be the same as the number of copies ordered |

\* = license keys are mandatory when the status is delivered and notifyUser is set to false.
### Value list order reply
| Status | Description |
| --- | --- |
| beingProcessed | The order is being handled by the supplier. Mandates a follow up call to the URL in replyToUrl. |
| backordered | The supplier can send an expected delivery date in deliveryDate. Mandates a follow up call to the URL in replyToUrl. |
| delivered | The order has been processed and the client expects to locate the license keys in the segment licenseKeys  |
| canceled | The orderline has NOT been approved. The supplier can send more detailed information in errorMessage |

## Sample files

### Order 1.js
An order for 1 copy that will be delivered to a private consumer that wants delivery in august. A prerequisite is that the supplier can handle "fromDate". The supplier should notify the customer when the order is activated.

Order reply (Ordersvar 1.js) shows the order being processed, which means it is pending approval. Expected deliver date is set to 2020-08-15 as requested.

### Order 2.js
An order containing two products with 18 copies each where assignment will be done through a license management portal and that the licenses should be delivered immediately. The delivery to the license management system is outside the scope of this work.  

Orderreply (Ordersvar 2.js) shows that assignment is possible and can be done through the system. 

# 2. Assignment

## Call from license management system

```javascript
{
	clientId:"",
	serviceProviderId: "",
	replyToUrl:"",
	action: "",

	account: {
        identitySource: "",
        id: "",
        schoolUnitCode: "",
        organizationNumber: "",
        name: "",
	},
	
	assignmentRows: [{
		user: {
			identitySource: "",
			id: ""
		},

		licenseKey: "",
		orderNumber: "",
		assignedByGroups: [{
			identitySource: "",
			id: "",
			groupName: ""
		}]
	}]
}

```

| Property | Type | Mandatory | Description |
| --- | --- | --- | --- |
| clientId | string | x | Client id, e.g. goteborgsregionen.se |
| serviceProviderId | string | x | Supplier id, e.g. nok.se |
| replyToUrl | string | x | The URL to use if the supplier needs to perform additional order replies |
| action | string | x | Assign (tilldela) or Unassign (fråndela) |
| account | object | x | Principal organization, commonly a school unit |
| account.id | string | x | Customer ID, e.g. account number |
| account.identitySource | string | x | Type of id. E.g. if it is the account number of the customer it should be set to "client" |
| account.schoolUnitCode | string |  | School unit code |
| account.organizationNumber | string | x | Organization number |
| account.name | string | x | Name of the school unit |
| assignmentRows| array | x | Array of assignments being made |
| assignmentRows.user| object | x | The user that is being assigned a license |
| assignmentRows.user.id| string | x | User ID |
| assignmentRows.user.identitySource | string | x | Source of the ID |
| assignmentRows.licenseKey| string | x | License key that was received during the order call |
| assignmentRows.assignedByGroups| array |  | The groups that a used was assigned through. The assignment is individual, but group property can also be sent if the supplier wants to use that in their system |
| assignmentRows.assignedByGroups.identitySource| string |  | Source of the group ID. |
| assignmentRows.assignedByGroups.id| string | x | Group id |
| assignmentRows.assignedByGroups.groupName| string | x | Group name |

## Reply from supplier

```javascript

{
	serviceProviderId:"",
	clientId:"",
	
	assignmentRows: [{
		user: {
			identitySource: "",
			id: ""
    	},
    
		licenseKey:"",
		status:"",
		productUrl:"",
		errorMessage:""
	}]
}

```
### Assignment reply

| Property | Type | Mandatory | Description |
| --- | --- | --- | --- |
| clientId | string | x | Client id, e.g. goteborgsregionen.se |
| serviceProviderId | string | x | Supplier id, e.g. nok.se |
| assignmentRows| array | x | Row array |
| assignmentRows.user| object | x | User that was assigned a license |
| assignmentRows.user.identitySource| string | x | Source of the user ID |
| assignmentRows.user.id| string | x | User ID |
| assignmentRows.licenseKey| string | x | License key that was assigned |
| assignmentRows.status| string | x | beingProcessed, assigned or failed |
| assignmentRows.productUrl| string | x | The link that can be used to access the resource |
| assignmentRows.errorMessage| string |  | Additional description of the failed assignment |

### Value list assignment reply

| Status | Description |
| --- | --- |
| beingProcessed | Assignment is being processed by the supplier. Mandatory for another reply to be sent at a later time. |
| assigned | Assignment is done and the service is ready to be used |
| failed | Assignment failed. More detaield information can be found in errorMessage |

## Sample files

### Assignment 1 (Tilldelning 1 Anrop.js)

Simple assignment without group property. Assignment is successful according to the reply (Tilldelning 1 Svar.js).

### Assignment 2 (Tilldelning 2 Anrop.js)

Assignment using group property. Assignment failed (Tilldelning 2 Svar.js). 

# 3. Statistics

Method 1 delivers information about assignment and use of licenses down to an individual level and is the preferred way. Method 2 aggregates data and can be used as an easier alternative to get started for the supplier, but the goal should be to implement Method 1.

## Method 1

### Call from license management system

```javascript
{
    serviceProviderId:"",
    clientId:"",
	
	articleNumber:"",
	user: {
        identitySource: "",
        id: ""
	},
	
    account: {
		identitySource: "",
        id: "",
        schoolUnitCode: "",
        organizationNumber: "",
        name: "",
	}
}
```
| Property | Type | Mandatory | Description |
| --- | --- | --- | --- |
| clientId | string | x | Client id, e.g. goteborgsregionen.se |
| serviceProviderId | string | x | Supplier id, e.g. nok.se |
| articleNumber | string |  | An article number can be specified to only get the information for that specific product |
| user | object | | A user can be specified to only get information about the licenses tied to that specific user |
| user.identitySource| string | x | Source of the user ID |
| user.id| string | x | User id |
| account | object | x | Principal organization, commonly a school unit |
| account.id | string | x | Customer ID, e.g. account number |
| account.identitySource | string | x | Type of id. E.g. if it is the account number of the customer it should be set to "client" |
| account.schoolUnitCode | string |  | School unit code |
| account.organizationNumber | string | x | Organization number |
| account.name | string | x | Name of the school unit |


### Reply

```javascript
{
    serviceProviderId:"",
    clientId:"",

    assignedLicenses: [{
        user: {
            identitySource: "",
            id: ""
        },
        licenseKey:"",
	productUrl:"",
        used:true,
        validFrom:"",
        validTo:""
    }],

    unassignedLicenses:[{
        articleNumber:"",
        quantity:10,
        licenseKeys:["", ""]
    }]
}
```
| Property | Type | Mandatory | Description |
| --- | --- | --- | --- |
| clientId | string | x | Client id, e.g. goteborgsregionen.se |
| serviceProviderId | string | x | Supplier id, e.g. nok.se |
| assignedLicenses | array | x | Licenses that have been assigned |
| assignedLicenses.user | object | x | The user that has been assigned licenses |
| assignedLicenses.user.identitySource| string | x | Source of the user ID |
| assignedLicenses.user.id| string | x | User id |
| assignedLicenses.licenseKey | object | x | License key that have been assigned |
| assignedLicenses.productUrl | string |  | URL to the product |
| assignedLicenses.used | boolean | x | true if product is in use |
| assignedLicenses.validFrom | date |  | When the license was activated |
| assignedLicenses.validTo | date |  | End date of the license period |
| unassignedLicenses | array |  | License available for assignment |
| unassignedLicenses.articleNumber | string | x | Article number |
| unassignedLicenses.quantity | string | x | Number of unassigned licenses |
| unassignedLicenses.licenseKeys | array | x | License keys that can be assigned |

## Method 2

### Call

```javascript
{
	serviceProviderId: "",
	clientId: "",
	organizationNumbers: [""],
	schoolUnitCodes: [""]
}
```
| Property | Type | Mandatory | Description |
| --- | --- | --- | --- |
| clientId | string | x | Client id, e.g. goteborgsregionen.se |
| serviceProviderId | string | x | Supplier id, e.g. nok.se |
| organizationNumbers | array | * | Organisation number of the units that the license portal requests an update to |
| schoolUnitCodes | array | * | School unit codes of the units that the license portal requests an update to |
\* Either organisation number or school unit code needs to be specified in the call.

### Reply

```javascript
{
	clientId:"",
	serviceProviderId:"",

	schoolUnits: [{
		schoolUnitCode: "",
		organizationNumber: "",
		licenses: [{
			articleNumber: "",
			productUrl: "",
			ordered: "",
			validFrom: "",
			validTo: "",
			totalLicenses: 1,
			unassignedLicenses: 0,
			assignedLicenses: 1,
			usedLicenses: 1,
			referenceName: ""
		}]
	}]
}
```
| Property | Type | Mandatory | Description |
| --- | --- | --- | --- |
| clientId | string | x | Client id, e.g. goteborgsregionen.se |
| serviceProviderId | string | x | Supplier id, e.g. nok.se |
| schoolUnits | array | x | The school unit codes that was requested |
| schoolUnits.schoolUnitCode | string | * | School unit code |
| schoolUnits.organizationNumber | string | * | Organisation number |
| schoolUnits.licenses | array | x | Array of license information |
| schoolUnits.licenses.articleNumber | string | x | Article number  |
| schoolUnits.licenses.productUrl | string | | Product link that can be used to access the product |
| schoolUnits.licenses.ordered | date | | When the license was ordered  |
| schoolUnits.licenses.validFrom | date | | When it was activated  |
| schoolUnits.licenses.validTo | date | | When it runs out |
| schoolUnits.licenses.totalLicenses | number | x | Number of licenses that have been acquired |
| schoolUnits.licenses.unassignedLicenses | number | x | Number of licenses that have not been assigned yet |
| schoolUnits.licenses.assignedLicenses | number | x | Number of licenses that have been assigned |
| schoolUnits.licenses.usedLicenses | number | | Number of licenses that have been activated |
| schoolUnits.licenses.referenceName | string | | Name of the person who acquired the licenses |


## Samples files

### Statistics 1 (Statistik Metod 1 Anrop.js)

Call for getting an update on a certain license on a certain school. 

### Statistics 2 (Statistik Metod 2)

Call for getting licenses and status update for either an entire organisation (Statistik Metod 2 Anrop med organisationsnummer.js) or school unit code (Statistik Metod 2 Anrop med skolenhetskoder.js). 

# Dates

Should be formated according to ISO 8601 (YYYY-MM-DD) “2020-03-30”.

# Method and authentication

All calls are done with HTTP POST if nothing else is specified.

Authentication is primarily done through mutual TLS (e.g. using Skolfederation Moa when possible), but can also be done via tokens (RFC 7519) or API keys in the HTTP header.
