sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	'sap/m/MessageToast',
], function (BaseController, MessageBox, Utilities, History, MessageToast) {
	"use strict";

	return BaseController.extend("suggestOrder.controller.StockAllocation", {
		handleRouteMatched: function (oEvent) {
			var sAppId = "App5bb4c41429720e1dcc397810";

			var oParams = {};

			var selectedSeries = sap.ui.getCore().getModel('selectedSeries').getData();

			// // new template and local model to post the data to sap. 
			// 				this._oNewEntryModel = new sap.ui.model.json.JSONModel();
			// 				this._oNewEntryModel.setData(this._dataTemplateForPostSAP());
			// 				this.setModel(this._oNewEntryModel, "dataForSAPModel");

			//  end
			//	Zzmoyr - zzseries_desc_en
			var modelSereiesHead = selectedSeries.series; //selectedSeries.Zzmoyr + " - " + selectedSeries.zzseries_desc_en;
			this.orderPrefix = selectedSeries.orderPrefix;
			var enableForDealer, setEnableFalseReset, viewInSuggestedTab;

			if (selectedSeries.whichTabClicked == "requestedTab") {
				viewInSuggestedTab = false;
			}
			if (selectedSeries.sLoggedinUserType == "DealerUser") {
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

			} else {
				this.outSideWindowDate = false;
				if (this.sLoggedinUserIsDealer == true){
				setEnableFalseReset = true;
				} else {
					setEnableFalseReset = false;	
				}
			}

			if ((selectedSeries.parsedtodayDate >= selectedSeries.windowEndDateP) && (selectedSeries.allocationIndicator == "A")) {
				viewInSuggestedTab = false;
			}

			if (selectedSeries.allocationIndicator == "R") {
				viewInSuggestedTab = true;
			}

			if (selectedSeries.allocationIndicator == "S") {
				viewInSuggestedTab = true;
			}

			// if it is allocated and greater than window due date,  then turn off the 

			//	enableForDealer = true; // TODO: to be removed on a later date before qa guna

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
				etaFrom: "ETA :01 Feb 2019 To 28 Feb 2019"

				// sLoggedinUserType: selectedSeries.sLoggedinUserType,
				// etaFrom: "",
				// etaTo: ""

			});

			var oModelLocalData = this.getView().setModel(this._oViewLocalData, "oViewLocalDataModel");

			// make a call to SAP and fetch the data for the 4th screen
			this.dealerCode = selectedSeries.dealerCode;
			this.series = selectedSeries.zzseries;
			var Language = selectedSeries.Language;

			this._setTheLanguage(Language); // set the language
			//	var oGetModel = this.getView().getModel("ZCDS_SUGGEST_ORD_CDS");

			this.oModel = this.getOwnerComponent().getModel("ZCDS_SUGGEST_ORD_CDS");

			// var oGetModelDetailData = this.getView().getModel("ZCDS_SUGGEST_ORD_CDS");
			// oGetModelDetailData.read("/zcds_suggest_ord", {

			this.oModel.read("/zcds_suggest_ord", {
				urlParameters: {

					"$filter": "zzdealer_code eq'" + this.dealerCode + "'and zzseries eq '" + this.series + "'"
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

						// if (i == 0) {
						// 	currentStatus = item.zzallocation_ind;
						// 	sEtaFromData = item.zzeta_month; //item.zzreq_eta_from; //item.zzstart_date;
						// 	sEtaToData = item.zzprod_month; // item.sEtaToData; //item.zzend_date;

						// 	//  var monthLocalizedString = function(month, locale) {
						// 	//     return new Date(2010,month).toLocaleString(locale,{month:"long"});
						// 	// };

						// 	if (sEtaFromData) {

						// 	}
						// }

						// Zzextcol - mktg_desc_en / zzintcol - int_trim_desc_en
						if (localeG == 'EN') {
							var mktgDescriptionBasedOnLang = item.mktg_desc_en;
							var suffixDescription = item.suffix_desc_en;
							var interiorTrimDesc = item.int_trim_desc_en;
						} else {
							var mktgDescriptionBasedOnLang = item.mktg_desc_fr;
							var suffixDescription = item.suffix_desc_fr;
							var interiorTrimDesc = item.int_trim_desc_fr;
						}

						uiForcolorTrim = item.zzextcol + "-" + mktgDescriptionBasedOnLang + "/" + item.zzintcol + "-" + interiorTrimDesc;

						var suffixToUi = item.zzsuffix + " " + suffixDescription;

						etaFromAndToDates.push({
							sEtaFromData: item.zzeta_month,
							sEtaToData: item.zzeta_month,
							//	sEtaToData: item.zzprod_month
						});

						oStockAllocationData.push({

							model: item.zzmodel,
							suffix: item.zzsuffix, //,
							suffix_desc: suffixToUi,
							colour_Trim: uiForcolorTrim,
							current: item.zzcur_stock,
							current_Ds: item.zzcur_ds,
							suggested: item.zzsuggest_qty,
							suggested_Ds: item.suggested_ds,
							requested_Volume: item.zzrequest_qty,
							difference: item.diff_sugg_req,
							requested_Ds: item.requested_ds, // Missing from oData
							allocated: item.zzallocated_qty,
							allocated_Ds: item.allocated_ds, //Missing from oData
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
							zzsuffix: item.zzsuffix

						});

						oStockAlocationBkup.push({

							model: item.zzmodel,
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
							zzsuffix: item.zzsuffix

						});

						oStockBeforeReset.push({

							model: item.zzmodel,
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
							zzsuffix: item.zzsuffix

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

						if (totalRecordsReceived == i) {

							oInitialTotalsForUI.push({

								currentTotal: currentTotal,
								currentDSTotal: currentDSTotal,
								differenceTotal: differenceTotal,
								suggestedTotal: suggestedTotal,
								suggestedDSTotal: suggestedDSTotal,
								requestedVolumeTotal: requestedVolumeTotal,
								allocatedTotal: allocatedTotal,
								allocatedDSTotal: allocatedDSTotal,
								pendingAllocationTotal: pendingAllocationTotal,
								unfilledAllocationTotal: unfilledAllocationTotal

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

					// suggested Data here. 			
					var oStockData = new sap.ui.model.json.JSONModel();
					oStockData.setData(oStockAllocationData);
					this.getView().setModel(oStockData, "stockDataModel");

					// lets updat the bindings also. 
					// var oStockModel = this.getView().getModel("stockDataModel");
					// oStockModel.updateBindings(true);

					// stockData backup. 
					var oStockDataBkup = new sap.ui.model.json.JSONModel();
					oStockDataBkup.setData(oStockAlocationBkup);
					this.getView().setModel(oStockDataBkup, "stockDataModelBkup");

					// Totals Received From SAP.
					var oTotalRecevied = new sap.ui.model.json.JSONModel();
					oTotalRecevied.setData(oInitialTotalsForUI);
					this.getView().setModel(oTotalRecevied, "initialStockTotalModel");

					// Bkup total Model. 
					var oTotalReceviedBkupModel = new sap.ui.model.json.JSONModel();
					oTotalReceviedBkupModel.setData(oInitialTotalsForUIBkup);
					this.getView().setModel(oInitialTotalsForUIBkup, "initialStockTotalModelBkup");

					// build the model received before reset
					var oStockBefore = new sap.ui.model.json.JSONModel();
					oStockBefore.setData(oStockBeforeReset);
					this.getView().setModel(oStockBefore, "stockFromSAPModel");

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
						locale = "en-us",
						month = objDate.toLocaleString(locale, {
							month: "short"
						});

					var fromMonthAndYear = "01 " + month + " " + etaFromDateYear;

					var objDateTo = new Date(toCompleteDate),
						locale = "en-us",
						month = objDateTo.toLocaleString(locale, {
							month: "short"
						});

					//    var getTheDaysIntheMonth = getDaysInMonth(month, etaToDateYear);

					var getTheDaysIntheMonth = new Date(+etaToDateYear, +etaToDateMonth, 0).getDate();
					//   console.log(getDaysInMonth(1, 2012))
					var toMonthAndYear = getTheDaysIntheMonth + " " + month + " " + etaToDateYear;
					var dateToUI = "ETA :" + fromMonthAndYear + " To " + toMonthAndYear;
					oModelLocalData.setProperty("/etaFrom", dateToUI);

					//

				}.bind(this),
				error: function (response) {
					sap.ui.core.BusyIndicator.hide();
				}
			});

			//  data needed for summation on temporary mode 

			//this._buildSuggestedModel();

			//          var oModelStockData = this.getView().getModel("stockDataModel");   //.getData();

			// var arr = [1,2,3,4];  current
			// var currenttotal=0;
			// for(var i in oModelStockData) { currenttotal += oModelStockData.current[i]; }

			// if (oEvent.mParameters.data.context) {
			// 	this.sContext = oEvent.mParameters.data.context;

			// } else {
			// 	if (this.getOwnerComponent().getComponentData()) {
			// 		var patternConvert = function (oParam) {
			// 			if (Object.keys(oParam).length !== 0) {
			// 				for (var prop in oParam) {
			// 					if (prop !== "sourcePrototype") {
			// 						return prop + "(" + oParam[prop][0] + ")";
			// 					}
			// 				}
			// 			}
			// 		};

			// 		this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);

			// 	}
			// }

			// var oPath;

			// if (this.sContext) {
			// 	oPath = {
			// 		path: "/" + this.sContext,
			// 		parameters: oParams
			// 	};
			// 	this.getView().bindObject(oPath);
			// }

		},

		whenUserChangesRequestedData: function (oEvt) {
			// the total might need to be updated. 
			var oTotalModelData = this.getView().getModel("initialStockTotalModel"); //.getData();
			// requestedVolumeTotal
			var currentValue = oEvt.getSource().getProperty("value");

			// oEvt.getParameter("value")	;

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
							// requestedVolumeTotal
							//	var currentValue = oEvt.getSource().getProperty("value");

							// oEvt.getParameter("value")	;

							//	var oldValue = oEvt.getSource()._sOldValue;
							var tempRequestedTotal = 0;
							//	if (currentValue != oldValue) {
							// trigger the flag to show a loss of data. 
							//	that.resultsLossofData = true;

							var oStockModelData = that.getView().getModel("stockDataModel").getData();
							for (var i = 0; i < oStockModelData.length; i++) {

								tempRequestedTotal = tempRequestedTotal + +oStockModelData[i].requested_Volume;

							}

							//	oTotalModelData.oData["0"].requestedVolumeTotal = tempRequestedTotal;

							var updationRequestedVolume = oTotalModelData.getProperty("/");

							updationRequestedVolume["0"].requestedVolumeTotal = tempRequestedTotal;
							oTotalModelData.updateBindings(true);

							//	}

							//	that._navBack();
						}
					}
				}
			);

			// }

			// return new Promise(function (fnResolve) {
			// 	var aChangedEntitiesPath, oChangedBindingContext;
			// 	var oModel = this.oModel;
			// 	if (oModel && oModel.hasPendingChanges()) {
			// 		aChangedEntitiesPath = Object.keys(oModel.mChangedEntities);

			// 		for (var j = 0; j < aChangedEntitiesPath.length; j++) {
			// 			oChangedBindingContext = oModel.getContext("/" + aChangedEntitiesPath[j]);
			// 			if (oChangedBindingContext && oChangedBindingContext.bCreated) {
			// 				oModel.deleteCreatedEntry(oChangedBindingContext);
			// 			}
			// 		}
			// 		oModel.resetChanges();
			// 	}
			// 	fnResolve();
			// }.bind(this)).catch(function (err) {
			// 	if (err !== undefined) {
			// 		MessageBox.error(err.message);
			// 	}
			// });

		},
		_onButtonPressSave: function (oEvent) {
			var that = this;

			sap.ui.core.BusyIndicator.show();
			// jsut send the data to SAP Plain vanilla. 

			this.SaveButtonClicked = true;

			var oSuggestUpdateModel = that.getOwnerComponent().getModel("ZSD_SUGGEST_ORDER_UPDATE_SRV");

			that._oToken = oSuggestUpdateModel.getHeaders()['x-csrf-token'];
			$.ajaxSetup({
				headers: {
					'X-CSRF-Token': that._oToken
				}
			});

			//  now check where ever there is a change in quantity,  send a flag to SAP,  the data is changed. 

			var oStockSapData = that.getView().getModel("stockDataModel");
			var stockFromSAP = oStockSapData.getData();
			var stockSAPProp = oStockSapData.getProperty("/");
			var stockFromScreen = that.getView().getModel("stockFromSAPModel").getData();
			this._dataupdateSuccessful = false;
			// replace teh stock from screen with stock from sap. 
			this.totalRecordsUpdated = (stockFromSAP.length);
			for (var i = 0; i < stockFromSAP.length; i++) {

				this._postTheDataToSAP(oSuggestUpdateModel, stockSAPProp[i]);

			}

		},

		_navigateToMainScreen: function () {

			// if (this._dataupdateSuccessful == true) {

			var showRecordSaved = this._oResourceBundle.getText("RECORD_SAVED_INSAP");

			sap.m.MessageToast.show(showRecordSaved, {
				duration: 3000, // default
				width: "15em", // default
				my: "center middle",
				at: "center middle",
				of: window, // default
				offset: "0 0", // default
				collision: "fit fit", // default
				onClose: null, // default
				autoClose: true, // default
				animationTimingFunction: "ease", // default
				animationDuration: 1000, // default
				closeOnBrowserNavigation: false // default
			});

			//reset the model 

			var oStockAllocationData = [];
			var oStockData = new sap.ui.model.json.JSONModel();
			oStockData.setData(oStockAllocationData);
			this.getView().setModel(oStockData, "stockDataModel");

			var oModelStockDataModel = this.getView().getModel("stockDataModel");
			oModelStockDataModel.updateBindings(true);

			this.oRouter.navTo("ProductionRequestSummary");
			// };

		},

		_postTheDataToSAP: function (oSuggestUpdateModel, sendTheDataToSAP) {
			var requestedVolume = sendTheDataToSAP.requested_Volume.toString();
			var dealerCode = this.dealerCode;
			var orderPrefix = this.orderPrefix;
			var oData = {

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
				Zzprefix: orderPrefix

			};

			var that = this;
			that.responseReceived = 0;
			oSuggestUpdateModel.create("/TSuggestOrdSet", (oData), {
				success: $.proxy(function (data, response) {

					that.responseReceived = that.responseReceived + 1;

					if (that.totalRecordsUpdated == that.responseReceived) {
						// all is done lets navigate back to the main screen. 
						// sap.ui.core.BusyIndicator.hide();
						//sap.ui.core.BusyIndicator.show();
						that._navigateToMainScreen();

					}

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

		onClickShowAllModels: function (oEvent) {

			var showSuggestModelsText = this._oResourceBundle.getText("SHOW_SUGGEST_MODELS"),
				showAllModelsText = this._oResourceBundle.getText("SHOW_ALL_MODELS");

			var currentText = this.getView().byId("showAllModelsBtn").getText();
			var oDetailModel = this.getView().getModel("oViewLocalDataModel");
			if (currentText == showSuggestModelsText) {
				this.getView().byId("showAllModelsBtn").setProperty("text", showAllModelsText);
				// enabled="{oViewLocalDataModel>/setEnableFalse}"

				oDetailModel.setProperty("/setEnableFalsePercentages", false);

				this._showSuggestedModels();
			} else {
				this.getView().byId("showAllModelsBtn").setProperty("text", showSuggestModelsText);
				oDetailModel.setProperty("/setEnableFalsePercentages", true);

				this._showAllModels();
			}

		},

		_showSuggestedModels: function (oEvt) {

			var oModelData2 = this.getView().getModel("stockDataModel").getData();
			var oInitalTotalStock = this.getView().getModel("initialStockTotalModel");
			var oInitialTotalStockModel = oInitalTotalStock.getData();

			for (var i = 0; i < oModelData2.length; i++) {

				//	visibleProperty "0%"

				if ((oModelData2[i].suggested <= 0) || (oModelData2[i].suggested <= "0%")) {

					oModelData2[i].visibleProperty = false;
					if (oModelData2[i].suggested != "0%") {
						oInitialTotalStockModel["0"].suggestedTotal = oInitialTotalStockModel["0"].suggestedTotal - +oModelData2[i].suggested;
						oInitialTotalStockModel["0"].currentDSTotal = oInitialTotalStockModel["0"].currentDSTotal - +oModelData2[i].current_Ds;
						oInitialTotalStockModel["0"].currentTotal = oInitialTotalStockModel["0"].currentTotal - +oModelData2[i].current;
						oInitialTotalStockModel["0"].differenceTotal = oInitialTotalStockModel["0"].differenceTotal - +oModelData2[i].difference;
						oInitialTotalStockModel["0"].requestedVolumeTotal = oInitialTotalStockModel["0"].requestedVolumeTotal - +oModelData2[i].requested_Volume;
						oInitialTotalStockModel["0"].suggestedDSTotal = oInitialTotalStockModel["0"].suggestedDSTotal - +oModelData2[i].suggested_Ds;

						oInitialTotalStockModel["0"].allocatedTotal = oInitialTotalStockModel["0"].allocatedTotal - +oModelData2[i].allocated;
						oInitialTotalStockModel["0"].allocatedDSTotal = oInitialTotalStockModel["0"].allocatedDSTotal - +oModelData2[i].allocated_Ds;
						oInitialTotalStockModel["0"].pendingAllocationTotal = oInitialTotalStockModel["0"].pendingAllocationTotal - +oModelData2[i].pendingAllocation;
						oInitialTotalStockModel["0"].unfilledAllocationTotal = oInitialTotalStockModel["0"].unfilledAllocationTotal - +oModelData2[i].unfilled_Allocation;

					}
				}

			}
			oInitalTotalStock.updateBindings(true);
			var oSuggestModel = new sap.ui.model.json.JSONModel();
			oSuggestModel.setData(oModelData2);
			this.getView().setModel(oSuggestModel, "stockDataModel");

		},

		_showAllModels: function (oEvt) {

			var oModelData = this.getView().getModel("stockDataModel").getData();
			var oInitalTotalStock = this.getView().getModel("initialStockTotalModel");
			var oInitialTotalStockModel = oInitalTotalStock.getData();

			for (var i = 0; i < oModelData.length; i++) {

				if ((oModelData[i].suggested <= 0) || (oModelData[i].suggested <= "0%")) {
					oModelData[i].visibleProperty = true;
					if (oModelData[i].suggested != "0%") {
						oInitialTotalStockModel["0"].suggestedTotal = +oInitialTotalStockModel["0"].suggestedTotal + +oModelData[i].suggested;
						oInitialTotalStockModel["0"].currentDSTotal = oInitialTotalStockModel["0"].currentDSTotal + +oModelData[i].current_Ds;
						oInitialTotalStockModel["0"].currentTotal = oInitialTotalStockModel["0"].currentTotal + +oModelData[i].current;
						oInitialTotalStockModel["0"].differenceTotal = oInitialTotalStockModel["0"].differenceTotal + +oModelData[i].difference;
						oInitialTotalStockModel["0"].requestedVolumeTotal = oInitialTotalStockModel["0"].requestedVolumeTotal + +oModelData[i].requested_Volume;
						oInitialTotalStockModel["0"].suggestedDSTotal = oInitialTotalStockModel["0"].suggestedDSTotal + +oModelData[i].suggested_Ds;

						oInitialTotalStockModel["0"].allocatedTotal = oInitialTotalStockModel["0"].allocatedTotal + +oModelData[i].allocated;
						oInitialTotalStockModel["0"].allocatedDSTotal = oInitialTotalStockModel["0"].allocatedDSTotal + +oModelData[i].allocated_Ds;
						oInitialTotalStockModel["0"].pendingAllocationTotal = oInitialTotalStockModel["0"].pendingAllocationTotal + +oModelData[i].pendingAllocation;
						oInitialTotalStockModel["0"].unfilledAllocationTotal = oInitialTotalStockModel["0"].unfilledAllocationTotal + +oModelData[i].unfilled_Allocation;

					}
				}

			}
			oInitalTotalStock.updateBindings(true);
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
				oDetailModel.setProperty("/setEnableFalseSuggest", false);
				this.getView().byId("showPercentagesBtn").setProperty("text", showAllPercentagesText);
				this._showPercentages();
			} else {
				this.getView().byId("showPercentagesBtn").setProperty("text", showSuggestPercentagesText);
				oDetailModel.setProperty("/setEnableFalseSuggest", true);
				this._showAllVAlues();
			}

		},
		_showPercentages: function (oEvt) {
			var oModelData = this.getView().getModel("stockDataModel"),
				oModelData2 = oModelData.getData(),
				oModelProp = oModelData.getProperty("/");

			var oInitialTotalStockModel = this.getView().getModel("initialStockTotalModel").getData();

			//current: currentDSTotal   
			//current_Ds         currentDSTotal

			for (var i = 0; i < oModelData2.length; i++) {

				oModelProp[i].current = this._calculatePercentage(+oModelData2[i].current, +oInitialTotalStockModel["0"].currentTotal) + "%";
				// oModelProp[i].current_Ds = this._calculatePercentage(+oModelData2[i].current_Ds, +oInitialTotalStockModel["0"].currentDSTotal) + "%";

				oModelProp[i].suggested = this._calculatePercentage(+oModelData2[i].suggested, +oInitialTotalStockModel["0"].suggestedTotal) + "%";
				// oModelProp[i].suggested_Ds = this._calculatePercentage(+oModelData2[i].suggested_Ds, +oInitialTotalStockModel["0"].suggestedDSTotal) +
				// 	"%";
				//oModelProp[i].requested_Volume = this._calculatePercentage(+oModelData2[i].requested_Volume, +oInitialTotalStockModel["0"].requestedVolumeTotal) + "%";
				oModelProp[i].allocated = this._calculatePercentage(+oModelData2[i].allocated, +oInitialTotalStockModel["0"].allocatedTotal) + "%";
				// oModelProp[i].pendingAllocation = this._calculatePercentage(+oModelData2[i].pendingAllocation, +oInitialTotalStockModel["0"].pendingAllocationTotal) +
				// 	"%";
				// oModelProp[i].unfilled_Allocation = this._calculatePercentage(+oModelData2[i].unfilled_Allocation, +oInitialTotalStockModel["0"].unfilledAllocationTotal) +
				// 	"%";
				if (+oModelData2[i].difference < 0) {

					oModelProp[i].difference = this._calculatePercentage(+oModelData2[i].difference, +oInitialTotalStockModel["0"].requestedVolumeTotal) +
						"%";

				} else {
					oModelProp[i].difference = this._calculatePercentage(+oModelData2[i].difference, +oInitialTotalStockModel["0"].requestedVolumeTotal) +
						"%";
				}

			}

			oModelData.updateBindings(true);

			var oModelInitialStockModel = this.getView().getModel("initialStockTotalModel");
			var oModelInitialStockModelData = oModelInitialStockModel.getData();

			if (oModelInitialStockModelData["0"].differenceTotal < 0) {
				var sPrefix = "-" + "100%";

			}
			// also the totals need to be set. 
			var oInitialTotalsForUI = [];
			oInitialTotalsForUI.push({

				currentTotal: "100%",
				currentDSTotal: oModelInitialStockModelData["0"].currentDSTotal,
				// currentDSTotal: "100%",
				// differenceTotal: sPrefix,
				suggestedTotal: "100%",

				allocatedDSTotal: oModelInitialStockModelData["0"].allocatedDSTotal,
				suggestedDSTotal: oModelInitialStockModelData["0"].suggestedDSTotal,
				// suggestedDSTotal: "100%",
				requestedVolumeTotal: oModelInitialStockModelData["0"].requestedVolumeTotal,
				allocatedTotal: "100%",
				// pendingAllocationTotal: "100%",
				pendingAllocationTotal: oModelInitialStockModelData["0"].pendingAllocationTotal,
				// unfilledAllocationTotal: "100%"
				unfilledAllocationTotal: oModelInitialStockModelData["0"].unfilledAllocationTotal

			});

			// Totals Received From SAP.
			var oTotalRecevied = new sap.ui.model.json.JSONModel();
			oTotalRecevied.setData(oInitialTotalsForUI);
			this.getView().setModel(oTotalRecevied, "initialStockTotalModel");

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

			// stockDataModelBkup
			var oStockDataModelBkup = this.getView().getModel("stockDataModelBkup").getData();
			//	var aDataCopy = JSON.parse(JSON.stringify(oStockDataModelBkup));
			var aDataCopy = oStockDataModelBkup;
			// the requested qty is changed in the UI we have to retain it. not reset it when click show all values. 
			var oStockFromScreenWithChangedRequestQty = this.getView().getModel("stockDataModel").getData();

			// Guna Todo reverse engineering -  from the percentage get the values. 
			var oStockAllocationData = [];
			for (var i = 0; i < oStockDataModelBkup.length; i++) {

				for (var j = 0; j < oStockFromScreenWithChangedRequestQty.length; j++) {

					if (aDataCopy[i].model == oStockFromScreenWithChangedRequestQty[j].model && aDataCopy[i].suffix ==
						oStockFromScreenWithChangedRequestQty[j].suffix &&
						aDataCopy[i].zzsug_seq_no == oStockFromScreenWithChangedRequestQty[j].zzsug_seq_no) {

						var dataType = typeof oStockFromScreenWithChangedRequestQty[j].requested_Volume;
						if (dataType == "number") {
							oStockFromScreenWithChangedRequestQty[j].requested_Volume = JSON.stringify(oStockFromScreenWithChangedRequestQty[j].requested_Volume);
						}

						if (aDataCopy[i].requested_Volume != oStockFromScreenWithChangedRequestQty[j].requested_Volume) {
							// oStockFromScreenWithChangedRequestQty[j].requested_Volume = JSON.stringify(oStockFromScreenWithChangedRequestQty[j].requested_Volume);
							var requestedQty = oStockFromScreenWithChangedRequestQty[j].requested_Volume;
							// if (isNaN(requestedQty) ) {
							//  	 var requestedQty = oStockFromScreenWithChangedRequestQty[j].requested_Volume;
							// } else {
							// 	oStockFromScreenWithChangedRequestQty[j].requested_Volume = JSON.stringify(oStockFromScreenWithChangedRequestQty[j].requested_Volume);
							// 	var requestedQty = oStockFromScreenWithChangedRequestQty[j].requested_Volume;
							// }

						} else {
							var requestedQty = aDataCopy[i].requested_Volume;
						}
						oStockAllocationData.push({

							model: aDataCopy[i].model,
							suffix: aDataCopy[i].suffix,
							suffix_desc: aDataCopy[i].suffix_desc,
							colour_Trim: aDataCopy[i].colour_Trim,
							current: aDataCopy[i].current,
							current_Ds: aDataCopy[i].current_Ds,
							suggested: aDataCopy[i].suggested,
							suggested_Ds: aDataCopy[i].suggested_Ds,
							requested_Volume: requestedQty,
							difference: aDataCopy[i].difference,
							requested_Ds: aDataCopy[i].requested_Ds,
							allocated: aDataCopy[i].allocated,
							allocated_Ds: aDataCopy[i].allocated_Ds,
							pendingAllocation: aDataCopy[i].pendingAllocation,
							visibleProperty: true,
							unfilled_Allocation: aDataCopy[i].unfilled_Allocation,
							dealer_code: aDataCopy[i].dealer_code,
							zzordertype: aDataCopy[i].zzordertype,
							zzsug_seq_no: aDataCopy[i].zzsug_seq_no,
							zzprocess_dt: aDataCopy[i].zzprocess_dt,
							zzextcol: aDataCopy[i].zzextcol,
							zzintcol: aDataCopy[i].zzintcol,
							zsrc_werks: aDataCopy[i].zsrc_werks,
							zzprod_month: aDataCopy[i].zzprod_month,
							zzeta_month: aDataCopy[i].zzeta_month,
							zzsuffix: aDataCopy[i].zzsuffix,

						});
						break;
					}
					// 				oStockFromScreenWithChangedRequestQty[j].requested_Volume 

				}
			}

			var oSuggestModel = new sap.ui.model.json.JSONModel();
			oSuggestModel.setData(oStockAllocationData);
			this.getView().setModel(oSuggestModel, "stockDataModel");

			// 		var oStockDataModel = new sap.ui.model.json.JSONModel();
			// oStockDataModel.setData(oStockDataModelBkup);
			// this.getView().setModel(oStockDataModelBkup, "stockDataModel");

			// var oModelTemp = this.getView().getModel("stockDataModel");
			// oModelTemp.updateBindings(true);
			//  the total model need to be reset with the values. 

			var oTotalStockFromBkup = this.getView().getModel("initialStockTotalModelBkup"); //.getData();
			var aDataFromTotal = JSON.parse(JSON.stringify(oTotalStockFromBkup));

			var oInitialTotalsForUI = [];
			oInitialTotalsForUI.push({
				currentTotal: aDataFromTotal["0"].currentTotal,
				differenceTotal: aDataFromTotal["0"].differenceTotal,
				currentDSTotal: aDataFromTotal["0"].currentDSTotal,
				suggestedTotal: aDataFromTotal["0"].suggestedTotal,
				suggestedDSTotal: aDataFromTotal["0"].suggestedDSTotal,
				requestedVolumeTotal: aDataFromTotal["0"].requestedVolumeTotal,
				allocatedTotal: aDataFromTotal["0"].allocatedTotal,
				allocatedDSTotal: aDataFromTotal["0"].allocatedDSTotal,
				pendingAllocationTotal: aDataFromTotal["0"].pendingAllocationTotal,
				unfilledAllocationTotal: aDataFromTotal["0"].unfilledAllocationTotal

			});

			// Totals Received From SAP.
			var oTotalRecevied = new sap.ui.model.json.JSONModel();
			oTotalRecevied.setData(oInitialTotalsForUI);
			this.getView().setModel(oTotalRecevied, "initialStockTotalModel");

			//the requested total should also be reset

			var oTotalModelData = this.getView().getModel("initialStockTotalModel"); //.getData();

			var tempRequestedTotal = 0;

			// this.resultsLossofData = true;

			var oStockModelData = this.getView().getModel("stockDataModel").getData();
			for (var i = 0; i < oStockModelData.length; i++) {

				tempRequestedTotal = tempRequestedTotal + +oStockModelData[i].requested_Volume;

			}

			var updationRequestedVolume = oTotalModelData.getProperty("/");

			updationRequestedVolume["0"].requestedVolumeTotal = tempRequestedTotal;
			oTotalModelData.updateBindings(true);

			//    					var oTotalReceviedBkupModel = new sap.ui.model.json.JSONModel();
			// oTotalReceviedBkupModel.setData(aDataFromTotal);
			// this.getView().setModel(aDataFromTotal, "initialStockTotalModel");

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
					ZzrequestQty: requestedVolume

				});
			});

			return oItemSet;
		},

	});
}, /* bExport= */ true);