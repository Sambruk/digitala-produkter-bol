

# API för Beställning och Leverans

##  Bakgrund  
Gruppen Beställning och Leverans har haft uppdraget att ta fram en serie av API:er som gör det möjligt för webbshopar och läromedelsproducenter att prata med varandra, samt förenkla hanteringen av licenser efter att köpet har genomförts.

Den första versionen består av tre API:er: Beställning, Tilldelning och Statistik.

**[1. Order](#1-order)**: Används av webbshopen för att anropa läromedelsproducenten och berätta hur många av en viss licens som köpts in av en viss kund.

**[2. Tilldelning](#2-tilldelning)**: Efter att köpet har genomförts kan en beställare använda en licensportal för att göra en tilldelning. Licensportalen kan sitta ihop med webbshopen eller vara fristående. En tilldelning går ut på att beställaren skickar information från licensportalen till läromedelsproducenten om vilka som ska använda licenserna.

**[3. Statistik](#3-statistik)**: En licensportal kan hämta statistik från läromedelsproducenter och kan presentera hur många licenser som köpts in och hur många som faktiskt använts. Man kan även se när licenserna går ut för att planera nya inköp och se över sina behov.

Exempelfiler finns att tillgå via GitHub tillsammans med dokumentationen.

# 1. Order

## Anrop från webbshop

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
		address: "",
		postalCode: "",
		city: "",
		country: ""
	},

	orderRows: [{
		orderRowId: "",
		articleNumber: "",
		quantity: 1,
		fromDate:"",
		duration: 12,
		durationUnit: "M",
		discountPercent:"",
		discountCode:"",
		EndCustomerOrderNumber:"",
		articleCampaignPrice:""

	}]
}
```

| Egenskap | Typ | Obligatorisk | Förklaring |
| --- | --- | --- | --- |
| clientId | string | x | Klientens id, t.ex. goteborgsregionen.se |
| serviceProviderId | string | x | Tjänsteleverantörs id, t.ex. nok.se |
| siteId | number |  | Id på avdelning/sida hos tjänsteleverantör |
| clientOrderNumber | string | x | Klientens ordernummer |
| replyToUrl | string | x | Den adress som ska användas om tjänsteleverantören inte kan svara direkt |
| notifyReference | bool |  | Om inte klienten har en licensportal kan man sätta till true så levererar tjänsteleverantören direkt till beställaren |
| deliveryLocation | string |  | Plattform dit licens ska levereras | 
| isPrivatePurchase | bool | | True ifall det är en privatperson som beställer |
| reference | object | | Namn och epost på den som har beställt licensen. Ifall notifyReference är satt till true så är det den personen som är mottagaren av licensen |
| reference.name | string | | Namnet på beställaren |
| reference.email | string | | Beställarens epost |
| account | object | x | Beställande organisationen, oftast en skolenhet |
| account.id | string | x | Den beställande organisationens id hos klienten, t.ex. ett kundnummer |
| account.identitySource | string | x | Anger vilket typ av id det är som kommer. Om det t.ex. är klientens kundnummer så kan värdet vara client |
| account.schoolUnitCode | string |  | Skolenhetskod om det är en skolenhet som beställer |
| account.organizationNumber | string | x | Organisationsnummer på beställaren |
| account.name | string | x | Namnet på skolenheten |
| account.address | string |  | Gatuadress |
| account.postalCode | string |  | Postnummer |
| account.city | string |  | Postort |
| account.country | string |  | Landskod (ISO 3166) |
| orderRows | array | x| De artiklar som ska beställas |
| orderRows.orderRowId | string | x | Radens id, används för att koppla ihop fråga med svar |
| orderRows.articleNumber | string | x | Tjänsteleverantörens id på den artikel som ska köpas |
| orderRows.quantity | number | x | Hur många som ska köpas |
| orderRows.fromDate | date | | Från och med när beställningen ska börja gälla. Kan användas ifall licensen börjar gälla direkt vid beställning. Valfritt att skicka med. Om leverantören stödjer så borde de svara med backordered och skicka med datumet i restnotering. Stödjer tjänsteleverantören inte så borde de svara med canceled |

| orderRows.duration | number |  | Antal för längd på licens (heltal) |
| orderRows.durationUnit | number |  | enhet för längd på licens enligt ISO-8601: D (Days) W (Weeks), M (Months), Y (Years) |
| orderRows.discountPercent | number |  |Siffra med hur många procent rabatt som ska gälla på denna orderrad om den avviker från det normala. Bör följas av en kod nedan|
| orderRows.discountCode | string |  | Kod som hör ihop med discountPercent. Kan användas för kampanjer eller speciella erbjudanden mot en specifik kund |
| orderRows.endCustomerOrderNumber | string |  | Slutkunds ordernummer. Kan användas för att skicka med slutkundens ordernummer/referens. Användbart om slutkunden använder sig av en inköpsportal |
| orderRows.articleCampaignPrice | number |  | Om priset avviker från listpris. Kan användas vid offertköp eller kampanjer. |

### Värdelistor till orderanropet
| identitySource | Förklaring |
| --- | --- |
| client | Licensportalens egna id |
| EGIL | EGIL-klientens id = kommunens egna id? |
| Google | Google-id |
| Microsoft | Microsoft-id |

## Svar från läromedelsproducent

Tjänsteleverantören ska svara klienten i anropet. Vid t.ex. restnoteringar kan tjänsteleverantören anropa klienten till den url som klienten angav i replyToUrl. I bägge fallen är det samma värden som skickas i meddelandet. 

Vid asynkrona svar ska endast uppdaterade rader skickas med. Statusen "Delivered" ska anses vara slutgiltig och behöver således inte skickas med igen.

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

| Egenskap | Typ | Obligatorisk | Förklaring |
| --- | --- | --- | --- |
| clientId | string | x | Klientens id, t.ex. goteborgsregionen.se |
| serviceProviderId | string | x | Tjänsteleverantörs id, t.ex. nok.se |
| clientOrderNumber | string | x | Klientens ordernummer. Ska vara samma skickades med i anropet |
| orderRows | array | x | De artiklar som har beställts |
| orderRows.orderRowId | string | x | Radens id, ska vara samma som klienten skickade med i anropet |
| orderRows.articleNumber | string | x | Tjänsteleverantörens id på den artikel som ska köpas |
| orderRows.quantity | number | x | Hur många som ska köpas. För verifiering bör vara samma som i anropet |
| orderRows.unitPrice | number | | Styckpriset (inkl. eventuella rabatter). Valfritt att skicka med |
| orderRows.discountPercent | number | | Vilken rabatt klienten får enligt avtal |
| orderRows.vatPercent | number | | Hur mycket moms som betalas för artikeln |
| orderRows.status | string | x | Kan vara beingProcessed, backordered, delivered eller canceled. Förklaras längre ner |
| orderRows.errorMessage | string | | Valfritt, vid annuleringar kan man skicka med ett felmeddelande |
| orderRows.deliveryDate | string | | Vid restnotering, leveransdatum |
| orderRows.licenseKeys | array | * | De licensnycklar som man ska använda vid tilldelning. En array av strängar. Har man beställt 10 så ska arrayen innehålla 10 nycklar |

\* = licensnycklar är obligatoriska om statusen är delivered och klienten anropade med notifyUser = false.
### Värdelistor till ordersvaret
| Status | Förklaring |
| --- | --- |
| beingProcessed | Köpet hanteras av tjänsteleverantören. Om tjänsteleverantören svarar med den här statusen förväntar sig klienten att få ett nytt anrop till replyToUrl vid ett senare tillfälle. |
| backordered | Restnoterad, tjänsteleverantören kan skicka med ett förväntat leveransdatum i deliveryDate. På samma sätt som i beingProcessed så förväntar sig klienten att få ett anrop till replyToUrl. |
| delivered | Köpet har gått igenom då förväntar sig klienten att hitta nycklarna som kan användas vid tilldelningen i licenseKeys  |
| canceled | Annulerad, köpet har inte gått igenom. Tjänsteleverantören kan skicka med mer detaljerad information i errorMessage |

## Exempelfiler

### Order 1.js
En beställning av 1 exemplar till en privatperson som ska börja användas i augusti. En förutsättning är att mottagaren kan hantera fromDate. Mottagaren ska meddela beställaren att produkten finns att använda.

Ordersvaret (Ordersvar 1.js) visar att köpet gick igenom, men att det fortsatt behandlas av mottagaren. Förväntat leveransdatum är satt till 2020-08-15 som önskat.

### Order 2.js
En beställning med två produkter med 18st licenser av varje där tilldelning ska genom en licensportal och licenserna ska aktiveras direkt. Webbshoppen ska efter ett lyckat köp meddela licensportalen att tilldelning ska ske (hur detta ska ske är inte specificerat).

Ordersvaret (Ordersvar 2.js) visar att tilldelning är redo och kan tilldelas via portalen. 

# 2. Tilldelning

## Anrop från licensportal

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

| Egenskap | Typ | Obligatorisk | Förklaring |
| --- | --- | --- | --- |
| clientId | string | x | Klientens id, t.ex. goteborgsregionen.se |
| serviceProviderId | string | x | Tjänsteleverantörs id, t.ex. nok.se |
| replyToUrl | string | x | Den adress som ska användas om tjänsteleverantören inte kan svara direkt |
| action | string | x | Assign (tilldela) eller Unassign (fråndela) |
| account | object | x | Beställande organisationen, oftast en skolenhet |
| account.id | string | x | Den beställande organisationens id hos klienten, t.ex. ett kundnummer |
| account.identitySource | string | x | Anger vilket typ av id det är som kommer. Om det t.ex. är klientens kundnummer så kan värdet vara client |
| account.schoolUnitCode | string |  | Skolenhetskod om det är en skolenhet som beställer |
| account.organizationNumber | string | x | Organisationsnummer på beställaren |
| account.name | string | x | Namnet på skolenheten |
| assignmentRows| array | x | Tilldelningarna |
| assignmentRows.user| object | x | Den användarens som ska använda en licens |
| assignmentRows.user.id| string | x | Användarens id |
| assignmentRows.user.identitySource | string | x | Källan till användarens id |
| assignmentRows.licenseKey| string | x | Licensnyckeln, en av de nycklar som tjänsteleverantören svarade med på köpet  |
| assignmentRows.assignedByGroups| array | | De grupper som en användare blev tilldelad genom. Tilldelningen är individuell men klienten kan skicka med information om grupptillhörighet och tjänsteleverantören kan välja att använda den i sin miljö |
| assignmentRows.assignedByGroups.identitySource| string |  | Källan till användarens id. |
| assignmentRows.assignedByGroups.id| string | x | Gruppens id |
| assignmentRows.assignedByGroups.groupName| string | x | Gruppens namn |

## Svar från läromedelsproducent

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
### Värden

| Egenskap | Typ | Obligatorisk | Förklaring |
| --- | --- | --- | --- |
| clientId | string | x | Klientens id, t.ex. goteborgsregionen.se |
| serviceProviderId | string | x | Tjänsteleverantörs id, t.ex. nok.se |
| assignmentRows| array | x | Raderna som har hanterats |
| assignmentRows.user| object | x | Användaren som har fått en licens |
| assignmentRows.user.identitySource| string | x | Källan för användarens id |
| assignmentRows.user.id| string | x | Användarens id |
| assignmentRows.licenseKey| string | x | Licensnyckeln som har tilldelats|
| assignmentRows.status| string | x | beingProcessed, assigned eller failed |
| assignmentRows.productUrl| string | x | Den länk som kan användas av användaren för att ta del av resursen |
| assignmentRows.errorMessage| string | | Eventuellt felmeddelande ifall tjänsteleverantören svarar med failed |

### Värdelistor från tilldelningssvaret

| Status | Förklaring |
| --- | --- |
| beingProcessed | Tilldelningen hanteras av tjänsteleverantören. Om tjänsteleverantören svarar med den här statusen förväntar sig klienten att få ett nytt anrop till replyToUrl vid ett senare tillfälle. |
| assigned | Tilldelningen är klar och tjänsten är redo att användas |
| failed | Tilldelningen har inte gått igenom. Tjänsteleverantören kan skicka med mer detaljerad information i errorMessage |
## Exempelfiler

### Tilldelning 1 Anrop.js

Enkel tilldelning utan grupptillhörighet. Tilldelning lyckas enligt svaret (Tilldelning 1 Svar.js).

### Tilldelning 2 Anrop.js

Tilldelning med hänvisning till en grupp. Tilldelningen misslyckades (Tilldelning 2 Svar.js). 

# 3. Statistik

Metod 1 levererar information om tilldelning och användning ner på individnivå och är därför att föredra. Metod 2 aggregerar data och kan användas som ett alternativ under tiden tills tjänsteleverantörer får klart API för metod 1.

## Metod 1

### Anrop

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
| Egenskap | Typ | Obligatorisk | Förklaring |
| --- | --- | --- | --- |
| clientId | string | x | Klientens id, t.ex. goteborgsregionen.se |
| serviceProviderId | string | x | Tjänsteleverantörs id, t.ex. nok.se |
| articleNumber | string | | Klienten kan skicka med ett artikelnummer för att enbart få ut statusen för just den produkten |
| user | object | | Klienten kan skicka med en användare för att enbart få ut statusen för just den användaren |
| user.identitySource| string | x | Källan för användarens id |
| user.id| string | x | Användarens id |
| account | object | x | Beställande organisationen, oftast en skolenhet |
| account.id | string | x | Den beställande organisationens id hos klienten, t.ex. ett kundnummer |
| account.identitySource | string | x | Anger vilket typ av id det är som kommer. Om det t.ex. är klientens kundnummer så kan värdet vara client |
| account.schoolUnitCode | string | x | Skolenhetskod om det är en skolenhet som beställer |
| account.OrganizationNumber | string | x | Organisationsnummer på beställaren |
| account.name | string | x | Namnet på skolenheten |

### Svar

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
| Egenskap | Typ | Obligatorisk | Förklaring |
| --- | --- | --- | --- |
| clientId | string | x | Klientens id, t.ex. goteborgsregionen.se |
| serviceProviderId | string | x | Tjänsteleverantörs id, t.ex. nok.se |
| assignedLicenses | array | x | De licenser som är tilldelade |
| assignedLicenses.user | object | x | Den användaren som har tilldelats licenser |
| assignedLicenses.user.identitySource| string | x | Användarens identity provider |
| assignedLicenses.user.id| string | x | Användarens id |
| assignedLicenses.licenseKey | object | x | Licensnyckeln som är tilldelad |
| assignedLicenses.productUrl | string |  | URL till produkten |
| assignedLicenses.used | boolean | x | True om användaren har börjat använda tjänsten |
| assignedLicenses.validFrom | date | | När licensen började gälla |
| assignedLicenses.validTo | date | | Hur länge licensen gäller |
| unassignedLicenses | array | | De licenser som inte har tilldelats ännu |
| unassignedLicenses.articleNumber | string | x | Artikelnummer på tjänsten |
| unassignedLicenses.quantity | string | x | Hur många som är otilldelade |
| unassignedLicenses.licenseKeys | array | x | De nycklar som är otilldelade |

## Metod 2

### Anrop

```javascript
{
	serviceProviderId: "",
	clientId: "",
	organizationNumbers: [""],
	schoolUnitCodes: [""]
}
```
| Egenskap | Typ | Obligatorisk | Förklaring |
| --- | --- | --- | --- |
| clientId | string | x | Klientens id, t.ex. goteborgsregionen.se |
| serviceProviderId | string | x | Tjänsteleverantörs id, t.ex. nok.se |
| organizationNumbers | array | * | Organisationsnummer på de enheter som klienten vill ha status på |
| schoolUnitCodes | array | * | Skolenhetskoder på de enheter som klienten vill ha status på |
\* Antingen organisationsnummer eller skolenhetskoder måste skickas med

### Svar

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
| Egenskap | Typ | Obligatorisk | Förklaring |
| --- | --- | --- | --- |
| clientId | string | x | Klientens id, t.ex. goteborgsregionen.se |
| serviceProviderId | string | x | Tjänsteleverantörs id, t.ex. nok.se |
| schoolUnits | array | x | De skolenheter som klienten har begärt |
| schoolUnits.schoolUnitCode | string | * | Skolenhetskoden |
| schoolUnits.organizationNumber | string | * | Organisationsnumret |
| schoolUnits.licenses | array | x | Skolenhetens licenser |
| schoolUnits.licenses.articleNumber | string | x | Artikelnummer på tjänsten  |
| schoolUnits.licenses.productUrl | string | | Länk till tjänsten |
| schoolUnits.licenses.ordered | date | | När tjänsten beställdes  |
| schoolUnits.licenses.validFrom | date | | När den började gälla  |
| schoolUnits.licenses.validTo | date | | När den slutar gälla |
| schoolUnits.licenses.totalLicenses | number | x | Hur många som beställdes |
| schoolUnits.licenses.unassignedLicenses | number | x | Hur många som är otilldelade |
| schoolUnits.licenses.assignedLicenses | number | x | Hur många som är tilldelade |
| schoolUnits.licenses.usedLicenses | number | | Hur många som har använts |
| schoolUnits.licenses.referenceName | string | | Den som beställer licensen |
\* Antingen organisationsnummer eller skolenhetskod måste skickas med

## Exempelfiler

### Statistik Metod 1 Anrop.js

Anrop för att hämta statistik gällande status på en viss licens på en viss skola. 

### Statistik Metod 2

Hämtar licenser och deras status för antingen organisationsnummer (Statistik Metod 2 Anrop med organisationsnummer.js) eller skolenhetskod (Statistik Metod 2 Anrop med skolenhetskoder.js). 

# Datum

Skickas i formatet ISO 8601 (YYYY-MM-DD) “2020-03-30”.

# Metod och autentisering

Alla anrop sker med HTTP POST om inget annat anges.

Autentisering sker med fördel via ömsesidig TLS (ex. via Moa när detta är möjligt), men kan också ske via tokens (RFC 7519) eller API-nycklar i HTTP header.
