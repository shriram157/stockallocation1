sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"suggestOrder/model/models",
	"./model/errorHandling",
		"sap/ui/model/odata/v2/ODataModel"
], function (UIComponent, Device, models, errorHandling, ODataModel) {
	"use strict";

	var navigationWithContext = {

	};

	return UIComponent.extend("suggestOrder.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			// set the FLP model
			this.setModel(models.createFLPModel(), "FLP");
//

            var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			var mConfig = this.getMetadata().getManifestEntry("/sap.app/dataSources/ZCDS_SUGGEST_ORD_CDS");
				if (sLocation_conf == 0) {
				mConfig.uri = "/Suggest_Order" + mConfig.uri;  //
			} else  {
					mConfig.uri = mConfig.uri;
			}
			var oDataModel = new ODataModel(mConfig.uri, {
				useBatch: false,
				// disableHeadRequestForToken: false,
				//defaultUpdateMethod: 'PUT',
				json: true,
				headers: {
					"X-Requested-With": "XMLHttpRequest"
				}
			});
			this.setModel(oDataModel, "ZCDS_SUGGEST_ORD_CDS");
			
// the Summation Data model. 

			var mConfig = this.getMetadata().getManifestEntry("/sap.app/dataSources/ZCDS_SUGGEST_ORD_SUM_CDS");
				if (sLocation_conf == 0) {
				mConfig.uri = "/Suggest_Order" + mConfig.uri;  //ecpSales_node_secured
			} else  {
					mConfig.uri = mConfig.uri;
			}
			var oDataModel = new ODataModel(mConfig.uri, {
				useBatch: false,
				// disableHeadRequestForToken: false,
				//defaultUpdateMethod: 'PUT',
				json: true,
				headers: {
					"X-Requested-With": "XMLHttpRequest"
				}
			});
			this.setModel(oDataModel, "ZCDS_SUGGEST_ORD_SUM_CDS");
			
//the count data model. ZCDS_SUGGEST_ORD_COUNT_CDS

			var mConfig = this.getMetadata().getManifestEntry("/sap.app/dataSources/ZCDS_SUGGEST_ORD_COUNT_CDS");
				if (sLocation_conf == 0) {
				mConfig.uri = "/Suggest_Order" + mConfig.uri;  
			} else  {
					mConfig.uri = mConfig.uri;
			}
			var oDataModel = new ODataModel(mConfig.uri, {
				useBatch: false,
				// disableHeadRequestForToken: false,
				//defaultUpdateMethod: 'PUT',
				json: true,
				headers: {
					"X-Requested-With": "XMLHttpRequest"
				}
			});
			this.setModel(oDataModel, "ZCDS_SUGGEST_ORD_COUNT_CDS");

 //ZSD_SUGGEST_ORDER_UPDATE_SRV
 			var mConfig = this.getMetadata().getManifestEntry("/sap.app/dataSources/ZSD_SUGGEST_ORDER_UPDATE_SRV");
				if (sLocation_conf == 0) {
				mConfig.uri = "/Suggest_Order" + mConfig.uri;  
			} else  {
					mConfig.uri = mConfig.uri;
			}
			var oDataModel = new ODataModel(mConfig.uri, {
				useBatch: false,
				// disableHeadRequestForToken: false,
				//defaultUpdateMethod: 'PUT',
				json: true,
				headers: {
					"X-Requested-With": "XMLHttpRequest"
				}
			});
			this.setModel(oDataModel, "ZSD_SUGGEST_ORDER_UPDATE_SRV");
 
 
 
 

			// set the dataSource model
			this.setModel(new sap.ui.model.json.JSONModel({}), "dataSource");

			// set application model
			var oApplicationModel = new sap.ui.model.json.JSONModel({});
			this.setModel(oApplicationModel, "applicationModel");

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// delegate error handling
			errorHandling.register(this);

			// create the views based on the url/hash
			this.getRouter().initialize();
		},

		createContent: function () {
			var app = new sap.m.App({
				id: "App"
			});
			var appType = "App";
			var appBackgroundColor = "";
			if (appType === "App" && appBackgroundColor) {
				app.setBackgroundColor(appBackgroundColor);
			}

			return app;
		},

		getNavigationPropertyForNavigationWithContext: function (sEntityNameSet, targetPageName) {
			var entityNavigations = navigationWithContext[sEntityNameSet];
			return entityNavigations == null ? null : entityNavigations[targetPageName];
		}

	});

});