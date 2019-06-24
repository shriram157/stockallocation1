	sap.ui.define(["sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"./utilities",
		"sap/ui/core/routing/History",
		"sap/m/MessageToast",
		"sap/ui/core/BusyIndicator",
		"sap/ui/model/Sorter",
		"sap/ui/model/Filter",

	], function (BaseController, MessageBox, Utilities, History, MessageToast, BusyIndicator, Sorter, Filter) {
		"use strict";
		var _timeout;
		return BaseController.extend("suggestOrder.controller.StockAllocation", {
			handleRouteMatched: function (oEvent) {
				var sAppId = "App5bb4c41429720e1dcc397810";

				var oParams = {};

				this.resultsLossofData = false;

				var selectedSeries = sap.ui.getCore().getModel('selectedSeries').getData();

				this.removeSuggestedRequestedZeroQty = false;
				var modelSereiesHead = selectedSeries.series; //selectedSeries.Zzmoyr + " - " + selectedSeries.zzseries_desc_en;
				this.orderPrefix = selectedSeries.orderPrefix;
				var enableForDealer, setEnableFalseReset, viewInSuggestedTab;

				if (selectedSeries.whichTabClicked == "requestedTab") {
					viewInSuggestedTab = false;
				}
				if (selectedSeries.sLoggedinUserType == "Dealer_User") {
					this.sLoggedinUserIsDealer = true;
					enableForDealer = true;
				} else {
					this.sLoggedinUserIsDealer = false;
					enableForDealer = false;
				}

				if ((selectedSeries.parsedtodayDate >= selectedSeries.windowEndDateP)) {
					// turn of the editable fields
					enableForDealer = false;
					this.outSideWindowDate = true;
					setEnableFalseReset = false;
					this.removeSuggestedRequestedZeroQty = true;

				} else {
					this.outSideWindowDate = false;
					if (this.sLoggedinUserIsDealer === true) {
						setEnableFalseReset = true;
					} else {
						setEnableFalseReset = false;
					}
				}

				if ((selectedSeries.parsedtodayDate >= selectedSeries.windowEndDateP) && (selectedSeries.allocationIndicator == "A")) {
					viewInSuggestedTab = false;
					this.removeSuggestedRequestedZeroQty = true;
				}

				if (selectedSeries.allocationIndicator == "R") {
					viewInSuggestedTab = true;

				}

				if (selectedSeries.allocationIndicator == "S") {
					viewInSuggestedTab = true;
				}

				// if it is allocated and greater than window due date,  then turn off the 

				this._oViewLocalData = new sap.ui.model.json.JSONModel({
					busy: false,
					delay: 0,
					visibleForDealer: true,
					visibleForInternalUser: true,
					editAllowed: true,
					enabled: true,
					BusinessPartnerName: selectedSeries.Business_Partner_name,
					series: modelSereiesHead,
					enableForDealer: enableForDealer,
					viewInSuggestedTab: viewInSuggestedTab,
					setEnableFalseReset: setEnableFalseReset,
					etaFrom: "ETA :01 Feb 2019 To 28 Feb 2019",
					seriesSuggestedVolume: selectedSeries.suggestedVolume,
					fromWhichTabClickIamIn: selectedSeries.whichTabClicked

				});

				var oModelLocalData = this.getView().setModel(this._oViewLocalData, "oViewLocalDataModel");

				// make a call to SAP and fetch the data for the 4th screen
				this.dealerCode = selectedSeries.dealerCode;
				this.series = selectedSeries.zzseries;
				this.yearModel = selectedSeries.zzmoyr;
				var Language = selectedSeries.Language;

				this._setTheLanguage(Language); // set the language
				//	var oGetModel = this.getView().getModel("ZCDS_SUGGEST_ORD_CDS");

				// Also the logo for the second screen. 
				this._setTheLogo();

				this.oModel = this.getOwnerComponent().getModel("ZCDS_SUGGEST_ORD_CDS");
				this.afterSAPDataUpdate = false;
				// var oGetModelDetailData = this.getView().getModel("ZCDS_SUGGEST_ORD_CDS");
				// oGetModelDetailData.read("/zcds_suggest_ord", {
				this._loadTheData(); // data to SAP screen

			},

			whenUserChangesRequestedData: function (oEvt) {
				// the total might need to be updated. 
				var oTotalModelData = this.getView().getModel("initialStockTotalModel"); //.getData();
				// requestedVolumeTotal
				var currentValue = oEvt.getSource().getProperty("value");

				var oldValue = oEvt.getSource()._sOldValue;
				var tempRequestedTotal = 0;
				if (currentValue != oldValue) {
					// trigger the flag to show a loss of data. 
					this.resultsLossofData = true;

					var oStockModelData = this.getView().getModel("stockDataModel").getData();
					for (var i = 0; i < oStockModelData.length; i++) {

						tempRequestedTotal = tempRequestedTotal + +oStockModelData[i].requested_Volume;

					}

					oTotalModelData.oData["0"].requestedVolumeTotal = tempRequestedTotal;

					var updationRequestedVolume = oTotalModelData.getProperty("/");

					updationRequestedVolume["0"].requestedVolumeTotal = tempRequestedTotal;
					oTotalModelData.updateBindings(true);

				}

				// when before click navigates to previous screen the popup might need to be thrown. 

			},

			_onPageNavButtonPress: function (oEvent) {

				var oBindingContext = oEvent.getSource().getBindingContext();

				return new Promise(function (fnResolve) {

					this.doNavigate("ProductionRequestSummary", oBindingContext, fnResolve, "");
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});

			},
			doNavigate: function (sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {

				var that = this;

				if (this.resultsLossofData == true) {
					MessageBox.confirm(
						this._oResourceBundle.getText("CONFIRM_LOSS_OF_DATA"), { //Are you Sure you want to Reset ?
							// styleClass: oComponent.getContentDensityClass(),
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.OK) {
									this.resultsLossofData = false;
									sap.ui.core.BusyIndicator.show();
									that.oRouter.navTo(sRouteName);
									//	that._navBack();
								}
							}
						}
					);
				} else {
					sap.ui.core.BusyIndicator.show();
					this.oRouter.navTo(sRouteName);

				}

				if (typeof fnPromiseResolve === "function") {
					fnPromiseResolve();
				}

			},
			resetToSuggestedClick: function () {
				// when the reset button is pressed and if any quantity is changed. 

				var oComponent = this.getOwnerComponent();

				var that = this;

				// if (this.resultsLossofData == true) {
				MessageBox.confirm(
					this._oResourceBundle.getText("ARE_YOU_SURE_TO_RESET"), { //Are you Sure you want to Reset ?
						// styleClass: oComponent.getContentDensityClass(),
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.OK) {
								var oStockSapData = that.getView().getModel("stockDataModel");
								var stockFromSAP = oStockSapData.getData();
								var stockSAPProp = oStockSapData.getProperty("/");
								var stockFromScreen = that.getView().getModel("stockFromSAPModel").getData();
								// replace teh stock from screen with stock from sap. 
								//also update the totals from the total model

								for (var i = 0; i < stockFromSAP.length; i++) {

									for (var j = 0; j < stockFromScreen.length; j++) {

										if (stockFromSAP[i].model == stockFromScreen[j].model && stockFromSAP[i].suffix == stockFromScreen[j].suffix &&
											stockFromSAP[i].zzsug_seq_no == stockFromScreen[j].zzsug_seq_no) {
											stockSAPProp[i].requested_Volume = stockFromScreen[j].suggested;
											break;
										}

									}

								}

								oStockSapData.updateBindings(true);

								var oTotalModelData = that.getView().getModel("initialStockTotalModel"); //.getData();

								var tempRequestedTotal = 0;

								var oStockModelData = that.getView().getModel("stockDataModel").getData();
								for (var i = 0; i < oStockModelData.length; i++) {

									tempRequestedTotal = tempRequestedTotal + +oStockModelData[i].requested_Volume;

								}

								var updationRequestedVolume = oTotalModelData.getProperty("/");

								updationRequestedVolume["0"].requestedVolumeTotal = tempRequestedTotal;
								oTotalModelData.updateBindings(true);

							}
						}
					}
				);

			},

			_onButtonPressSave: function (oEvent) {

				var that = this;
				var promise = new Promise(function (resolve, reject) {
					// sap.ui.core.BusyIndicator.show(0);
					that.onOpenDialog();
					setTimeout(function () {

						resolve(that);
					}, 1);

				});

				promise.then(function () {

					that._onButtonPressSave1();

				});

			},

			_onButtonPressSave1: function (oEvent) {

				var that = this;

				//var oButton = this.getView().byId("saveReqId");
				//  oButton.setBusy(true);
				//  oButton.setBusyIndicatorDelay(0); 

				//var oBusyDialog = new sap.m.BusyDialog(); 
				//      oBusyDialog.open();

				//sap.ui.core.BusyIndicator.show(0);
				// jsut send the data to SAP Plain vanilla. 

				this.SaveButtonClicked = true;

				var oSuggestUpdateModel = that.getOwnerComponent().getModel("ZSD_SUGGEST_ORDER_UPDATE_SRV");

				//  now check where ever there is a change in quantity,  send a flag to SAP,  the data is changed. 

				var oStockSapData = that.getView().getModel("stockDataModel");
				var sendTheDataToSAP = oStockSapData.getData();
				var stockSAPProp = oStockSapData.getProperty("/");
				// var stockFromScreen = that.getView().getModel("stockFromSAPModel").getData();
				this._dataupdateSuccessful = false;
				// replace teh stock from screen with stock from sap. 
				this.totalRecordsUpdated = (sendTheDataToSAP.length);
				var tempArrayToHoldData = [];

				for (var i = 0; i < sendTheDataToSAP.length; i++) {

					//this._postTheDataToSAP(oSuggestUpdateModel, stockSAPProp[i], tempArrayToHoldData );

					var requestedVolumeNumb = Number(sendTheDataToSAP[i].requested_Volume);
					var suggestedQtyFromTCINumb = Number(sendTheDataToSAP[i].suggested);

					var dealerCode = this.dealerCode;
					var orderPrefix = this.orderPrefix.toUpperCase();
					//  greater of suggested qty or requested qty should be moved to 		
					var suggestedQtyFromTCI = sendTheDataToSAP[i].suggested;
					if (suggestedQtyFromTCINumb > requestedVolumeNumb) {
						//sendTheDataToSAP.zzint_alc_qty;
						var initialAllocatedQty = requestedVolumeNumb;
					} else if (requestedVolumeNumb > suggestedQtyFromTCINumb) {
						var initialAllocatedQty = suggestedQtyFromTCINumb;
					} else {
						var initialAllocatedQty = suggestedQtyFromTCINumb;
					}
					var requestedVolume = requestedVolumeNumb.toString();
					var initialAllocatedQty = initialAllocatedQty.toString();

					tempArrayToHoldData.push({

						ZzsugSeqNo: sendTheDataToSAP[i].zzsug_seq_no,
						ZzprocessDt: sendTheDataToSAP[i].zzprocess_dt,
						Zzmodel: sendTheDataToSAP[i].model,
						Zzmoyr: sendTheDataToSAP[i].zzmoyr,
						Zzsuffix: sendTheDataToSAP[i].zzsuffix,
						Zzextcol: sendTheDataToSAP[i].zzextcol,
						Zzintcol: sendTheDataToSAP[i].zzintcol,
						ZsrcWerks: sendTheDataToSAP[i].zsrc_werks,
						Zzordertype: sendTheDataToSAP[i].zzordertype,
						ZzdealerCode: dealerCode,
						ZzprodMonth: sendTheDataToSAP[i].zzprod_month,
						ZzetaMonth: sendTheDataToSAP[i].zzeta_month,
						ZzdelReview: "Y",
						ZzrequestQty: requestedVolume,
						Zzprefix: orderPrefix,
						ZzintAlcQty: initialAllocatedQty
					});

				}
				// call the deep entity. 
				this.actualPushToSAPoDataDeepEntity(oSuggestUpdateModel, tempArrayToHoldData);

			},

			onOpenDialog: function (oEvent) {
				// instantiate dialog
				if (!this._dialog) {

					// this._sortDialog = sap.ui.xmlfragment("vehicleSortDialog", "vehicleLocator.fragment.vehicleSortDialog", this);
					// this._dialog = sap.ui.xmlfragment("sap.m.sample.BusyDialog.BusyDialog", this);
					this._dialog = sap.ui.xmlfragment("BusyDialog", "suggestOrder.fragment.BusyDialog", this);
					this.getView().addDependent(this._dialog);
				}

				// open dialog
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._dialog);
				this._dialog.open();

				// simulate end of operation
				// _timeout = jQuery.sap.delayedCall(3000, this, function () {
				// 	this._dialog.close();
				// });

			},

			onDialogClosed: function (oEvent) {
				// jQuery.sap.clearDelayedCall(_timeout);
				var messageForCancelled = this.getView().getModel("i18n").getResourceBundle().getText("operationCancelled");
				var messageForCompleted = this.getView().getModel("i18n").getResourceBundle().getText("operationCompleted");
				if (oEvent.getParameter("cancelPressed")) {
					MessageToast.show(messageForCancelled);
				} else {
					MessageToast.show(messageForCompleted);
				}
			},

			_navigateToMainScreen: function () {

				// if (this._dataupdateSuccessful == true) {

				// var showRecordSaved = this._oResourceBundle.getText("RECORD_SAVED_INSAP");

				// sap.m.MessageToast.show(showRecordSaved, {
				// 	duration: 3000,
				// 	width: "15em",
				// 	my: "center middle",
				// 	at: "center middle",
				// 	of: window,
				// 	offset: "0 0",
				// 	collision: "fit fit",
				// 	onClose: null,
				// 	autoClose: true,
				// 	animationTimingFunction: "ease",
				// 	animationDuration: 1000,
				// 	closeOnBrowserNavigation: false
				// });

				// try to close the indicator	
				this._dialog.close();

				this.afterSAPDataUpdate = true;

				this.resultsLossofData = false; // the data is saved,  so no message
				this._loadTheData(); // reload the data from SAP. 
				// };

			},

			_postTheDataToSAP: function (oSuggestUpdateModel, sendTheDataToSAP, tempArrayToHoldData) {

				var requestedVolumeNumb = Number(sendTheDataToSAP.requested_Volume);
				var suggestedQtyFromTCINumb = Number(sendTheDataToSAP.suggested);

				var dealerCode = this.dealerCode;
				var orderPrefix = this.orderPrefix.toUpperCase();
				//  greater of suggested qty or requested qty should be moved to 		
				var suggestedQtyFromTCI = sendTheDataToSAP.suggested;
				if (suggestedQtyFromTCINumb > requestedVolumeNumb) {
					//sendTheDataToSAP.zzint_alc_qty;
					var initialAllocatedQty = requestedVolumeNumb;
				} else if (requestedVolumeNumb > suggestedQtyFromTCINumb) {
					var initialAllocatedQty = suggestedQtyFromTCINumb;
				} else {
					var initialAllocatedQty = suggestedQtyFromTCINumb;
				}
				var requestedVolume = requestedVolumeNumb.toString();
				var initialAllocatedQty = initialAllocatedQty.toString();

				tempArrayToHoldData.push({

					ZzsugSeqNo: sendTheDataToSAP.zzsug_seq_no,
					ZzprocessDt: sendTheDataToSAP.zzprocess_dt,
					Zzmodel: sendTheDataToSAP.model,
					Zzmoyr: sendTheDataToSAP.zzmoyr,
					Zzsuffix: sendTheDataToSAP.zzsuffix,
					Zzextcol: sendTheDataToSAP.zzextcol,
					Zzintcol: sendTheDataToSAP.zzintcol,
					ZsrcWerks: sendTheDataToSAP.zsrc_werks,
					Zzordertype: sendTheDataToSAP.zzordertype,
					ZzdealerCode: dealerCode,
					ZzprodMonth: sendTheDataToSAP.zzprod_month,
					ZzetaMonth: sendTheDataToSAP.zzeta_month,
					ZzdelReview: "Y",
					ZzrequestQty: requestedVolume,
					Zzprefix: orderPrefix,
					ZzintAlcQty: initialAllocatedQty
				});

			},

			actualPushToSAPoDataDeepEntity: function (oSuggestUpdateModel, oItemSet) {

				// lets move all the below update functionality to a different subroutine and call it once the above is done. 

				this.obj = {
					"ZzsugSeqNo": "ALL",
					"OrderHtoOrderI": oItemSet

				};

				var that = this;
				that.responseReceived = 0;
				oSuggestUpdateModel.refreshSecurityToken();

				// oClaimModel.create("/zc_headSet", this.obj, {
				// 	success: $.proxy(function (data, response) {   SuggestOrdSet

				oSuggestUpdateModel.create("/SuggestOrdSet", (this.obj), {
					success: $.proxy(function (data, response) {

						// that.responseReceived = that.responseReceived + 1;

						// if (that.totalRecordsUpdated == that.responseReceived) {
						// all is done lets navigate back to the main screen. 
						// sap.ui.core.BusyIndicator.hide();
						//sap.ui.core.BusyIndicator.show();
						that._navigateToMainScreen(); // instead reload the current page. 

						// }

					}),
					error: function (err) {
						// console.log(err);
					}
				});

			},

			getQueryParameters: function (oLocation) {
				var oQuery = {};
				var aParams = oLocation.search.substring(1).split("&");
				for (var i = 0; i < aParams.length; i++) {
					var aPair = aParams[i].split("=");
					oQuery[aPair[0]] = decodeURIComponent(aPair[1]);
				}
				return oQuery;

			},
			_onLinkPress: function (oEvent) {

				var oBindingContext = oEvent.getSource().getBindingContext();

				return new Promise(function (fnResolve) {

					this.doNavigate("RundownSummary", oBindingContext, fnResolve, "");
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});

			},
			_onLinkPress1: function (oEvent) {

				var oBindingContext = oEvent.getSource().getBindingContext();

				return new Promise(function (fnResolve) {

					this.doNavigate("SalesPlanSummary", oBindingContext, fnResolve, "");
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});

			},
			_onButtonPress2: function (oEvent) {

				var oBindingContext = oEvent.getSource().getBindingContext();

				return new Promise(function (fnResolve) {

					this.doNavigate("SalesDetails", oBindingContext, fnResolve, "");
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});

			},
			_onButtonPress3: function () {

				window.close();

			},
			onInit: function () {

				this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				this.oRouter.getTarget("StockAllocation").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

			},

			_setTheLanguage: function (language) {

				if (language == "EN") {
					var sSelectedLocale = "en"; // default is english 
				} else {
					var sSelectedLocale = "fr";
				}

				//selected language. 

				if (sSelectedLocale == "fr") {
					var i18nModel = new sap.ui.model.resource.ResourceModel({
						bundleUrl: "i18n/i18n.properties",
						bundleLocale: ("fr")

					});
					this.getView().setModel(i18nModel, "i18n");
					this.sCurrentLocale = 'FR';

				} else {
					var i18nModel = new sap.ui.model.resource.ResourceModel({
						bundleUrl: "i18n/i18n.properties",
						bundleLocale: ("en")

					});
					this.getView().setModel(i18nModel, "i18n");
					this.sCurrentLocale = 'EN';

				}

				var oModeli18n = this.getView().getModel("i18n");
				this._oResourceBundle = oModeli18n.getResourceBundle();
			},

			onClickShowAllModels: function (oEvent) {

				var showSuggestModelsText = this._oResourceBundle.getText("SHOW_SUGGEST_MODELS"),
					showAllModelsText = this._oResourceBundle.getText("SHOW_ALL_MODELS");

				var currentText = this.getView().byId("showAllModelsBtn").getText();
				var oDetailModel = this.getView().getModel("oViewLocalDataModel");
				if (currentText == showSuggestModelsText) {
					this.getView().byId("showAllModelsBtn").setProperty("text", showAllModelsText);
					// enabled="{oViewLocalDataModel>/setEnableFalse}"

					oDetailModel.setProperty("/setEnableFalsePercentages", true);

					this._showSuggestedModels();
				} else {
					this.getView().byId("showAllModelsBtn").setProperty("text", showSuggestModelsText);
					oDetailModel.setProperty("/setEnableFalsePercentages", true);

					this._showAllModels();
				}

			},

			_calculateTotals: function (includeZero) {

				var oModelData2 = this.getView().getModel("stockDataModel").getData();

				var oInitalTotalStock = this.getView().getModel("initialStockTotalModel");
				var oInitialTotalStockModel = oInitalTotalStock.getData();
				var currentTotal = 0,
					currentDSTotal = 0,
					suggestedTotal = 0,
					suggestedDSTotal = 0,
					requestedVolumeTotal = 0,
					allocatedTotal = 0,
					allocatedDSTotal = 0,
					pendingAllocationTotal = 0,
					unfilledAllocationTotal = 0,
					differenceTotal = 0;

				for (var i = 0; i < oModelData2.length; i++) {
					var duringPercentage = oModelData2[i].current.includes("%");
					if (oModelData2[i].visibleProperty == true && duringPercentage == false) {
						// if ( oModelData2[i].visibleProperty == true ) {
						currentTotal = +oModelData2[i].current + +currentTotal;
						currentDSTotal = +oModelData2[i].current_Ds + +currentDSTotal;
						suggestedTotal = +oModelData2[i].suggested + +suggestedTotal;
						suggestedDSTotal = +oModelData2[i].suggested_Ds + +suggestedDSTotal;
						// requestedVolumeTotal = +oModelData2[i].requested_Volume + +requestedVolumeTotal;
						allocatedTotal = +oModelData2[i].allocated + +allocatedTotal;
						allocatedDSTotal = +oModelData2[i].allocated_Ds + +allocatedDSTotal;
						pendingAllocationTotal = +oModelData2[i].pendingAllocation + +pendingAllocationTotal;
						unfilledAllocationTotal = +oModelData2[i].unfilled_Allocation + +unfilledAllocationTotal;
						differenceTotal = +oModelData2[i].difference + +differenceTotal;
					}
				}
//  requested volume is not based on suggested stock. 
					for (var i = 0; i < oModelData2.length; i++) {
						
						
						requestedVolumeTotal = +oModelData2[i].requested_Volume + +requestedVolumeTotal;
						
						
					}
          
				
				
				
				
				
				

				if (duringPercentage == true) {

					var oModelData2 = this.getView().getModel("stockDataModelBkup").getData();
					var oInitalTotalStock = this.getView().getModel("initialStockTotalModel");
					var oInitialTotalStockModel = oInitalTotalStock.getData();
					var currentTotal = 0,
						currentDSTotal = 0,
						suggestedTotal = 0,
						suggestedDSTotal = 0,
						requestedVolumeTotal = 0,
						allocatedTotal = 0,
						allocatedDSTotal = 0,
						pendingAllocationTotal = 0,
						unfilledAllocationTotal = 0,
						differenceTotal = 0;

					for (var i = 0; i < oModelData2.length; i++) {

						if (includeZero == true) {
							//if ( oModelData2[i].suggested < "0" ) {
							currentTotal = +oModelData2[i].current + +currentTotal;
							currentDSTotal = +oModelData2[i].current_Ds + +currentDSTotal;
							suggestedTotal = +oModelData2[i].suggested + +suggestedTotal;
							suggestedDSTotal = +oModelData2[i].suggested_Ds + +suggestedDSTotal;
							// requestedVolumeTotal = +oModelData2[i].requested_Volume + +requestedVolumeTotal;
							allocatedTotal = +oModelData2[i].allocated + +allocatedTotal;
							allocatedDSTotal = +oModelData2[i].allocated_Ds + +allocatedDSTotal;
							pendingAllocationTotal = +oModelData2[i].pendingAllocation + +pendingAllocationTotal;
							unfilledAllocationTotal = +oModelData2[i].unfilled_Allocation + +unfilledAllocationTotal;
							differenceTotal = +oModelData2[i].difference + +differenceTotal;
							//}
						} else {
							// take only excluding the ones with zero quantities. 
							if (oModelData2[i].suggested > "0") {
								currentTotal = +oModelData2[i].current + +currentTotal;
								currentDSTotal = +oModelData2[i].current_Ds + +currentDSTotal;
								suggestedTotal = +oModelData2[i].suggested + +suggestedTotal;
								suggestedDSTotal = +oModelData2[i].suggested_Ds + +suggestedDSTotal;
								// requestedVolumeTotal = +oModelData2[i].requested_Volume + +requestedVolumeTotal;
								allocatedTotal = +oModelData2[i].allocated + +allocatedTotal;
								allocatedDSTotal = +oModelData2[i].allocated_Ds + +allocatedDSTotal;
								pendingAllocationTotal = +oModelData2[i].pendingAllocation + +pendingAllocationTotal;
								unfilledAllocationTotal = +oModelData2[i].unfilled_Allocation + +unfilledAllocationTotal;
								differenceTotal = +oModelData2[i].difference + +differenceTotal;
							}

						}
					}

					oInitialTotalStockModel["0"].suggestedTotal = suggestedTotal;
					oInitialTotalStockModel["0"].currentDSTotal = currentDSTotal;
					oInitialTotalStockModel["0"].currentTotal = currentTotal;
					oInitialTotalStockModel["0"].differenceTotal = differenceTotal;
					oInitialTotalStockModel["0"].requestedVolumeTotal = requestedVolumeTotal;
					oInitialTotalStockModel["0"].suggestedDSTotal = suggestedDSTotal;

					oInitialTotalStockModel["0"].allocatedTotal = allocatedTotal;
					oInitialTotalStockModel["0"].allocatedDSTotal = allocatedDSTotal;
					oInitialTotalStockModel["0"].pendingAllocationTotal = pendingAllocationTotal;
					oInitialTotalStockModel["0"].unfilledAllocationTotal = unfilledAllocationTotal;

					// }

				} else {

					var oModelData2 = this.getView().getModel("stockDataModelBkup").getData();
					var oInitalTotalStock = this.getView().getModel("initialStockTotalModel");
					var oInitialTotalStockModel = oInitalTotalStock.getData();

					oInitialTotalStockModel["0"].suggestedTotal = suggestedTotal;
					oInitialTotalStockModel["0"].currentDSTotal = currentDSTotal;
					oInitialTotalStockModel["0"].currentTotal = currentTotal;
					oInitialTotalStockModel["0"].differenceTotal = differenceTotal;
					oInitialTotalStockModel["0"].requestedVolumeTotal = requestedVolumeTotal;
					oInitialTotalStockModel["0"].suggestedDSTotal = suggestedDSTotal;

					oInitialTotalStockModel["0"].allocatedTotal = allocatedTotal;
					oInitialTotalStockModel["0"].allocatedDSTotal = allocatedDSTotal;
					oInitialTotalStockModel["0"].pendingAllocationTotal = pendingAllocationTotal;
					oInitialTotalStockModel["0"].unfilledAllocationTotal = unfilledAllocationTotal;
				}
				oInitalTotalStock.updateBindings(true);
			},

			_showSuggestedModels: function (oEvt) {

				var oModelData2 = this.getView().getModel("stockDataModel").getData();
				var oInitalTotalStock = this.getView().getModel("initialStockTotalModel");
				var oInitialTotalStockModel = oInitalTotalStock.getData();
				var oModelData3 = this.getView().getModel("stockDataModelBkup").getData();
				var includeZero = false;
				// initialStockTotalModelBkup
				var oInitalTotalStockBkupData = this.getView().getModel("initialStockTotalModelBkup");
				// var oInitalTotalStockBkupData = oInitalTotalStockBkup.getData();
				for (var i = 0; i < oModelData2.length; i++) {

					//	visibleProperty "0%"

					if ((oModelData2[i].suggested <= 0) || (oModelData2[i].suggested <= "0%")) {

						oModelData2[i].visibleProperty = false;

					}

				}

				this._calculateTotals(includeZero);

				var showSuggestPercentagesText = this._oResourceBundle.getText("SHOW_PERCENTAGES"),
					showAllPercentagesText = this._oResourceBundle.getText("SHOW_ALL_VALUES");

				var currentText = this.getView().byId("showPercentagesBtn").getText();

				if (currentText == showAllPercentagesText) {
					// get the percent calculation done again. 
					this._showPercentagesAgain(includeZero);

				}

				//	oInitalTotalStock.updateBindings(true);
				var oSuggestModel = new sap.ui.model.json.JSONModel();
				oSuggestModel.setData(oModelData2);
				this.getView().setModel(oSuggestModel, "stockDataModel");

			},

			_showAllModels: function (oEvt) {

				var oModelData = this.getView().getModel("stockDataModel").getData();
				var oInitalTotalStock = this.getView().getModel("initialStockTotalModel");
				var oInitialTotalStockModel = oInitalTotalStock.getData();
				var oModelData3 = this.getView().getModel("stockDataModelBkup").getData();
				var includeZero = true;

				for (var i = 0; i < oModelData.length; i++) {

					if ((oModelData[i].suggested <= 0) || (oModelData[i].suggested <= "0%")) {
						oModelData[i].visibleProperty = true;

					}

				}

				this._calculateTotals(includeZero);

				var showSuggestPercentagesText = this._oResourceBundle.getText("SHOW_PERCENTAGES"),
					showAllPercentagesText = this._oResourceBundle.getText("SHOW_ALL_VALUES");

				var currentText = this.getView().byId("showPercentagesBtn").getText();

				if (currentText == showAllPercentagesText) {
					// 	// get the percent calculation done again. 
					this._showPercentagesAgain();

				}

				// oInitalTotalStock.updateBindings(true);
				var oSuggestModel = new sap.ui.model.json.JSONModel();
				oSuggestModel.setData(oModelData);
				this.getView().setModel(oSuggestModel, "stockDataModel");

			},

			onClickShowPercentages: function (oEvt) {
				var showSuggestPercentagesText = this._oResourceBundle.getText("SHOW_PERCENTAGES"),
					showAllPercentagesText = this._oResourceBundle.getText("SHOW_ALL_VALUES");
				var oDetailModel = this.getView().getModel("oViewLocalDataModel");
				var currentText = this.getView().byId("showPercentagesBtn").getText();
				if (currentText == showSuggestPercentagesText) {
					//	oDetailModel.setProperty("/setEnableFalseSuggest", true);
					this.getView().byId("showPercentagesBtn").setProperty("text", showAllPercentagesText);
					this._showPercentages();
				} else {
					this.getView().byId("showPercentagesBtn").setProperty("text", showSuggestPercentagesText);

					this._showAllVAlues();
				}

			},
			_showPercentages: function (oEvt) {
				var oModelData = this.getView().getModel("stockDataModel"),
					oModelData2 = oModelData.getData(),
					oModelProp = oModelData.getProperty("/");

				var oInitialTotalStockModel = this.getView().getModel("initialStockTotalModel").getData();

				for (var i = 0; i < oModelData2.length; i++) {
					// if (oModelData2[i].visibleProperty == true){

					if (+oModelData2[i].current > 0) {
						oModelProp[i].current = this._calculatePercentage(+oModelData2[i].current, +oInitialTotalStockModel["0"].currentTotal) + "%";

					}
					if (+oModelData2[i].suggested > 0) {
						oModelProp[i].suggested = this._calculatePercentage(+oModelData2[i].suggested, +oInitialTotalStockModel["0"].suggestedTotal) +
							"%";
					}

					if (+oModelData2[i].allocated > 0) {
						oModelProp[i].allocated = this._calculatePercentage(+oModelData2[i].allocated, +oInitialTotalStockModel["0"].allocatedTotal) +
							"%";
					}

					if (+oModelData2[i].difference < 0) {

						oModelProp[i].difference = this._calculatePercentage(+oModelData2[i].difference, +oInitialTotalStockModel["0"].requestedVolumeTotal) +
							"%";

					} else {
						oModelProp[i].difference = this._calculatePercentage(+oModelData2[i].difference, +oInitialTotalStockModel["0"].requestedVolumeTotal) +
							"%";
					}

					// }
				}
				oModelData.updateBindings(true);

				var oModelInitialStockModel = this.getView().getModel("initialStockTotalModel");
				var oModelInitialStockModelData = oModelInitialStockModel.getData();

				if (oModelInitialStockModelData["0"].differenceTotal < 0) {
					var sPrefix = "-" + "100%";

				}

			},

			_showPercentagesAgain: function (includeZero) {
				debugger;
				var oModelData = this.getView().getModel("stockDataModelBkup"),
					oModelData2 = oModelData.getData(),
					// oModelProp = oModelData.getProperty("/"),

					oModelData3 = this.getView().getModel("stockDataModel");
				var oModelProp = oModelData3.getProperty("/");

				// if (includeZero == false ) {
				// the totals should be based on the records where suggestqty is Greater than zero. 
				var currentTotal = 0,
					currentDSTotal = 0,
					suggestedTotal = 0,
					suggestedDSTotal = 0,
					requestedVolumeTotal = 0,
					allocatedTotal = 0,
					allocatedDSTotal = 0,
					pendingAllocationTotal = 0,
					unfilledAllocationTotal = 0,
					differenceTotal = 0;

				$.each(oModelData2, function (i, item) {

					if (includeZero == false) {

						if (item.suggested > "0") {

							currentTotal = currentTotal + +item.current;
							// currentDSTotal = currentDSTotal + +item.zzcur_ds;
							suggestedTotal = suggestedTotal + +item.suggested;

							// requestedVolumeTotal = requestedVolumeTotal + +item.zzrequest_qty;
							allocatedTotal = allocatedTotal + +item.allocated;
							requestedVolumeTotal = requestedVolumeTotal + +item.requested_Volume;

						}
					} else {

						currentTotal = currentTotal + +item.current;
						// currentDSTotal = currentDSTotal + +item.zzcur_ds;
						suggestedTotal = suggestedTotal + +item.suggested;
						// differenceTotal = differenceTotal + +item.diff_sugg_req;
						// suggestedDSTotal = suggestedDSTotal + +item.suggested_ds;
						requestedVolumeTotal = requestedVolumeTotal + +item.requested_Volume;
						// requestedVolumeTotal = requestedVolumeTotal + +item.zzrequest_qty;
						allocatedTotal = allocatedTotal + +item.allocated;

					}
				});

				// } else {
				// var oInitialTotalStockModel = this.getView().getModel("initialStockTotalModel").getData();	

				// }

				//current: currentDSTotal   
				//current_Ds         currentDSTotal

				for (var i = 0; i < oModelData2.length; i++) {
					// if (oModelData2[i].visibleProperty == true){

					//if (+oModelData2[i].suggested > 0 ){

					if (+oModelData2[i].current > 0) {
						oModelProp[i].current = this._calculatePercentage(+oModelData2[i].current, currentTotal) + "%";
						// oModelProp[i].current_Ds = this._calculatePercentage(+oModelData2[i].current_Ds, +oInitialTotalStockModel["0"].currentDSTotal) + "%";
					}
					if (+oModelData2[i].suggested > 0) {
						oModelProp[i].suggested = this._calculatePercentage(+oModelData2[i].suggested, suggestedTotal) + "%";
					}
					// oModelProp[i].suggested_Ds = this._calculatePercentage(+oModelData2[i].suggested_Ds, +oInitialTotalStockModel["0"].suggestedDSTotal) +
					// 	"%";
					// oModelProp[i].requested_Volume = this._calculatePercentage(+oModelData2[i].requested_Volume, requestedVolumeTotal) + "%";
					if (+oModelData2[i].allocated > 0) {
						oModelProp[i].allocated = this._calculatePercentage(+oModelData2[i].allocated, allocatedTotal) + "%";
					}
					// oModelProp[i].pendingAllocation = this._calculatePercentage(+oModelData2[i].pendingAllocation, +oInitialTotalStockModel["0"].pendingAllocationTotal) +
					// 	"%";
					// oModelProp[i].unfilled_Allocation = this._calculatePercentage(+oModelData2[i].unfilled_Allocation, +oInitialTotalStockModel["0"].unfilledAllocationTotal) +
					// 	"%";
					// if (+oModelData2[i].difference < 0) {

					oModelProp[i].difference = this._calculatePercentage(+oModelData2[i].difference, requestedVolumeTotal) +
						"%";

					// } else {
					// 	oModelProp[i].difference = this._calculatePercentage(+oModelData2[i].difference, requestedVolumeTotal) +
					// 		"%";
					// }

					//}
				}
				oModelData3.updateBindings(true);

			},
			_calculatePercentage: function (partialValue, totalValue) {
				if (partialValue && totalValue) {

					var tempValue = (100 * partialValue) / totalValue;

					// var num = 5.56789;
					//var n = num.toFixed(2);

					var finalValue = tempValue.toFixed(2);

					//  var finalValue =  Math.round(tempValue);
					// Math.round      var result = (price * sale) / 100;

					return finalValue.toLocaleString(); // (100 * partialValue) / totalValue;
				} else {
					return 0;
				}
			},

			_showAllVAlues: function (oEvt) {

				var oModelData = this.getView().getModel("stockDataModel"),
					oModelData2 = oModelData.getData(),
					oModelProp = oModelData.getProperty("/");

				var oModelDataFromBkup = this.getView().getModel("stockDataModelBkup"),
					oModelDataFromBkupData = oModelDataFromBkup.getData();

				for (var i = 0; i < oModelData2.length; i++) {

					for (var j = 0; j < oModelDataFromBkupData.length; j++) {
						if (oModelProp[i].colour_Trim == oModelDataFromBkupData[j].colour_Trim &&
							oModelProp[i].zzsuffix == oModelDataFromBkupData[j].zzsuffix &&
							oModelProp[i].zzsug_seq_no == oModelDataFromBkupData[j].zzsug_seq_no) {

							oModelProp[i].current = oModelDataFromBkupData[j].current;
							oModelProp[i].suggested = oModelDataFromBkupData[j].suggested;
							oModelProp[i].allocated = oModelDataFromBkupData[j].allocated;
							oModelProp[i].difference = oModelDataFromBkupData[j].difference;
							break;
						}

					}

				}
				oModelData.updateBindings("true");

			},

			_dataTemplateForPostSAP: function (dataFromScreen) {

				var oItemSet = [];
				$.each(dataFromScreen, function (i, item) {

					var requestedVolume = item.requested_Volume.toString();
					oItemSet.push({

						ZzsugSeqNo: item.zzsug_seq_no,
						ZzprocessDt: item.zzprocess_dt,
						Zzmodel: item.model,
						Zzmoyr: item.zzmoyr,
						Zzsuffix: item.zzsuffix,
						Zzextcol: item.zzextcol,
						Zzintcol: item.zzintcol,
						ZsrcWerks: item.zsrc_werks,
						Zzordertype: item.zzordertype,
						ZzdealerCode: item.dealer_code,
						ZzprodMonth: item.zzprod_month,
						ZzetaMonth: item.zzeta_month,
						zzdel_review: "Y",
						ZzrequestQty: requestedVolume,
						zzint_alc_qty: item.zzint_alc_qty

					});
				});

				return oItemSet;
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

			_loadTheData: function (oEvent) {

				this.oModel.read("/zcds_suggest_ord", {
					urlParameters: {

						"$filter": "zzdealer_code eq'" + this.dealerCode + "'and zzseries eq '" + this.series + "'" + "and zzmoyr eq '" + this.yearModel +
							"'"
					},

					success: function (oData) {
						sap.ui.core.BusyIndicator.hide();
						var oStockAllocationData = [];
						var oInitialTotalsForUI = [];
						var oInitialTotalsForUIBkup = [];
						var oStockBeforeReset = [];
						var oStockAlocationBkup = [];
						var sEtaFromData;
						var sEtaToData;
						var currentStatus;
						var etaFromAndToDates = [];

						var oModelLocalData = this.getView().getModel("oViewLocalDataModel");

						var totalRecordsReceived = oData.results.length;

						if (totalRecordsReceived <= 0) {
							oModelLocalData.setProperty("/enableForDealer", false);
							oModelLocalData.setProperty("/setEnableFalse", false);
						}
						totalRecordsReceived = totalRecordsReceived - 1;
						var currentTotal = 0,
							currentDSTotal = 0,
							suggestedTotal = 0,
							suggestedDSTotal = 0,
							requestedVolumeTotal = 0,
							allocatedTotal = 0,
							allocatedDSTotal = 0,
							pendingAllocationTotal = 0,
							unfilledAllocationTotal = 0,
							differenceTotal = 0;
						var zeroSuggestioncurrentTotal = 0,
							zeroSuggestioncurrentDSTotal = 0,
							zeroSuggestionsuggestedTotal = 0,
							zeroSuggestiondifferenceTotal = 0,
							zeroSuggestionsuggestedDSTotal = 0,
							zeroSuggestionrequestedVolumeTotal = 0,
							zeroSuggestionallocatedTotal = 0,
							zeroSuggestionallocatedDSTotal = 0,
							zeroSuggestionpendingAllocationTotal = 0,
							zeroSuggestionunfilledAllocationTotal = 0;
						var uiForcolorTrim;
						var dealerCode = this.dealerCode;
						var localeG = this.sCurrentLocale;
						$.each(oData.results, function (i, item) {

							item.suggested_ds = Math.round(item.suggested_ds);
							item.requested_ds = Math.round(item.requested_ds);
							item.allocated_ds = Math.round(item.allocated_ds);

							//item.zzrequest_qty = JSON.stringify(item.zzrequest_qty);

							if (i == 0) {
								currentStatus = item.zzallocation_ind;
							}

							// Zzextcol - mktg_desc_en / zzintcol - int_trim_desc_en
							if (localeG == 'EN') {
								var mktgDescriptionBasedOnLang = item.mktg_desc_en;
								var suffixDescription = item.suffix_desc_en;
								var interiorTrimDesc = item.int_trim_desc_en;
								var modelCodeWithDescription = item.zzmodel + " - " + item.model_desc_en;
							} else {
								var mktgDescriptionBasedOnLang = item.mktg_desc_fr;
								var suffixDescription = item.suffix_desc_fr;
								var interiorTrimDesc = item.int_trim_desc_fr;
								var modelCodeWithDescription = item.zzmodel + " - " + item.model_desc_fr;
							}

							//  turn off the zzintcol from the bleow With Rob Mc Carthy - item.zzintcol

							uiForcolorTrim = item.zzextcol + "-" + mktgDescriptionBasedOnLang;

							var suffixToUi = item.zzsuffix + " " + suffixDescription + "/" + interiorTrimDesc;

							etaFromAndToDates.push({
								sEtaFromData: item.zzeta_month,
								sEtaToData: item.zzeta_month,
								//	sEtaToData: item.zzprod_month
							});

							oStockAllocationData.push({

								model: item.zzmodel,
								modelCodeDescription: modelCodeWithDescription,
								suffix: item.zzsuffix, //,
								suffix_desc: suffixToUi,
								colour_Trim: uiForcolorTrim,
								current: item.zzcur_stock,
								current_Ds: item.zzcur_ds,
								suggested: item.zzsuggest_qty,
								suggested_Ds: item.suggested_ds,
								requested_Volume: item.zzrequest_qty,
								difference: item.diff_sugg_req,
								requested_Ds: item.requested_ds,
								allocated: item.zzallocated_qty,
								allocated_Ds: item.allocated_ds,
								pendingAllocation: item.pending_allocation,
								visibleProperty: true,
								unfilled_Allocation: item.unfilled__allocation,
								dealer_code: dealerCode,
								zzmoyr: item.zzmoyr,
								zzordertype: item.zzordertype,
								//  mandatory data for post
								zzsug_seq_no: item.zzsug_seq_no,
								zzprocess_dt: item.zzprocess_dt,
								zzextcol: item.zzextcol,
								zzintcol: item.zzintcol,
								zsrc_werks: item.zsrc_werks,
								zzprod_month: item.zzprod_month,
								zzeta_month: item.zzeta_month,
								zzsuffix: item.zzsuffix,
								zzzadddata1: item.zzzadddata1, // this is used for Sort
								zzint_alc_qty: item.zzint_alc_qty

							});

							oStockAlocationBkup.push({

								model: item.zzmodel,
								modelCodeDescription: modelCodeWithDescription,
								suffix: item.zzsuffix, //,
								suffix_desc: suffixToUi,
								colour_Trim: uiForcolorTrim,
								current: item.zzcur_stock,
								current_Ds: item.zzcur_ds,
								suggested: item.zzsuggest_qty,
								suggested_Ds: item.suggested_ds,
								requested_Volume: item.zzrequest_qty,
								difference: item.diff_sugg_req,
								requested_Ds: item.requested_ds,
								allocated: item.zzallocated_qty,
								allocated_Ds: item.allocated_ds,
								pendingAllocation: item.pending_allocation,
								unfilled_Allocation: item.unfilled__allocation,

								zzsug_seq_no: item.zzsug_seq_no,
								zzprocess_dt: item.zzprocess_dt,
								zzextcol: item.zzextcol,
								zzintcol: item.zzintcol,
								zsrc_werks: item.zsrc_werks,
								zzprod_month: item.zzprod_month,
								zzeta_month: item.zzeta_month,
								zzordertype: item.zzordertype,
								zzsuffix: item.zzsuffix,
								zzzadddata1: item.zzzadddata1, // this is used for Sort
								zzint_alc_qty: item.zzint_alc_qty

							});

							oStockBeforeReset.push({

								model: item.zzmodel,
								modelCodeDescription: modelCodeWithDescription,
								suffix: item.zzsuffix,
								colour_Trim: uiForcolorTrim,
								suggested: item.zzsuggest_qty,
								difference: item.diff_sugg_req,
								requested_Volume: item.zzrequest_qty,
								zzsug_seq_no: item.zzsug_seq_no,
								zzprocess_dt: item.zzprocess_dt,
								zzextcol: item.zzextcol,
								zzintcol: item.zzintcol,
								zsrc_werks: item.zsrc_werks,
								zzprod_month: item.zzprod_month,
								zzeta_month: item.zzeta_month,
								zzordertype: item.zzordertype,
								zzsuffix: item.zzsuffix,
								zzzadddata1: item.zzzadddata1, // this is used for Sort
								zzint_alc_qty: item.zzint_alc_qty

							});

							currentTotal = currentTotal + +item.zzcur_stock;
							currentDSTotal = currentDSTotal + +item.zzcur_ds;
							suggestedTotal = suggestedTotal + +item.zzsuggest_qty;
							differenceTotal = differenceTotal + +item.diff_sugg_req;
							suggestedDSTotal = suggestedDSTotal + +item.suggested_ds;

							requestedVolumeTotal = requestedVolumeTotal + +item.zzrequest_qty;
							allocatedTotal = allocatedTotal + +item.zzallocated_qty;
							allocatedDSTotal = allocatedDSTotal + +item.allocated_ds;
							pendingAllocationTotal = pendingAllocationTotal + +item.pending_allocation;
							unfilledAllocationTotal = unfilledAllocationTotal + +item.unfilled__allocation;

							if (item.zzsuggest_qty <= 0) {
								zeroSuggestioncurrentTotal = zeroSuggestioncurrentTotal + +item.zzcur_stock;
								zeroSuggestioncurrentDSTotal = zeroSuggestioncurrentDSTotal + +item.zzcur_ds;
								zeroSuggestionsuggestedTotal = zeroSuggestionsuggestedTotal + +item.zzsuggest_qty;
								zeroSuggestiondifferenceTotal = zeroSuggestiondifferenceTotal + +item.diff_sugg_req;
								zeroSuggestionsuggestedDSTotal = zeroSuggestionsuggestedDSTotal + +item.suggested_ds;

								zeroSuggestionrequestedVolumeTotal = zeroSuggestionrequestedVolumeTotal + +item.zzrequest_qty;
								zeroSuggestionallocatedTotal = zeroSuggestionallocatedTotal + +item.zzallocated_qty;
								zeroSuggestionallocatedDSTotal = zeroSuggestionallocatedDSTotal + +item.allocated_ds;
								zeroSuggestionpendingAllocationTotal = zeroSuggestionpendingAllocationTotal + +item.pending_allocation;
								zeroSuggestionunfilledAllocationTotal = zeroSuggestionunfilledAllocationTotal + +item.unfilled__allocation;
							}

							if (totalRecordsReceived == i) {

								oInitialTotalsForUI.push({

									currentTotal: zeroSuggestioncurrentTotal,
									currentDSTotal: zeroSuggestioncurrentDSTotal,
									differenceTotal: zeroSuggestiondifferenceTotal,
									suggestedTotal: zeroSuggestionsuggestedTotal,
									suggestedDSTotal: zeroSuggestionsuggestedDSTotal,
									requestedVolumeTotal: requestedVolumeTotal,
									allocatedTotal: zeroSuggestionallocatedTotal,
									allocatedDSTotal: zeroSuggestionallocatedDSTotal,
									pendingAllocationTotal: zeroSuggestionpendingAllocationTotal,
									unfilledAllocationTotal: zeroSuggestionunfilledAllocationTotal

								});

								oInitialTotalsForUIBkup.push({

									currentTotal: currentTotal,
									currentDSTotal: currentDSTotal,
									differenceTotal: differenceTotal,
									suggestedTotal: suggestedTotal,
									suggestedDSTotal: suggestedDSTotal,
									requestedVolumeTotal: requestedVolumeTotal,
									allocatedTotal: allocatedTotal,
									allocatedDSTotal: allocatedDSTotal,
									pendingAllocationTotal: pendingAllocationTotal,
									unfilledAllocationTotal: unfilledAllocationTotal,
									onlyForBkup: true

								});

							}

						});

						// lets sort the model data as per the zzzadddata1 field.
						// var oStockAllocationData = _.sortBy(( _.sortBy(oStockAllocationData, 'zzzadddata1')), 'zzsuffix', 'zzintcol');
						/*global  _:true*/
						// if (this.afterSAPDataUpdate != true) {

							// oStockAllocationData = _.sortBy(oStockAllocationData, "zzzadddata1").reverse();
							// oStockAlocationBkup = _.sortBy(oStockAlocationBkup, "zzzadddata1").reverse();

							// var oStockAllocationData = _.chain(oStockAllocationData)
							// .sortBy('zzzadddata1').reverse()  
							// .sortBy('zzsuffix');                      

							//		var oStockAlocationBkup = _.chain(oStockAlocationBkup)
							// .sortBy('zzzadddata1').reverse()  
							// .sortBy('zzsuffix');                  

							
							//oStockAlocationBkup = _.sortBy( oStockAlocationBkup, "zzzadddata1" ).reverse();
						// } else {

							// reset and set again to retain the sort order 	
							// var oStockAllocationDataReset = [];
							// var oStockData = new sap.ui.model.json.JSONModel();
							// oStockData.setData(oStockAllocationDataReset);
							// this.getView().setModel(oStockData, "stockDataModel");

							// oStockAllocationData = _.sortBy(oStockAllocationData, "zzzadddata1").reverse();
							// oStockAlocationBkup = _.sortBy(oStockAlocationBkup, "zzzadddata1").reverse();

						// }
						
			
							// oStockAllocationData = _.sortBy(( _.sortBy(oStockAllocationData, 'zzzadddata1'), 'zzsuffix', "zzextcol"));
							// oStockAlocationBkup = _.sortBy(( _.sortBy(oStockAlocationBkup, "zzzadddata1"), "zzsuffix", "zzextcol"));			
						
							// 	var oStockAllocationData = _.chain(oStockAllocationData)
							// .sortBy("zzextcol")
							// .sortBy("zzsuffix")
							// 	.sortBy("zzzadddata1");
						
						
						
								// var oStockAllocationData = _.chain(oStockAllocationData)
								// .sortBy("zzzadddata1")
								// .sortBy("zzsuffix")
								// 	.sortBy("zzextcol");
						
							// var oStockAlocationBkup = _.chain(oStockAlocationBkup)
							// .sortBy("zzextcol")
							// .sortBy("zzsuffix")
							// 	.sortBy("zzzadddata1");
				 
						  oStockAllocationData = _.chain(oStockAllocationData)
							  .sortBy("zzextcol")
							  .sortBy("zzsuffix")
							  	.sortBy("model")
							  .value();
											 
				 	  oStockAlocationBkup = _.chain(oStockAlocationBkup)
							  .sortBy("zzextcol")
							  .sortBy("zzsuffix")
							  	.sortBy("model")
							  .value();
				 
				 
				 
				 

						// suggested Data here. 			
						var oStockData = new sap.ui.model.json.JSONModel();
						oStockData.setData(oStockAllocationData);
						this.getView().setModel(oStockData, "stockDataModel");
						// By default lets show the suggested only and by clicking on show all models then we expland the screen. 

						var suggestedTabClick = this._oViewLocalData.getProperty("/fromWhichTabClickIamIn"); //"suggestedTab"
						var suggestedVolumeonSeries = this._oViewLocalData.getProperty("/seriesSuggestedVolume"); // "0"
						var showSuggestModelsText = this._oResourceBundle.getText("SHOW_SUGGEST_MODELS"),
							showAllModelsText = this._oResourceBundle.getText("SHOW_ALL_MODELS");
						var currentText = this.getView().byId("showAllModelsBtn").getText();
						var oModelData2 = this.getView().getModel("stockDataModel").getData();

						if (suggestedVolumeonSeries == "0") {
							// by default we want to expand the records with zero qty. 
							if (currentText == showAllModelsText) {
								// set the text to show suggested models and expand the view. 
								this.getView().byId("showAllModelsBtn").setProperty("text", showSuggestModelsText);
								for (var i = 0; i < oModelData2.length; i++) {
									if (oModelData2[i].suggested <= 0) {
										oModelData2[i].visibleProperty = true;

									}
								}

							}

						} else {

							if (currentText == showAllModelsText) {
								for (var i = 0; i < oModelData2.length; i++) {
									if (oModelData2[i].suggested <= 0) {
										oModelData2[i].visibleProperty = false;

									}
								}

							} else {
								for (var i = 0; i < oModelData2.length; i++) {
									if (oModelData2[i].suggested <= 0) {
										oModelData2[i].visibleProperty = true;
									}
								}

							}

						}

						if (this.removeSuggestedRequestedZeroQty == true) {
							// if requested qty and suggested qty are zero,  then lets not show the user the data.	 	
							for (var i = 0; i < oModelData2.length; i++) {
								if (oModelData2[i].suggested <= 0 && oModelData2[i].requested_Volume <= 0) {
									oModelData2[i].visibleProperty = false;
									oModelData2.splice(i, 1); // lets remove the record from UI, no use for it
								}
							}

						}

						var oModelData = this.getView().getModel("stockDataModel");
						oModelData.updateBindings(true);

						// lets updat the bindings also. 
						// var oStockModel = this.getView().getModel("stockDataModel");
						// oStockModel.updateBindings(true);

						// stockData backup. 
						var oStockDataBkup = new sap.ui.model.json.JSONModel();
						var aDataCopy = JSON.parse(JSON.stringify(oStockAlocationBkup));
						oStockDataBkup.setData(aDataCopy);
						this.getView().setModel(oStockDataBkup, "stockDataModelBkup");

						// Totals Received From SAP.
						var oTotalRecevied = new sap.ui.model.json.JSONModel();
						oTotalRecevied.setData(oInitialTotalsForUI);
						this.getView().setModel(oTotalRecevied, "initialStockTotalModel");

						// Bkup total Model. 
						var oTotalReceviedBkupModel = new sap.ui.model.json.JSONModel();
						// oTotalReceviedBkupModel.setData(oInitialTotalsForUIBkup);
						oTotalReceviedBkupModel.setData(oInitialTotalsForUI);
						this.getView().setModel(oInitialTotalsForUIBkup, "initialStockTotalModelBkup");

						// build the model received before reset
						var oStockBefore = new sap.ui.model.json.JSONModel();
						oStockBefore.setData(oStockBeforeReset);
						this.getView().setModel(oStockBefore, "stockFromSAPModel");

						// for the totals subtract from the total					
						var oModel = this.getView().getModel("initialStockTotalModel");
						if (oModel.oData.length <= 1) {
							this._calculateTotals();
							// var oDetailModel = this.getView().getModel("oViewLocalDataModel");
							// 	oDetailModel.setProperty("/setEnableFalseSuggest", false);	
						}

						//	   this._carryOnWithtotals();
						// check if initialallocation stock is blank do not display the column. 

						//var oStockModel = this.getView().getModel("initialStockTotalModel").getData();

						//var allocatedQtyTotal = oStockModel["0"].allocatedTotal;
						var oViewLocalModel = this.getView().getModel("oViewLocalDataModel");

						if (currentStatus == "S") {
							oViewLocalModel.setProperty("/viewInSuggestedTab", false);

							if (this.outSideWindowDate == false) {
								if (this.sLoggedinUserIsDealer == true) {
									oViewLocalModel.setProperty("/enableForDealer", true);
									oViewLocalModel.setProperty("/setEnableFalseReset", true);
								} else {
									oViewLocalModel.setProperty("/enableForDealer", false);
									oViewLocalModel.setProperty("/setEnableFalseReset", false);
								}

							}

							// } else {
							// 	oViewLocalModel.setProperty("/viewInSuggestedTab", true);
						}

						if (currentStatus == "R") {
							//	oViewLocalModel.setProperty("/viewInSuggestedTab", true);
							// oViewLocalDataModel>/setEnableFalseReset   
							oViewLocalModel.setProperty("/setEnableFalseReset", false);
							oViewLocalModel.setProperty("/enableForDealer", false);
						}

						//  eta froma and To Dates. 
						var valueOfEarlierEtaFrom, valueOFEarlierEtaTo;
						var lowestEtaFrom, highestEtaTo;
						for (var i = 0; i < etaFromAndToDates.length; i++) {

							if ((etaFromAndToDates[i].sEtaFromData < valueOfEarlierEtaFrom) && (etaFromAndToDates[i].sEtaFromData < lowestEtaFrom) ||
								lowestEtaFrom == undefined) {
								lowestEtaFrom = etaFromAndToDates[i].sEtaFromData;

							}
							if ((etaFromAndToDates[i].sEtaToData > valueOFEarlierEtaTo) && (etaFromAndToDates[i].sEtaToData > highestEtaTo) ||
								highestEtaTo == undefined) {
								highestEtaTo = etaFromAndToDates[i].sEtaToData;

							}

							valueOfEarlierEtaFrom = etaFromAndToDates[i].sEtaFromData;
							valueOFEarlierEtaTo = etaFromAndToDates[i].sEtaToData;
						}

						var etaFromDateMonth = lowestEtaFrom.substr(4, 2);
						var etaFromDateYear = lowestEtaFrom.substr(0, 4);
						var etaToDateMonth = highestEtaTo.substr(4, 2);
						var etaToDateYear = highestEtaTo.substr(0, 4);
						var dummyDate = "01";
						var fromCompleteDate = etaFromDateMonth + "/" + dummyDate + "/" + etaFromDateYear;
						var toCompleteDate = etaToDateMonth + "/" + dummyDate + "/" + etaToDateYear;

						if (localeG == 'EN') {
							locale = "en-us";
						} else {
							locale = "fr-us";
						}

						var objDate = new Date(fromCompleteDate),
							locale = locale,
							month = objDate.toLocaleString(locale, {
								month: "short"
							});

						var fromMonthAndYear = "01 " + month + " " + etaFromDateYear;

						var objDateTo = new Date(toCompleteDate),
							locale = locale,
							month = objDateTo.toLocaleString(locale, {
								month: "short"
							});

						//    var getTheDaysIntheMonth = getDaysInMonth(month, etaToDateYear);

						var getTheDaysIntheMonth = new Date(+etaToDateYear, +etaToDateMonth, 0).getDate();
						//   console.log(getDaysInMonth(1, 2012))
						var toMonthAndYear = getTheDaysIntheMonth + " " + month + " " + etaToDateYear;
						
						if (localeG == 'EN') {
							var dateToUI = "ETA :" + fromMonthAndYear + " To " + toMonthAndYear;
						} else {
							var dateToUI = "heure d'arrivée estimée :" + fromMonthAndYear + " à " + toMonthAndYear;
						}
						
						
						
						
						
					
						oModelLocalData.setProperty("/etaFrom", dateToUI);

						//

					}.bind(this),
					error: function (response) {
						sap.ui.core.BusyIndicator.hide();
					}
				});
			},
			onLiveChange: function (oEvent) {
				this.sSearchQuery = oEvent.getSource()
					.getValue();
				this.fnApplyFiltersAndOrdering();
			},
			fnApplyFiltersAndOrdering: function (oEvent) {
				var aFilters = [],
					aSorters = [];

				// aSorters.push(new Sorter("dealerId1", this.bDescending));

				if (this.sSearchQuery) {
					var oFilter = new Filter([
						new Filter("model", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
						new Filter("modelCodeDescription", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
						new Filter("suffix_desc", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
						new Filter("colour_Trim", sap.ui.model.FilterOperator.Contains, this.sSearchQuery)
					], false);
					// this.sSearchQuery);
					aFilters.push(oFilter);
				}

				this.byId("stockDataModelTableId")
					.getBinding("items")
					.filter(aFilters)
					.sort(aSorters);
			},

		});
	}, /* bExport= */ true);