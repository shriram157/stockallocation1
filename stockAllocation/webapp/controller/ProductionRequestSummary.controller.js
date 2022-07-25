sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
], function (BaseController, MessageBox, Utilities, History, MessageToast) {
	"use strict";
	var suggestedCount, requestedCount, allocatedCount, tabClicked, etaFromNewSeries, etaToNewSeries, backupModelData, RouteObj = {};
	return BaseController.extend("suggestOrder.controller.ProductionRequestSummary", {
		handleRouteMatched: function (oEvent) {
			// window.location.reload();
			var sAppId = "App5bb4c41429720e1dcc397810";

			var oParams = {};
			this.reqcomplete();

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

			var oViewModel = this.getView().getModel("detailView");
			oViewModel.setProperty("/visibleSeriesBtn", false);

			// on every route matched lets set the count. 

		},

		getAllModels: function (ZYear, ZSeries) {
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");
			if (sLocation_conf == 0) {
				this.sPrefix = "/Suggest_Order";
			} else {
				//Cloud Deployment
				this.sPrefix = "";
			}
			this.nodeJsUrl = this.sPrefix + "/node";
			var _that = this;
			sap.ui.core.BusyIndicator.show();
			var _that = this;
			_that._oDataModel.getData().modelData = [];

			var uri = _that.nodeJsUrl + "/ZSD_SUGGEST_ORDER_UPDATE_SRV/ZCDS_SUGGEST_ORD_READ?$filter=zzmoyr eq '" + ZYear +
				"' and zzseries eq '" + ZSeries + "'";
			$.ajax({
				dataType: "json",
				url: uri,
				type: "GET",
				success: function (oData) {
					backupModelData = oData.d.results;
					if (_that._oDataModel.getData().modelData == undefined) {
						_that._oDataModel.getData().modelData = [];
					}

					if (oData.d.results.length > 0) {
						var b = 0;
						for (var i = 0; i < oData.d.results.length; i++) {
							var oModel = oData.d.results[i].zzmodel;
							for (var j = 0; j < _that._oDataModel.getData().modelData.length; j++) {
								if (oModel != _that._oDataModel.getData().modelData[j].Model) {
									b++;
								}
							}
							if (b == _that._oDataModel.getData().modelData.length && oData.d.results[i].zzorder_ind == "Y") {
								_that._oDataModel.getData().modelData.push({
									"localLang": _that.sCurrentLocale,
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
								_that._oDataModel.updateBindings(true);

							}
							b = 0;
						}
						sap.ui.core.BusyIndicator.hide();
						if (_that._oDataModel.getData().modelData.length < 1) {
							var messageForNoModelData = _that.getView().getModel("i18n").getResourceBundle().getText("noModelDataReceived");
							MessageToast.show(messageForNoModelData);
						} else {
							if (_that._oDataModel.getData().modelData[0].Model != "Please Select") {
								_that._oDataModel.getData().modelData.unshift({
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
						}

					} else {
						sap.ui.core.BusyIndicator.hide();
					}
					_that._oDataModel.updateBindings(true);
					console.log("_that._oDataModel", _that._oDataModel);
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},

		onModelSelectionChange: function (oModel) {
			var _that = this;
			_that.Modelyear = RouteObj.Year;
			_that.Model = oModel.getParameters("selectedItem").selectedItem.getKey();
			RouteObj.Model = _that.Model;
			_that._oDataModel.getData().suffixData = [];

			var b = 0;
			for (var i = 0; i < backupModelData.length; i++) {
				var zzsuffix = backupModelData[i].zzsuffix;
				for (var j = 0; j < _that._oDataModel.getData().suffixData.length; j++) {
					if (zzsuffix !== _that._oDataModel.getData().suffixData[j].Suffix) {
						b++;
					}
				}
				if (b === _that._oDataModel.getData().suffixData.length && backupModelData[i].zzmodel == _that.Model && backupModelData[i].zzmoyr ==
					_that.Modelyear) {
					_that._oDataModel.getData().suffixData.push({
						"Model": backupModelData[i].zzmodel,
						"Modelyear": backupModelData[i].zzmoyr,
						"Suffix": backupModelData[i].zzsuffix,
						"int_c": backupModelData[i].zzintcol,
						"SuffixDescriptionEN": backupModelData[i].suffix_desc_en,
						"SuffixDescriptionFR": backupModelData[i].suffix_desc_fr,
						"mrktg_int_desc_en": backupModelData[i].int_trim_desc_en,
						"mrktg_int_desc_fr": backupModelData[i].int_trim_desc_fr,
						"localLang": _that.sCurrentLocale
					});
					_that._oDataModel.updateBindings(true);

				}
				b = 0;
			}
			sap.ui.core.BusyIndicator.hide();
			if (_that._oDataModel.getData().suffixData[0].zzsuffix !== "Please Select") {
				_that._oDataModel.getData().suffixData.unshift({
					"Model": "",
					"Modelyear": "",
					"Suffix": _that._oResourceBundle.getText("PleaseSelect"),
					"int_c": "",
					"SuffixDescriptionEN": "",
					"SuffixDescriptionFR": "",
					"mrktg_int_desc_en": "",
					"mrktg_int_desc_fr": "",
					"localLang": ""
				});
			}
			_that._oDataModel.updateBindings(true);
		},

		onSuffixChange: function (oSuffixVal) {
			var _that = this;
			_that.Suffix = oSuffixVal.getParameters("selectedItem").selectedItem.getKey();
			RouteObj.Suffix = _that.Suffix;
			// sap.ui.core.BusyIndicator.show();
			_that._oDataModel.getData().colorData = [];
			backupModelData.filter(function (item) {
				// console.log(item);
				if (item.zzmodel == _that.Model && item.zzmoyr == RouteObj.Year && item.zzsuffix == _that.Suffix && item.zzseries == RouteObj.Series) {
					var obj = {
						"ExteriorColorCode": item.zzextcol,
						"MarketingDescriptionEXTColorEN": item.mktg_desc_en,
						"MarketingDescriptionEXTColorFR": item.mktg_desc_fr,
						"localLang": _that.sCurrentLocale,
						"InteriorColorCode": item.zzintcol
					};
					// console.log("oData.d.results", obj);
					_that._oDataModel.getData().colorData.push(obj);
				}
			});
			_that._oDataModel.getData().colorData.unshift({
				"ExteriorColorCode": _that._oResourceBundle.getText("PleaseSelect"),
				"MarketingDescriptionEXTColorEN": "",
				"MarketingDescriptionEXTColorFR": "",
				"localLang": "",
				"InteriorColorCode": ""
			});
			_that._oDataModel.updateBindings(true);
		},

		onColorSelectionDoneEnableAddButton: function (oEvent) {
			RouteObj.ExtCol = oEvent.getParameters("selectedItem").selectedItem.getKey();
			var ColorData = oEvent.getParameters().selectedItem.getBindingContext("ModelDataModel").getObject();
			RouteObj.ExtCol = ColorData.ExteriorColorCode;
			RouteObj.IntCol = ColorData.InteriorColorCode;

			var oModelDetailViewData = this.getView().getModel('detailView').getData();
			var oRouteConfig = new sap.ui.model.json.JSONModel();
			sap.ui.getCore().setModel(oRouteConfig, "RouteConfig");
			this.seriesObj.zzmoyr = RouteObj.Year;
			this.seriesObj.zzseries = RouteObj.Series;
			this.seriesObj.zzseries_desc_en = RouteObj.SeriesDesc;
			this.seriesObj.zzsuffix = RouteObj.Suffix;
			this.seriesObj.zzmodel = RouteObj.Model;
			this.seriesObj.Language = this.sCurrentLocale;
			this.seriesObj.zzextcol = RouteObj.ExtCol;
			this.seriesObj.zzintcol = RouteObj.IntCol;

			this.seriesObj.etaFromNewSeries = etaFromNewSeries;
			this.seriesObj.etaToNewSeries = etaToNewSeries;

			this.seriesObj.parsedtodayDate = oModelDetailViewData.parsedtodayDate;
			this.seriesObj.windowEndDateP = oModelDetailViewData.windowEndDateP;

			// this.seriesObj.sSelectedDealer = this.sSelectedDealer;
			if (!this.sSelectedDealerText) {
				this.seriesObj.Business_Partner_name = "";
			}
			this.seriesObj.Business_Partner_name = this.sSelectedDealerText;
			// this.seriesObj.processDate = sap.ui.getCore().getModel("suggestedDataModel").getData()[0].zzprocess_dt;

			if (sap.ui.getCore().getModel("suggestedDataModel").getData().length > 0) {
				this.seriesObj.processDate = sap.ui.getCore().getModel("suggestedDataModel").getData()[0].zzprocess_dt;
			} else {
				this.seriesObj.processDate = this.getView().getModel("requestedDataModel").getData()[0].zzprocess_dt;
			}

			this.seriesObj.Dealer = this.sSelectedDealer;
			if (!tabClicked) {
				this.seriesObj.tabClicked = "suggestedTab";
			} else
				this.seriesObj.tabClicked = tabClicked;
			this.seriesObj.sLoggedinUserType = this.sLoggedinUserType;
			oRouteConfig.setData(this.seriesObj);
			oRouteConfig.updateBindings(true);
			// debugger;
			sap.ui.core.Fragment.byId("seriesDialog", "clickNewSeriesDialog").setVisible(true);
			// check for all mandatory fields and allow submit. 

		},

		//CR2.0 Add new series
		onClickRequestNewSeries: function () {
			var checkSeriesData = this.getView().getModel("SeriesDataModel").getData().results.length;
			if (checkSeriesData > 0) {
				if (!this._seriesRequestDialog) {
					this._seriesRequestDialog = sap.ui.xmlfragment("seriesDialog", "suggestOrder.fragment.NewCarSeriesDialog", this);

					this.getView().addDependent(this._seriesRequestDialog);
				}
				this._seriesRequestDialog.open();
				sap.ui.core.Fragment.byId("seriesDialog", "clickNewSeriesDialog").setVisible(false);

			} else {
				var messageForNoSeriesData = this.getView().getModel("i18n").getResourceBundle().getText("noSeriesDataReceived");
				MessageToast.show(messageForNoSeriesData);
			}
		},

		onSeriesSelectionChange: function (oEvt) {
			var Data = oEvt.getParameters().selectedItem.getBindingContext("SeriesDataModel").getObject();
			RouteObj.Year = Data.moyr;
			RouteObj.Series = Data.series;
			RouteObj.SeriesDesc = Data.series_desc_en;
			this.getAllModels(Data.moyr, Data.series);
			this.seriesObj = {};

			this.oModelStockData = this.getView().getModel("suggestedDataModel").getData();
			this.oModelStockData2 = this.getView().getModel("requestedDataModel").getData();

			// var alreadyExists = this.oModelStockData.filter(function (k) {
			// 	if (k.modelYear === Data.zzmoyr && k.zzseries === Data.zzseries){
			// 		return k;
			// 	}
			// });
			// var alreadyExists2 = this.oModelStockData2.filter(function (k) {
			// 	if (k.modelYear === Data.zzmoyr && k.zzseries === Data.zzseries){
			// 		return k;
			// 	}
			// });

			// if ((alreadyExists.length > 0)||(alreadyExists2.length > 0)) {
			// 	MessageBox.error(Data.zzseries + " & " + Data.zzmoyr + " " + this._oResourceBundle.getText("AlreadyExists"));
			// 	this.onClickCloseNewSeriesDialog();
			// } else {

			// if (this.seriesObj.newAddedSeries != "") {
			// 	sap.ui.core.Fragment.byId("seriesDialog", "clickNewSeriesDialog").setVisible(true);
			// }
			// }
		},

		//CR2.0 Add new series
		onClickAddNewSeriesDialog: function (oEvt) {
			this.onClickCloseNewSeriesDialog();
			this.oRouter.navTo("StockAllocation", {});
		},

		//CR2.0 Add new series
		onClickCloseNewSeriesDialog: function (oEvent) {
			sap.ui.core.Fragment.byId("seriesDialog", "ID_SeriesDesc").setSelectedKey("");
			sap.ui.core.Fragment.byId("seriesDialog", "ID_modelDesc").setSelectedKey("");
			sap.ui.core.Fragment.byId("seriesDialog", "ID_modelDesc").setSelectedKey();
			// sap.ui.core.Fragment.byId("seriesDialog", "ID_modelDesc").setText();
			sap.ui.core.Fragment.byId("seriesDialog", "ID_marktgIntDesc").setSelectedKey();
			// sap.ui.core.Fragment.byId("seriesDialog", "ID_marktgIntDesc").setText();
			sap.ui.core.Fragment.byId("seriesDialog", "ID_ExteriorColorCode").setSelectedKey();
			// sap.ui.core.Fragment.byId("seriesDialog", "ID_ExteriorColorCode").setText();
			this._seriesRequestDialog.close();
		},

		//CR2.0 Add new series
		getAllSeries: function () {
			var that = this;
			var oSeriesModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oSeriesModel, "SeriesDataModel");
			var oSuggestUpdateModel = this.getOwnerComponent().getModel("ZSD_SUGGEST_ORDER_UPDATE_SRV");
			///ZC_ALLOCAT_CFG(p_orderable='Y',p_div='"+this.sapDivision+"')/Set", 
			///node/ZSD_SUGGEST_ORDER_UPDATE_SRV/ZC_ALLOCAT_CFG(p_orderable='Y')/Set
			oSuggestUpdateModel.read("/ZC_ALLOCAT_CFG(p_orderable='Y',p_div='" + this.sapDivision + "')/Set", {
				success: $.proxy(function (data, response) {
					console.log("seriesData", data);
					data.results.unshift({
						"p_orderable": "",
						"moyr": "",
						"zzorder_ind": "",
						"series": "",
						"series_desc_en": ""
					});
					that.getView().getModel("SeriesDataModel").setData(data);
				}),
				error: function (err) {
					console.log("err", err);
				}
			});

		},
		//  All my custom Modules - Begin///////////////////////////////////////////////////////////////////////////////////////

		onClickShowAllSeries: function (oEvent) {

			var showSuggestSeriesText = this._oResourceBundle.getText("SHOW_SUGGEST_SERIES"),
				showAllSeriesText = this._oResourceBundle.getText("SHOW_ALL_SERIES");

			var currentText = showAllSeriesText; //this.getView().byId("showAllSeriesBtn").getText();
			if (currentText == showSuggestSeriesText) {
				// this.getView().byId("showAllSeriesBtn").setProperty("text", showAllSeriesText);
				this._showSuggestedQuantity();
			} else {
				// this.getView().byId("showAllSeriesBtn").setProperty("text", showSuggestSeriesText);
				this._showAllSeries();
			}

		},

		_showSuggestedQuantity: function () {
			var oViewModel = this.getView().getModel("detailView");
			oViewModel.setProperty("/visibleSeriesBtn", false);
			var oModelData2 = this.getView().getModel("suggestedDataModel").getData();

			for (var i = 0; i < oModelData2.length; i++) {
				if (oModelData2[i].suggestedVolume <= 0) {
					oModelData2[i].visibleProperty = false;
				}
			}

			var oSuggestModel = new sap.ui.model.json.JSONModel();
			oSuggestModel.setData(oModelData2);
			this.getView().setModel(oSuggestModel, "suggestedDataModel");
			sap.ui.getCore().setModel(oSuggestModel, "suggestedDataModel");

		},

		_showAllSeries: function () {
			var oViewModel = this.getView().getModel("detailView");
			oViewModel.setProperty("/visibleSeriesBtn", true);
			//visibleSeriesBtn
			var oModelData = this.getView().getModel("suggestedDataModel").getData();

			for (var i = 0; i < oModelData.length; i++) {

				if (oModelData[i].suggestedVolume <= 0) {
					oModelData[i].visibleProperty = true;
				}

			}

			var oSuggestModel = new sap.ui.model.json.JSONModel();
			oSuggestModel.setData(oModelData);
			this.getView().setModel(oSuggestModel, "suggestedDataModel");
			sap.ui.getCore().setModel(oSuggestModel, "suggestedDataModel");
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
			this.reqcomplete();
		},

		// All my custom modules - End	-//////////////////////////////////////////////////////////////////////////////////////////////	

		_onTableItemPress: function (oEvent) {
			if (sap.ui.getCore().getModel("RouteConfig")) {
				sap.ui.getCore().getModel("RouteConfig").setData();
			}
			var oBindingContextPath = oEvent.getParameter("listItem").getBindingContextPath();

			// get the details on which icontab is selected. 

			var selectedKey = this.getView().byId('iconTab').getSelectedKey();
			var checkForSuggestedString = selectedKey.search("iconTabFilterSuggested");
			var checkForRequested = selectedKey.search("iconTabFilterRequested");
			var checkForAllocated = selectedKey.search("iconTabFilterAllocated");
			var whichTabClicked;

			if (checkForSuggestedString > 0) {
				whichTabClicked = "suggestedTab";
				tabClicked = "suggestedTab";
				var oBindingContext = oEvent.getParameter("listItem").getBindingContext('suggestedDataModel');
			}
			if (checkForRequested > 0) {
				whichTabClicked = "requestedTab";
				tabClicked = "requestedTab";
				var oBindingContext = oEvent.getParameter("listItem").getBindingContext('requestedDataModel');
			}
			if (checkForAllocated > 0) {
				whichTabClicked = "allocatedTab";
				tabClicked = "allocatedTab";
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

			if (this.sLoggedinUserType == "Dealer_User") {
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
			selectedData.zzmoyr = selectedData.series.slice(0, 4);
			selectedData.UserId = this.UserId;

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
			if (sap.ui.getCore().getModel("RouteConfig")) {
				sap.ui.getCore().getModel("RouteConfig").setData();
			}
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

			if (sap.ui.getCore().getModel("RouteConfig")) {
				sap.ui.getCore().getModel("RouteConfig").setData();
			}
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

		},
		onInit: function () {

			// initialize  local models and data calls
			this.userDiv = window.location.search.match(/Division=([^&]*)/i)[1];
			if (this.userDiv == "10") {
				this._oViewModel = new sap.ui.model.json.JSONModel({
					busy: false,
					delay: 0,
					visibleForDealer: true,
					visibleForInternalUser: true,
					editAllowed: true,
					enabled: true,
					visibleSeriesBtn: false,
					userLanguage: window.location.search.match(/language=([^&]*)/i)[1].toLocaleUpperCase(),
					sopurlEN: "https://infostream.toyota.ca/tci/myportal/dealers/toyota/sales/Resources/reference%20guide/!ut/p/z1/lZLLUsIwFIZfxQ3Lzjm9WpbYGa0XrEALbTZMGtISLQmUAPL2Rl3hyC2rZOY7Z_5LgEAORNKtqKkWStLGvAsSTBPsRnEcYpKkmY2D5Lk_it58-27swuQQwChEHISP7sN96juY2EAumccjp4fn5sdAgCyZmEERBgHDynYsWjHH8rzSsbrM8y2f2l1e8sAuS_ebZlIv9RwKzcSUyw5qtVeadnBNG77uYMvXatOy32vFWy4Zv6k3YsbPmH29wCw5RP6J6wc4lcfJDUZDYUTeHlMxxAAmW8F3kEnVLkzDoysDjBGezvk0v8Zp-1G_NpupnltCVgryv2kaSryvVqRnKlFS808N-fWdLBdZtgjdvfUxDHdpNW-2L70vNPlLqw!!/?1dmy&urile=wcm%3apath%3a%2Ftci_en%2Ftoyota%2Fsales%2Fresources%2Freference%2Bguide%2Fstock%2Ballocation%2Buser%2Bguide",
					sopurlFR: "https://infostream.toyota.ca/tci/myportal/dealers/toyota/sales/Resources/reference%20guide/!ut/p/z1/lZJJU8IwFMe_ihw4dt7rajnWzmhdsLIUaC5MGhKIQgIlgHx7o55wZMspmfm9N_8lQGAERNGtnFIjtaJz-y5JNM6xlWZZjHneL1zs5M_tXvoWuncDH4aHAKYxYid-9B_u-6GHuQvkknk8chI8Nz8AAmTJ5ATKOIoYCtdzqGCeEwSV57RYEDohdVu84pFbVf43zZRZmhmUhskxV000eq8NbeKazvm6iTVf603Nfq-C11wxfjPdyAk_Y_b1ArPkEPknrh_gVB4nN1gNpRV5e0xFFyMYbiXfQaF0vbAN964MMEN4OufT_hqvbqftqd1MzcyRSmgY_U3TUvJ9tSKJrUQrwz8NjK7vpCdqWC6KYhH7e-ejG-_6YjbfvogkaTS-ACwF72Q!/?1dmy&urile=wcm%3apath%3a%2Ftci_fr%2Ftoyota%2Fsales%2Fresources%2Freference%2Bguide%2Fstock%2Ballocation%2Buser%2Bguide",
				});
			} else if (this.userDiv == "20") {
				this._oViewModel = new sap.ui.model.json.JSONModel({
					busy: false,
					delay: 0,
					visibleForDealer: true,
					visibleForInternalUser: true,
					editAllowed: true,
					enabled: true,
					visibleSeriesBtn: false,
					userLanguage: window.location.search.match(/language=([^&]*)/i)[1].toLocaleUpperCase(),
					userDiv: window.location.search.match(/Division=([^&]*)/i)[1],
					sopurlEN: "https://infostream.toyota.ca/tci/myportal/dealers/lexus/sales/Resources/!ut/p/z1/rZLLbsIwEEV_hS5YRuM8McsIqQpFVcojhXiDjGODSx7gOED_vm6QKlEVaKV6Y1s-o7lzr4HAAkhJD3JNtaxKmpt7SoJljPqDKMIojmeJjcbx6Hk6ePH7YejBvAXQlRUiIL-p_wLwYxSgMR6Okr43cVBi36t_BQJkx2QGKV6hTLBeZgkUCMvzfduiPkWW41CGA3vlYsf-pFmpd3oDqWZyKVQX5fzU1F1U05ybTfG6ahQ7HwVXvGS8s25kxg2iK7bt0DyvWGtQp6m5Oj9-H-RCqT0ZuveNIJfID1a0wC2vbzRpNaRGZO-6ChfmB8mPkJSVKkz60z-aGyF4ujen-VHybb8noQmiKjU_aVj8bxJToWBXJEmB3XdrO8HHmdjkh_XDB50LwtI!/dz/d5/L0lHSkovd0RNQUxrQUVnQSEhLzROVkUvZW4!/",
					sopurlFR: "https://infostream.toyota.ca/tci/myportal/dealers/lexus/sales/Resources/!ut/p/z1/lZJPb4JAEMW_SnvwSGYQhOVITBqsaagoVfZiVlxwW1iQP2q_fVeaNLGpUveyO8lvMu-9HaCwAirZQaSsEYVkmaojaq19dMaeR9D3F6GOM3_6Mh-_jhzXNWHZAXjluAj0P_0_AHnyLJyRyTR0zGCIod7X_wYUaBmLLUTDLSOEmbo2QoaaaWCskcThmjVMDJvhxuYbdqZj2ZTNDqImFmsuB5jxU1sPsGYZV1fF66Kt4u9nwisuY_6QtmLLf2u9EKMHE6PfK71E_nDbAbfivDGk0xApkfZ1FQYsD4IfIZRFlasPnt-Zn4fw3OdTLY143--pq7IuZMNPDazuDnueVFDmYZgT41P7CMhxkeyyQ_r4BfnwTbw!/?1dmy&urile=wcm%3apath%3a%2Ftci_fr%2Flexus%2Fsales%2Fresources%2Freference%2Bguide%2Fstock%2Ballocation%2Buser%2Bguide"
				});
			}

			this.getView().setModel(this._oViewModel, "detailView");

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

				this.currentScopeUrl = "/userDetails/currentScopesForUser";

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

					//////////////////////////////////////////////////////////////////////////////////////////////////////
					// Local Testing Hardcodings
					var sLocation = window.location.host;
					var sLocation_conf = sLocation.search("webide");
					if (sLocation_conf == 0) {
						// if a local user from weide 
						// userType = "TCI_User";
						userType = "Dealer_User";
					} else {
						var userType = oData.loggedUserType[0];
						//////////////////////////////////////////////////////////////////						
					}

					switch (userType) {
					case "Dealer_User":

						that.sLoggedinUserType = "Dealer_User";
						oModelDetailview.setProperty("/editOrderPrefix", true);
						oModelDetailview.setProperty("/loggedInUserType", "Dealer_User");
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

			this.getAllSeries();
			this._oDataModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(this._oDataModel, "ModelDataModel");

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

					that.UserId = oData.userProfile.id;

					$.each(oData.attributes, function (i, item) {
						var BpLength = item.BusinessPartner.length;

						if (i == 0) {
							// if local testing lets just use 42130duser							
							//////////////////////////////////////////////////////////////////////////////////////////////////////
							// Local Testing Hardcodings
							var sLocation = window.location.host;
							var sLocation_conf = sLocation.search("webide");
							if (sLocation_conf == 0) {
								// if a local user from weide 
								// -- Guna // TODO: While testing locally for Dealer	 
								oModelDetailView.setProperty("/BusinessPartnerKey", "2400042130");
								oModelDetailView.setProperty("/Dealer_No", "2400042130");
								var tempDealerText = "2400042130" + " - " + "For local testing only";
								// oModelDetailView.setProperty("/Dealer_Name", item.BusinessPartnerName);

								oModelDetailView.setProperty("/Dealer_Name", tempDealerText);

							} else {

								//////////////////////////////////////////////////////////////////						

								oModelDetailView.setProperty("/BusinessPartnerKey", item.BusinessPartnerKey);
								oModelDetailView.setProperty("/Dealer_No", item.BusinessPartner);
								var tempDealerText = item.BusinessPartner + " - " + item.BusinessPartnerName;
								// oModelDetailView.setProperty("/Dealer_Name", item.BusinessPartnerName);

								oModelDetailView.setProperty("/Dealer_Name", tempDealerText);
							}
						}
						// for toyota login show only toyota dealers, for lexus show only lexus. 

						if (item.Division == that.sDivision || item.Division == "Dual") {
							BpDealer.push({

								"BusinessPartnerKey": item.BusinessPartnerKey,
								"BusinessPartner": item.BusinessPartner, //.substring(5, BpLength),
								"BusinessPartnerName": item.BusinessPartnerName, //item.OrganizationBPName1 //item.BusinessPartnerFullName
								"Division": item.Division,
								"BusinessPartnerType": item.BusinessPartnerType,
								"searchTermReceivedDealerName": item.SearchTerm2
							});
						}
					});

					if (BpDealer.length == 0) {
						sap.m.MessageBox.error(
							"The Dealer data not received,  check the URL Division, Logged in ID, clear the Browser Cache, Pick the Right ID and Retry"
						);
					}

					that.getView().setModel(new sap.ui.model.json.JSONModel(BpDealer), "BpDealerModel");

					var dealerCode = "";
					if (oData.samlAttributes.DealerCode) {
						dealerCode = oData.samlAttributes.DealerCode["0"];
					}
					userAttributes.push({
						"UserType": oData.samlAttributes.UserType["0"],
						"DealerCode": dealerCode,
						"Language": oData.samlAttributes.Language["0"]
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
			this._navigateToHandleRouteMatched();
		},

		reqcomplete: async function () {

			if (!this.sSelectedDealer) {
				var oModelDetailview = this.getView().getModel("detailView");
				var oDataFromModel = oModelDetailview.getData();
				this.sSelectedDealer = oDataFromModel.BusinessPartnerKey;
			}
			
			await this._getWindowDate();
			console.log(oModelDetailview);
			var oGetModel = this.getView().getModel("ZCDS_SUGGEST_ORD_SUM_CDS");
			
			
			if (oModelDetailview.parsedtodayDate < oModelDetailview.windowStartDateP) {
				// 	// reset all the models to initial State and return, 
				var oViewSuggestData = [];
				var oSuggestModel = new sap.ui.model.json.JSONModel();
				oSuggestModel.setData(oViewSuggestData);
				this.getView().setModel(oSuggestModel, "suggestedDataModel");
				sap.ui.getCore().setModel(oSuggestModel, "suggestedDataModel");

				var oViewRequestedData = [];
				var oRequestModel = new sap.ui.model.json.JSONModel();
				oRequestModel.setData(oViewRequestedData);
				this.getView().setModel(oRequestModel, "requestedDataModel");

				var oViewAllocatedData = [];
				var oAllocatedModel = new sap.ui.model.json.JSONModel();
				oAllocatedModel.setData(oViewAllocatedData);
				this.getView().setModel(oAllocatedModel, "allocatedDataModel");

				var oViewCountData = [];
				var oCountModel = new sap.ui.model.json.JSONModel();
				oCountModel.setData(oViewCountData);
				this.getView().setModel(oCountModel, "countViewModel");

				oModel.setProperty("/showAllocatedTab", false);
				oModel.setProperty("/showSuggestionTab", false);
				oModel.setProperty("/showRequestedTab", false);

				return;

			}else{
			oGetModel.read("/ZCDS_SUGGEST_ORD_SUM", {

				urlParameters: {
					// lets also filter the Division 18th June
					// "$filter": "zzdealer_code eq '" + this.sSelectedDealer + "' "
					"$filter": "zzdealer_code eq '" + this.sSelectedDealer + "'and zdivision eq '" + this.sapDivision + "'"
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
					var seriesDescription;
					var that = this;
					// var oViewModel = new JSONModel({          //changes by Swetha
					// 	delay: 0.00000001
					// });										
					that.data = oData.results;
					var oSuggArr = oData.results;
					var filteredSugArr;

					//                var timeForBanner  ;

					if (oSuggArr.length > 0) {
						var filteredSugArr = oSuggArr.filter(s => s.total_request_qty != "0" || s.total_suggest_qty != "0");
						var stotalArr = [];

						stotalArr = filteredSugArr.reduce((accumulator, cur) => {
							cur.total_request_qty = parseInt(cur.total_request_qty);
							cur.total_allocated_qty = parseInt(cur.total_allocated_qty);
							cur.total_suggest_qty = parseInt(cur.total_suggest_qty);
							let sname = cur.zzseries;

							let found = accumulator.find(elem => elem.zzseries === sname)

							if (found) {
								found.total_suggest_qty += cur.total_suggest_qty;
								found.total_request_qty += cur.total_request_qty;
								found.total_allocated_qty += cur.total_allocated_qty;

							} else {
								accumulator.push(cur)
							};
							return accumulator;
						}, []);
						$.each(stotalArr, function (i, item) {
							if (item !== undefined) {
								// if (item.total_request_qty == "0" && item.total_suggest_qty == "0") {
								// 	that.data.splice(i, 1);
								// } else {
								// if ((item.zzdlr_ref_no == "") || (item.zzdlr_ref_no == undefined)) {
								order_Number = "XXXXXX";
								// }

								if (that.sCurrentLocale == 'FR') {
									seriesDescription = item.zzseries_desc_fr;
								} else {
									seriesDescription = item.zzseries_desc_en;
								}

								// Suggested Data
								oViewSuggestData.push({
									seriesDescription: seriesDescription,
									// series: item.zzmoyr + "-" + item.zzseries_desc_en,
									series: item.zzmoyr + "-" + seriesDescription, //item.zzseries_desc_en,
									orderPrefix: item.zzprefix,
									orderNumber: order_Number, //zzsug_seq_no,
									suggestedVolume: item.total_suggest_qty, //zzsuggest_qty,
									dealerCode: item.zzdealer_code,
									visibleProperty: true,
									zzseries: item.zzseries,
									zzallocation_ind: item.zzallocation_ind,
									zzdel_review: item.zzdel_review,
									zzprocess_dt: item.zzprocess_dt,
									zzzadddata4: Number(item.zzzadddata4), // this field needed to apply the sort logic.
									modelYear: item.zzmoyr

								});

								if (+item.total_request_qty && +item.total_suggest_qty) {
									var suggestedVolPercentRequested = ((+item.total_request_qty / +item.total_suggest_qty) * 100);
									suggestedVolPercentRequested = parseFloat(suggestedVolPercentRequested).toFixed(0);
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
									// var suggestedMixRequested = ((item.total_request_rec / item.total_suggest_rec) * 100);
									var suggestedMixRequested = ((item.total_suggest_rec / item.total_request_rec) * 100);
									suggestedMixRequested = parseFloat(suggestedMixRequested).toFixed(0);
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
									percentRequestVolAllocated = parseFloat(percentRequestVolAllocated).toFixed(0);
									percentRequestVolAllocated = percentRequestVolAllocated + "%";
								} else if (+item.total_allocated_qty <= 0 && +item.total_request_qty > 0) {
									percentRequestVolAllocated = 0;
								} else if (+item.total_allocated_qty > 0 && +item.total_request_qty <= 0) {
									percentRequestVolAllocated = "N/A";
								} else if (+item.total_allocated_qty == 0 && +item.total_request_qty == 0) {
									percentRequestVolAllocated = 0;
								}

								oViewRequestedData.push({
									seriesDescription: seriesDescription,
									// series: item.zzmoyr + "-" + item.zzseries_desc_en,
									series: item.zzmoyr + "-" + seriesDescription,
									orderPrefix: item.zzprefix, //order_Number,
									zzseries: item.zzseries,
									orderNumber: order_Number, // item.zzdlr_ref_no, //zzsug_seq_no,
									suggestedVolume: item.total_suggest_qty, //zzsuggest_qty,
									requestedVolume: item.total_request_qty,
									suggestedVolPercentRequested: suggestedVolPercentRequested, //item.tot_suggest_perc,
									suggestedMixRequested: suggestedMixRequested, //item.tot_suggest_mix_requested,
									dealerCode: item.zzdealer_code,
									dealerReviewCount: item.dealer_review_count,
									zzdel_review: item.zzdel_review,
									zzzadddata4: Number(item.zzzadddata4), // this field needed to apply the sort logic.
									modelYear: item.zzmoyr,
									zzprocess_dt: item.zzprocess_dt

								});

								//Allocated Data
								orderNumber = item.zzprefix + " - " + order_Number;

								oViewAllocatedData.push({
									seriesDescription: seriesDescription,
									// series: item.zzmoyr + "-" + item.zzseries_desc_en,
									series: item.zzmoyr + "-" + seriesDescription,
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
									zzdel_review: item.zzdel_review,
									zzzadddata4: Number(item.zzzadddata4), // this field needed to apply the sort logic.Number('123')
									modelYear: item.zzmoyr,
									zzprocess_dt: item.zzprocess_dt
								});

								// console.log("oViewAllocatedData", oViewAllocatedData);
								//}
							}
						});

					}

					// var fullySorted =  _.chain(list).sortBy('age').sortBy('name').value(); syntax
					var oViewSuggestData = _.sortBy((_.sortBy(oViewSuggestData, 'zzzadddata4')), 'modelYear');
					var oViewRequestedData = _.sortBy((_.sortBy(oViewRequestedData, 'zzzadddata4')), 'modelYear');
					var oViewAllocatedData = _.sortBy((_.sortBy(oViewAllocatedData, 'zzzadddata4')), 'modelYear');

					// suggested Data here. 			
					var oSuggestModel = new sap.ui.model.json.JSONModel();
					oSuggestModel.setData(oViewSuggestData);
					this.getView().setModel(oSuggestModel, "suggestedDataModel");
					sap.ui.getCore().setModel(oSuggestModel, "suggestedDataModel");

					var oSuggestedModelData = this.getView().getModel("suggestedDataModel").getData();
					// by default lets show only suggested data. 

					var showSuggestSeriesText = this._oResourceBundle.getText("SHOW_SUGGEST_SERIES"),
						showAllSeriesText = this._oResourceBundle.getText("SHOW_ALL_SERIES");

					var currentText = showAllSeriesText; //this.getView().byId("showAllSeriesBtn").getText();
					var atleastOneRecordwithZeroExist = false;
					if (currentText == showAllSeriesText) {

						for (var i = 0; i < oSuggestedModelData.length; i++) {

							//	visibleProperty

							if (oSuggestedModelData[i].suggestedVolume <= 0) {
								oSuggestedModelData[i].visibleProperty = false;
								atleastOneRecordwithZeroExist = true;
							}

						}
					} else {

						for (var i = 0; i < oSuggestedModelData.length; i++) {

							//	visibleProperty

							if (oSuggestedModelData[i].suggestedVolume <= 0) {
								oSuggestedModelData[i].visibleProperty = true;
								atleastOneRecordwithZeroExist = true;
							}

						}
					}

					if (atleastOneRecordwithZeroExist == true) {
						//disable the button
						this._oViewModel.setProperty("/noZeroRecordFound", true);

					} else {
						//enable the button
						this._oViewModel.setProperty("/noZeroRecordFound", false);
					}

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

					var oModelCalled = this.getView().getModel('suggestedDataModel');
					oModelCalled.attachRequestCompleted(this._callTheCountService());

				}.bind(this),
				error: function (response) {
					sap.ui.core.BusyIndicator.hide();
				}

			});
			}

		}, // end of req complete

		//  make a call to count model.   this.sSelectedDealer
		_callTheCountService: function (oEvent) {
			var oGetModelCount = this.getView().getModel("ZCDS_SUGGEST_ORD_COUNT_CDS");

			oGetModelCount.read("/ZCDS_SUGGEST_ORD_COUNT", {
				urlParameters: {
					"$filter": "zzdealer_code eq '" + this.sSelectedDealer + "'and zdivision eq '" + this.sapDivision + "'"
				},

				success: function (oData) {

					etaFromNewSeries = oData.results[0].zzstart_date;
					etaToNewSeries = oData.results[0].zzend_date;

					var oViewCountData = [];
					var oModel = this.getView().getModel("detailView");
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
						// var newTempDate = windowStartYear + "/" + windowStartMonth + "/" + windowStartDay + " " + windowhour + ":" + windowMinute;

						var newTempDate = windowStartMonth + "/" + windowStartDay + "/" + windowStartYear + " " + windowhour + ":" + windowMinute;

						var dateForBanner = windowStartMonth + "/" + windowStartDay + "/" + windowStartYear;
						var timeForBanner = windowhour + ":" + windowMinute;

						var windowEndDate = item.zzstart_date.substr(0, 8); // using start as end and end as start not by mistake //item.zzstart_date.substr(0,8);
						var windowEndYear = windowEndDate.substr(0, 4);
						var windowEndMonth = windowEndDate.substr(4, 2);
						var windowEndDay = windowEndDate.substr(6, 2);

						var windowStarthour = item.zzstart_date.substr(8, 2);
						var windowStartMinute = item.zzstart_date.substr(10, 2);

						var windowEndDateFormatted = windowEndMonth + "/" + windowEndDay + "/" + windowEndYear + " " + windowStarthour + ":" +
							windowStartMinute;
						oModel.setProperty("/dateForBanner", dateForBanner);
						oModel.setProperty("/timeForBanner", timeForBanner);
						oModel.setProperty("/startDateofWindow", windowEndDateFormatted);
						oModel.setProperty("/endDateofTheWindow", dateForBanner);
						oModel.setProperty("/dateForValidation", newTempDate);
						oModel.setProperty("/statusFromCalender", item.zzstatus);
					});

					// count View model			
					var oCountModel = new sap.ui.model.json.JSONModel();
					oCountModel.setData(oViewCountData);
					this.getView().setModel(oCountModel, "countViewModel");

					// date to the ui. 
					var oModel = this.getView().getModel("detailView");

					var sDateForBanner = oModel.getProperty("/dateForBanner");
					var sDateForTime = oModel.getProperty("/timeForBanner");

					// Due on in french. 
					if (this.sCurrentLocale == "FR") {
						// var WordDueOn = 'Due sur ';
						var tempDueDate = "Dû le" + sDateForBanner + ' à  ' + sDateForTime + "(HNE)";
						oModel.setProperty("/dueDate", tempDueDate); // the due date for the screen. 	

					} else {
						// var WordDueOn = 'Due on ';

						var tempDueDate = 'Due on ' + sDateForBanner + " at " + sDateForTime + "(EST)";
						oModel.setProperty("/dueDate", tempDueDate); // the due date for the screen. 

					}

					//  when the current date is between window open date and window close date then enable the suggested and Requested and disable the allocated. 
					var startDateofTheWindow = oModel.getProperty("/startDateofWindow");
					var endDateofTheWindow = oModel.getProperty("/endDateofTheWindow");

					var windowStartDateP = Date.parse(startDateofTheWindow);

					var windowEndDateWithTime = oModel.getProperty("/dateForValidation");
					var windowEndDateP = Date.parse(windowEndDateWithTime);

					var torontoTime = new Date();
					/*global  moment:true*/
					var extractTimeZone = moment(torontoTime);
					//var currentDate = extractTimeZone.tz('America/New_York').format('YYYY/MM/DD hh:mm');
					var currentDate = extractTimeZone.tz('America/New_York').format('MM/DD/YYYY HH:mm'); //24 hour format

					var parsedtodayDate = Date.parse(currentDate);

					if (parsedtodayDate < windowEndDateP) { //&& parsedtodayDate >= windowStartDateP
						// in this period we have to show suggestion and Requested.  Turn off the Allocated. 
						oModel.setProperty("/showAllocatedTab", false);
					}
					oModel.setProperty("/parsedtodayDate", parsedtodayDate);
					oModel.setProperty("/windowEndDateP", windowEndDateP);
					oModel.setProperty("/windowStartDateP", windowStartDateP);

					if ((parsedtodayDate >= windowEndDateP)) {
						oModel.setProperty("/editOrderPrefix", false);
						oModel.setProperty("/outOfWindowDate", true);

					}
					//  new change -  within the window date,  lets show only records where the dealer has reviewed. 						

					this._updateTheCount();

				}.bind(this),
				error: function (response) {
					sap.ui.core.BusyIndicator.hide();
				}
			});

		},

		_getWindowDate: function (oEvent) {
			return new Promise((resolve, reject) => {
				var oGetModelCount = this.getView().getModel("ZCDS_SUGGEST_ORD_COUNT_CDS");

				oGetModelCount.read("/ZCDS_SUGGEST_ORD_COUNT", {
					urlParameters: {
						"$filter": "zzdealer_code eq '" + this.sSelectedDealer + "'and zdivision eq '" + this.sapDivision + "'"
					},

					success: function (oData) {

						etaFromNewSeries = oData.results[0].zzstart_date;
						etaToNewSeries = oData.results[0].zzend_date;

						var oViewCountData = [];
						var oModel = this.getView().getModel("detailView");
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
							// var newTempDate = windowStartYear + "/" + windowStartMonth + "/" + windowStartDay + " " + windowhour + ":" + windowMinute;

							var newTempDate = windowStartMonth + "/" + windowStartDay + "/" + windowStartYear + " " + windowhour + ":" +
								windowMinute;

							var dateForBanner = windowStartMonth + "/" + windowStartDay + "/" + windowStartYear;
							var timeForBanner = windowhour + ":" + windowMinute;

							var windowEndDate = item.zzstart_date.substr(0, 8); // using start as end and end as start not by mistake //item.zzstart_date.substr(0,8);
							var windowEndYear = windowEndDate.substr(0, 4);
							var windowEndMonth = windowEndDate.substr(4, 2);
							var windowEndDay = windowEndDate.substr(6, 2);

							var windowStarthour = item.zzstart_date.substr(8, 2);
							var windowStartMinute = item.zzstart_date.substr(10, 2);

							var windowEndDateFormatted = windowEndMonth + "/" + windowEndDay + "/" + windowEndYear + " " + windowStarthour + ":" +
								windowStartMinute;
							oModel.setProperty("/dateForBanner", dateForBanner);
							oModel.setProperty("/timeForBanner", timeForBanner);
							oModel.setProperty("/startDateofWindow", windowEndDateFormatted);
							oModel.setProperty("/endDateofTheWindow", dateForBanner);
							oModel.setProperty("/dateForValidation", newTempDate);
							oModel.setProperty("/statusFromCalender", item.zzstatus);
						});

						// count View model			
						var oCountModel = new sap.ui.model.json.JSONModel();
						oCountModel.setData(oViewCountData);
						this.getView().setModel(oCountModel, "countViewModel");

						// date to the ui. 
						var oModel = this.getView().getModel("detailView");

						var sDateForBanner = oModel.getProperty("/dateForBanner");
						var sDateForTime = oModel.getProperty("/timeForBanner");

						// Due on in french. 
						if (this.sCurrentLocale == "FR") {
							// var WordDueOn = 'Due sur ';
							var tempDueDate = "Dû le" + sDateForBanner + ' à  ' + sDateForTime + "(HNE)";
							oModel.setProperty("/dueDate", tempDueDate); // the due date for the screen. 	

						} else {
							// var WordDueOn = 'Due on ';

							var tempDueDate = 'Due on ' + sDateForBanner + " at " + sDateForTime + "(EST)";
							oModel.setProperty("/dueDate", tempDueDate); // the due date for the screen. 

						}

						//  when the current date is between window open date and window close date then enable the suggested and Requested and disable the allocated. 
						var startDateofTheWindow = oModel.getProperty("/startDateofWindow");
						var endDateofTheWindow = oModel.getProperty("/endDateofTheWindow");

						var windowStartDateP = Date.parse(startDateofTheWindow);

						var windowEndDateWithTime = oModel.getProperty("/dateForValidation");
						var windowEndDateP = Date.parse(windowEndDateWithTime);

						var torontoTime = new Date();
						/*global  moment:true*/
						var extractTimeZone = moment(torontoTime);
						//var currentDate = extractTimeZone.tz('America/New_York').format('YYYY/MM/DD hh:mm');
						var currentDate = extractTimeZone.tz('America/New_York').format('MM/DD/YYYY HH:mm'); //24 hour format

						var parsedtodayDate = Date.parse(currentDate);

						if (parsedtodayDate < windowEndDateP) { //&& parsedtodayDate >= windowStartDateP
							// in this period we have to show suggestion and Requested.  Turn off the Allocated. 
							oModel.setProperty("/showAllocatedTab", false);
						}
						oModel.setProperty("/parsedtodayDate", parsedtodayDate);
						oModel.setProperty("/windowEndDateP", windowEndDateP);
						oModel.setProperty("/windowStartDateP", windowStartDateP);

						if ((parsedtodayDate >= windowEndDateP)) {
							oModel.setProperty("/editOrderPrefix", false);
							oModel.setProperty("/outOfWindowDate", true);

						}
						//  new change -  within the window date,  lets show only records where the dealer has reviewed. 						
						resolve(oModel);

					}.bind(this),
					error: function (response) {
						sap.ui.core.BusyIndicator.hide();
					}
				});
			});

		},

		_updateTheCount: function (oEvent) {
			// along with count if the status is A and is out of window end date then do not display the allocated tab. 
			var oModel = this.getView().getModel("detailView");
			var oModelData = oModel.getData();

			if ((oModelData.statusFromCalender == "R" || oModelData.statusFromCalender == "") && oModelData.allocationInidcator == "S" &&
				oModelData.parsedtodayDate > oModelData.windowEndDateP || oModelData.parsedtodayDate < oModelData.windowStartDateP) {
				// 	// reset all the models to initial State and return, 
				var oViewSuggestData = [];
				var oSuggestModel = new sap.ui.model.json.JSONModel();
				oSuggestModel.setData(oViewSuggestData);
				this.getView().setModel(oSuggestModel, "suggestedDataModel");
				sap.ui.getCore().setModel(oSuggestModel, "suggestedDataModel");

				var oViewRequestedData = [];
				var oRequestModel = new sap.ui.model.json.JSONModel();
				oRequestModel.setData(oViewRequestedData);
				this.getView().setModel(oRequestModel, "requestedDataModel");

				var oViewAllocatedData = [];
				var oAllocatedModel = new sap.ui.model.json.JSONModel();
				oAllocatedModel.setData(oViewAllocatedData);
				this.getView().setModel(oAllocatedModel, "allocatedDataModel");

				var oViewCountData = [];
				var oCountModel = new sap.ui.model.json.JSONModel();
				oCountModel.setData(oViewCountData);
				this.getView().setModel(oCountModel, "countViewModel");

				oModel.setProperty("/showAllocatedTab", false);
				oModel.setProperty("/showSuggestionTab", false);
				oModel.setProperty("/showRequestedTab", false);

				return;

			}

			if ((oModelData.parsedtodayDate < oModelData.windowEndDateP) && oModelData.allocationInidcator == "A") {

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
			var suggestedModelData = oSuggestedModel.getData();
			var suggestedModelLength = oSuggestedModel.getData().length;

			if (oSuggestedModel) {

				// loop and count the suggested model where qty is greater than 0. 					

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
				// if (validWindowSuggested == true) {
				// 	var suggestedModelLengthTemp = oSuggestedModel.getData().length;
				// 	if (suggestedModelLengthTemp <= 0) {
				// 		oModel.setProperty("/showSuggestionTab", false);
				// 	}
				// }

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
				// if the window is out of date, remove the records with suggested, requested = 0.		
				var oModelDetail = this.getView().getModel("detailView");
				var isOutofWindow = false;
				isOutofWindow = oModelDetail.getProperty("/outOfWindowDate");

				if (isOutofWindow == true) {
					for (var i = requestedModelLengthTemp - 1; i >= 0; i--) {

						// for (var i = 0; i < requestedModelLengthTemp; i++) {

						if (requestedModelData[i].suggestedVolume <= "0" && requestedModelData[i].requestedVolume <= "0") {
							requestedModelData.splice(i, 1);
							requestedModelLength = requestedModelLength - 1;
							//  continue;
						}

						// if (requestedModelData[i].dealerReviewCount == "Y") {

					}

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

			// if the calender status and suggest order status does not match do not display the data. 

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
					this.sapDivision = "TOY";

				} else { // set the lexus logo
					var currentImageSource = this.getView().byId("idLexusLogo");
					currentImageSource.setProperty("src", "images/i_lexus_black_full.png");
					this.sapDivision = "LEX";
					// }
				}
			}

		},
		formatColor: function (color) {
			// check if the date is past the due date then do a different color. 

			return color ? color : "Error";
		},
		onExit: function () {
			RouteObj = {};
		}
	}); // very end
}, /* bExport= */ true);