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
		var _timeout, objNew = {},
			btnSavePressed,
			backupModelData, processDate, itemModel, newseriesFlag, tempObj2, IntCol2, callNewModelCount = 0,
			salesNetData = [],
			localScope,
			checkOBJ = {};
		return BaseController.extend("suggestOrder.controller.StockAllocation", {
			handleRouteMatched: function (oEvent) {
				// sap.ui.core.BusyIndicator.show();
				this.defaultLightBusyDialog = new sap.m.BusyDialog();
				this.defaultLightBusyDialog.open();
				var sAppId = "App5bb4c41429720e1dcc397810";
				var oParams = {};
				callNewModelCount = 0;
				this.resultsLossofData = false;
				btnSavePressed = false;
				if (sap.ui.getCore().getModel("RouteConfig") && sap.ui.getCore().getModel("RouteConfig").getData()) {
					newseriesFlag = true;
					var routeConfig = sap.ui.getCore().getModel("RouteConfig").getData();
					// this.zzseries = routeConfig.zzseries;
					// this.zzmoyr = routeConfig.zzmoyr;

					this.dealerCode = routeConfig.Dealer;
					this.zzseries = routeConfig.zzseries;
					this.zzmoyr = routeConfig.zzmoyr;
					processDate = routeConfig.processDate;
					this.whichTabClicked = routeConfig.whichTabClicked;
					this.seriesDescription = routeConfig.zzseries_desc_en;
					this.Business_Partner_name = routeConfig.Business_Partner_name;
					this.UserId = routeConfig.Dealer;
					this.sLoggedinUserType = routeConfig.sLoggedinUserType;
					this.parsedtodayDate = routeConfig.parsedtodayDate;
					this.windowEndDateP = routeConfig.windowEndDateP;
					this.etaFromNewSeries = routeConfig.etaFromNewSeries;
					this.etaToNewSeries = routeConfig.etaToNewSeries;

					var Language = routeConfig.Language;
					// var Language = selectedSeries.Language;
					var enableForDealer, setEnableFalseReset, viewInSuggestedTab;

					if (this.whichTabClicked == "requestedTab") {
						viewInSuggestedTab = false;
					}
					if (this.sLoggedinUserType == "Dealer_User") {
						this.sLoggedinUserIsDealer = true;
						enableForDealer = true;
					} else {
						this.sLoggedinUserIsDealer = false;
						enableForDealer = false;
					}

					this.modelClickFlag = false;

					if ((this.parsedtodayDate >= this.windowEndDateP)) {
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

					if ((this.parsedtodayDate >= this.windowEndDateP)) {
						viewInSuggestedTab = false;
						this.removeSuggestedRequestedZeroQty = true;
					}

					this._oViewLocalData = new sap.ui.model.json.JSONModel({
						busy: false,
						delay: 0,
						visibleForDealer: true,
						visibleForInternalUser: true,
						editAllowed: true,
						enabled: true,
						BusinessPartnerName: this.Business_Partner_name,
						series: this.zzmoyr + " " + this.zzseries,
						enableForDealer: enableForDealer,
						viewInSuggestedTab: viewInSuggestedTab,
						setEnableFalseReset: setEnableFalseReset,
						etaFrom: "ETA :01 Feb 2019 To 28 Feb 2019",
						seriesSuggestedVolume: 0,
						fromWhichTabClickIamIn: this.whichTabClicked,
						setResetEnabled: false,
						checkBoxEnabled: false,
						processDate: processDate
							// checkBoxFlag: true
					});

					var oModelLocalData = this.getView().setModel(this._oViewLocalData, "oViewLocalDataModel");

					this.series = routeConfig.zzseries;
					this.yearModel = routeConfig.zzmoyr;
					var Language = routeConfig.Language;
					var newAddedQty = 0;
					var newAddedModel = routeConfig.zzmodel;
					var newAddedModelAndDescription = "";
					var newAddedSuffix = routeConfig.zzsuffix;
					var newAddedSuffixAndDescription = "";
					var newAddedExteriorColorCode = routeConfig.zzextcol;
					var newAddedExteriorColorCodeAndDescription = "";
					IntCol2 = routeConfig.zzintcol;

					//var temp = this.oGlobalJSONModel.getData().colorData;
					tempObj2 = [{
						"newAddedQty": newAddedQty,
						"newAddedModel": newAddedModel,
						"newAddedModelAndDescription": newAddedModelAndDescription,
						"newAddedSuffix": newAddedSuffix,
						"newAddedSuffixAndDescription": newAddedSuffixAndDescription,
						"newAddedExteriorColorCode": newAddedExteriorColorCode,
						"newAddedExteriorColorCodeAndDescription": newAddedExteriorColorCodeAndDescription
					}];

				} else {
					newseriesFlag = false;
					var selectedSeries = sap.ui.getCore().getModel('selectedSeries').getData();
					processDate = selectedSeries.zzprocess_dt;
					// console.log("processDate", processDate);

					this.zzseries = selectedSeries.zzseries;
					this.seriesDescription = selectedSeries.seriesDescription;
					this.zzmoyr = selectedSeries.zzmoyr;
					this.UserId = selectedSeries.dealerCode;

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

					this.modelClickFlag = false;

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
					jQuery.sap.require("sap.ui.core.format.DateFormat");
					var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
						pattern: "dd MMMM yyyy"
					});
//Changes done by Minakshi for INC0194774

					var processDateDisplay = oDateFormat.format(new Date(processDate), "UTC");
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
						fromWhichTabClickIamIn: selectedSeries.whichTabClicked,
						setResetEnabled: false,
						checkBoxEnabled: false,
						processDateDisplay: processDateDisplay
							// checkBoxFlag: true

					});

					var oModelLocalData = this.getView().setModel(this._oViewLocalData, "oViewLocalDataModel");

					// this.getView().getModel("oViewLocalDataModel").setProperty("/setEnableFalseReset", true); //local testing

					// make a call to SAP and fetch the data for the 4th screen
					this.dealerCode = selectedSeries.dealerCode;
					this.series = selectedSeries.zzseries;
					this.yearModel = selectedSeries.zzmoyr;
					var Language = selectedSeries.Language;
				}
				this.oModel = this.getOwnerComponent().getModel("ZCDS_SUGGEST_ORD_CDS");
				this.afterSAPDataUpdate = false;
				this._setTheLanguage(Language); // set the language
				// Also the logo for the second screen. 
				this._setTheLogo();
				this.oGlobalJSONModel = new sap.ui.model.json.JSONModel();
				this.getView().setModel(this.oGlobalJSONModel, "GlobalJSONModel");

				this._getAllTheModelsFortheSeries();
				this.runninDataLoadScriptflag = false;

				this._loadSalesData2();
				var that = this;
				setTimeout(function () {
					that._loadTheData();
				}, 3000);

			},

			onAfterRendering: function () {
				// console.log("rendering");
				this.getView().setModel(this._oViewLocalData, "oViewLocalDataModel");

			},

			//START- CR3.0 Dealer Config
			onCheck: function (oCheck) {
				// debugger;
				//objNew.ZzuiFlag 
				if (oCheck.getParameter("selected") === true && Number(oCheck.getSource().getBindingContext("stockDataModel").getObject().suggested) >
					0) {
					oCheck.getSource().getBindingContext("stockDataModel").getObject().ZzuiFlag = "Y";
					oCheck.getSource().getBindingContext("stockDataModel").getObject().zzui_flag = "Y";
				} else if (oCheck.getParameter("selected") === false && Number(oCheck.getSource().getBindingContext("stockDataModel").getObject().suggested) >
					0) {
					oCheck.getSource().getBindingContext("stockDataModel").getObject().ZzuiFlag = "N";
					oCheck.getSource().getBindingContext("stockDataModel").getObject().zzui_flag = "N";
				}

				this.getView().getModel("stockDataModel").updateBindings(true);
			},

			formatBoolean: function (oEvent) {
				// debugger;
				var oDetailModel = this.getView().getModel("oViewLocalDataModel");
				var oModelData2 = this.getView().getModel("stockDataModel").getData();
			},

			onClickShowAll: function (evt) {
				if (!!this.getView().getModel("stockDataModel")) {
					var oTable = this.getView().byId("stockDataModelTableId");
					var oModelData2 = this.getView().getModel("stockDataModel").getData();
					if (evt.getSource().getPressed() == false) {
						// console.log("pressed", evt);
						for (var i = 0; i < oModelData2.length; i++) {
							if ((oModelData2[i].suggested <= 0) && (oModelData2[i].requested_Volume <= "0")) {
								oModelData2[i].visibleProperty = false;
							}
						}
						// this._calculateTotals();
					} else if (evt.getSource().getPressed() == true) {
						// console.log("pressed2", evt);
						for (var i = 0; i < oModelData2.length; i++) {
							if ((oModelData2[i].suggested <= 0) && (oModelData2[i].requested_Volume <= "0")) {
								oModelData2[i].visibleProperty = true;
							}
						}
					}
					this.getView().getModel("stockDataModel").updateBindings(true);
					// this._calculateTotals();
				}
			},

			//CR2.0 Show All
			onClickShowAllX: function (evt) {
				if (!!this.getView().getModel("stockDataModel")) {
					var oTable = this.getView().byId("stockDataModelTableId");
					var oModelData2 = this.getView().getModel("stockDataModel").getData();
					if (evt == false) {
						// console.log("pressed", evt);
						for (var i = 0; i < oModelData2.length; i++) {
							if ((oModelData2[i].suggested <= 0) && (oModelData2[i].requested_Volume <= "0")) {
								oModelData2[i].visibleProperty = false;
							}
						}
					} else if (evt == true) {
						// console.log("pressed2", evt);
						for (var i = 0; i < oModelData2.length; i++) {
							if ((oModelData2[i].suggested <= 0) && (oModelData2[i].requested_Volume <= "0")) {
								oModelData2[i].visibleProperty = true;
								// document.getElementsByClassName("noheight").style.height = "2rem !important";
							}
						}
					}
					this.getView().getModel("stockDataModel").updateBindings(true);
					this._calculateTotals();
				}
			},
			whenUserChangesRequestedDataOnFragment: function (oEvt) {
				localScope = this;
				this.flagThreShold = false;
				var newAddedQty = oEvt.getSource().getValue();
				var newAddedModel = sap.ui.core.Fragment.byId("modelDialog", "ID_modelDesc").getSelectedItem().getKey();
				var currentData = {};
				currentData.model = newAddedModel;
				var tempRequestedTotal = 0;
				tempRequestedTotal = tempRequestedTotal + +newAddedQty;

				var oStockModelData = this.getView().getModel("stockDataModel").getData();

				var bool = oStockModelData.find((o, i) => {
					if (o.model === currentData.model) {

						return true;
					}
				});
				if (bool) {
					for (var i = 0; i < oStockModelData.length; i++) {
						if (oStockModelData[i].model != "" && oStockModelData[i].model == currentData.model) {
							//fix for difference column update

							tempRequestedTotal = tempRequestedTotal + +oStockModelData[i].requested_Volume;

							this.tempModel = oStockModelData[i].model;
						}
						localScope.getThreSholdFragment(oStockModelData[i], currentData, this.tempModel, tempRequestedTotal);
					}

					var newValue = 0;
					if (this.flagThreShold == true) {
						MessageBox.error("You have crossed the threshold");

						newValue = newValue + +newAddedQty - 1;
						localScope.reqThreShold = 0;
						//	oEvt.getSource()._getIncrementButton().setBlocked(true);
						//	oEvt.getSource()._getIncrementButton().addStyleClass("disableBtn");
						oEvt.getSource().setValue(newValue);
					} else {
						//	oEvt.getSource()._getIncrementButton().setBlocked(false);
						//	oEvt.getSource()._getIncrementButton().removeStyleClass("disableBtn");
						if (!newAddedModel || newAddedModel == "" || newAddedModel == "Please Select") {
							MessageBox.error("Please select Model");
							oEvt.getSource().setValue(newValue);
						}
					}
				} else {

					localScope.thresholdModel.read("/ZCDS_SUGGST_ORD_QTY_TOL", {
						urlParameters: {
							"$filter": "zzdealer_code eq'" + this.dealerCode + "' and zzmoyr eq '" + this.yearModel + "' and zzmodel eq '" + currentData.model +
								"'"
						},

						//"$filter": "zzdealer_code eq'" + this.dealerCode + "' and zzmoyr eq '" + this.yearModel +"'"	
						success: function (thresholdData) {

							if (thresholdData.results.length > 0) {
								localScope.reqThreShold = thresholdData.results[0].allowedtolerance;
							} else {
								localScope.reqThreShold = 0;
							}
							if (tempRequestedTotal > localScope.reqThreShold) {
								localScope.flagThreShold = true;

							}
							var newValue = 0;
							if (localScope.flagThreShold == true) {
								MessageBox.error("You have crossed the threshold");

								newValue = newValue + +newAddedQty - 1;
								localScope.reqThreShold = 0;
								//	oEvt.getSource()._getIncrementButton().setBlocked(true);
								//	oEvt.getSource()._getIncrementButton().addStyleClass("disableBtn");
								sap.ui.core.Fragment.byId("modelDialog", "reqVolumeId").setValue(newValue);
							} else {
								//	oEvt.getSource()._getIncrementButton().setBlocked(false);
								//	oEvt.getSource()._getIncrementButton().removeStyleClass("disableBtn");
								if (!newAddedModel || newAddedModel == "" || newAddedModel == "Please Select") {
									MessageBox.error("Please select Model");
									sap.ui.core.Fragment.byId("modelDialog", "reqVolumeId").setValue(newValue);
								}
							}
						},
						error: function (error) {

						}
					});

				}

			},
			getThreSholdFragment: function (_data, _current, _dataModel, _currentThreShold) {
				if (_data.model == "" && _current.model === _data.modelCodeDescription.replace("--", " ").split(" ")[1] && _data.reqThreshold !==
					"") {
					//			console.log("currentData", _data.model);
					localScope.reqThreShold = Number(_data.reqThreshold);
					//			console.log("reqThreShold", localScope.reqThreShold);

					if (_currentThreShold > localScope.reqThreShold) {
						localScope.flagThreShold = true;

					}
				}
			},

			whenUserChangesRequestedData: function (oEvt) {
				this.flagThreShold = false;
				localScope = this;
				localScope.evt = oEvt;
				var oTotalModelData = this.getView().getModel("initialStockTotalModel"); //.getData();
				
				var aSuggestedOrd = this.getOwnerComponent().getModel("LocalDataModel").getProperty("/zcdsSuggestOrdRes");
				
				var szzextcol = oEvt.getSource().getParent().getCells()[2].getText().split("-")[0];
				var szzmodel = oEvt.getSource().getParent().getCells()[0].getText().split("-")[0];
				var szzsuffix = oEvt.getSource().getParent().getCells()[1].getText().split(" ")[0];
				
				var szzui_flag = aSuggestedOrd.filter((item)=> item.zzmodel == szzmodel.trim() && item.zzsuffix == szzsuffix.trim()  && item.zzextcol == szzextcol.trim()  )[0].zzui_flag;

				var currentValue = oEvt.getSource().getProperty("value");

				var backupData = this.getView().getModel("stockDataModelBkup").getData();

				var currentData = oEvt.getSource().getBindingContext("stockDataModel").getObject();
				oEvt.getSource().getBindingContext("stockDataModel").getObject().requested_Volume = oEvt.getSource().getBindingContext(
					"stockDataModel").getObject().requested_Volume.toString();
				var currentSeqNumber = currentData.zzsug_seq_no;

				var oldS4Entry = backupData.filter(function (val) {
					if (val.zzsug_seq_no == currentSeqNumber)
						return val;
				});

				var oldS4Value = parseInt(oldS4Entry[0].requested_Volume);
				var oldValue = oEvt.getSource()._sOldValue;

				var requestedDSTotal = 0;
				var oDetailModel = this.getView().getModel("oViewLocalDataModel");
				//HyperCare 3.0
				if (Number(currentData.suggested == 0)) {
					currentData.checkBoxEnabled = false;
					currentData.checkBoxFlag = false;
					currentData.zzui_flag = "";
				}
                //var sZzui_flag =aSuggestedOrd.filter((item)=> item.zzsug_seq_no ==oEvt.getSource().getBindingContext("stockDataModel").getObject().zzsug_seq_no)[0].zzui_flag;
				//HyperCare 3.0		(changes by Swetha for the Task0175595 on 25/10/22)(  incident INC0214976 on 4/11/2022)
				if (Number(currentData.requested_Volume) < Number(currentData.suggested)) {
					currentData.checkBoxEnabled = true;
					currentData.checkBoxFlag = true;
					currentData.zzui_flag = "Y";
				} else if (Number(currentData.requested_Volume) > Number(currentData.suggested) && Number(currentData.suggested) != 0) {
					currentData.checkBoxEnabled = false;
					currentData.checkBoxFlag = false;
					currentData.zzui_flag = "N";
				} else {
					currentData.checkBoxEnabled = false;
					currentData.checkBoxFlag = false;
					currentData.zzui_flag = "";
				}

				if (currentValue > oldS4Value) {
					var additionalQty = currentValue - oldS4Value;
					// Requested Days of Supply = Suggested Days of Supply + (Unit Days of Supply * Additional qty requested)
					currentData.requested_Ds = currentData.suggested_Ds + (parseInt(currentData.currentU_DS) * additionalQty);
				} else if (currentValue < oldS4Value) {
					// Requested Days of Supply = Suggested Days of Supply - (Unit Days of Supply * Qty rejected by the dealer)
					var rejectedQty = oldS4Value - currentValue;
					// Requested Days of Supply = Suggested Days of Supply - (Unit Days of Supply * Qty rejected by the dealer)
					currentData.requested_Ds = currentData.suggested_Ds - (parseInt(currentData.currentU_DS) * rejectedQty);
				} else if (currentValue == 0) {
					var reversedQty = 0;
					// Requested Days of Supply = Suggested Days of Supply + (Unit Days of Supply * Additional qty requested)
					currentData.requested_Ds = currentData.suggested_Ds + (parseInt(currentData.currentU_DS) * reversedQty);
				}

				if (currentValue != oldValue) {
					// trigger the flag to show a loss of data. 
					this.resultsLossofData = true;
					// localScope.reqThreShold = 0;
					var tempRequestedTotal = 0;
					var oStockModelData = this.getView().getModel("stockDataModel").getData();
					for (var i = 0; i < oStockModelData.length; i++) {
						if (oStockModelData[i].model != "" && oStockModelData[i].model == currentData.model) {
							//fix for difference column update
							oStockModelData[i].difference = Number(oStockModelData[i].suggested) - Number(oStockModelData[i].requested_Volume);

							this.currentStockVolume = oStockModelData[i].requested_Volume;
							tempRequestedTotal = tempRequestedTotal + +oStockModelData[i].requested_Volume;
							requestedDSTotal = requestedDSTotal + +oStockModelData[i].requested_Ds;
							this.tempModel = oStockModelData[i].model;
						}
						localScope.getThreShold(oStockModelData[i], currentData, this.tempModel, tempRequestedTotal);
					}
					if (this.flagThreShold == true) {
						MessageBox.error("You have crossed the threshold");
						localScope.reqThreShold = 0;
					}
					oTotalModelData.oData["0"].requestedVolumeTotal = tempRequestedTotal;
					oTotalModelData.oData["0"].requestedDSTotal = requestedDSTotal;
					var updationRequestedVolume = oTotalModelData.getProperty("/");

					updationRequestedVolume["0"].requestedVolumeTotal = tempRequestedTotal;
					oTotalModelData.updateBindings(true);
					// this.getView().getModel("initialStockTotalModel").updateBindings(true);
					// }

				}

				oEvt.getSource()._getInput().setEditable(false);
				if (currentValue < Number(currentData.suggested)) {
					oEvt.getSource()._getInput().removeStyleClass("EqualWhite");
					oEvt.getSource()._getInput().removeStyleClass("IncrementBlue");
					oEvt.getSource()._getInput().addStyleClass("DecrementRed");
				} else if (currentValue > Number(currentData.suggested)) {
					oEvt.getSource()._getInput().removeStyleClass("EqualWhite");
					oEvt.getSource()._getInput().removeStyleClass("DecrementRed");
					oEvt.getSource()._getInput().addStyleClass("IncrementBlue");
				} else if (currentValue == Number(currentData.suggested)) {
					oEvt.getSource()._getInput().removeStyleClass("DecrementRed");
					oEvt.getSource()._getInput().removeStyleClass("IncrementBlue");
					oEvt.getSource()._getInput().addStyleClass("EqualWhite");
				}

				this._calculateTotals();

				// when before click navigates to previous screen the popup might need to be thrown. 

			},

			getThreShold: function (_data, _current, _dataModel, _currentThreShold) {
				if (_data.model == "" && _current.model === _data.modelCodeDescription.replace("--", " ").split(" ")[1] && _data.reqThreshold !==
					"") {
					console.log("currentData", _data.model);
					localScope.reqThreShold = Number(_data.reqThreshold);
					localScope.subtotal = _data.requested_Volume;
					console.log("reqThreShold", localScope.reqThreShold);

					if (_currentThreShold > localScope.reqThreShold) {
						localScope.flagThreShold = true;
						for (var x = 0; x <= this.oTable.getItems().length - 1; x++) {
							if (localScope.oTable.getItems()[x].getCells()[0].getText().split(" ")[0] == _current.model) {
								localScope.oTable.getItems()[x].getCells()[12]._getIncrementButton().setBlocked(true);
								localScope.oTable.getItems()[x].getCells()[12]._getIncrementButton().addStyleClass("disableBtn");
							}
						}
						localScope.currentRequestVolume = (Number(localScope.currentStockVolume) - 1).toString();
						_current.requested_Volume = _current.requested_Volume - 1;
						_currentThreShold = _currentThreShold - 1;
						localScope.getView().getModel("stockDataModel").updateBindings(true);

					} else {
						for (var x = 0; x <= this.oTable.getItems().length - 1; x++) {
							if (localScope.oTable.getItems()[x].getCells()[0].getText().split(" ")[0] == _current.model) {
								localScope.oTable.getItems()[x].getCells()[12]._getIncrementButton().setBlocked(false);
								localScope.oTable.getItems()[x].getCells()[12]._getIncrementButton().removeStyleClass("disableBtn");
							}
						}
					}
				}
			},

			_onPageNavButtonPress: function (oEvent) {
				this.getView().byId("stockDataModelTableId").getModel("stockDataModel").setData();
				this.getView().byId("stockDataModelTableId").getModel("stockDataModel").updateBindings(true);
				this.getView().getModel("initialStockTotalModel").setData();
				this.getView().getModel("initialStockTotalModel").updateBindings(true);

				if (newseriesFlag && !btnSavePressed) {
					var that = this;
					MessageBox.confirm(
						that._oResourceBundle.getText("NO_SERIESDATA_SAVED"), { //Are you Sure you want to Reset ?
							// styleClass: oComponent.getContentDensityClass(),
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.OK) {
									var oBindingContext = oEvent.getSource().getBindingContext();
									return new Promise(function (fnResolve) {
										that.doNavigate("ProductionRequestSummary", oBindingContext, fnResolve, "");
									}.bind(that)).catch(function (err) {
										if (err !== undefined) {
											MessageBox.error(err.message);
										}
									});
								}
							}
						}
					);
					// MessageBox.information(this._oResourceBundle.getText("NO_SERIESDATA_SAVED"));
				} else {
					var oBindingContext = oEvent.getSource().getBindingContext();
					return new Promise(function (fnResolve) {
						this.doNavigate("ProductionRequestSummary", oBindingContext, fnResolve, "");
					}.bind(this)).catch(function (err) {
						if (err !== undefined) {
							MessageBox.error(err.message);
						}
					});
				}
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
											stockSAPProp[i].difference = stockSAPProp[i].suggested - stockSAPProp[i].requested_Volume;
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
								that._calculateTotals();
							}
						}
					}
				);
			},

			_onButtonPressSave: function (oEvent) {
				btnSavePressed = true;
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
				var oModelData2 = this.getView().getModel("stockDataModel").getData();
				that.oTable = this.getView().byId("stockDataModelTableId");
				that.data = oModelData2;
				if (!!this.dynamicIndices && this.dynamicIndices.length > 0) {
					for (var i = this.dynamicIndices.length - 1; i >= 0; i--) {
						// console.log("index", i);
						oModelData2.splice(this.dynamicIndices[i], 1);
					}
				}
				this.getView().getModel("stockDataModel").updateBindings(true);

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
					if (!!this.orderPrefix) {
						var orderPrefix = this.orderPrefix.toUpperCase();
					}
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
					// var initialAllocatedQty = initialAllocatedQty.toString();
					//Dealer flag changes 
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
						// ZzprodMonth: sendTheDataToSAP[i].zzprod_month,
						// zzend_date: sendTheDataToSAP[i].zzend_date,
						ZzdelReview: "Y",
						ZzrequestQty: requestedVolume,
						Zzprefix: orderPrefix,
						// zzseries :sendTheDataToSAP[i].zzseries,
						// ZZseries: sendTheDataToSAP[i].zzseries,
						// ZzintAlcQty: initialAllocatedQty,
						ZcreatedBy: this.UserId,
						ZzuiFlag: sendTheDataToSAP[i].zzui_flag
					});

				}
				// //debugger;
				// call the deep entity. 
				this.actualPushToSAPoDataDeepEntity(oSuggestUpdateModel, tempArrayToHoldData);

			},

			onOpenDialog: function (oEvent) {
				// instantiate dialog
				if (!this._dialog) {
					this._dialog = sap.ui.xmlfragment("BusyDialog", "suggestOrder.fragment.BusyDialog", this);
					this.getView().addDependent(this._dialog);
				}
				// open dialog
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._dialog);
				this._dialog.open();
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
				// try to close the indicator	
				this._dialog.close();

				this.afterSAPDataUpdate = true;
				this.resultsLossofData = false; // the data is saved,  so no message
				this.defaultLightBusyDialog.open();
				this._loadSalesData2();
				var that = this;
				setTimeout(function () {
					that._loadTheData();
				}, 3000);
			},

			_postTheDataToSAP: function (oSuggestUpdateModel, sendTheDataToSAP, tempArrayToHoldData) {

				var requestedVolumeNumb = Number(sendTheDataToSAP.requested_Volume);
				var suggestedQtyFromTCINumb = Number(sendTheDataToSAP.suggested);

				var dealerCode = this.dealerCode;
				if (!!this.orderPrefix) {
					var orderPrefix = this.orderPrefix.toUpperCase();
				}
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
					ZzetaMonth: sendTheDataToSAP.zzend_date,
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

				oSuggestUpdateModel.create("/SuggestOrdSet", (this.obj), {
					success: $.proxy(function (data, response) {
						that._navigateToMainScreen(); // instead reload the current page. 
						// that.onClickShowAllModels();
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
				var sLocation = window.location.host;
				var sLocation_conf = sLocation.search("webide");
				if (sLocation_conf == 0) {
					this.sPrefix = "/Suggest_Order";
				} else {
					//Cloud Deployment
					this.sPrefix = "";
				}
				this.nodeJsUrl = this.sPrefix + "/node";

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
					this.Language = "F";

				} else {
					var i18nModel = new sap.ui.model.resource.ResourceModel({
						bundleUrl: "i18n/i18n.properties",
						bundleLocale: ("en")
					});
					this.getView().setModel(i18nModel, "i18n");
					this.sCurrentLocale = 'EN';
					this.Language = "E";
				}

				var oModeli18n = this.getView().getModel("i18n");
				this._oResourceBundle = oModeli18n.getResourceBundle();
			},

			onClickShowAllModels: function (oEvent) {
				var showSuggestModelsText = this._oResourceBundle.getText("SHOW_ALL_MODELS"), //SHOW_SUGGEST_MODELS
					showAllModelsText = this._oResourceBundle.getText("SHOW_ALL_MODELS");

				var currentText = this.getView().byId("showAllModelsBtn").getText();
				currentText = showAllModelsText;
				var oDetailModel = this.getView().getModel("oViewLocalDataModel");
				this.getView().byId("showAllModelsBtn").setProperty("text", showAllModelsText);
				oDetailModel.setProperty("/setEnableFalsePercentages", true);
				this._showAllModels();
			},

			//Calculating Total for all & Subtotal per model 

			_calculateTotals: function (includeZero) {
				// this.defaultLightBusyDialog.open();
				var that = this;
				this.flagCheck = false;
				this.index = 0;
				this.count = 0;
				var oModelData2 = this.getView().getModel("stockDataModel").getData();
				that.oTable = this.getView().byId("stockDataModelTableId");

				for (var k = 0; k < oModelData2.length; k++) {
					if (oModelData2[k].model == "") {
						this.flagCheck = true;
					}
				}
				//debugger;
				if (this.flagCheck) {
					that.data = oModelData2;
					if (!!this.dynamicIndices && this.dynamicIndices.length > 0) {
						for (var i = this.dynamicIndices.length - 1; i >= 0; i--) {
							// console.log("index", i);
							oModelData2.splice(this.dynamicIndices[i], 1);
							if (!!that.oTable.getItems()[this.dynamicIndices[i]]) {
								that.oTable.getItems()[this.dynamicIndices[i]].removeStyleClass("grayBG");
								var cells = that.oTable.getItems()[this.dynamicIndices[i]].getCells();
								for (var j = 0; j < cells.length; j++) {
									cells[j].removeStyleClass("boldFont");
									cells[j].mProperties.step = 1;
									cells[j].mProperties.editable = true;
									cells[j].mProperties.enabled = true;
								}
							}
						}
					}
				} else {
					var temp = that.oTable.getItems();
					temp.forEach(function (element) {
						element.removeStyleClass("grayBG");
						var m = element.getCells();
						m.forEach(function (element2) {
							element2.removeStyleClass("boldFont");
							element2.mProperties.step = 1;
							element2.mProperties.editable = true;
							element2.mProperties.enabled = true;
						});
					});
				}
				// oTable.updateItems();
				// console.log("oTable.getItems()", that.oTable.getItems());
				this.getView().getModel("stockDataModel").updateBindings(true);

				var oInitalTotalStock = this.getView().getModel("initialStockTotalModel");
				var oInitialTotalStockModel = oInitalTotalStock.getData();
				var currentTotal = 0,
					currentDSTotal = 0,
					currentCTSTotal = 0,
					currentCPTotal = 0,
					currentUDSTotal = 0,
					suggestedTotal = 0,
					suggestedDSTotal = 0,
					requestedDSTotal = 0,
					requestedVolumeTotal = 0,
					allocatedTotal = 0,
					allocatedDSTotal = 0,
					pendingAllocationTotal = 0,
					unfilledAllocationTotal = 0,
					differenceTotal = 0,
					salesDataTotal = 0,
					count = 0;

				var result = [];
				// var count;
				var resGrouped = oModelData2.reduce(function (res, value) {
					if (!res[value.model]) {
						res[value.model] = {
							model: value.model,
							modelDesc: value.modelCodeDescription,
							allowedtolerance: value.allowedtolerance,
							currentTotal: 0,
							currentDSTotal: 0,
							currentCTSTotal: 0,
							currentCPTotal: 0,
							currentUDSTotal: 0,
							suggestedTotal: 0,
							suggestedDSTotal: 0,
							requestedVolumeTotal: 0,
							requestedDSTotal: 0,
							allocatedTotal: 0,
							allocatedDSTotal: 0,
							pendingAllocationTotal: 0,
							unfilledAllocationTotal: 0,
							differenceTotal: 0,
							count: 0,
							salesDataTotal: 0
						};
						result.push(res[value.model]);
					}
					if (value.salesdata === undefined) {
						value.salesdata = 0;
					}
					res[value.model].salesDataTotal = +res[value.model].salesDataTotal + +value.salesdata;
					res[value.model].currentTotal = +res[value.model].currentTotal + +value.current;
					res[value.model].currentDSTotal = + +value.current_Ds; //+res[value.model].currentDSTotal + +value.current_Ds;
					res[value.model].currentCTSTotal = +res[value.model].currentCTSTotal + +value.current_CTS;
					res[value.model].currentCPTotal = +res[value.model].currentCPTotal + +value.current_CP;
					res[value.model].currentUDSTotal = +res[value.model].currentUDSTotal + +value.currentU_DS;
					res[value.model].suggestedTotal = +res[value.model].suggestedTotal + +value.suggested;
					// res[value.model].suggestedDSTotal = +res[value.model].suggestedDSTotal + +value.suggested_Ds;
					res[value.model].suggestedDSTotal = +value.current_Ds + +value.currentU_DS * res[value.model].suggestedTotal;
					// console.log("suggested"+res[value.model].suggestedTotal);

					res[value.model].allocatedTotal = +res[value.model].allocatedTotal + +value.allocated;
					res[value.model].allocatedDSTotal = +res[value.model].allocatedDSTotal + +value.allocated_Ds;
					res[value.model].pendingAllocationTotal = +res[value.model].pendingAllocationTotal + +value.pendingAllocation;
					res[value.model].unfilledAllocationTotal = +res[value.model].unfilledAllocationTotal + +value.unfilled_Allocation;
					res[value.model].differenceTotal = +res[value.model].differenceTotal + +value.difference;
					res[value.model].requestedVolumeTotal = +res[value.model].requestedVolumeTotal + +value.requested_Volume;
					// res[value.model].count = res[value.model].count + 1;

					res[value.model].requestedDSTotal = +value.current_Ds + +value.currentU_DS * res[value.model].requestedVolumeTotal; //+res[value.model].requestedDSTotal + +value.requested_Ds;

					return res;
				}, {});
				this.dynamicIndices = [];

				$.each(resGrouped, function (i, item) {
					// item.currentDSTotal = (item.currentDSTotal / item.count);
					addRow(item);
				});

				function addRow(item) {

					// console.log("resGrouped", resGrouped);
					that.oItem = new sap.m.ColumnListItem({
						cells: [
							new sap.m.Text({
								text: item.modelDesc
							}),
							new sap.m.Text({
								text: ""
							}),
							new sap.m.Text({
								text: ""
							}),
							new sap.m.Text({
								text: "{i18n>TOTALS}",
								width: "auto",
								maxLines: 1,
								wrapping: false,
								textAlign: "End",
								textDirection: "Inherit",
								visible: true,
								class: "boldFont"
							}),
							new sap.m.Text({
								text: item.currentTotal
							}),
							new sap.m.Text({
								text: item.currentCPTotal
							}),
							new sap.m.Text({
								text: item.currentCTSTotal
							}),
							new sap.m.Text({
								text: item.currentDSTotal
							}),
							new sap.m.Text({
								text: item.currentUDSTotal
							}),
							new sap.m.Text({
								text: item.suggestedTotal
							}),
							new sap.m.Text({
								text: "" //item.suggestedDSTotal
							}),
							new sap.m.Text({
								text: item.requestedVolumeTotal
							}),
							new sap.m.Text({
								text: item.differenceTotal
							}),
							new sap.m.Text({
								text: "" //item.requestedDSTotal
							})
						]
					});
					var cells = that.oItem.getCells();
					for (var i = 0; i < cells.length; i++) {
						cells[i].addStyleClass("boldFont");
					}

					that.obj = {
						"allocated": item.allocatedTotal,
						"allocatedDSSubttlOnly": item.allocatedDSTotal,
						"colour_Trim": "",
						"current": item.currentTotal,
						"currentU_DS": item.currentUDSTotal,
						"current_CP": item.currentCPTotal,
						"current_CTS": item.currentCTSTotal,
						"currentDSSubttlOnly": item.currentDSTotal,
						"dealer_code": "",
						"difference": item.differenceTotal,
						"model": "",
						"modelCodeDescription": "--" + item.modelDesc,
						"pendingAllocation": "",
						"requestedDSSubttlOnly": item.requestedDSTotal,
						"requested_Volume": item.requestedVolumeTotal,
						"suffix": "",
						"suffix_desc": "",
						"suggested": item.suggestedTotal,
						"suggestedDSSubttlOnly": item.suggestedDSTotal,
						"unfilled_Allocation": "",
						"visibleProperty": true,
						"zsrc_werks": "",
						"zzend_date": "",
						"zzextcol": "",
						"zzint_alc_qty": "",
						"zzintcol": "",
						"zzmoyr": "",
						"zzordertype": "",
						"zzprocess_dt": "",
						"zzprod_month": "",
						"zzsuffix": "",
						"zzsug_seq_no": "",
						"zzzadddata1": "",
						"reqThreshold": item.allowedtolerance + item.suggestedTotal,
						"allowedtolerance": "",
						"salesdata": item.salesDataTotal
					};

					var tempIndex = [],
						output = [];
					var oTable = that.getView().byId("stockDataModelTableId");
					var tabData = oTable.getBinding("items").oList;

					var group_to_values = tabData.reduce(function (obj, item) {
						obj[item.model] = obj[item.model] || [];
						obj[item.model].push(item.current);
						return obj;
					}, Object.create(null));

					var groups = Object.keys(group_to_values).map(function (key) {
						return {
							model: key,
							current: group_to_values[key]
						};
					});
					//CR2.0 Model Level Sub Total
					that._dynamicSubTotal(groups, item, that.obj);
				}

				for (var i = 0; i < oModelData2.length; i++) {
					if (oModelData2[i].model != "") {
						this.duringPercentage = oModelData2[i].current.includes("%");
						if (oModelData2[i].visibleProperty == true && this.duringPercentage == false) {
							if (oModelData2[i].salesdata === undefined) {
								oModelData2[i].salesdata = 0;
							}
							// if ( oModelData2[i].visibleProperty == true ) {
							currentTotal = +oModelData2[i].current + +currentTotal;
							currentDSTotal = +oModelData2[i].current_Ds + +currentDSTotal;
							currentCTSTotal = +oModelData2[i].current_CTS + +currentCTSTotal;
							currentCPTotal = +oModelData2[i].current_CP + +currentCPTotal;
							currentUDSTotal = +oModelData2[i].currentU_DS + +currentUDSTotal;
							salesDataTotal = +oModelData2[i].salesdata + +salesDataTotal;
							suggestedTotal = +oModelData2[i].suggested + +suggestedTotal;
							suggestedDSTotal = +oModelData2[i].suggested_Ds + +suggestedDSTotal;
							// requestedVolumeTotal = +oModelData2[i].requested_Volume + +requestedVolumeTotal;
							requestedDSTotal = +oModelData2[i].requested_Ds + +requestedDSTotal;
							allocatedTotal = +oModelData2[i].allocated + +allocatedTotal;
							allocatedDSTotal = +oModelData2[i].allocated_Ds + +allocatedDSTotal;
							pendingAllocationTotal = +oModelData2[i].pendingAllocation + +pendingAllocationTotal;
							unfilledAllocationTotal = +oModelData2[i].unfilled_Allocation + +unfilledAllocationTotal;
							differenceTotal = +oModelData2[i].difference + +differenceTotal;
						}
					}
				}
				//  requested volume is not based on suggested stock. 
				for (var i = 0; i < oModelData2.length; i++) {
					oModelData2[i].requested_Volume = oModelData2[i].requested_Volume.toString();
					if (oModelData2[i].model != "") {
						requestedVolumeTotal = +oModelData2[i].requested_Volume + +requestedVolumeTotal;
					}
				}
				oInitialTotalStockModel["0"].suggestedTotal = suggestedTotal;
				oInitialTotalStockModel["0"].currentDSTotal = currentDSTotal;
				oInitialTotalStockModel["0"].currentTotal = currentTotal;

				oInitialTotalStockModel["0"].currentCTSTotal = currentCTSTotal;
				oInitialTotalStockModel["0"].currentCPTotal = currentCPTotal;
				oInitialTotalStockModel["0"].currentUDSTotal = currentUDSTotal;

				oInitialTotalStockModel["0"].differenceTotal = differenceTotal;
				oInitialTotalStockModel["0"].requestedVolumeTotal = requestedVolumeTotal;
				oInitialTotalStockModel["0"].suggestedDSTotal = suggestedDSTotal;
				oInitialTotalStockModel["0"].requestedDSTotal = requestedDSTotal;

				oInitialTotalStockModel["0"].allocatedTotal = allocatedTotal;
				oInitialTotalStockModel["0"].allocatedDSTotal = allocatedDSTotal;
				oInitialTotalStockModel["0"].pendingAllocationTotal = pendingAllocationTotal;
				oInitialTotalStockModel["0"].unfilledAllocationTotal = unfilledAllocationTotal;

				oInitialTotalStockModel["0"].salesDataTotal = salesDataTotal;

				if (this.duringPercentage == true) {
					var oModelDataOld = this.getView().getModel("stockDataModelBkup").getData();
					var oInitalTotalStock = this.getView().getModel("initialStockTotalModel");
					var oInitialTotalStockModel = oInitalTotalStock.getData();
					var currentTotal = 0,
						currentDSTotal = 0,
						currentCTSTotal = 0,
						currentCPTotal = 0,
						currentUDSTotal = 0,

						suggestedTotal = 0,
						suggestedDSTotal = 0,
						requestedVolumeTotal = 0,
						requestedDSTotal = 0,
						allocatedTotal = 0,
						allocatedDSTotal = 0,
						pendingAllocationTotal = 0,
						unfilledAllocationTotal = 0,
						differenceTotal = 0,
						salesDataTotal = 0;

					for (var i = 0; i < oModelDataOld.length; i++) {
						if (includeZero == true && oModelDataOld[i].model != "") {
							//if ( oModelData2[i].suggested < "0" ) {
							if (oModelDataOld[i].salesdata === undefined) {
								oModelDataOld[i].salesdata = 0;
							}
							currentTotal = +oModelDataOld[i].current + +currentTotal;
							currentDSTotal = +oModelDataOld[i].current_Ds + +currentDSTotal;

							currentCTSTotal = +oModelDataOld[i].current_CTS + +currentCTSTotal;
							currentCPTotal = +oModelDataOld[i].current_CP + +currentCPTotal;
							currentUDSTotal = +oModelDataOld[i].currentU_DS + +currentUDSTotal;

							salesDataTotal = +oModelDataOld[i].salesdata + +salesDataTotal;

							suggestedTotal = +oModelDataOld[i].suggested + +suggestedTotal;
							suggestedDSTotal = +oModelDataOld[i].suggested_Ds + +suggestedDSTotal;
							// requestedVolumeTotal = +oModelData2[i].requested_Volume + +requestedVolumeTotal;
							requestedDSTotal = +oModelDataOld[i].requested_Ds + +requestedDSTotal;
							allocatedTotal = +oModelDataOld[i].allocated + +allocatedTotal;
							allocatedDSTotal = +oModelDataOld[i].allocated_Ds + +allocatedDSTotal;
							pendingAllocationTotal = +oModelDataOld[i].pendingAllocation + +pendingAllocationTotal;
							unfilledAllocationTotal = +oModelDataOld[i].unfilled_Allocation + +unfilledAllocationTotal;
							differenceTotal = +oModelDataOld[i].difference + +differenceTotal;
							//}
						} else {
							// take only excluding the ones with zero quantities. 
							if (oModelData2[i].suggested > "0" && oModelDataOld[i].model != "") {
								if (oModelData2[i].salesdata === undefined) {
									oModelData2[i].salesdata = 0;
								}
								currentTotal = +oModelDataOld[i].current + +currentTotal;
								currentDSTotal = +oModelDataOld[i].current_Ds + +currentDSTotal;
								currentCTSTotal = +oModelDataOld[i].current_CTS + +currentCTSTotal;
								currentCPTotal = +oModelDataOld[i].current_CP + +currentCPTotal;
								currentUDSTotal = +oModelDataOld[i].currentU_DS + +currentUDSTotal;

								salesDataTotal = +oModelDataOld[i].salesdata + +salesDataTotal;

								suggestedTotal = +oModelDataOld[i].suggested + +suggestedTotal;
								suggestedDSTotal = +oModelDataOld[i].suggested_Ds + +suggestedDSTotal;
								// requestedVolumeTotal = +oModelData2[i].requested_Volume + +requestedVolumeTotal;
								requestedDSTotal = +oModelDataOld[i].requested_Ds + +requestedDSTotal;
								allocatedTotal = +oModelDataOld[i].allocated + +allocatedTotal;
								allocatedDSTotal = +oModelDataOld[i].allocated_Ds + +allocatedDSTotal;
								pendingAllocationTotal = +oModelDataOld[i].pendingAllocation + +pendingAllocationTotal;
								unfilledAllocationTotal = +oModelDataOld[i].unfilled_Allocation + +unfilledAllocationTotal;
								differenceTotal = +oModelDataOld[i].difference + +differenceTotal;
							}
						}
					}
					for (var x = 0; x < oModelDataOld.length; x++) {
						// if (oModelData2[i].model != "") {
						oModelDataOld[x].requested_Volume = oModelDataOld[x].requested_Volume.toString();
						requestedVolumeTotal = +oModelDataOld[x].requested_Volume + +requestedVolumeTotal;
						// }
					}

					oInitialTotalStockModel["0"].suggestedTotal = suggestedTotal;
					oInitialTotalStockModel["0"].currentDSTotal = currentDSTotal;
					oInitialTotalStockModel["0"].currentTotal = currentTotal;

					oInitialTotalStockModel["0"].currentCTSTotal = currentCTSTotal;
					oInitialTotalStockModel["0"].currentCPTotal = currentCPTotal;
					oInitialTotalStockModel["0"].currentUDSTotal = currentUDSTotal;

					oInitialTotalStockModel["0"].differenceTotal = differenceTotal;
					oInitialTotalStockModel["0"].requestedVolumeTotal = requestedVolumeTotal;
					oInitialTotalStockModel["0"].suggestedDSTotal = suggestedDSTotal;
					oInitialTotalStockModel["0"].requestedDSTotal = requestedDSTotal;

					oInitialTotalStockModel["0"].allocatedTotal = allocatedTotal;
					oInitialTotalStockModel["0"].allocatedDSTotal = allocatedDSTotal;
					oInitialTotalStockModel["0"].pendingAllocationTotal = pendingAllocationTotal;
					oInitialTotalStockModel["0"].unfilledAllocationTotal = unfilledAllocationTotal;

					oInitialTotalStockModel["0"].salesDataTotal = salesDataTotal;

				}
				// else {
				else {
					if (newseriesFlag == true) {
						var oModelDataOld = this.getView().getModel("stockDataModelBkup").getData();
						var oTotalRecevied = new sap.ui.model.json.JSONModel();
						oTotalRecevied.setData(this.oInitialTotalsForUI);
						oTotalRecevied.setSizeLimit(1000);
						this.getView().setModel(oTotalRecevied, "initialStockTotalModel");
						var oInitialTotalStockModel = oInitalTotalStock.getData();
						oInitialTotalStockModel.push({
							"suggestedTotal": "0",
							"currentDSTotal": "0",
							"currentTotal": "0",
							"currentCTSTotal": "0",
							"currentCPTotal": "0",
							"currentUDSTotal": "0",
							"differenceTotal": "0",
							"requestedVolumeTotal": "0",
							"suggestedDSTotal": "0",
							"requestedDSTotal": "0",
							"allocatedTotal": "0",
							"allocatedDSTotal": "0",
							"pendingAllocationTotal": "0",
							"unfilledAllocationTotal": "0",
							"salesDataTotal": "0"
						});

						var oModelDataOld = this.getView().getModel("stockDataModelBkup").getData();
						var oInitalTotalStock = this.getView().getModel("initialStockTotalModel");
						var oInitialTotalStockModel = oInitalTotalStock.getData();
						var currentTotal = 0,
							currentDSTotal = 0,
							currentCTSTotal = 0,
							currentCPTotal = 0,
							currentUDSTotal = 0,

							suggestedTotal = 0,
							suggestedDSTotal = 0,
							requestedVolumeTotal = 0,
							requestedDSTotal = 0,
							allocatedTotal = 0,
							allocatedDSTotal = 0,
							pendingAllocationTotal = 0,
							unfilledAllocationTotal = 0,
							differenceTotal = 0,
							salesDataTotal = 0;
						for (var i = 0; i < oModelDataOld.length; i++) {
							if (oModelDataOld[i].model != "") {
								// this.duringPercentage = oModelData2[i].current.includes("%");
								// if (oModelData2[i].visibleProperty == true && this.duringPercentage == false) {
								// if ( oModelData2[i].visibleProperty == true ) {
								if (oModelDataOld[i].salesdata === undefined) {
									oModelDataOld[i].salesdata = 0;
								}
								currentTotal = +oModelDataOld[i].current + +currentTotal;
								currentDSTotal = +oModelDataOld[i].current_Ds + +currentDSTotal;
								currentCTSTotal = +oModelDataOld[i].current_CTS + +currentCTSTotal;
								currentCPTotal = +oModelDataOld[i].current_CP + +currentCPTotal;
								currentUDSTotal = +oModelDataOld[i].currentU_DS + +currentUDSTotal;
								salesDataTotal = +oModelDataOld[i].salesdata + +salesDataTotal;

								suggestedTotal = +oModelDataOld[i].suggested + +suggestedTotal;
								suggestedDSTotal = +oModelDataOld[i].suggested_Ds + +suggestedDSTotal;
								// requestedVolumeTotal = +oModelData2[i].requested_Volume + +requestedVolumeTotal;
								requestedDSTotal = +oModelDataOld[i].requested_Ds + +requestedDSTotal;
								allocatedTotal = +oModelDataOld[i].allocated + +allocatedTotal;
								allocatedDSTotal = +oModelDataOld[i].allocated_Ds + +allocatedDSTotal;
								pendingAllocationTotal = +oModelDataOld[i].pendingAllocation + +pendingAllocationTotal;
								unfilledAllocationTotal = +oModelDataOld[i].unfilled_Allocation + +unfilledAllocationTotal;
								differenceTotal = +oModelDataOld[i].difference + +differenceTotal;
								// }
							}
						}

						for (var x = 0; x < oModelDataOld.length; x++) {
							// if (oModelDataOld[i].model != "") {
							oModelDataOld[x].requested_Volume = oModelDataOld[x].requested_Volume.toString();
							requestedVolumeTotal = +oModelDataOld[x].requested_Volume + +requestedVolumeTotal;
							// }
						}

						oInitialTotalStockModel["0"].suggestedTotal = suggestedTotal;
						oInitialTotalStockModel["0"].currentDSTotal = currentDSTotal;
						oInitialTotalStockModel["0"].currentTotal = currentTotal;

						oInitialTotalStockModel["0"].currentCTSTotal = currentCTSTotal;
						oInitialTotalStockModel["0"].currentCPTotal = currentCPTotal;
						oInitialTotalStockModel["0"].currentUDSTotal = currentUDSTotal;

						oInitialTotalStockModel["0"].differenceTotal = differenceTotal;
						oInitialTotalStockModel["0"].requestedVolumeTotal = requestedVolumeTotal;
						oInitialTotalStockModel["0"].suggestedDSTotal = suggestedDSTotal;
						oInitialTotalStockModel["0"].requestedDSTotal = requestedDSTotal;

						oInitialTotalStockModel["0"].allocatedTotal = allocatedTotal;
						oInitialTotalStockModel["0"].allocatedDSTotal = allocatedDSTotal;
						oInitialTotalStockModel["0"].pendingAllocationTotal = pendingAllocationTotal;
						oInitialTotalStockModel["0"].unfilledAllocationTotal = unfilledAllocationTotal;
						oInitialTotalStockModel["0"].salesDataTotal = salesDataTotal;
					}
				}

				oInitalTotalStock.updateBindings(true);

				for (var i = 0; i < oModelData2.length; i++) {
					that.oTable.getItems()[i].getCells()[12]._getInput().setEditable(false);
					oModelData2[i].requested_Volume = oModelData2[i].requested_Volume.toString();
					if (oModelData2[i].model != "") {

						if (Number(oModelData2[i].requested_Volume) < Number(oModelData2[i].suggested)) {
							that.oTable.getItems()[i].getCells()[12]._getInput().removeStyleClass("EqualWhite");
							that.oTable.getItems()[i].getCells()[12]._getInput().removeStyleClass("IncrementBlue");
							that.oTable.getItems()[i].getCells()[12]._getInput().addStyleClass("DecrementRed");
						} else if (Number(oModelData2[i].requested_Volume) > Number(oModelData2[i].suggested)) {
							that.oTable.getItems()[i].getCells()[12]._getInput().removeStyleClass("EqualWhite");
							that.oTable.getItems()[i].getCells()[12]._getInput().removeStyleClass("DecrementRed");
							that.oTable.getItems()[i].getCells()[12]._getInput().addStyleClass("IncrementBlue");
						} else if (Number(oModelData2[i].requested_Volume) == Number(oModelData2[i].suggested)) {
							that.oTable.getItems()[i].getCells()[12]._getInput().removeStyleClass("DecrementRed");
							that.oTable.getItems()[i].getCells()[12]._getInput().removeStyleClass("IncrementBlue");
							that.oTable.getItems()[i].getCells()[12]._getInput().addStyleClass("EqualWhite");
						}
					}
				}
				this.defaultLightBusyDialog.close();
			},

			//CR2.0 Calculating Subtotal on model level
			_dynamicSubTotal: function (groups, item, obj) {
				var that = this;
				// that.count = 0;
				var oTable = this.getView().byId("stockDataModelTableId");
				groups.forEach(function (element) {
					if (item.model == element.model) {
						that.index = element.current.length + that.index + that.count;
						that.getView().getModel("stockDataModel").getData().splice(that.index, 0, obj);
						that.getView().getModel("stockDataModel").updateBindings(true);
						oTable.getBinding("items").refresh(true);
						that.dynamicIndices.push(that.index);
						that.count = 1;

						// debugger;
						if (!!oTable.getItems()[that.index]) {
							oTable.getItems()[that.index].addStyleClass("grayBG");
							var cells = oTable.getItems()[that.index].getCells();
							for (var i = 0; i < cells.length; i++) {
								cells[i].addStyleClass("boldFont");
								cells[i].mProperties.step = 0;
								cells[i].mProperties.editable = false;
								cells[i].mProperties.enabled = false;
							}
						}
					}
				});
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
				oSuggestModel.setSizeLimit(1000);
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
				// if(this.dynamicIndice.length<1){
				this._calculateTotals(includeZero);
				// }

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
				oSuggestModel.setSizeLimit(1000);
				this.getView().setModel(oSuggestModel, "stockDataModel");

			},

			onClickShowPercentages: function (oEvt) {
				var showSuggestPercentagesText = this._oResourceBundle.getText("SHOW_PERCENTAGES"),
					showAllPercentagesText = this._oResourceBundle.getText("SHOW_ALL_VALUES");
				var oDetailModel = this.getView().getModel("oViewLocalDataModel");
				var currentText = this.getView().byId("showPercentagesBtn").getText();
				if (currentText == showSuggestPercentagesText) {
					oDetailModel.setProperty("/setEnableFalseSuggest", true);
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
					if (oModelData2[i].model != "") {
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

					}
				}
				oModelData.updateBindings(true);

				var oModelInitialStockModel = this.getView().getModel("initialStockTotalModel");
				var oModelInitialStockModelData = oModelInitialStockModel.getData();

				if (oModelInitialStockModelData["0"].differenceTotal < 0) {
					var sPrefix = "-" + "100%";

				}

			},

			_showPercentagesAgain: function (includeZero) {
				// //debugger;
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

					if (includeZero == false && oModelData2[i].model != "") {

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

				for (var i = 0; i < oModelData2.length; i++) {
					// if (oModelData2[i].visibleProperty == true){

					//if (+oModelData2[i].suggested > 0 ){
					if (oModelData2[i].model != "") {

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

					}
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
					if (oModelData2[i].model != "") {
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
						ZzetaMonth: item.zzend_date,
						zzdel_review: "Y",
						ZzrequestQty: requestedVolume,
						zzint_alc_qty: item.zzint_alc_qty,
						ZzuiFlag: item.ZzuiFlag
					});
				});

				return oItemSet;
			},

			_setTheLogo: function (oEvent) {
				var isDivisionSent = window.location.search.match(/Division=([^&]*)/i);
				if (isDivisionSent) {
					this.sDivision = window.location.search.match(/Division=([^&]*)/i)[1];
					if (this.sDivision == '10') // set the toyoto logo
					{
						var currentImageSource = this.getView().byId("idLexusLogo");
						currentImageSource.setProperty("src", "images/toyota_logo_colour.png");

					} else { // set the lexus logo
						var currentImageSource = this.getView().byId("idLexusLogo");
						currentImageSource.setProperty("src", "images/i_lexus_black_full.png");
					}
				}

			},

			//CR60-Fetching Past 6 months Sales data
			_loadSalesData2: function (oEvent) {
				// sap.ui.core.BusyIndicator.show();
				this.runninDataLoadScriptflag = false;
				var that = this;
				// that.callNewModel = true;
				this.oModel.read("/zcds_suggest_ord", {
					urlParameters: {
						"$filter": "zzdealer_code eq'" + this.dealerCode + "'and zzseries eq '" + this.series + "'"
							//+ "and zzmoyr eq '" + this.yearModel +"'"
					},
					success: function (oData) {
						// sap.ui.core.BusyIndicator.hide();
						if (oData.results.length > 0) {
							that.getOwnerComponent().getModel("LocalDataModel").setProperty("/zcdsSuggestOrdRes", oData.results);
							// that.defaultLightBusyDialog.close();
							$.each(oData.results, function (i, item) {
								var query = "(Model='" + item.zzmodel + "',Kunnr='" + that.dealerCode + "',Zzextcol='" + item.zzextcol + "',Zzseries='" +
									that.series + "',Zzsuffix='" + item.zzsuffix + "')"; //" + item.zzmoyr + "
								var uri = that.nodeJsUrl + "/ZVMS_STOCK_ALLOC_SALES_DATA_SRV/SalesDataSet" + query;
								$.ajax({
									dataType: "json",
									url: uri,
									type: "GET",
									success: function (oData) {
										// that.defaultLightBusyDialog.close();
										// sap.ui.core.BusyIndicator.hide();
										// if (oData.d.NetSales !== "0") {
										salesNetData.push({
											"NetSales": parseInt(oData.d.NetSales),
											"Model": oData.d.Model,
											"Kunnr": oData.d.Kunnr,
											"Zzextcol": oData.d.Zzextcol,
											"Zzseries": oData.d.Zzseries,
											"Zzsuffix": oData.d.Zzsuffix
												// "Zzmoyr": oData.d.Zzmoyr
										});

									},
									error: function (oError) {
										that.defaultLightBusyDialog.close();
										// sap.ui.core.BusyIndicator.hide();
									}
								});
							});
						} else {
							that.defaultLightBusyDialog.close();
							// sap.ui.core.BusyIndicator.hide();
						}
					}.bind(this),
					error: function (response) {
						this.defaultLightBusyDialog.close();
						// sap.ui.core.BusyIndicator.hide();
					}
				});
			},

			_loadTheData: function (oEvent) {
				// this.defaultLightBusyDialog.open();
				// sap.ui.core.BusyInd9icator.show();
				this.runninDataLoadScriptflag = false;
				var that = this;
				// that.callNewModel = true;
				//CR3.0 fetching Threshold flag
				this.thresholdModel = this.getOwnerComponent().getModel("ZVMS_STOCK_ALLOCATION_SUGG_ORD_SRV");
				this.thresholdModel.read("/ZCDS_SUGGST_ORD_QTY_TOL", {
					urlParameters: {
						"$filter": "zzdealer_code eq'" + this.dealerCode + "' and zzmoyr eq '" + this.yearModel + "'"
					},

					//"$filter": "zzdealer_code eq'" + this.dealerCode + "' and zzmoyr eq '" + this.yearModel +"'"	
					success: function (thresholdData) {
						// console.log("thresholdData", thresholdData.results);
						that.threSholdData = thresholdData.results;
						that.oModel.read("/zcds_suggest_ord", {
							urlParameters: {
								"$filter": "zzdealer_code eq'" + that.dealerCode + "'and zzseries eq '" + that.series + "'" + "and zzmoyr eq '" + that.yearModel +
									"'"
							},

							success: function (oData) {
								if (oData.results.length > 0) {
									// sap.ui.core.BusyIndicator.hide();
									var oStockAllocationData = [];
									that.oInitialTotalsForUI = [];
									var oInitialTotalsForUIBkup = [];
									var oStockBeforeReset = [];
									var oStockAlocationBkup = [];
									var sEtaFromData;
									var sEtaToData;
									var currentStatus;
									var etaFromAndToDates = [];

									var oModelLocalData = that.getView().getModel("oViewLocalDataModel");

									var totalRecordsReceived = oData.results.length;
									if (totalRecordsReceived <= 0) {
										oModelLocalData.setProperty("/enableForDealer", false);
										oModelLocalData.setProperty("/setEnableFalse", false);
									}
									totalRecordsReceived = totalRecordsReceived - 1;
									var currentTotal = 0,
										currentDSTotal = 0,
										currentCTSTotal = 0,
										currentCPTotal = 0,
										currentUDSTotal = 0,

										suggestedTotal = 0,
										suggestedDSTotal = 0,
										requestedVolumeTotal = 0,
										allocatedTotal = 0,
										allocatedDSTotal = 0,
										pendingAllocationTotal = 0,
										unfilledAllocationTotal = 0,
										differenceTotal = 0,
										requestedDSTotal = 0,
										salesDataTotal = 0;

									var zeroSuggestioncurrentTotal = 0,
										zeroSuggestioncurrentDSTotal = 0,
										zeroSuggestioncurrentCTSTotal = 0,
										zeroSuggestioncurrentCPTotal = 0,
										zeroSuggestioncurrentUDSTotal = 0,

										zeroSuggestionsuggestedTotal = 0,
										zeroSuggestionsalesDataTotal = 0,
										zeroSuggestiondifferenceTotal = 0,
										zeroSuggestionsuggestedDSTotal = 0,
										zeroSuggestionrequestedVolumeTotal = 0,
										zeroSuggestionallocatedTotal = 0,
										zeroSuggestionallocatedDSTotal = 0,
										zeroSuggestionpendingAllocationTotal = 0,
										zeroSuggestionunfilledAllocationTotal = 0,
										zeroSuggestionrequestedDSTotal = 0;

									var uiForcolorTrim;
									var dealerCode = that.dealerCode;
									var localeG = that.sCurrentLocale;
									if (newseriesFlag == true && that.etaFromNewSeries && that.etaToNewSeries) {
										etaFromAndToDates.push({
											sEtaFromData: that.etaFromNewSeries,
											sEtaToData: that.etaToNewSeries,
										});
									}

									$.each(oData.results, function (i, item) {
										for (var x = 0; x < salesNetData.length; x++) {
											if (salesNetData[x].Zzsuffix == item.zzsuffix &&
												salesNetData[x].Model == item.zzmodel &&
												salesNetData[x].Zzextcol == item.zzextcol) {
												item.NetSales = salesNetData[x].NetSales;
											}
										}
										that.threSholdData.filter(function (item2) {
											if (item.zzmodel == item2.zzmodel && item.zzmoyr == item2.zzmoyr) {
												that.allowedtolerance = item2.allowedtolerance;
											}
										});
										// allowedtolerance
										//START- CR3.0 Dealer Config
										if ((item.zzui_flag == "Y") && (Number(item.zzrequest_qty)) < (Number(item.zzsuggest_qty))) {
											checkOBJ.checkBoxFlag = true;
											checkOBJ.checkBoxEnabled = true;
										} else if ((item.zzui_flag == "N") && (Number(item.zzrequest_qty)) == (Number(item.zzsuggest_qty))) {
											checkOBJ.checkBoxFlag = false;
											checkOBJ.checkBoxEnabled = false;
										} else {
											checkOBJ.checkBoxFlag = false;
											checkOBJ.checkBoxEnabled = false;
										}
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
										if (newseriesFlag == false) {
											etaFromAndToDates.push({
												sEtaFromData: item.zzstart_date,
												sEtaToData: item.zzend_date,
												//	sEtaToData: item.zzprod_month
											}); //change by aarti
										}

										if (item.allowedtolerance === undefined) {
											item.allowedtolerance = 0;
										}

										oStockAllocationData.push({
											model: item.zzmodel,
											modelCodeDescription: modelCodeWithDescription,
											suffix: item.zzsuffix, //,
											suffix_desc: suffixToUi,
											colour_Trim: uiForcolorTrim,

											current: item.zzcur_stock,
											current_CP: item.zzcur_pipeline,
											currentDSSubttlOnly: "",
											current_Ds: item.zzcur_ds,
											current_CTS: +item.zzcur_pipeline + +item.zzcur_stock,
											currentU_DS: item.zzunit_ds,

											suggested: item.zzsuggest_qty,
											// Current Days of Supply + (Unit Days of Supply * Vehicles suggested by IBP at Model-Dealer Level.
											//+item.zzcur_ds++(+item.zzunit_ds+*zzsuggest_qty)
											suggestedDSSubttlOnly: "",
											suggested_Ds: +item.zzcur_ds + parseInt(item.zzunit_ds) * parseInt(item.zzsuggest_qty), //item.suggested_ds,  
											requested_Volume: item.zzrequest_qty,
											difference: item.diff_sugg_req,
											requestedDSSubttlOnly: "",
											requested_Ds: +item.zzcur_ds + parseInt(item.zzunit_ds) * parseInt(item.zzsuggest_qty), //item.requested_ds,
											allocated: item.zzallocated_qty,
											allocatedDSSubttlOnly: "",
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
											zzend_date: item.zzend_date,
											zzsuffix: item.zzsuffix,
											zzzadddata1: item.zzzadddata1, // this is used for Sort
											zzint_alc_qty: item.zzint_alc_qty,
											reqThreshold: "",
											allowedtolerance: Number(that.allowedtolerance),
											salesdata: item.NetSales,
											zzui_flag: item.zzui_flag, //START- CR3.0 Dealer Config
											checkBoxFlag: checkOBJ.checkBoxFlag,
											checkBoxEnabled: checkOBJ.checkBoxEnabled
										});

										oStockAlocationBkup.push({

											model: item.zzmodel,
											modelCodeDescription: modelCodeWithDescription,
											suffix: item.zzsuffix, //,
											suffix_desc: suffixToUi,
											colour_Trim: uiForcolorTrim,

											current: item.zzcur_stock,
											current_CP: item.zzcur_pipeline,
											currentDSSubttlOnly: "",
											current_Ds: item.zzcur_ds,
											current_CTS: +item.zzcur_pipeline + +item.zzcur_stock,
											currentU_DS: item.zzunit_ds,

											suggested: item.zzsuggest_qty,
											suggestedDSSubttlOnly: "",
											suggested_Ds: +item.zzcur_ds + parseInt(item.zzunit_ds) * parseInt(item.zzsuggest_qty), //item.suggested_ds,
											requested_Volume: item.zzrequest_qty,
											difference: item.diff_sugg_req,
											requestedDSSubttlOnly: "",
											requested_Ds: +item.zzcur_ds + parseInt(item.zzunit_ds) * parseInt(item.zzsuggest_qty) + +item.zzunit_ds, //item.requested_ds,
											allocated: item.zzallocated_qty,
											allocatedDSSubttlOnly: "",
											allocated_Ds: item.allocated_ds,
											pendingAllocation: item.pending_allocation,
											unfilled_Allocation: item.unfilled__allocation,

											zzsug_seq_no: item.zzsug_seq_no,
											zzprocess_dt: item.zzprocess_dt,
											zzextcol: item.zzextcol,
											zzintcol: item.zzintcol,
											zsrc_werks: item.zsrc_werks,
											zzprod_month: item.zzprod_month,
											zzend_date: item.zzend_date,
											zzordertype: item.zzordertype,
											zzsuffix: item.zzsuffix,
											zzzadddata1: item.zzzadddata1, // this is used for Sort
											zzint_alc_qty: item.zzint_alc_qty,
											allowedtolerance: Number(that.allowedtolerance),
											salesdata: item.NetSales,
											zzui_flag: item.zzui_flag,
											checkBoxFlag: checkOBJ.checkBoxFlag,
											checkBoxEnabled: checkOBJ.checkBoxEnabled
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
											zzend_date: item.zzend_date,
											zzordertype: item.zzordertype,
											zzsuffix: item.zzsuffix,
											zzzadddata1: item.zzzadddata1, // this is used for Sort
											zzint_alc_qty: item.zzint_alc_qty,
											salesdata: item.NetSales,
											zzui_flag: item.zzui_flag,
											checkBoxFlag: checkOBJ.checkBoxFlag,
											checkBoxEnabled: checkOBJ.checkBoxEnabled,
											allowedtolerance: that.allowedtolerance
										});

										currentTotal = currentTotal + +item.zzcur_stock;
										currentDSTotal = currentDSTotal + +item.zzcur_ds;
										currentCTSTotal = currentCTSTotal + +item.zcur_total;
										currentCPTotal = currentCPTotal + +item.zzcur_pipeline;
										currentUDSTotal = currentUDSTotal + +item.zzunit_ds;

										suggestedTotal = suggestedTotal + +item.zzsuggest_qty;
										differenceTotal = differenceTotal + +item.diff_sugg_req;
										suggestedDSTotal = suggestedDSTotal + +item.suggested_ds;

										requestedDSTotal = requestedDSTotal + +item.requested_Ds;
										salesDataTotal = salesDataTotal + +item.salesdata;

										requestedVolumeTotal = requestedVolumeTotal + +item.zzrequest_qty;
										allocatedTotal = allocatedTotal + +item.zzallocated_qty;
										allocatedDSTotal = allocatedDSTotal + +item.allocated_ds;
										pendingAllocationTotal = pendingAllocationTotal + +item.pending_allocation;
										unfilledAllocationTotal = unfilledAllocationTotal + +item.unfilled__allocation;

										if (item.zzsuggest_qty <= 0) {
											zeroSuggestioncurrentTotal = zeroSuggestioncurrentTotal + +item.zzcur_stock;
											zeroSuggestioncurrentDSTotal = zeroSuggestioncurrentDSTotal + +item.zzcur_ds;
											zeroSuggestioncurrentCTSTotal = zeroSuggestioncurrentCTSTotal + +item.zcur_total;
											zeroSuggestioncurrentCPTotal = zeroSuggestioncurrentCPTotal + +item.zzcur_pipeline;
											zeroSuggestioncurrentUDSTotal = zeroSuggestioncurrentUDSTotal + +item.zzunit_ds;

											zeroSuggestionsalesDataTotal = zeroSuggestionsalesDataTotal + +item.salesdata;
											zeroSuggestionsuggestedTotal = zeroSuggestionsuggestedTotal + +item.zzsuggest_qty;
											zeroSuggestiondifferenceTotal = zeroSuggestiondifferenceTotal + +item.diff_sugg_req;
											zeroSuggestionsuggestedDSTotal = zeroSuggestionsuggestedDSTotal + +item.suggested_ds;
											zeroSuggestionrequestedDSTotal = zeroSuggestionrequestedDSTotal + +item.requested_Ds;

											zeroSuggestionrequestedVolumeTotal = zeroSuggestionrequestedVolumeTotal + +item.zzrequest_qty;
											zeroSuggestionallocatedTotal = zeroSuggestionallocatedTotal + +item.zzallocated_qty;
											zeroSuggestionallocatedDSTotal = zeroSuggestionallocatedDSTotal + +item.allocated_ds;
											zeroSuggestionpendingAllocationTotal = zeroSuggestionpendingAllocationTotal + +item.pending_allocation;
											zeroSuggestionunfilledAllocationTotal = zeroSuggestionunfilledAllocationTotal + +item.unfilled__allocation;
										}

										that.runninDataLoadScriptflag = true;
										if (totalRecordsReceived == i) {

											if (newseriesFlag == true) {
												that.oInitialTotalsForUI.push({
													"suggestedTotal": "0",
													"currentDSTotal": "0",
													"currentTotal": "0",
													"currentCTSTotal": "0",
													"currentCPTotal": "0",
													"currentUDSTotal": "0",
													"differenceTotal": "0",
													"requestedVolumeTotal": "0",
													"suggestedDSTotal": "0",
													"requestedDSTotal": "0",
													"allocatedTotal": "0",
													"allocatedDSTotal": "0",
													"pendingAllocationTotal": "0",
													"unfilledAllocationTotal": "0",
													"salesDataTotal": "0"
												});
											} else if (newseriesFlag == false) {
												that.oInitialTotalsForUI.push({

													currentTotal: zeroSuggestioncurrentTotal,
													currentDSTotal: zeroSuggestioncurrentDSTotal,
													currentCTSTotal: zeroSuggestioncurrentCTSTotal,
													currentCPTotal: zeroSuggestioncurrentCPTotal,
													currentUDSTotal: zeroSuggestioncurrentUDSTotal,

													differenceTotal: zeroSuggestiondifferenceTotal,
													suggestedTotal: zeroSuggestionsuggestedTotal,
													suggestedDSTotal: zeroSuggestionsuggestedDSTotal,
													requestedVolumeTotal: requestedVolumeTotal,
													requestedDSTotal: zeroSuggestionrequestedDSTotal,

													allocatedTotal: zeroSuggestionallocatedTotal,
													allocatedDSTotal: zeroSuggestionallocatedDSTotal,
													pendingAllocationTotal: zeroSuggestionpendingAllocationTotal,
													unfilledAllocationTotal: zeroSuggestionunfilledAllocationTotal,
													salesDataTotal: zeroSuggestionsalesDataTotal

												});

												oInitialTotalsForUIBkup.push({
													currentTotal: currentTotal,
													currentDSTotal: currentDSTotal,
													currentCTSTotal: currentCTSTotal,
													currentCPTotal: currentCPTotal,
													currentUDSTotal: currentUDSTotal,
													differenceTotal: differenceTotal,
													suggestedTotal: suggestedTotal,
													suggestedDSTotal: suggestedDSTotal,
													requestedDSTotal: requestedDSTotal,
													requestedVolumeTotal: requestedVolumeTotal,
													allocatedTotal: allocatedTotal,
													allocatedDSTotal: allocatedDSTotal,
													pendingAllocationTotal: pendingAllocationTotal,
													unfilledAllocationTotal: unfilledAllocationTotal,
													salesDataTotal: salesDataTotal,
													onlyForBkup: true

												});
											}

										}
										// }, 2000);

									});

									console.log(that.getView().getModel("oViewLocalDataModel"));
									// if (that.counter == 0) {
									// function runScript2() {
									// console.log("running 2 as flag runninDataLoadScriptflag is true")
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
									oStockData.setSizeLimit(
										1000);
									console.log("oStockData", oStockData);
									that.getView().setModel(oStockData, "stockDataModel");
									// By default lets show the suggested only and by clicking on show all models then we expland the screen. 

									var suggestedTabClick = that._oViewLocalData.getProperty("/fromWhichTabClickIamIn"); //"suggestedTab"
									var suggestedVolumeonSeries = that._oViewLocalData.getProperty("/seriesSuggestedVolume"); // "0"
									var showSuggestModelsText = that._oResourceBundle.getText("SHOW_ALL_MODELS"), //SHOW_SUGGEST_MODELS
										showAllModelsText = that._oResourceBundle.getText("SHOW_ALL_MODELS");
									var currentText = showAllModelsText; //this.getView().byId("showAllModelsBtn").getText();
									var oModelData2 = that.getView().getModel("stockDataModel").getData();

									if (suggestedVolumeonSeries == "0") {
										// by default we want to expand the records with zero qty. 
										if (currentText == showAllModelsText) {
											// set the text to show suggested models and expand the view. 
											that.getView().byId("showAllModelsBtn").setProperty("text", showSuggestModelsText);
											for (var i = 0; i < oModelData2.length; i++) {
												if (oModelData2[i].suggested <= 0) {
													oModelData2[i].visibleProperty = true;
												}
											}
										}
									} else {
										for (var i = 0; i < oModelData2.length; i++) {
											if (oModelData2[i].suggested <= 0) {
												oModelData2[i].visibleProperty = true;
											}
										}
									}

									if (that.removeSuggestedRequestedZeroQty == true) {
										// if requested qty and suggested qty are zero,  then lets not show the user the data.	 	
										for (var i = 0; i < oModelData2.length; i++) {
											if (oModelData2[i].suggested <= 0 && oModelData2[i].requested_Volume <= 0) {
												oModelData2[i].visibleProperty = false;
												oModelData2.splice(i, 1); // lets remove the record from UI, no use for it
											}
										}
									}

									var oModelData = that.getView().getModel("stockDataModel");
									oModelData.updateBindings(true);
									// stockData backup. 
									var oStockDataBkup = new sap.ui.model.json.JSONModel();
									var aDataCopy = JSON.parse(JSON.stringify(oStockAlocationBkup));
									oStockDataBkup.setData(aDataCopy);
									oStockDataBkup.setSizeLimit(
										1000);

									that.getView().setModel(oStockDataBkup, "stockDataModelBkup");

									// Totals Received From SAP.
									var oTotalRecevied = new sap.ui.model.json.JSONModel();
									oTotalRecevied.setData(that.oInitialTotalsForUI);
									oTotalRecevied
										.setSizeLimit(1000);
									that.getView().setModel(oTotalRecevied, "initialStockTotalModel");

									// Bkup total Model. 
									var oTotalReceviedBkupModel = new sap.ui.model.json.JSONModel();
									// oTotalReceviedBkupModel.setData(oInitialTotalsForUIBkup);
									oTotalReceviedBkupModel.setData(that.oInitialTotalsForUI);
									oTotalReceviedBkupModel.setSizeLimit(1000);
									that.getView()
										.setModel(oInitialTotalsForUIBkup, "initialStockTotalModelBkup");

									// build the model received before reset
									var oStockBefore = new sap.ui.model.json.JSONModel();
									oStockBefore.setData(oStockBeforeReset);
									oStockBefore.setSizeLimit(
										1000);
									that.getView().setModel(oStockBefore, "stockFromSAPModel");

									// for the totals subtract from the total					
									var oModel = that.getView().getModel("initialStockTotalModel");

									var oViewLocalModel = that.getView().getModel("oViewLocalDataModel");

									if (currentStatus == "S") {
										oViewLocalModel.setProperty("/viewInSuggestedTab", false);

										if (that.outSideWindowDate == false) {
											if (that.sLoggedinUserIsDealer == true) {
												oViewLocalModel.setProperty("/enableForDealer", true);
												oViewLocalModel.setProperty("/setEnableFalseReset", true);
											} else {
												oViewLocalModel.setProperty("/enableForDealer", false);
												oViewLocalModel.setProperty("/setEnableFalseReset", false);
											}
										}
									}

									if (currentStatus == "R") {
										oViewLocalModel.setProperty("/setEnableFalseReset", false);
										oViewLocalModel.setProperty("/enableForDealer", false);
									}

									//  eta from and To Dates. 
									var valueOfEarlierEtaFrom, valueOFEarlierEtaTo;
									var lowestEtaFrom, highestEtaTo;
									for (var i = 0; i < etaFromAndToDates.length; i++) {

										if ((etaFromAndToDates[i].sEtaFromData < valueOfEarlierEtaFrom) && (etaFromAndToDates[i].sEtaFromData <
												lowestEtaFrom) ||
											lowestEtaFrom == undefined) {
											lowestEtaFrom = etaFromAndToDates[i].sEtaFromData;

										}
										if ((etaFromAndToDates[i].sEtaToData > valueOFEarlierEtaTo) && (etaFromAndToDates[i].sEtaToData > highestEtaTo) ||
											highestEtaTo == undefined) {
											//highestEtaTo = etaFromAndToDates[i].sEtaToData;
											var jsonDate = (processDate).toJSON();
											var m = jsonDate.replace(/[^a-z0-9/\s/g]|\:\.\d\dZ/g, ' ');
											var newDateTO = m.replace(/\s/g, "");
											highestEtaTo = newDateTO;

										}

										valueOfEarlierEtaFrom = etaFromAndToDates[i].sEtaFromData;
										valueOFEarlierEtaTo = etaFromAndToDates[i].sEtaToData;
									}

									if (lowestEtaFrom !== undefined) {
										var etaFromDateMonth = parseInt(lowestEtaFrom.substr(4, 2)) + 1; //lowestEtaFrom.substr(4, 2);
										if (etaFromDateMonth > 12) {
											etaFromDateMonth = etaFromDateMonth - 12;
										}
										var etaFromDateYear = lowestEtaFrom.substr(0, 4);
									}
									// //debugger;
									if (highestEtaTo !== undefined) {
										var etaToDateMonth = parseInt(highestEtaTo.substr(4, 2)) + 2; //it ll be process date plus two future months
										//changes done by Vivek Saraogi
										if (etaToDateMonth > 12) {
											etaToDateMonth = etaToDateMonth - 12;
											var etaToDateYear = +highestEtaTo.substr(0, 4) + +1;
										} else {
											var etaToDateYear = highestEtaTo.substr(0, 4);
										}
									}
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

									var oTable = that.getView().byId("stockDataModelTableId");
									oTable.setModel(that.getView().getModel("stockDataModel"),
										"stockDataModel");
									oTable.refreshItems();
									oTable.getModel("stockDataModel").updateBindings();
									// if (item.zzrequest_qty < Number(item.zzsuggest_qty)) {
									// 	this.getView().byId("stepInputQty")._getInput().removeStyleClass("EqualGreen");
									// 	this.getView().byId("stepInputQty")._getInput().removeStyleClass("IncrementBlue");
									// 	this.getView().byId("stepInputQty")._getInput().addStyleClass("DecrementRed");
									// } else if (item.zzrequest_qty > Number(item.zzsuggest_qty)) {
									// 	this.getView().byId("stepInputQty")._getInput().removeStyleClass("EqualGreen");
									// 	this.getView().byId("stepInputQty")._getInput().removeStyleClass("DecrementRed");
									// 	this.getView().byId("stepInputQty")._getInput().addStyleClass("IncrementBlue");
									// } else if (item.zzrequest_qty == Number(item.zzsuggest_qty)) {
									// 	this.getView().byId("stepInputQty")._getInput().removeStyleClass("DecrementRed");
									// 	this.getView().byId("stepInputQty")._getInput().removeStyleClass("IncrementBlue");
									// 	this.getView().byId("stepInputQty")._getInput().addStyleClass("EqualGreen");
									// }
									that._calculateTotals();
									//debugger;
									if (newseriesFlag == true && callNewModelCount === 0) {
										that.newModelData(tempObj2, IntCol2);
										callNewModelCount = 1;
									}

									// that.defaultLightBusyDialog.close();
								} else {
									that.defaultLightBusyDialog.close();
									// sap.ui.core.BusyIndicator.hide();
								}
							}.bind(that),
							error: function (response) {
								that.defaultLightBusyDialog.close();
								// sap.ui.core.BusyIndicator.hide();
							}
						});
					}.bind(that),
					error: function (response) {
						that.defaultLightBusyDialog.close();
						// sap.ui.core.BusyIndicator.hide();
					}
				});

			},
			onLiveChange: function (oEvent) {
				// if (!!query && query.length > 0) {
				// 	this.sSearchQuery = query;
				// 	this.fnApplyFiltersAndOrdering();

				// } else {
				this.sSearchQuery = oEvent.getSource().getValue();
				this.fnApplyFiltersAndOrdering();
				// }
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

			onClickRequestNewModel: function (oEvent) {
				this.modelClickFlag = true;
				//  call the function get all the models already
				this._getAllTheModelsFortheSeries();

			},

			_getAllTheModelsFortheSeries: function (oSeriesVal2) {
				sap.ui.core.BusyIndicator.show();

				var Modelyear = this.zzmoyr;
				var oSeriesVal = this.zzseries;

				// this.oModelStockExistingData = this.getView().getModel("stockDataModel").getData();
				var _that = this;
				_that.oGlobalJSONModel.getData().modelData = [];

				var uri = _that.nodeJsUrl + "/ZSD_SUGGEST_ORDER_UPDATE_SRV/ZCDS_SUGGEST_ORD_READ?$filter=zzmoyr eq '" + Modelyear +
					"' and zzseries eq '" + oSeriesVal + "'";
				$.ajax({
					dataType: "json",
					url: uri,
					type: "GET",
					success: function (oData) {
						// console.log("oData.d.results", oData.d.results);
						backupModelData = oData.d.results;
						if (_that.oGlobalJSONModel.getData().modelData == undefined) {
							_that.oGlobalJSONModel.getData().modelData = [];
						}

						if (oData.d.results.length > 0) {
							var b = 0;
							for (var i = 0; i < oData.d.results.length; i++) {
								var oModel = oData.d.results[i].zzmodel;
								for (var j = 0; j < _that.oGlobalJSONModel.getData().modelData.length; j++) {
									if (oModel != _that.oGlobalJSONModel.getData().modelData[j].Model) {
										b++;
									}
								}
								if (b == _that.oGlobalJSONModel.getData().modelData.length && oData.d.results[i].zzorder_ind == "Y") {
									_that.oGlobalJSONModel.getData().modelData.push({
										"localLang": _that.Language,
										"mrktg_int_desc_en": oData.d.results[i].int_trim_desc_en,
										"mrktg_int_desc_fr": oData.d.results[i].int_trim_desc_fr,
										"MarketingDescriptionEXTColorEN": oData.d.results[i].mktg_desc_en,
										"MarketingDescriptionEXTColorFR": oData.d.results[i].mktg_desc_fr,
										"ENModelDesc": oData.d.results[i].model_desc_en,
										"FRModelDesc": oData.d.results[i].model_desc_fr,
										"SuffixDescriptionEN": oData.d.results[i].suffix_desc_en,
										"SuffixDescriptionFR": oData.d.results[i].suffix_desc_fr,
										"ExteriorColorCode": oData.d.results[i].zzextcol,
										"zzintcol": oData.d.results[i].zzintcol,
										"Model": oData.d.results[i].zzmodel,
										"zzmoyr": oData.d.results[i].zzmoyr,
										"zzorder_ind": oData.d.results[i].zzorder_ind,
										"zzseries": oData.d.results[i].zzseries,
										"zzseries_desc_en": oData.d.results[i].zzseries_desc_en,
										"zzseries_desc_fr": oData.d.results[i].zzseries_desc_fr,
										"Suffix": oData.d.results[i].zzsuffix
									});
									_that.oGlobalJSONModel.updateBindings(true);

								}
								b = 0;
							}
							sap.ui.core.BusyIndicator.hide();
							if (_that.oGlobalJSONModel.getData().modelData.length < 1) {
								var oModelLocalData = _that.getView().getModel("oViewLocalDataModel");
								oModelLocalData.setProperty("/enableForDealer", false);
								var messageForNoModelData = _that.getView().getModel("i18n").getResourceBundle().getText("noModelDataReceived");
								MessageToast.show(messageForNoModelData);
							} else {
								if (_that.oGlobalJSONModel.getData().modelData[0].Model != "Please Select") {
									_that.oGlobalJSONModel.getData().modelData.unshift({
										"Model": _that._oResourceBundle.getText("PleaseSelect"),
										"ENModelDesc": "",
										"FRModelDesc": "",
										"localLang": "",
										"int_trim_desc_en": "",
										"int_trim_desc_fr": "",
										"mktg_desc_en": "",
										"mktg_desc_fr": "",
										"suffix_desc_en": "",
										"suffix_desc_fr": "",
										"zzextcol": "",
										"zzintcol": "",
										"zzmoyr": "",
										"zzorder_ind": "",
										"zzseries": "",
										"zzseries_desc_en": "",
										"zzseries_desc_fr": "",
										"zzsuffix": ""
									});
								}
								_that.GlobalModelData = _that.oGlobalJSONModel.getData().modelData;
							}

						} else {
							sap.ui.core.BusyIndicator.hide();
						}
						_that.oGlobalJSONModel.updateBindings(true);
						if (_that.modelClickFlag == true) {
							_that._requestCompletedOpenDialog();
						}
					},
					error: function (oError) {
						sap.ui.core.BusyIndicator.hide();
						_that.errorFlag = true;
					}
				});

			},

			_requestCompletedOpenDialog: function (oEvent) {
				var checkModelData = this.oGlobalJSONModel.getData().modelData.length;
				if (checkModelData > 0) {
					if (!this._modelRequestDialog) {
						this._modelRequestDialog = sap.ui.xmlfragment("modelDialog", "suggestOrder.fragment.NewCarModelDialog", this);

						this.getView().addDependent(this._modelRequestDialog);
					}
					this._modelRequestDialog.open();
					sap.ui.core.Fragment.byId("modelDialog", "clickNewModelDialog").setVisible(false);

				} else {
					var messageForNoModelData = this.getView().getModel("i18n").getResourceBundle().getText("noModelDataReceived");
					MessageToast.show(messageForNoModelData);
				}
			},

			//on Model Selection Change
			onModelSelectionChange: function (oModel) {
				var _that = this;
				_that.Modelyear = this.zzmoyr;
				_that.Model = oModel.getParameters("selectedItem").selectedItem.getKey();
				_that.oGlobalJSONModel.getData().suffixData = [];

				var b = 0;
				for (var i = 0; i < backupModelData.length; i++) {
					var zzsuffix = backupModelData[i].zzsuffix;
					for (var j = 0; j < _that.oGlobalJSONModel.getData().suffixData.length; j++) {
						if (zzsuffix !== _that.oGlobalJSONModel.getData().suffixData[j].Suffix) {
							b++;
						}
					}
					if (b === _that.oGlobalJSONModel.getData().suffixData.length && backupModelData[i].zzmodel == _that.Model && backupModelData[i]
						.zzmoyr ==
						_that.Modelyear) {
						_that.oGlobalJSONModel.getData().suffixData.push({
							"Model": backupModelData[i].zzmodel,
							"Modelyear": backupModelData[i].zzmoyr,
							"Suffix": backupModelData[i].zzsuffix,
							"int_c": backupModelData[i].zzintcol,
							"SuffixDescriptionEN": backupModelData[i].suffix_desc_en,
							"SuffixDescriptionFR": backupModelData[i].suffix_desc_fr,
							"mrktg_int_desc_en": backupModelData[i].int_trim_desc_en,
							"mrktg_int_desc_fr": backupModelData[i].int_trim_desc_fr,
							"localLang": _that.Language
						});
						_that.oGlobalJSONModel.updateBindings(true);

					}
					b = 0;
				}
				sap.ui.core.BusyIndicator.hide();
				if (_that.oGlobalJSONModel.getData().suffixData[0].zzsuffix !== "Please Select") {
					_that.oGlobalJSONModel.getData().suffixData.unshift({
						"Model": "",
						"localLang": "",
						"int_c": "",
						"mrktg_int_desc_en": "",
						"mrktg_int_desc_fr": "",
						"SuffixDescriptionEN": "",
						"SuffixDescriptionFR": "",
						"Modelyear": "",
						"Suffix": _that._oResourceBundle.getText("PleaseSelect")
					});
				}
				_that.oGlobalJSONModel.updateBindings(true);
			},

			onSuffixChange: function (oSuffixVal) {
				var _that = this;
				_that.Suffix = oSuffixVal.getParameters("selectedItem").selectedItem.getKey();
				// sap.ui.core.BusyIndicator.show();
				_that.oGlobalJSONModel.getData().colorData = [];
				backupModelData.filter(function (item) {
					// console.log(item);
					if (item.zzmodel == _that.Model && item.zzmoyr == _that.Modelyear && item.zzsuffix == _that.Suffix && item.zzseries == _that.zzseries) {
						var obj = {
							"ExteriorColorCode": item.zzextcol,
							"MarketingDescriptionEXTColorEN": item.mktg_desc_en,
							"MarketingDescriptionEXTColorFR": item.mktg_desc_fr,
							"localLang": _that.Language,
							"InteriorColorCode": item.zzintcol
						};
						// console.log("oData.d.results", obj);
						_that.oGlobalJSONModel.getData().colorData.push(obj);
					}
				});
				_that.oGlobalJSONModel.getData().colorData.unshift({
					"ExteriorColorCode": _that._oResourceBundle.getText("PleaseSelect"),
					"MarketingDescriptionEXTColorEN": "",
					"MarketingDescriptionEXTColorFR": "",
					"localLang": "",
					"InteriorColorCode": ""
				});
				_that.oGlobalJSONModel.updateBindings(true);
				// sap.ui.core.BusyIndicator.hide();
				// console.log("oData.d.results", _that.oGlobalJSONModel.getData().colorData);
			},

			onColorSelectionDoneEnableAddButton: function (oEvent) {
				sap.ui.core.Fragment.byId("modelDialog", "clickNewModelDialog").setVisible(true);
				// check for all mandatory fields and allow submit. 

			},

			onClickCloseNewModelDialog: function (oEvent) {
				sap.ui.core.Fragment.byId("modelDialog", "ID_modelDesc").setSelectedKey("");
				sap.ui.core.Fragment.byId("modelDialog", "reqVolumeId").setValue();
				sap.ui.core.Fragment.byId("modelDialog", "ID_modelDesc").setSelectedKey();
				// sap.ui.core.Fragment.byId("modelDialog", "ID_modelDesc").setText();
				sap.ui.core.Fragment.byId("modelDialog", "ID_marktgIntDesc").setSelectedKey();
				// sap.ui.core.Fragment.byId("modelDialog", "ID_marktgIntDesc").setText();
				sap.ui.core.Fragment.byId("modelDialog", "ID_ExteriorColorCode").setSelectedKey();
				// sap.ui.core.Fragment.byId("modelDialog", "ID_ExteriorColorCode").setText();
				// 
				this._modelRequestDialog.close();
			},

			getSourcePlant: function (objNew) {
				var uri = this.nodeJsUrl + "/Z_VEHICLE_MASTER_SRV/zc_myear?$filter= ModelYear eq '" + objNew.Zzmoyr +
					"' and Model eq '" + objNew.Zzmodel + "'";
				//ModelSeriesNo
				var that = this;
				$.ajax({
					dataType: "json",
					url: uri,
					type: "GET",
					success: function (oData) {
						if (oData.d.results.length > 0) {
							// console.log("Source Plant", oData.d.results[0].SourcePlant);
							objNew.ZsrcWerks = oData.d.results[0].SourcePlant;
							that.oModelStockData[that.oModelStockData.length - 1].ZsrcWerks = oData.d.results[0].SourcePlant;
							that.getSeqNumber(objNew);
						} else {
							if (!newseriesFlag) {
								that.onClickCloseNewModelDialog();
							}
							MessageBox.error(that._oResourceBundle.getText("NO_DATA"));
						}
					},
					error: function (oErr) {
						// console.log("Error in fetching source plant", oErr);
					}
				});
			},

			getSeqNumber: function (objNew) {
				var that = this;
				var service = that.nodeJsUrl + "/ZSD_SUGGEST_ORDER_UPDATE_SRV/";
				that.oIBPModel = new sap.ui.model.odata.ODataModel(service, true); //this.getOwnerComponent().getModel("ZSD_SUGGEST_ORDER_UPDATE_SRV");
				that._oToken = this.oIBPModel.getHeaders()['x-csrf-token'];
				var uri = this.nodeJsUrl + "/ZSD_SUGGEST_ORDER_UPDATE_SRV/SuggestOrderSet('00000000')";
				$.ajax({
					type: "GET",
					headers: {
						"X-Csrf-Token": "Fetch"
					},
					url: uri,
					success: function (data, textStatus, request) {
						that.csrfToken = request.getResponseHeader('X-Csrf-Token');
						$.ajaxSetup({
							headers: {
								'X-CSRF-Token': that.csrfToken
							}
						});

					}
				});
				that.oIBPModel.create("/SuggestOrderSet", objNew, {
					success: $.proxy(function (data, response) {
						// console.log("odata seq", data.ZzsugSeqNo);
						objNew.ZzsugSeqNo = data.ZzsugSeqNo;
						that.oModelStockData[that.oModelStockData.length - 1].zzsug_seq_no = data.ZzsugSeqNo;
						that.comingFromAddingaModel = true;
						// lets get teh totals straight. 

						that.oModelStockData = that.getView().getModel("stockDataModel").getData();

						var oInitalTotalStock = that.getView().getModel("initialStockTotalModel");
						var oInitialTotalStockModel = oInitalTotalStock.getData();
						var newAddedQty;
						if (newAddedQty) {
							newAddedQty = sap.ui.core.Fragment.byId("modelDialog", "reqVolumeId").getValue();
						}
						// else {
						// 	newAddedQty = 0;
						// }
						oInitialTotalStockModel["0"].requestedVolumeTotal = oInitialTotalStockModel["0"].requestedVolumeTotal + newAddedQty;
						oInitalTotalStock.updateBindings(true);
						// sort the data. 
						var oModelStock = that.getView().getModel("stockDataModel");
						that.oModelStockData = _.chain(that.oModelStockData)
							.sortBy("zzextcol")
							.sortBy("zzsuffix")
							.sortBy("model")
							.value();

						oModelStock.updateBindings(true);
						if (!newseriesFlag) {
							sap.ui.core.Fragment.byId("modelDialog", "ID_modelDesc").setSelectedKey("");
							sap.ui.core.Fragment.byId("modelDialog", "ID_ExteriorColorCode").setSelectedKey("");
							sap.ui.core.Fragment.byId("modelDialog", "ID_marktgIntDesc").setSelectedKey("");
							sap.ui.core.Fragment.byId("modelDialog", "reqVolumeId").setValue("");
							sap.ui.core.Fragment.byId("modelDialog", "reqVolumeId").setValue(0);
							that._modelRequestDialog.close();
						}

						sap.ui.getCore().setModel(that.getView().getModel("stockDataModel"), "stockDataModel");
						that._loadSalesData2();
						setTimeout(function () {
							that._loadTheData();
						}, 3000);

					}),
					error: function (err) {
						// console.log("Error in fetching source plant", err);
					}
				});
			},

			onClickAddNewModelDialog: function (oEvt) {
				newseriesFlag = false;
				//to get source plant Z_VEHICLE_MASTER_SRV/zc_c_vehicle?$top=2

				var newAddedQty = sap.ui.core.Fragment.byId("modelDialog", "reqVolumeId").getValue();
				var newAddedModel = sap.ui.core.Fragment.byId("modelDialog", "ID_modelDesc").getSelectedItem().getKey();
				var newAddedModelAndDescription = sap.ui.core.Fragment.byId("modelDialog", "ID_modelDesc").getSelectedItem().getText();
				var newAddedSuffix = sap.ui.core.Fragment.byId("modelDialog", "ID_marktgIntDesc").getSelectedItem().getKey();
				var newAddedSuffixAndDescription = sap.ui.core.Fragment.byId("modelDialog", "ID_marktgIntDesc").getSelectedItem().getText();
				var newAddedExteriorColorCode = sap.ui.core.Fragment.byId("modelDialog", "ID_ExteriorColorCode").getSelectedItem().getKey();
				var newAddedExteriorColorCodeAndDescription = sap.ui.core.Fragment.byId("modelDialog", "ID_ExteriorColorCode").getSelectedItem()
					.getText();

				var tempOBj = [{
					"newAddedQty": newAddedQty,
					"newAddedModel": newAddedModel,
					"newAddedModelAndDescription": newAddedModelAndDescription,
					"newAddedSuffix": newAddedSuffix,
					"newAddedSuffixAndDescription": newAddedSuffixAndDescription,
					"newAddedExteriorColorCode": newAddedExteriorColorCode,
					"newAddedExteriorColorCodeAndDescription": newAddedExteriorColorCodeAndDescription
				}];
				this.newModelData(tempOBj, "");
			},

			newModelData: function (tempOBj, intcol) {
				var oModelStock = this.getView().getModel("stockDataModel");
				this.oModelStockData = this.getView().getModel("stockDataModel").getData();
				// var existingModelData = oModelStock.getData();
				var alreadyExists = this.oModelStockData.filter(function (k) {
					if (k.model === tempOBj[0].newAddedModel && k.suffix === tempOBj[0].newAddedSuffix && k.zzextcol === tempOBj[0].newAddedExteriorColorCode)
						return k;
				});
				var _that = this;
				var exists = Object.keys(_that.oModelStockData).some(function (k) {
					return (_that.oModelStockData[k].model === tempOBj[0].newAddedModel && _that.oModelStockData[k].suffix === tempOBj[0].newAddedSuffix &&
						_that.oModelStockData[k].zzextcol === tempOBj[0].newAddedExteriorColorCode);
				});
				var temp = this.oGlobalJSONModel.getData().colorData;
				if (!exists) {
					_that.getView().getModel("oViewLocalDataModel").setProperty("/setResetEnabled", false);
					objNew.ZzsugSeqNo = '00000000';
					objNew.Zzmodel = tempOBj[0].newAddedModel;
					objNew.ZzprocessDt = processDate;
					objNew.Zzsuffix = tempOBj[0].newAddedSuffix;
					objNew.Zzmoyr = this.yearModel;
					objNew.Zzextcol = tempOBj[0].newAddedExteriorColorCode;
					objNew.Zzintcol = this.InteriorColorCode;
					objNew.ZzdealerCode = this.dealerCode;
					objNew.ZzrequestQty = tempOBj[0].newAddedQty.toString();
					objNew.Zzseries = this.series;
					objNew.ZzseriesDescEn = this.seriesDescription;
					// var res = temp.find(({
					// 	ExteriorColorCode
					// }) => ExteriorColorCode == newAddedExteriorColorCode);
					if (!!temp) {
						for (var i = 0; i < temp.length; i++) {
							if (temp[i] != undefined && temp[i] !== null) {
								temp[i].ExteriorColorCode = tempOBj[0].newAddedExteriorColorCode;
								this.InteriorColorCode = temp[i].InteriorColorCode;
							}
						}
					} else {
						this.InteriorColorCode = intcol;
					}
					this.oModelStockData.push({
						model: tempOBj[0].newAddedModel,
						ZsrcWerks: objNew.ZsrcWerks,
						zzsug_seq_no: objNew.zzsug_seq_no,
						zzprocess_dt: processDate,
						modelCodeDescription: tempOBj[0].newAddedModelAndDescription,
						zzsuffix: tempOBj[0].newAddedSuffix,
						zzmoyr: this.yearModel,
						suffix_desc: tempOBj[0].newAddedSuffixAndDescription,
						zzextcol: tempOBj[0].newAddedExteriorColorCode,
						requested_Volume: tempOBj[0].newAddedQty,
						colour_Trim: tempOBj[0].newAddedExteriorColorCodeAndDescription,
						current: "0",
						zzintcol: this.InteriorColorCode,
						visibleProperty: true,
						zzseries: this.series
					});
					this.getSourcePlant(objNew);
				} else {
					if (!newseriesFlag) {
						_that.onClickCloseNewModelDialog();
						MessageBox.error(tempOBj[0].newAddedModel + " " + _that._oResourceBundle.getText("AlreadyExists"));
					}
					_that.onClickShowAllX(true);
					var aFilters = [];
					var filter = new Filter([
						new Filter("model", sap.ui.model.FilterOperator.Contains, tempOBj[0].newAddedModel),
						new Filter("zzsuffix", sap.ui.model.FilterOperator.Contains, tempOBj[0].newAddedSuffix),
						// new Filter("suffix_desc", sap.ui.model.FilterOperator.Contains, newAddedSuffixAndDescription.split(" - ")[0]),
						new Filter("zzextcol", sap.ui.model.FilterOperator.Contains, tempOBj[0].newAddedExteriorColorCode)
					], true);
					aFilters.push(filter);
					this.byId("stockDataModelTableId").getBinding("items").filter(aFilters, "Application");
					_that.getView().getModel("oViewLocalDataModel").setProperty("/setResetEnabled", true);
				}
			},

			resetSearch: function () {
				this.byId("stockDataModelTableId").getBinding("items").filter([], "Application");
				this._calculateTotals();
			},
			onExit: function () {
				// var oDetailModel = this.getView().getModel("oViewLocalDataModel");
				// oDetailModel.setProperty("/checkBoxEnabled", false);
				// oDetailModel.setProperty("/checkBoxFlag", false);
				salesNetData = {};
				callNewModelCount = 0;
				var oTable = this.getView().byId("stockDataModelTableId");
				if (oTable.getItems().length > 1) {
					this.dynamicIndices = [];
					// console.log("this.dynamicIndices", this.dynamicIndices);
					for (var k = 0; k < oTable.getItems().length; k++) {
						if (oTable.getItems()[0].getId().split("-")[0] != oTable.getItems()[k].getId().split("-")[0]) {
							oTable.removeItem(oTable.getItems()[k].getId().split("-")[0]);
						}
					}
				}
			}
		});
	}, /* bExport= */ true);