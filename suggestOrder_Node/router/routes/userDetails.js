/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, quotes: 0, no-use-before-define: 0, new-cap:0 */
"use strict";

module.exports = function () {

	var async = require('async');
	var express = require('express');
	var request = require('request');
	var xsenv = require("@sap/xsenv");

	var auth64;

	var app = express.Router();
//var express = require('express');
// const correlator = require('correlation-id');
var log = require('cf-nodejs-logging-support');
 

// Set the minimum logging level (Levels: error, warn, info, verbose, debug, silly)
log.setLoggingLevel("info");	
	

// Bind to express app
app.use(log.logNetwork);	
	
	var options = {};
	options = Object.assign(options, xsenv.getServices({
		api: {
			name: "SUGGEST_ORDER_APIM_CUPS"
		}
	}));

	var xsenv = require('@sap/xsenv');
	
	
	

	var uaaService = xsenv.getServices({
		uaa: {
			tag: "xsuaa"
		}
	});

	

	var xsuaaCredentials = uaaService.uaa;
	if (!xsuaaCredentials) {
		logger.error('uaa service not found');
		res.status(401).json({
			message: "uaa service not found"
		});
		//util.callback(new Error("uaa service not found"), res, "uaa service not found");
		return;
	}

	var uname = options.api.user,
		pwd = options.api.password,
		url = options.api.host,
		APIKey = options.api.APIKey,
		client = options.api.client;

	auth64 = 'Basic ' + new Buffer(uname + ':' + pwd).toString('base64');

	var reqHeader = {
		"Authorization": auth64,
		"Content-Type": "application/json",
		"APIKey": APIKey,
		"x-csrf-token": "Fetch"
	};

	app.use(function (req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});

	// session information. 
	app.get('/sessioninfo', function (req, res) {
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});
		
		
			return res.type("text/plain").status(200).send(JSON.stringify(req));
		// res.end(JSON.stringify({
		// 	userEncoded: encodeURI(JSON.stringify(req))
		// }));

	});



	app.get("/currentScopesForUser", (req, res) => {
			var xsAppName = xsuaaCredentials.xsappname;

	
	
		var parsedData = JSON.stringify(req.authInfo.userAttributes);
		var obj_data = JSON.parse(parsedData);

		let legacyDealerCode;
		try {
			legacyDealerCode = obj_data.DealerCode[0];
			var legacyDealerCodeAvailable = true;
			
					req.logMessage("info", "currentScopes for User Requested");
		    		req.logMessage("info", 'Dealer code from the SAML Token is', legacyDealerCodeAvailable, legacyDealerCode);
		} catch (e) {
			req.logMessage("info", "Dealer Code is blank or is a local testing run");
				// return;
			var legacyDealerCodeAvailable = false;
		}

		var scopeData = req.authInfo.scopes;

		var sendUserData = {
			"loggedUserType": []
		};

		var SCOPE = xsuaaCredentials.xsappname;
		req.logMessage("info", 'The app name', SCOPE);
			req.logMessage("info", 'Scope Data length', scopeData.length);
        var viewSuggestOrder = false;
        
        		for (var i = 0; i < scopeData.length; i++) {
                      console.log("scope Data to be analyzed",  scopeData[i])
        
        		}
		for (var i = 0; i < scopeData.length; i++) {

			req.logMessage("info", 'inside For loop with iteration',  i, scopeData[i] );   

			if (scopeData[i] == xsuaaCredentials.xsappname + '.Manage_Suggest_Order_Requests') {
				var userType = "DealerUser";
				sendUserData.loggedUserType.push(userType);
 
             req.logMessage("info", "usertype", userType )
				return res.type("text/plain").status(200).send(JSON.stringify(sendUserData));
				break;
			}
			if (scopeData[i] == xsuaaCredentials.xsappname  + ".View_Suggest_Order_Requests") {
				viewSuggestOrder = true;
			}
 //suggestOrder!t1188.View_Suggest_Order_Requests
			// if ((scopeData[i] == xsuaaCredentials.xsappname + '.View_Suggest_Order_Requests') && !(scopeData[i] == xsuaaCredentials.xsappname + '.Manage_Suggest_Order_Requests')) {

			// 	var zone = obj_data.Zone
			// 	if (zone != null) {
			// 		sendUserData.loggedUserType.push("Zone_User");
			// 	} else {
			// 		sendUserData.loggedUserType.push("TCI_User");
			// 	}

			// 	// var userType = "internalUser";
			// 	//sendUserData.loggedUserType.push(userType);

			// 	return res.type("text/plain").status(200).send(JSON.stringify(sendUserData));
			// 	break;

			// }

		}; // enf for for loop. 
		
		
		
		
				if (viewSuggestOrder == true ) {
			 
			 	var zone = obj_data.Zone
				if (zone != null) {
					sendUserData.loggedUserType.push("Zone_User");
				} else {
					sendUserData.loggedUserType.push("TCI_User");
				}

			sendUserData.loggedUserType.push(userType);

			return res.type("text/plain").status(200).send(JSON.stringify(sendUserData));

		}
		


	});
	
	
	

	app.get("/currentScopesForUserLocaltesting", (req, res) => {

		var sendUserData = {
			"loggedUserType": []
		};

		var userType = "TCI_User";
		sendUserData.loggedUserType.push(userType);

		return res.type("text/plain").status(200).send(JSON.stringify(sendUserData));

	});

	//the below route for local testing. 

	app.get("/attributesforlocaltesting", (req, res) => {

		var receivedData = {};

		var sendToUi = {
			"attributes": [],
			"samlAttributes": [],
			legacyDealer: "",
			legacyDealerName: ""

		};

		// ===================only for local testing - remove next deploy
		var obj_temp = {
			Language: ['English', 'English'],
			UserType: ['National', 'National'],
			DealerCode: [' ', ' ']
		};
		// req.logMessage("info", req.authInfo.userAttributes);
		var parsedData = JSON.stringify(obj_temp);
		//		 req.logMessage("info", 'After Json Stringify', parsedData);
		var obj_parsed = JSON.parse(parsedData);
		sendToUi.samlAttributes.push(obj_parsed);

		// =========================================

		//	var parsedData = JSON.stringify(req.authInfo.userAttributes);

		//	var obj = JSON.stringify(req.authInfo.userAttributes);
		//		var obj_parsed = JSON.parse(obj);
		var csrfToken;
		var obj_data = JSON.parse(parsedData);
		var csrfToken;
		var samlData = parsedData;

		//	req.logMessage("info", 'saml data', samlData);

		//		req.logMessage("info", 'send to ui data', sendToUi);

		let checkSAMLDetails;
		try {
			checkSAMLDetails = obj_data.DealerCode[0];
		} catch (e) {

			// return;
			var nosamlData = true;
		}
		sendToUi.samlAttributes.push(obj_parsed);

		var userType = obj_data.UserType[0];

		if (userType == 'Dealer') {
			var legacyDealer = obj_data.DealerCode[0];
		}

		//	if  usertype eq dealer then just get the details for that dealer,  otherwise get everything else

		if (userType == 'Dealer') {

			var url1 = "/API_BUSINESS_PARTNER/A_BusinessPartner/?$format=json&$filter=SearchTerm2 eq'" + legacyDealer +
				"' &$expand=to_Customer&$format=json&?sap-client=" + client;

		} else {

			var url1 = "/API_BUSINESS_PARTNER/A_BusinessPartner/?$format=json&$expand=to_Customer&?sap-client=" + client +
				"&$filter=(BusinessPartnerType eq 'Z001' or BusinessPartnerType eq 'Z004' or BusinessPartnerType eq 'Z005') and zstatus ne 'X' &$orderby=BusinessPartner asc";

		}

		request({
			url: url + url1,
			headers: reqHeader

		}, function (error, response, body) {

			var attributeFromSAP;
			if (!error && response.statusCode == 200) {
				csrfToken = response.headers['x-csrf-token'];

				var json = JSON.parse(body);
				// req.logMessage("info", json);  // // TODO: delete it Guna

				for (var i = 0; i < json.d.results.length; i++) {

					receivedData = {};

					var BpLength = json.d.results[i].BusinessPartner.length;
					receivedData.BusinessPartnerName = json.d.results[i].OrganizationBPName1;
					receivedData.BusinessPartnerKey = json.d.results[i].BusinessPartner;
					receivedData.BusinessPartner = json.d.results[i].BusinessPartner.substring(5, BpLength);
					receivedData.BusinessPartnerType = json.d.results[i].BusinessPartnerType;
					receivedData.SearchTerm2 = json.d.results[i].SearchTerm2;

					let attributeFromSAP;
					try {
						attributeFromSAP = json.d.results[i].to_Customer.Attribute1;
					} catch (e) {

						// return;
					}

					switch (attributeFromSAP) {
					case "01":
						receivedData.Division = "10";
						receivedData.Attribute = "01"
						break;
					case "02":
						receivedData.Division = "20";
						receivedData.Attribute = "02"
						break;
					case "03":
						receivedData.Division = "Dual";
						receivedData.Attribute = "03"
						break;
					case "04":
						receivedData.Division = "10";
						receivedData.Attribute = "04"
						break;
					case "05":
						receivedData.Division = "Dual";
						receivedData.Attribute = "05"
						break;
					default:
						receivedData.Division = "10"; //  lets put that as a toyota dealer
						receivedData.Attribute = "01"

					}

					if ((receivedData.BusinessPartner == legacyDealer || receivedData.SearchTerm2 == legacyDealer) && (userType == 'Dealer')) {
						sendToUi.legacyDealer = receivedData.BusinessPartner,
							sendToUi.legacyDealerName = receivedData.BusinessPartnerName
						sendToUi.attributes.push(receivedData);
						break;
					}

					if (userType == 'Dealer') {
						continue;
					} else {
						sendToUi.attributes.push(receivedData);
					}
				}

				res.type("application/json").status(200).send(sendToUi);

			} else {

				var result = JSON.stringify(body);
				res.type('application/json').status(400).send(result);
			}
		});

	});

	app.get("/attributes", (req, res) => {
		req.logMessage("info", "attributes fetch started")

		var receivedData = {};

		var sendToUi = {
			"attributes": [],
			"samlAttributes": [],
			legacyDealer: "",
			legacyDealerName: ""

		};

		req.logMessage("info", req.authInfo.userAttributes);
		var parsedData = JSON.stringify(req.authInfo.userAttributes);
		req.logMessage("info", 'After Json Stringify', parsedData);

		var obj = JSON.stringify(req.authInfo.userAttributes);
		var obj_parsed = JSON.parse(obj);
		var csrfToken;
		var obj_data = JSON.parse(parsedData);
		var csrfToken;
			var samlData = parsedData;

		req.logMessage("info", 'saml data', samlData);

		req.logMessage("info", 'send to ui data', sendToUi);

		let checkSAMLDetails;
		try {
			checkSAMLDetails = obj_data.DealerCode[0];
		} catch (e) {
			req.logMessage("info", "Dealer Code is blank or is a local testing run")
				// return;
			var nosamlData = true;
		}

		sendToUi.samlAttributes.push(obj_parsed);

        var userAttributes = req.authInfo.userAttributes;
        
        var userType = userAttributes.UserType[0];
        
		req.logMessage("info", 'after json Parse', obj_data);
	//	var userType = obj_data.UserType[0];

		if (userType == 'Dealer') {
			var legacyDealer = obj_data.DealerCode[0];
		}

		if (userType == 'Zone') { 
		  var tempUSerType = 'Zone';
			//var zoneToWhichUSerBelongs = samlData.Zone[0];
				var zoneToWhichUSerBelongs = userAttributes.Zone[0];
		}

		req.logMessage("info", 'Dealer Number logged in and accessed parts Availability App', legacyDealer);

		//	if  usertype eq dealer then just get the details for that dealer,  otherwise get everything else

		if (userType == 'Dealer') {

			var url1 = "/API_BUSINESS_PARTNER/A_BusinessPartner/?$format=json&$filter=SearchTerm2 eq'" + legacyDealer +
				"' &$expand=to_Customer&$format=json&?sap-client=" + client;

		} else {
                       	req.logMessage("info", 'Logged in User Type outside', userType);
			if (tempUSerType == 'Zone') {
                 
				// he is a zone user.            	
				var userZone;
				switch (zoneToWhichUSerBelongs) {
				case "1":
					userZone = "1000";
					break;
				case "2":
					userZone = "2000";
					break;
				case "3":
					userZone = "3000";
					break;
				case "4":
					userZone = "5000";
					break;
				case "5":
					userZone = "4000";
					break;
				case "7":
					userZone = "9000";
					break;

				default:

				}

                	req.logMessage("info", 'Logged in User Zone before the API Url', userZone);
                	
                				url1 = "/API_BUSINESS_PARTNER/A_BusinessPartner?sap-client=" + client + "&$format=json" +
				"&$expand=to_Customer/to_CustomerSalesArea&$filter=(BusinessPartnerType eq 'Z001' or BusinessPartnerType eq 'Z004' or BusinessPartnerType eq 'Z005') and zstatus ne 'X'" + "&$orderby=BusinessPartner asc";
                	
				// var url1 = "/API_BUSINESS_PARTNER/A_BusinessPartner/?$format=json&$expand=to_Customer&?sap-client=" + client +
				// 	"&$filter=(BusinessPartnerType eq 'Z001' or BusinessPartnerType eq 'Z004' or BusinessPartnerType eq 'Z005') and zstatus ne 'X' &$orderby=BusinessPartner asc";

			} else {
				
					req.logMessage("info", 'Logged in User just before internal user call', userType);

				var url1 = "/API_BUSINESS_PARTNER/A_BusinessPartner/?$format=json&$expand=to_Customer&?sap-client=" + client +
					"&$filter=(BusinessPartnerType eq 'Z001' or BusinessPartnerType eq 'Z004' or BusinessPartnerType eq 'Z005') and zstatus ne 'X' &$orderby=BusinessPartner asc";
			}
		}
		req.logMessage("info", 'Final url being fetched', url + url1);
		request({
			url: url + url1,
			headers: reqHeader

		}, function (error, response, body) {

			var attributeFromSAP;
			if (!error && response.statusCode == 200) {
				csrfToken = response.headers['x-csrf-token'];

				var json = JSON.parse(body);
				// req.logMessage("info", json);  // // TODO: delete it Guna
				
				

				for (var i = 0; i < json.d.results.length; i++) {
					
			    	// req.logMessage("info", 'Json from SAP sales office', json.d.results[i].SalesOffice); 
			    	// req.logMessage("info", 'Business Partner', json.d.results[i].BusinessPartner);
			    	// 	req.logMessage("info", 'User Zone from SAML', userZone); 
			    	// req.logMessage("info", 'User Type from SAML', userType); 
			    	
			    		if (userType != 'Dealer') {
							      	if (json.d.results[i].to_Customer) {
							    		if (json.d.results[i].to_Customer.to_CustomerSalesArea.results){
							    		var salesOfficeFromSAP = json.d.results[i].to_Customer.to_CustomerSalesArea.results[0].SalesOffice;
							    		}
							    	} else {
							    	       
							    	    	continue;
							    	    
							    	}
			    		}	    	
					
					// if ( (userType == 'Zone' ) 	&& (json.d.results[i].SalesOffice != userZone) ){
					if ( (userType == 'Zone' ) 	&& (salesOfficeFromSAP != userZone) ){
				// if ( (userType == 'Zone' ) 	&& (json.d.results[i].to_Customer.to_CustomerSalesArea.results[0].SalesOffice != userZone) ){			
					
						continue;
					} else {
 

					receivedData = {};

					var BpLength = json.d.results[i].BusinessPartner.length;
					receivedData.BusinessPartnerName = json.d.results[i].OrganizationBPName1;
					receivedData.BusinessPartnerKey = json.d.results[i].BusinessPartner;
					receivedData.BusinessPartner = json.d.results[i].BusinessPartner.substring(5, BpLength);
					receivedData.BusinessPartnerType = json.d.results[i].BusinessPartnerType;
					receivedData.SearchTerm2 = json.d.results[i].SearchTerm2;

					let attributeFromSAP;
					try {
						attributeFromSAP = json.d.results[i].to_Customer.Attribute1;
					} catch (e) {
						req.logMessage("info", "The Data is sent without Attribute value for the BP", json.d.results[i].BusinessPartner)
							// return;
					}

					switch (attributeFromSAP) {
					case "01":
						receivedData.Division = "10";
						receivedData.Attribute = "01"
						break;
					case "02":
						receivedData.Division = "20";
						receivedData.Attribute = "02"
						break;
					case "03":
						receivedData.Division = "Dual";
						receivedData.Attribute = "03"
						break;
					case "04":
						receivedData.Division = "10";
						receivedData.Attribute = "04"
						break;
					case "05":
						receivedData.Division = "Dual";
						receivedData.Attribute = "05"
						break;
					default:
						receivedData.Division = "10"; //  lets put that as a toyota dealer
						receivedData.Attribute = "01"

					}

					if ((receivedData.BusinessPartner == legacyDealer || receivedData.SearchTerm2 == legacyDealer) && (userType == 'Dealer')) {
						sendToUi.legacyDealer = receivedData.BusinessPartner,
							sendToUi.legacyDealerName = receivedData.BusinessPartnerName
						sendToUi.attributes.push(receivedData);
						break;
					}

					if (userType == 'Dealer') {
						continue;
					} else {
						sendToUi.attributes.push(receivedData);
					}
				}
				}
				res.type("application/json").status(200).send(sendToUi);
				req.logMessage("info", 'Results sent successfully');
			} else {

				var result = JSON.stringify(body);
				res.type('application/json').status(400).send(result);
			}
		});

	});

	return app;
};