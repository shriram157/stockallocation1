	sap.ui.define(["sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"./utilities",
		"sap/ui/core/routing/History"
	], function (BaseController, MessageBox, Utilities, History) {
		"use strict";

		return BaseController.extend("suggestOrder.controller.ProductionRequestSummary", {
			handleRouteMatched: function (oEvent) {
				var sAppId = "App5bb4c41429720e1dcc397810";

				var oParams = {};

				// add some conditions when do you want to call this 
				//	if ( this.comingFromInit == false){
					sap.ui.core.BusyIndicator.show();
				this.reqcomplete();
				//		} else {
				//set the Count because SAP cannot handle this. 

				//		}

				if (oEvent.mParameters.data.context) {
					this.sContext = oEvent.mParameters.data.context;

				} else {
					if (this.getOwnerComponent().getComponentData()) {
						var patternConvert = function (oParam) {
							if (Object.keys(oParam).length !== 0) {
								for (var prop in oParam) {
									if (prop !== "sourcePrototype") {
										return prop + "(" + oParam[prop][0] + ")";
									}
								}
							}
						};

						this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);

					}
				}

				var oPath;

				if (this.sContext) {
					oPath = {
						path: "/" + this.sContext,
						parameters: oParams
					};
					this.getView().bindObject(oPath);
				}

				// on every route matched lets set the count. 

				// this._countModels();// TODO: to be commented.

			},
			//  All my custom Modules - Begin///////////////////////////////////////////////////////////////////////////////////////

			onClickShowAllSeries: function (oEvent) {

				var showSuggestSeriesText = this._oResourceBundle.getText("SHOW_SUGGEST_SERIES"),
					showAllSeriesText = this._oResourceBundle.getText("SHOW_ALL_SERIES");

				var currentText = this.getView().byId("showAllSeriesBtn").getText();
				if (currentText == showSuggestSeriesText) {
					this.getView().byId("showAllSeriesBtn").setProperty("text", showAllSeriesText);
					this._showSuggestedQuantity();
				} else {
					this.getView().byId("showAllSeriesBtn").setProperty("text", showSuggestSeriesText);
					this._showAllSeries();
				}

			},

			_showSuggestedQuantity: function () {
				var oModelData2 = this.getView().getModel("suggestedDataModel").getData();

				for (var i = 0; i < oModelData2.length; i++) {

					//	visibleProperty

					if (oModelData2[i].suggestedVolume <= 0) {
						oModelData2[i].visibleProperty = false;
					}

				}

				var oSuggestModel = new sap.ui.model.json.JSONModel();
				oSuggestModel.setData(oModelData2);
				this.getView().setModel(oSuggestModel, "suggestedDataModel");

			},

			_showAllSeries: function () {
				var oModelData = this.getView().getModel("suggestedDataModel").getData();

				for (var i = 0; i < oModelData.length; i++) {

					if (oModelData[i].suggestedVolume <= 0) {
						oModelData[i].visibleProperty = true;
					}

				}

				var oSuggestModel = new sap.ui.model.json.JSONModel();
				oSuggestModel.setData(oModelData);
				this.getView().setModel(oSuggestModel, "suggestedDataModel");

			},

			onBusinessPartnerSelected: function (oEvent) {

				//  validate only to check the business partners from the screen.  do not allow anything else. 
				var oViewModel = this.getView().getModel("detailView");
				var selectedDataModel = this.getView().getModel("suggestedDataModel");
				if (oEvent.getParameter("\selectedItem") == null) {
					this.getView().byId("idDealerComboBox").setValueState("Error");
					oEvent.getSource().setValue("");
					oViewModel.setProperty("/enableMaterialEntered", false);
					oViewModel.setProperty("/afterMaterialFound", false);

					return;

				} else {
					this.getView().byId("idDealerComboBox").setValueState("None");
				}

				//	oViewModel.setProperty("/afterMaterialFound", false);

				//		var materialFromScreen = this.getView().byId("material_id").getValue();
				var selectedCustomerT = this.getView().byId("idDealerComboBox").getValue();

				// if (!materialFromScreen || !selectedCustomerT) {
				// 	//mandatory parameters not made
				// 	oViewModel.setProperty("/enableMaterialEntered", false);
				// 	oViewModel.setProperty("/afterMaterialFound", false);
				// } else {
				// 	oViewModel.setProperty("/enableMaterialEntered", true);
				// }

				var sSelectedDealer = oEvent.getParameter("\selectedItem").getProperty("key");
				var sSelectedDealerText = oEvent.getParameter("\selectedItem").getProperty("additionalText");
				var sSelectedText = oEvent.getParameter("\selectedItem").getProperty("text");

				this.sSelectedDealer = sSelectedDealer;
				this.sSelectedDealerText = sSelectedDealerText;
				oViewModel.setProperty("/Dealer_No", sSelectedDealer);
				oViewModel.setProperty("/Dealer_Name", sSelectedDealerText);
				//	selectedDataModel.setProperty("/Dealer_Name", sSelectedDealerText); // need this data to the stock Allocation View

				var oModelBP = this.getView().getModel("BpDealerModel");
				var aDataBP = oModelBP.getData();

				// - call this so we get the new DAta everytime the BP Data has been changed. 
				this.reqcomplete(); // TODO: Lets call this again. 

			},

			// All my custom modules - End	-//////////////////////////////////////////////////////////////////////////////////////////////	

			_onTableItemPress: function (oEvent) {

				var oBindingContextPath = oEvent.getParameter("listItem").getBindingContextPath();

				//pass the selected series to the next init event of 

				//          var selectedSeries = {
				//    selectedSeries :  selectedSeries
				//};

				//this.reqObj.selectedPO = this.selectedPO.purchaseOrderID;
				// sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(selectedSeries), 'selectedSeries');
				// this.reqObj.selectedPO = this.selectedPO.purchaseOrderID;

				// get the details on which icontab is selected. 

				var selectedKey = this.getView().byId('iconTab').getSelectedKey();
				var checkForSuggestedString = selectedKey.search("iconTabFilterSuggested");
				var checkForRequested = selectedKey.search("iconTabFilterRequested");
				var checkForAllocated = selectedKey.search("iconTabFilterAllocated");
				var whichTabClicked;

				if (checkForSuggestedString > 0) {
					whichTabClicked = "suggestedTab";
					var oBindingContext = oEvent.getParameter("listItem").getBindingContext('suggestedDataModel');
				}
				if (checkForRequested > 0) {
					whichTabClicked = "requestedTab";
					var oBindingContext = oEvent.getParameter("listItem").getBindingContext('requestedDataModel');
				}
				if (checkForAllocated > 0) {
					whichTabClicked = "allocatedTab";
					var oBindingContext = oEvent.getParameter("listItem").getBindingContext('allocatedDataModel');
				}

				var path = oBindingContext.getPath();
				var selectedData = oBindingContext.getModel().getProperty(path);
				var BpLength = this.sSelectedDealer.length;
				var bPasCustomerWantsToSee = this.sSelectedDealer.substring(5, BpLength);
				if (!this.sSelectedDealerText) {

					this.sSelectedDealerText = this.getView().getModel("detailView").getData().Dealer_Name;
				}
				var oModelDetailViewData = this.getView().getModel('detailView').getData();

				if (this.sLoggedinUserType == "DealerUser") {
					selectedData.Business_Partner_name = this.sSelectedDealerText;
				} else {
					selectedData.Business_Partner_name = bPasCustomerWantsToSee + "-" + this.sSelectedDealerText;
				}

				// selectedData.Business_Partner_name = bPasCustomerWantsToSee + "-" + this.sSelectedDealerText; //BP Name to next screen

				selectedData.Language = this.sCurrentLocale;
				selectedData.sLoggedinUserType = this.sLoggedinUserType;
				selectedData.whichTabClicked = whichTabClicked;
				selectedData.parsedtodayDate = oModelDetailViewData.parsedtodayDate;
				selectedData.windowEndDateP = oModelDetailViewData.windowEndDateP;
				selectedData.allocationIndicator = oModelDetailViewData.allocationInidcator;

				sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(selectedData), 'selectedSeries');

				//	var oBindingContext = oEvent.getParameter("listItem").getBindingContextPath();

				return new Promise(function (fnResolve) {
					this.doNavigate("StockAllocation", oBindingContext, fnResolve, "");
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});

			},
			doNavigate: function (sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
				var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
				var oModel = (oBindingContext) ? oBindingContext.getModel() : null;

				var sEntityNameSet;
				if (sPath !== null && sPath !== "") {
					if (sPath.substring(0, 1) === "/") {
						sPath = sPath.substring(1);
					}
					sEntityNameSet = sPath.split("(")[0];
				}
				var sNavigationPropertyName;
				var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;

				if (sEntityNameSet !== null) {
					sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet,
						sRouteName);
				}
				if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
					if (sNavigationPropertyName === "") {
						this.oRouter.navTo(sRouteName, {
							context: sPath,
							masterContext: sMasterContext
						}, false);
					} else {
						oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function (bindingContext) {
							if (bindingContext) {
								sPath = bindingContext.getPath();
								if (sPath.substring(0, 1) === "/") {
									sPath = sPath.substring(1);
								}
							} else {
								sPath = "undefined";
							}

							// If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
							if (sPath === "undefined") {
								this.oRouter.navTo(sRouteName);
							} else {
								this.oRouter.navTo(sRouteName, {
									context: sPath,
									masterContext: sMasterContext
								}, false);
							}
						}.bind(this));
					}
				} else {
					this.oRouter.navTo(sRouteName);
				}

				if (typeof fnPromiseResolve === "function") {
					fnPromiseResolve();
				}

			},
			_onTableItemPress1: function (oEvent) {

				var oBindingContext = oEvent.getParameter("listItem").getBindingContext();

				return new Promise(function (fnResolve) {
					this.doNavigate("StockAllocation", oBindingContext, fnResolve, "");
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});

			},
			_onTableItemPress2: function (oEvent) {

				var oBindingContext = oEvent.getParameter("listItem").getBindingContext();

				return new Promise(function (fnResolve) {
					this.doNavigate("StockAllocation", oBindingContext, fnResolve, "");
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});

			},
			_onTableItemPress3: function (oEvent) {

				var oBindingContext = oEvent.getParameter("listItem").getBindingContext();

				return new Promise(function (fnResolve) {
					this.doNavigate("StockAllocation", oBindingContext, fnResolve, "");
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});

			},
			_onButtonPress: function () {
				window.close();
				// window.top.close();
				//	this.close(); // TODO: To be revisited. 

			},
			onInit: function () {

				// initialize  local models and data calls

				var oViewModel = new sap.ui.model.json.JSONModel({
					busy: false,
					delay: 0,
					visibleForDealer: true,
					visibleForInternalUser: true,
					editAllowed: true,
					enabled: true

				});

				this.getView().setModel(oViewModel, "detailView");

				// the business partner oData calls should happen onit.
				var sLocation = window.location.host;
				var sLocation_conf = sLocation.search("webide");
				if (sLocation_conf == 0) {
					this.sPrefix = "/Suggest_Order"; // the destination
					this.attributeUrl = "/userDetails/attributesforlocaltesting";
					this.currentScopeUrl = "/userDetails/currentScopesForUserLocaltesting";
				} else {
					this.sPrefix = "";
					this.attributeUrl = "/userDetails/attributes";
					//this.attributeUrl = "/userDetails/attributesforlocaltesting";		// TODO: security not yet implemented
					this.currentScopeUrl = "/userDetails/currentScopesForUser";
					//	this.currentScopeUrl = "/userDetails/currentScopesForUserLocaltesting";// TODO: security not yet implemented
				}

				// lets set the function call to get the lanugauge from url 

				this._setTheLanguage();

				this._setTheLogo();

				//  ajax call to BP Data and Scope Data
				var oModelDetailview = this.getView().getModel("detailView");
				var that = this;
				$.ajax({
					url: this.sPrefix + this.currentScopeUrl,
					type: "GET",
					dataType: "json",
					success: function (oData) {
						// var userScopes = oData;
						// userScopes.forEach(function (data) {

						var userType = oData.loggedUserType[0];
						switch (userType) {
						case "DealerUser":

							that.sLoggedinUserType = "DealerUser";
							oModelDetailview.setProperty("/editOrderPrefix", true);
							oModelDetailview.setProperty("/loggedInUserType", "DealerUser");
							oModelDetailview.setProperty("/editAllowed", false);
							oModelDetailview.setProperty("/visibleForInternalUser", false);

							break;

						case "TCI_User":
							that.sLoggedinUserType = "TCI_User";
							oModelDetailview.setProperty("/editOrderPrefix", false);
							oModelDetailview.setProperty("/loggedInUserType", "TCI_User");
							oModelDetailview.setProperty("/editAllowed", true);
							oModelDetailview.setProperty("/visibleForInternalUser", true);

							break;
						case "Zone_User":
							that.sLoggedinUserType = "Zone_User";
							oModelDetailview.setProperty("/editOrderPrefix", false);
							oModelDetailview.setProperty("/loggedInUserType", "Zone_User");
							oModelDetailview.setProperty("/editAllowed", true);
							oModelDetailview.setProperty("/visibleForInternalUser", true);

							break;
						default:
							// raise a message, because this should not be allowed. 

						}
						that._callTheDealerFetchService();
					}

				});

				// lets handle the route matched here. 

				// ===============================================================================

			},

			_callTheDealerFetchService: function (oEvent) {
				var that = this;
				$.ajax({
					url: this.sPrefix + this.attributeUrl,
					type: "GET",
					dataType: "json",

					success: function (oData) {
						var BpDealer = [];
						var userAttributes = [];
						var oModelDetailView = this.getView().getModel("detailView");
						$.each(oData.attributes, function (i, item) {
							var BpLength = item.BusinessPartner.length;

							if (i == 0) {
								oModelDetailView.setProperty("/BusinessPartnerKey", item.BusinessPartnerKey);
								oModelDetailView.setProperty("/Dealer_No", item.BusinessPartner);
								var tempDealerText = item.BusinessPartner + " - " + item.BusinessPartnerName;
								// oModelDetailView.setProperty("/Dealer_Name", item.BusinessPartnerName);

								oModelDetailView.setProperty("/Dealer_Name", tempDealerText);
							}

							BpDealer.push({

								"BusinessPartnerKey": item.BusinessPartnerKey,
								"BusinessPartner": item.BusinessPartner, //.substring(5, BpLength),
								"BusinessPartnerName": item.BusinessPartnerName, //item.OrganizationBPName1 //item.BusinessPartnerFullName
								"Division": item.Division,
								"BusinessPartnerType": item.BusinessPartnerType,
								"searchTermReceivedDealerName": item.SearchTerm2
							});

						});

						// BpDealer.push({
						// 	"BusinessPartnerKey": "2400042120",
						// 	"BusinessPartner": "2400042120", //.substring(5, BpLength),
						// 	"BusinessPartnerName": "For local testing only", //item.OrganizationBPName1 //item.BusinessPartnerFullName
						// 	"Division": "10",
						// 	"BusinessPartnerType": "10",
						// 	"searchTermReceivedDealerName": "42120"
						// });
						// 						BpDealer.push({
						// 	"BusinessPartnerKey": "2400042193",
						// 	"BusinessPartner": "2400042193", //.substring(5, BpLength),
						// 	"BusinessPartnerName": "For local testing only", //item.OrganizationBPName1 //item.BusinessPartnerFullName
						// 	"Division": "10",
						// 	"BusinessPartnerType": "10",
						// 	"searchTermReceivedDealerName": "42193"
						// });
						// 						BpDealer.push({
						// 	"BusinessPartnerKey": "2400042120",
						// 	"BusinessPartner": "2400042120", //.substring(5, BpLength),
						// 	"BusinessPartnerName": "For local testing only", //item.OrganizationBPName1 //item.BusinessPartnerFullName
						// 	"Division": "10",
						// 	"BusinessPartnerType": "10",
						// 	"searchTermReceivedDealerName": "42120"
						// });

						that.getView().setModel(new sap.ui.model.json.JSONModel(BpDealer), "BpDealerModel");

						//	that.getModel("LocalDataModel").setProperty("/BpDealerModel", BpDealer);
						//that.getView().setModel(new sap.ui.model.json.JSONModel(BpDealer), "BpDealerModel");
						// read the saml attachments the same way 
						var dealerCode = "";
						$.each(oData.samlAttributes, function (i, item) {
							if (item.DealerCode) {
								dealerCode = item.DealerCode["0"];
							}

							userAttributes.push({
								"UserType": item.UserType["0"],
								"DealerCode": dealerCode,
								"Language": item.Language["0"]

							});

						});

						that.getView().setModel(new sap.ui.model.json.JSONModel(userAttributes), "userAttributesModel");
						// set the bp for further calls. 
						// var oModelDetailData= this.getView().getModel("detailView").getData();
						// 	 this.sSelectedDealer = oModelDetailData.BusinessPartnerKey;
						that.sSelectedDealer =
							that.getView().getModel("detailView").getProperty("/BusinessPartnerKey");

						var oDataLoaded = that.getView().getModel('userAttributesModel');
						oDataLoaded.attachRequestCompleted(that.reqcomplete());

						//	that._getTheUserAttributes();

					}.bind(this),
					error: function (response) {
						sap.ui.core.BusyIndicator.hide();
					}
				});
				this.comingFromInit = true;
				this._navigateToHandleRouteMatched(); // TODO: To be revisited. 
			},

			reqcomplete: function () {

				// call the oData service
				// =======================================================================

				//	var oSuggestOrderModel = this.getOwnerComponent().getModel("ZSD_SUGGEST_ORDER_SRV");
				//	var oGetModel = this.getModel("ZSD_SUGGEST_ORDER_SRV");  //ZCDS_SUGGEST_ORD_SUM_CDS
				// var oGetModel = this.getView().getModel("ZCDS_SUGGEST_ORD_CDS");
				// this.getModel("LocalDataModel").setProperty("/VehicleDetails", data.results[0]);
				if (!this.sSelectedDealer) {
					var oModelDetailview = this.getView().getModel("detailView");
					var oDataFromModel = oModelDetailview.getData();

					this.sSelectedDealer = oDataFromModel.BusinessPartnerKey;
				}

				var oGetModel = this.getView().getModel("ZCDS_SUGGEST_ORD_SUM_CDS");
				oGetModel.read("/ZCDS_SUGGEST_ORD_SUM", {

					urlParameters: {
						//	"$filter": "zzdealer_code eq '"+ this.dealerCode      
						//"$filter": "zzdealer_code eq '" + 2400042193 + "' "
						"$filter": "zzdealer_code eq '" + this.sSelectedDealer + "' "
					},

					success: function (oData) {

						//first get count model and then call the 
						var oViewSuggestData = [];
						var oViewRequestedData = [];
						var oViewAllocatedData = [];
						var oModel = this.getView().getModel("detailView");
						var order_Number = "";
						var orderNumber;
						var countForSuggested, countForRequested;

						//                var timeForBanner  ;	
						$.each(oData.results, function (i, item) {
							if ((item.zzdlr_ref_no == "") || (item.zzdlr_ref_no == undefined)) {
								order_Number = "XXXXXX";
							}

							// Suggested Data
							oViewSuggestData.push({

								series: item.zzmoyr + "-" + item.zzseries_desc_en,
								orderPrefix: item.zzprefix,
								orderNumber: order_Number, //zzsug_seq_no,
								suggestedVolume: item.total_suggest_qty, //zzsuggest_qty,
								dealerCode: item.zzdealer_code,
								visibleProperty: true,
								zzseries: item.zzseries,
								zzallocation_ind: item.zzallocation_ind,
								zzdel_review: item.zzdel_review

							});
							// requested Data	
							// calculate the suggestedVolPercentRequested

							if (+item.total_request_qty && +item.total_suggest_qty) {
								var suggestedVolPercentRequested = ((+item.total_request_qty / +item.total_suggest_qty) * 100);
								suggestedVolPercentRequested = parseFloat(suggestedVolPercentRequested).toFixed(2);
								suggestedVolPercentRequested = suggestedVolPercentRequested + "%";
							} else if (+item.total_request_qty <= 0 && +item.total_suggest_qty > 0) {
								suggestedVolPercentRequested = 0;
							} else if (+item.total_request_qty > 0 && +item.total_suggest_qty <= 0) {
								suggestedVolPercentRequested = "N/A";
							} else if (+item.total_request_qty == 0 && +item.total_suggest_qty == 0) {
								suggestedVolPercentRequested = 0;
							}
							// suggest MIX requested totals. 
							if (item.total_request_rec && item.total_suggest_rec) {
								var suggestedMixRequested = ((item.total_request_rec / item.total_suggest_rec) * 100);
								suggestedMixRequested = parseFloat(suggestedMixRequested).toFixed(2);
								suggestedMixRequested = suggestedMixRequested + "%";
							} else if (item.total_request_rec <= 0 && item.total_suggest_rec > 0) {
								suggestedMixRequested = 0;
							} else if (item.total_request_rec > 0 && item.total_suggest_rec <= 0) {
								suggestedMixRequested = "N/A";
							} else if (item.total_request_rec == 0 && item.total_suggest_rec == 0) {
								suggestedMixRequested = 0;
							}
							// percent request volume allocated. 
							if (+item.total_allocated_qty && +item.total_request_qty) {
								var percentRequestVolAllocated = ((+item.total_allocated_qty / +item.total_request_qty) * 100);
								percentRequestVolAllocated = parseFloat(percentRequestVolAllocated).toFixed(2);
								percentRequestVolAllocated = percentRequestVolAllocated + "%";
							} else if (+item.total_allocated_qty <= 0 && +item.total_request_qty > 0) {
								percentRequestVolAllocated = 0;
							} else if (+item.total_allocated_qty > 0 && +item.total_request_qty <= 0) {
								percentRequestVolAllocated = "N/A";
							} else if (+item.total_allocated_qty == 0 && +item.total_request_qty == 0) {
								percentRequestVolAllocated = 0;
							}

							// calculate the suggestedMixRequested
							//   	var suggestedMixRequested = ((+item.total_request_qty/+item.total_suggest_qty) *100 );

							// if (item.total_suggest_qty > 0 ) {

							// }
							// countForMixCalc

							oViewRequestedData.push({

								series: item.zzmoyr + "-" + item.zzseries_desc_en,
								orderPrefix: item.zzprefix, //order_Number,
								zzseries: item.zzseries,
								orderNumber: order_Number, // item.zzdlr_ref_no, //zzsug_seq_no,
								suggestedVolume: item.total_suggest_qty, //zzsuggest_qty,
								requestedVolume: item.total_request_qty,
								suggestedVolPercentRequested: suggestedVolPercentRequested, //item.tot_suggest_perc,
								suggestedMixRequested: suggestedMixRequested, //item.tot_suggest_mix_requested,
								dealerCode: item.zzdealer_code,
								dealerReviewCount: item.dealer_review_count,
								zzdel_review: item.zzdel_review

							});

							//Allocated Data
							orderNumber = item.zzprefix + " - " + order_Number;

							oViewAllocatedData.push({
								series: item.zzmoyr + "-" + item.zzseries_desc_en,
								zzseries: item.zzseries,
								orderPrefix: item.zzprefix,
								orderNumber: orderNumber, //item.zzdlr_ref_no,
								suggestedVolume: item.total_suggest_qty,
								requestedVolume: item.total_request_qty,
								suggestedVolPercentRequested: suggestedVolPercentRequested, //item.tot_suggest_perc,
								suggestedMixRequested: suggestedMixRequested, //item.tot_suggest_mix_requested,
								allocatedVolume: item.total_allocated_qty,
								percentRequestVolAllocated: percentRequestVolAllocated, //item.perc_request_volum_allocated,
								pendingAllocation: item.pending_allocation,
								unfilledAllocation: item.unfilled_allocation,
								dealerCode: item.zzdealer_code,
								zzdel_review: item.zzdel_review

							});

						});
						// suggested Data here. 			
						var oSuggestModel = new sap.ui.model.json.JSONModel();
						oSuggestModel.setData(oViewSuggestData);
						this.getView().setModel(oSuggestModel, "suggestedDataModel");

						var oSuggestedModelData = this.getView().getModel("suggestedDataModel").getData();
						if (oSuggestedModelData.length > 0) {
							var allocationInidcator = oSuggestedModelData["0"].zzallocation_ind;
							oModel.setProperty("/allocationInidcator", allocationInidcator);
							if (allocationInidcator == "S") {

								var oModel = this.getView().getModel("detailView");
								oModel.setProperty("/showAllocatedTab", false);

							}

							var allocationInidcator = oSuggestedModelData["0"].zzallocation_ind;
							if (allocationInidcator == "S") {

								var oModel = this.getView().getModel("detailView");
								oModel.setProperty("/showAllocatedTab", false);
								oModel.setProperty("/showRequestedTab", true);
								oModel.setProperty("/showSuggestionTab", true);

							}

							if (allocationInidcator == "R") {

								var oModel = this.getView().getModel("detailView");
								oModel.setProperty("/showSuggestionTab", false);
								oModel.setProperty("/showAllocatedTab", true);
								oModel.setProperty("/showRequestedTab", false);

							}

							if (allocationInidcator == "A") {
								
							var oModel = this.getView().getModel("detailView");
								oModel.setProperty("/showSuggestionTab", false);
								oModel.setProperty("/showAllocatedTab", true);
								oModel.setProperty("/showRequestedTab", true);

								// var oModel = this.getView().getModel("detailView");
								// oModel.setProperty("/showAllocatedTab", false);
								// 	oModel.setProperty("/showRequestedTab", true);
								// oModel.setProperty("/showSuggestionTab", true);

							}

							if (allocationInidcator == "") {
								// not a valid record,  the allocation indicator is received as blank,  not a valid record.
								var showSAPDataHasIssue = this._oResourceBundle.getText("ALLOCATION_INDICATOR_BLANK");

								sap.m.MessageToast.show(showSAPDataHasIssue, {
									duration: 3000, // default
									width: "15em", // default
									my: "center middle",
									at: "center middle",
									of: window, // default
									offset: "0 0", // default
									collision: "fit fit", // default
									onClose: null, // default
									autoClose: false, // default
									animationTimingFunction: "ease", // default
									animationDuration: 1000, // default
									closeOnBrowserNavigation: false // default
								});
								this._showColor("Red", '#cc1919');

							}

						}

						// Requested Data here. 

						var oRequestModel = new sap.ui.model.json.JSONModel();
						oRequestModel.setData(oViewRequestedData);
						this.getView().setModel(oRequestModel, "requestedDataModel");
						//			var oModelRequestedDataModel = this.getView().getModel("requestedDataModel");

						// Allocated Data here. 
						var oAllocatedModel = new sap.ui.model.json.JSONModel();
						oAllocatedModel.setData(oViewAllocatedData);
						this.getView().setModel(oAllocatedModel, "allocatedDataModel");

						// //set the Count because SAP cannot handle this. 
						// this._updateTheCount();

						// date to the ui. 
						// var oModel = this.getView().getModel("detailView");

						// var sDateForBanner = oModel.getProperty("/dateForBanner");
						// var sDateForTime = oModel.getProperty("/timeForBanner");

						// var tempDueDate = 'Due on ' + sDateForBanner + ' at ' + sDateForTime + '(EST)';
						// oModel.setProperty("/dueDate", tempDueDate); // the due date for the screen. 

						var oModelCalled = this.getView().getModel('suggestedDataModel');
						oModelCalled.attachRequestCompleted(this._callTheCountService());

					}.bind(this),
					error: function (response) {
						sap.ui.core.BusyIndicator.hide();
					}

				});

			}, // end of req complete

			//  make a call to count model.   this.sSelectedDealer
			_callTheCountService: function (oEvent) {
				var oGetModelCount = this.getView().getModel("ZCDS_SUGGEST_ORD_COUNT_CDS");

				oGetModelCount.read("/ZCDS_SUGGEST_ORD_COUNT", {

					urlParameters: {
						// "$filter": "zzdealer_code eq '"+ this.dealerCode                                  //" + 2400042193 + "' "
						// "$filter": "zzdealer_code eq '" + 2400042193 + "' "

						"$filter": "zzdealer_code eq '" + this.sSelectedDealer + "' "
					},

					success: function (oData) {
						var oViewCountData = [];
						var oModel = this.getView().getModel("detailView");

						//	this.getView().setModel(new sap.ui.model.json.JSONModel(oData.results), "countViewModel");
						sap.ui.core.BusyIndicator.hide();
						$.each(oData.results, function (i, item) {
							if (item.totalUnfilledcount == 0) {
								item.totalUnfilledcount = "0";
							}

							oViewCountData.push({
								suggestedCount: item.suggest_count,
								requestedCount: item.request_count,
								allocatedCount: item.allocat_count,
								totalSuggestCount: item.totalsuggestedCount,
								totalRequestedCount: item.totalRequestedCount,
								totalAllocatedCount: item.totalAllocatedCount,
								totalPendingCount: item.totalPendingCount,
								totalUnfilledCount: item.totalUnfilledcount

							});

							var windowStartDate = item.zzend_date.substr(0, 8); //item.zzstart_date.substr(0,8);
							var windowStartYear = windowStartDate.substr(0, 4);
							var windowStartMonth = windowStartDate.substr(4, 2);
							var windowStartDay = windowStartDate.substr(6, 2);
							var windowhour = item.zzend_date.substr(8, 2);
							var windowMinute = item.zzend_date.substr(10, 2);
							var newTempDate = windowStartYear + "/" + windowStartMonth + "/" + windowStartDay + " " + windowhour + ":" + windowMinute;

							var dateForBanner = windowStartMonth + "/" + windowStartDay + "/" + windowStartYear;
							var timeForBanner = windowhour + ":" + windowMinute;

							var windowEndDate = item.zzstart_date.substr(0, 8); // using start as end and end as start not by mistake //item.zzstart_date.substr(0,8);
							var windowEndYear = windowEndDate.substr(0, 4);
							var windowEndMonth = windowEndDate.substr(4, 2);
							var windowEndDay = windowEndDate.substr(6, 2);

							var windowEndDateFormatted = windowEndMonth + "/" + windowEndDay + "/" + windowEndYear;
							oModel.setProperty("/dateForBanner", dateForBanner);
							oModel.setProperty("/timeForBanner", timeForBanner);
							oModel.setProperty("/startDateofWindow", windowEndDateFormatted);
							oModel.setProperty("/endDateofTheWindow", dateForBanner);
							oModel.setProperty("/dateForValidation", newTempDate);

						});

						// count View model			
						var oCountModel = new sap.ui.model.json.JSONModel();
						oCountModel.setData(oViewCountData);
						this.getView().setModel(oCountModel, "countViewModel");

						// date to the ui. 
						var oModel = this.getView().getModel("detailView");

						var sDateForBanner = oModel.getProperty("/dateForBanner");
						var sDateForTime = oModel.getProperty("/timeForBanner");

						if (sDateForBanner) {
							var tempDueDate = 'Due on ' + sDateForBanner + ' at ' + sDateForTime + '(EST)';
							oModel.setProperty("/dueDate", tempDueDate); // the due date for the screen. 
						}

						//  when the current date is between window open date and window close date then enable the suggested and Requested and disable the allocated. 
						var startDateofTheWindow = oModel.getProperty("/startDateofWindow");
						var endDateofTheWindow = oModel.getProperty("/endDateofTheWindow");

						var windowStartDateP = Date.parse(startDateofTheWindow);

						var windowEndDateWithTime = oModel.getProperty("/dateForValidation");
						var windowEndDateP = Date.parse(windowEndDateWithTime);

						// var torontoTime = new Date().toLocaleString("en-US", {
						// 	timeZone: "America/New_York"
						// });
						var torontoTime = new Date();
						var extractTimeZone = moment(torontoTime);
						var currentDate = extractTimeZone.tz('America/New_York').format('YYYY/MM/DD hh:mm');
						// var torontoTimeZone  = moment.tz(torontoTime , "America/New_York");
						  
					//	 var currentDate = new Date(torontoTimeZone); 
						// var currentDate = new Date(torontoTime);

						// var currentDate = new Date();

						// var dd = currentDate.getDate();
						// var mm = currentDate.getMonth() + 1; //January is 0!
						// var yyyy = currentDate.getFullYear();
						// var hours = currentDate.getHours();
						// var mins = currentDate.getMinutes();
						// var seconds = currentDate.getSeconds();

					//	currentDate = mm + '/' + dd + '/' + yyyy + " " + hours + ":" + mins;

						var parsedtodayDate = Date.parse(currentDate);

						if ((parsedtodayDate <= windowEndDateP && parsedtodayDate >= windowStartDateP)) {
							// in this period we have to show suggestion and Requested.  Turn off the Allocated. 
							oModel.setProperty("/showAllocatedTab", false);
						}
						oModel.setProperty("/parsedtodayDate", parsedtodayDate);
						oModel.setProperty("/windowEndDateP", windowEndDateP);

						if ((parsedtodayDate >= windowEndDateP)) {

							oModel.setProperty("/editOrderPrefix", false);
							oModel.setProperty("/outOfWindowDate", true);
							//	oModelDetailview.setProperty("/editAllowed", true);

							// 					var oModel = this.getView().getModel("detailView");
							// oModel.setProperty("/showAllocatedTab", false);
							// 	oModel.setProperty("/showRequestedTab", true);
							// oModel.setProperty("/showSuggestionTab", true);

						}

						//  new change -  within the window date,  lets show only records where the dealer has reviewed. 						

						this._updateTheCount();

					}.bind(this),
					error: function (response) {
						sap.ui.core.BusyIndicator.hide();
					}
				});

			},

			_updateTheCount: function (oEvent) {

				// along with count if the status is A and is out of window end date then do not display the allocated tab. 
				var oModel = this.getView().getModel("detailView");
				var oModelData = oModel.getData();

				if ((oModelData.parsedtodayDate >= oModelData.windowEndDateP) && oModelData.allocationInidcator == "A") {

					oModel.setProperty("/showAllocatedTab", false);

				}
				
					if ((oModelData.parsedtodayDate >= oModelData.windowEndDateP) && oModelData.allocationInidcator == "S") {

					oModel.setProperty("/showSuggestionTab", false);

				}
							
				

				// get the data from requestedDataModel  suggestedDataModel allocatedDataModel  allocationInidcator
				var allocationIndicator = oModel.getProperty("/allocationInidcator");
				if (oModelData.parsedtodayDate <= oModelData.windowEndDateP && allocationIndicator == "S") {
					// remove teh records from teh suggested model where dealer review flag == Y
					var validWindowSuggested = true;
					// remove teh records from the requested model where dealer review flag != Y
				} else {
					var validWindowSuggested = false;
				}
				//set the Count because SAP cannot handle this. 			

				var oCountModel = this.getView().getModel("countViewModel");
				var oSuggestedModel = this.getView().getModel("suggestedDataModel");

				if (oSuggestedModel) {
					var suggestedModelData = oSuggestedModel.getData();
					// loop and count the suggested model where qty is greater than 0. 					
					var suggestedModelLength = oSuggestedModel.getData().length;
					
					
					
// 					for (var i = elements.length - 1; i >= 0; i--) {
//   if (elements[i] == remove) {
//     elements.splice(i, 1);
//   }
// }
					
					for (var i = suggestedModelData.length - 1; i >= 0; i--) {	
						if (suggestedModelData[i].zzdel_review == "Y" && validWindowSuggested == true) {

                          if (suggestedModelData[i].suggestedVolume <= 0) {
                          	suggestedModelLength = suggestedModelLength - 1;
                          	var volumeZeroRecord = true;
                          } else {
                          		var volumeZeroRecord = false;
                          }
                             
							suggestedModelData.splice(i, 1);
							if (volumeZeroRecord == false) {
							suggestedModelLength = suggestedModelLength - 1;
							}
 
						}
					}
						for (var i = 0; i < suggestedModelData.length; i++) {

					if (suggestedModelData[i].suggestedVolume <= 0) {
					 suggestedModelLength = suggestedModelLength - 1;
					}
						}
 
	 

					// }
					oSuggestedModel.updateBindings(true);
					
					// check if suggested model has any anydata then only publish the tab suggestedTAb otherwise turn it off. 
					   if (validWindowSuggested == true) {
					   		var suggestedModelLengthTemp = oSuggestedModel.getData().length;
					   		   if (suggestedModelLengthTemp <= 0) {
					   		   			oModel.setProperty("/showSuggestionTab", false);
					   		   }
					   }
					
                  
				}
				var oRequestedModel = this.getView().getModel("requestedDataModel");
				if (oRequestedModel) {
					var requestedModelData = oRequestedModel.getData(); //.length;
					var requestedModelLengthTemp = oRequestedModel.getData().length;
					var requestedModelLength = requestedModelLengthTemp;

		
		            	for (var i = requestedModelLengthTemp - 1; i >= 0; i--) {	

					// for (var i = 0; i < requestedModelLengthTemp; i++) {

                       	if (requestedModelData[i].zzdel_review != "Y" && validWindowSuggested == true) {
							requestedModelData.splice(i, 1);
							 requestedModelLength = requestedModelLength - 1;
							//  continue;
                       	}

						// if (requestedModelData[i].dealerReviewCount == "Y") {
						// 	requestedModelLength = requestedModelLength + 1;
						// }

					}
					 if (requestedModelLength < 0) {
					 	requestedModelLength = 0;
					 }
            	oRequestedModel.updateBindings(true);
				}
				var oAllocatedModel = this.getView().getModel("allocatedDataModel");

				if (oAllocatedModel) {
					var allocatedModelData = oAllocatedModel.getData();
					// loop and count the suggested model where qty is greater than 0. 					
					var allocatedModelLength = oAllocatedModel.getData().length;
					// for (var i = 0; i < allocatedModelData.length; i++) {

					// 	if (allocatedModelData[i].allocatedVolume <= 0) {
					// 		allocatedModelLength = allocatedModelLength - 1;
					// 	}

					// }// TODO: 

				}

				// if (oAllocatedModel) {
				// 	var allocatedModelLength = oAllocatedModel.getData().length;
				// }

				var oCountModel = this.getView().getModel("countViewModel");
				if (oCountModel) {
					oCountModel.setProperty("/suggestedCount", suggestedModelLength);
					oCountModel.setProperty("/requestedCount", requestedModelLength);
					oCountModel.setProperty("/allocatedCount", allocatedModelLength);

					oCountModel.updateBindings(true);
				}
					sap.ui.core.BusyIndicator.hide();
			},

			_showColor: function (Flag, color) {
				var oContentDOM = $('#content'); //Pass div Content ID
				var oParent = $('#content').parent(); //Get Parent
				//Find for MessageToast class
				var oMessageToastDOM = $('#content').parent().find('.sapMMessageToast');
				oMessageToastDOM.css('background', color); //Apply css

			},

			_navigateToHandleRouteMatched: function (oEvent) {

				this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				this.oRouter.getTarget("ProductionRequestSummary").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

			},
			_setTheLanguage: function (oEvent) {

				var oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties"
				});
				this.getView().setModel(oI18nModel, "i18n");

				//  get the locale to determine the language. 
				var isLocaleSent = window.location.search.match(/language=([^&]*)/i);
				if (isLocaleSent) {
					var sSelectedLocale = window.location.search.match(/language=([^&]*)/i)[1];
				} else {
					var sSelectedLocale = "EN"; // default is english 
				}

				//selected language.	
				// if (window.location.search == "?language=fr") {
				if (sSelectedLocale == "fr") {
					var i18nModel = new sap.ui.model.resource.ResourceModel({
						bundleUrl: "i18n/i18n.properties",
						bundleLocale: ("fr")

					});
					this.getView().setModel(i18nModel, "i18n");
					this.sCurrentLocale = 'FR';
					// set the right image for logo	 - french		
					/*				var currentImageSource = this.getView().byId("idLexusLogo");
									currentImageSource.setProperty("src", "images/Lexus_FR.png");*/

				} else {
					var i18nModel = new sap.ui.model.resource.ResourceModel({
						bundleUrl: "i18n/i18n.properties",
						bundleLocale: ("en")

					});
					this.getView().setModel(i18nModel, "i18n");
					this.sCurrentLocale = 'EN';
					// set the right image for logo			
					/*				var currentImageSource = this.getView().byId("idLexusLogo");
									currentImageSource.setProperty("src", "images/Lexus_EN.png");*/

				}

				var oModeli18n = this.getView().getModel("i18n");
				this._oResourceBundle = oModeli18n.getResourceBundle();
			},

			_setTheLogo: function (oEvent) {

				// if (userDetails[0].UserType == 'Dealer') {

				var isDivisionSent = window.location.search.match(/Division=([^&]*)/i);
				if (isDivisionSent) {
					this.sDivision = window.location.search.match(/Division=([^&]*)/i)[1];

					// if (this.sDivision == aDataBP[0].Division) {

					// 	this.getView().byId("messageStripError").setProperty("visible", false);

					if (this.sDivision == '10') // set the toyoto logo
					{
						var currentImageSource = this.getView().byId("idLexusLogo");
						currentImageSource.setProperty("src", "images/toyota_logo_colour.png");

					} else { // set the lexus logo
						var currentImageSource = this.getView().byId("idLexusLogo");
						currentImageSource.setProperty("src", "images/i_lexus_black_full.png");

						// }
					}
				}

			},

			formatColor: function (color) {
				// check if the date is past the due date then do a different color. 

				return color ? color : "Error";
			},

		}); // very end
	}, /* bExport= */ true);