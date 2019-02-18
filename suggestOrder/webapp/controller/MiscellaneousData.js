			// _buildSuggestedModel: function () {

			// 	var oViewSuggestData = {
			// 		"suggestedData": [{
			// 			series: "2018 Sienna-EN",
			// 			orderPrefix: "E1802",
			// 			orderNumber: "12346",
			// 			suggestedVolume: "4",
			// 			dealerCode: "2400042193"
			// 		}, {
			// 			series: "2018 Toyota-Camry",
			// 			orderPrefix: "E1804",
			// 			orderNumber: "12344",
			// 			suggestedVolume: "8",
			// 			dealerCode: "2400042120"
			// 		}, {
			// 			series: "2018 Lexus",
			// 			orderPrefix: "E1802",
			// 			orderNumber: "12344",
			// 			suggestedVolume: "4",
			// 			dealerCode: "2400034030"
			// 		}, {
			// 			series: "2018 Sienna-EN2",
			// 			orderPrefix: "E18022",
			// 			orderNumber: "123462",
			// 			suggestedVolume: "42",
			// 			dealerCode: "2400042193"
			// 		}, {
			// 			series: "2018 Toyota-Camry",
			// 			orderPrefix: "E18042",
			// 			orderNumber: "123442",
			// 			suggestedVolume: "8",
			// 			dealerCode: "2400042120"
			// 		}, {
			// 			series: "2018 Lexus",
			// 			orderPrefix: "E18022",
			// 			orderNumber: "123442",
			// 			suggestedVolume: "42",
			// 			dealerCode: "2400034030"
			// 		}]

			// 	};

			// 	var oSuggestModel = new sap.ui.model.json.JSONModel();
			// 	oSuggestModel.setData(oViewSuggestData);
			// 	this.getView().setModel(oSuggestModel, "suggestedDataModel");
			// 	var oModelSuggestedDataModel = this.getView().getModel("suggestedDataModel");

			// 	//	this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(oModelSuggestedDataModel), "suggestedDataModel");

			// },

			// _buildRequestedDataModel: function () {

			// 	var oViewRequetData = {
			// 		"requestedData": [{
			// 			series: "2018 Sienna-EN",
			// 			orderPrefix: "E1802",
			// 			orderNumber: "12346",
			// 			suggestedVolume: "4",
			// 			requestedVolume: "6",
			// 			suggestedVolPercentRequested: "10%",
			// 			suggestedMixRequested: "30%",
			// 			dealerCode: "2400042193"
			// 		}, {
			// 			series: "2018 Toyota-Camry",
			// 			orderPrefix: "E1804",
			// 			orderNumber: "12344",
			// 			suggestedVolume: "8",
			// 			requestedVolume: "6",
			// 			suggestedVolPercentRequested: "20%",
			// 			suggestedMixRequested: "40%",
			// 			dealerCode: "2400042120"
			// 		}, {
			// 			series: "2018 Lexus",
			// 			orderPrefix: "E1802",
			// 			orderNumber: "12344",
			// 			suggestedVolume: "4",
			// 			requestedVolume: "6",
			// 			suggestedVolPercentRequested: "30%",
			// 			suggestedMixRequested: "60%",
			// 			dealerCode: "2400034030"
			// 		}, {
			// 			series: "2018 Sienna-EN2",
			// 			orderPrefix: "E18022",
			// 			orderNumber: "123462",
			// 			suggestedVolume: "42",
			// 			requestedVolume: "6",
			// 			suggestedVolPercentRequested: "60%",
			// 			suggestedMixRequested: "80%",
			// 			dealerCode: "2400042193"
			// 		}, {
			// 			series: "2018 Toyota-Camry",
			// 			orderPrefix: "E18042",
			// 			orderNumber: "123442",
			// 			suggestedVolume: "8",
			// 			requestedVolume: "6",
			// 			suggestedVolPercentRequested: "70%",
			// 			suggestedMixRequested: "70%",
			// 			dealerCode: "2400042120"
			// 		}, {
			// 			series: "2018 Lexus",
			// 			orderPrefix: "E18022",
			// 			orderNumber: "123442",
			// 			suggestedVolume: "42",
			// 			requestedVolume: "6",
			// 			suggestedVolPercentRequested: "30%",
			// 			suggestedMixRequested: "40%",
			// 			dealerCode: "2400034030"
			// 		}]

			// 	};

			// 	var oRequestModel = new sap.ui.model.json.JSONModel();
			// 	oRequestModel.setData(oViewRequetData);
			// 	this.getView().setModel(oRequestModel, "requestedDataModel");
			// 	var oModelRequestedDataModel = this.getView().getModel("requestedDataModel");

			// },

			// _buildAllocatedDataModel: function () {

			// 	var oViewAllocatedData = {
			// 		"allocatedData": [{
			// 			series: "2018 Sienna-EN",
			// 			orderPrefix: "E1802",
			// 			orderNumber: "12346",
			// 			suggestedVolume: "4",
			// 			requestedVolume: "6",
			// 			suggestedVolPercentRequested: "10%",
			// 			suggestedMixRequested: "30%",
			// 			allocatedVolume: "20",
			// 			percentRequestVolAllocated: "30%",
			// 			unfilledAllocation: "30",
			// 			dealerCode: "2400042193"
			// 		}, {
			// 			series: "2018 Toyota-Camry",
			// 			orderPrefix: "E1804",
			// 			orderNumber: "12344",
			// 			suggestedVolume: "8",
			// 			requestedVolume: "6",
			// 			suggestedVolPercentRequested: "20%",
			// 			suggestedMixRequested: "40%",
			// 			allocatedVolume: "20",
			// 			percentRequestVolAllocated: "30%",
			// 			unfilledAllocation: "30",
			// 			dealerCode: "2400042120"
			// 		}, {
			// 			series: "2018 Lexus",
			// 			orderPrefix: "E1802",
			// 			orderNumber: "12344",
			// 			suggestedVolume: "4",
			// 			requestedVolume: "6",
			// 			suggestedVolPercentRequested: "30%",
			// 			suggestedMixRequested: "60%",
			// 			allocatedVolume: "20",
			// 			percentRequestVolAllocated: "30%",
			// 			unfilledAllocation: "30",
			// 			dealerCode: "2400034030"
			// 		}, {
			// 			series: "2018 Sienna-EN2",
			// 			orderPrefix: "E18022",
			// 			orderNumber: "123462",
			// 			suggestedVolume: "42",
			// 			requestedVolume: "6",
			// 			suggestedVolPercentRequested: "60%",
			// 			suggestedMixRequested: "80%",
			// 			allocatedVolume: "20",
			// 			percentRequestVolAllocated: "30%",
			// 			unfilledAllocation: "30",
			// 			dealerCode: "2400042193"
			// 		}, {
			// 			series: "2018 Toyota-Camry",
			// 			orderPrefix: "E18042",
			// 			orderNumber: "123442",
			// 			suggestedVolume: "8",
			// 			requestedVolume: "6",
			// 			suggestedVolPercentRequested: "70%",
			// 			suggestedMixRequested: "70%",
			// 			allocatedVolume: "20",
			// 			percentRequestVolAllocated: "30%",
			// 			unfilledAllocation: "30",
			// 			dealerCode: "2400042120"
			// 		}, {
			// 			series: "2018 Lexus",
			// 			orderPrefix: "E18022",
			// 			orderNumber: "123442",
			// 			suggestedVolume: "42",
			// 			requestedVolume: "6",
			// 			suggestedVolPercentRequested: "30%",
			// 			suggestedMixRequested: "40%",
			// 			allocatedVolume: "20",
			// 			percentRequestVolAllocated: "30%",
			// 			unfilledAllocation: "30",
			// 			dealerCode: "2400034030"
			// 		}]

			// 	};

			// 	var oAllocatedModel = new sap.ui.model.json.JSONModel();
			// 	oAllocatedModel.setData(oViewAllocatedData);
			// 	this.getView().setModel(oAllocatedModel, "allocatedDataModel");
			// 	var oModelAllocatedDataModel = this.getView().getModel("allocatedDataModel");

			// }
			
			
			
			
			
					// for (var i = 0; i < aDataBP.length; i++) {
				// 	if (aDataBP[i].BusinessPartner == sSelectedText) {

				// 		// extract the business partner type to be validated for pio indicator. 

				// 		oViewModel.setProperty("/Dealer_type", aDataBP[i].BusinessPartnerType);
				// 		// set the Division  				    
				// 		this.sDivision = aDataBP[i].Division;

				// 		if (this.sDivision == '10') // set the toyoto logo
				// 		{
				// 			var currentImageSource = this.getView().byId("idLexusLogo");
				// 			currentImageSource.setProperty("src", "images/toyota_logo_colour.png");

				// 		} else { // set the lexus logo
				// 			if (this.sDivision == "Dual") {
				// 				// read the url division. default make it toyota
				// 				var isDivisionSent = window.location.search.match(/Division=([^&]*)/i);
				// 				if (isDivisionSent) {
				// 					this.sDivision = window.location.search.match(/Division=([^&]*)/i)[1];
				// 					if (this.sDivision == 10) {
				// 						var currentImageSource = this.getView().byId("idLexusLogo");
				// 						currentImageSource.setProperty("src", "images/toyota_logo_colour.png");
				// 					} else {
				// 						var currentImageSource = this.getView().byId("idLexusLogo");
				// 						currentImageSource.setProperty("src", "images/i_lexus_black_full.png");
				// 					}
				// 				} else { // for default behaviour we use toyota. 
				// 					this.sDivision = "10";
				// 					var currentImageSource = this.getView().byId("idLexusLogo");
				// 					currentImageSource.setProperty("src", "images/toyota_logo_colour.png");
				// 				}
				// 			} else { // it is lexus
				// 				var currentImageSource = this.getView().byId("idLexusLogo");
				// 				currentImageSource.setProperty("src", "images/i_lexus_black_full.png");

				// 			}

				// 		}

				// 		break;
				// 	}
				// }
				
				
				
				
						// _countModels: function (oEvent) {
			// 	// local temporary hardcodings

			// 	var oViewCount = new sap.ui.model.json.JSONModel({
			// 		suggestedCount: "40",
			// 		requestedCount: "60",
			// 		allocatedCount: "80",
			// 		totalSuggestCount: "120",
			// 		totalRequestedCount: "140",
			// 		totalAllocatedCount: "130",
			// 		totalPendingCount: "240",
			// 		totalUnfilledCount: "160"

			// 	});

			// 	this.getView().setModel(oViewCount, "countViewModel");

			// },
			
					// var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			// var oModel = (oBindingContext) ? oBindingContext.getModel() : null;

			// var sEntityNameSet;
			// if (sPath !== null && sPath !== "") {
			// 	if (sPath.substring(0, 1) === "/") {
			// 		sPath = sPath.substring(1);
			// 	}
			// 	sEntityNameSet = sPath.split("(")[0];
			// }
			// var sNavigationPropertyName;
			// var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;

			// if (sEntityNameSet !== null) {
			// 	sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet,
			// 		sRouteName);
			// }
			// if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
			// 	if (sNavigationPropertyName === "") {
			// 		this.oRouter.navTo(sRouteName, {
			// 			context: sPath,
			// 			masterContext: sMasterContext
			// 		}, false);
			// 	} else {
			// 		oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function (bindingContext) {
			// 			if (bindingContext) {
			// 				sPath = bindingContext.getPath();
			// 				if (sPath.substring(0, 1) === "/") {
			// 					sPath = sPath.substring(1);
			// 				}
			// 			} else {
			// 				sPath = "undefined";
			// 			}

			// 			// If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
			// 			if (sPath === "undefined") {
			// 				this.oRouter.navTo(sRouteName);
			// 			} else {
			// 				this.oRouter.navTo(sRouteName, {
			// 					context: sPath,
			// 					masterContext: sMasterContext
			// 				}, false);
			// 			}
			// 		}.bind(this));
			// 	}
			// } else {

			// }
			
			
					// _buildSuggestedModel: function () {

		// 	var oViewSuggestData = {
		// 		"suggestedData": [{
		// 					model: "Toyota-Camry",
		// 					suffix: "test",
		// 					colour_Trim: "Color Trim Value",     
		// 					current:  "100",
		// 					current_Ds: "20",
		// 					suggested: "60",
		// 					// suggested_Ds:  ///Missing from oData
		// 					requested_Volume: 70,
		// 					difference: "80",
		// 					// requested_Ds:  // Missing from oData
		// 					allocated: "90",
		// 					// allocated_Ds:   //Missing from oData
		// 					pendingAllocation: "40",
		// 					 unfilled_Allocation: "60"
		// 		}, {
		// 					model: "Toyota-Camry",
		// 					suffix: "test",
		// 					colour_Trim: "Color Trim Value",     
		// 					current:  "100",
		// 					current_Ds: "20",
		// 					suggested: "60",
		// 					// suggested_Ds:  ///Missing from oData
		// 					requested_Volume: 70,
		// 					difference: "80",
		// 					// requested_Ds:  // Missing from oData
		// 					allocated: "90",
		// 					// allocated_Ds:   //Missing from oData
		// 					pendingAllocation: "40",
		// 					 unfilled_Allocation: "60"
		// 		}, {
		// 					model: "Toyota-Camry",
		// 					suffix: "test",
		// 					colour_Trim: "Color Trim Value",     
		// 					current:  "100",
		// 					current_Ds: "20",
		// 					suggested: "60",
		// 					// suggested_Ds:  ///Missing from oData
		// 					requested_Volume: 70,
		// 					difference: "80",
		// 					// requested_Ds:  // Missing from oData
		// 					allocated: "90",
		// 					// allocated_Ds:   //Missing from oData
		// 					pendingAllocation: "40",
		// 					 unfilled_Allocation: "60"
		// 		}, {
		// 					model: "Toyota-Camry",
		// 					suffix: "test",
		// 					colour_Trim: "Color Trim Value",     
		// 					current:  "100",
		// 					current_Ds: "20",
		// 					suggested: "60",
		// 					// suggested_Ds:  ///Missing from oData
		// 					requested_Volume: 70,
		// 					difference: "80",
		// 					// requested_Ds:  // Missing from oData
		// 					allocated: "90",
		// 					// allocated_Ds:   //Missing from oData
		// 					pendingAllocation: "40",
		// 					 unfilled_Allocation: "60"
		// 		}, {
		// 					model: "Toyota-Camry",
		// 					suffix: "test",
		// 					colour_Trim: "Color Trim Value",     
		// 					current:  "100",
		// 					current_Ds: "20",
		// 					suggested: "60",
		// 					// suggested_Ds:  ///Missing from oData
		// 					requested_Volume: 70,
		// 					difference: "80",
		// 					// requested_Ds:  // Missing from oData
		// 					allocated: "90",
		// 					// allocated_Ds:   //Missing from oData
		// 					pendingAllocation: "40",
		// 					 unfilled_Allocation: "60"
		// 		}, {
		// 					model: "Toyota-Camry",
		// 					suffix: "test",
		// 					colour_Trim: "Color Trim Value",     
		// 					current:  "100",
		// 					current_Ds: "20",
		// 					suggested: "60",
		// 					// suggested_Ds:  ///Missing from oData
		// 					requested_Volume: 70,
		// 					difference: "80",
		// 					// requested_Ds:  // Missing from oData
		// 					allocated: "90",
		// 					// allocated_Ds:   //Missing from oData
		// 					pendingAllocation: "40",
		// 					 unfilled_Allocation: "60"
		// 		}]

		// 	};

		// 	var oSuggestModel = new sap.ui.model.json.JSONModel();
		// 	oSuggestModel.setData(oViewSuggestData);
		// 	this.getView().setModel(oSuggestModel, "stockDataModel");
		// //	var oModelSuggestedDataModel = this.getView().getModel("suggestedDataModel");

		// 	//	this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(oModelSuggestedDataModel), "suggestedDataModel");

		// },
		
		
					// model: item.zzmodel,
			// suffix: item.zzsuffix,
			// colour_Trim: item.int_trim_desc_en,
			// current: item.zzcur_stock,
			// current_Ds: item.zzcur_ds,
			// suggested: item.zzsuggest_qty,
			// // suggested_Ds:  ///Missing from oData
			// requested_Volume: item.zzrequest_qty,
			// difference: item.diff_sugg_req,
			// var oViewUpdateDataInSAP = ({

			// 				zzmodel   : "test",
			//                         zzsuffix   : "Suffix text",
			//                         int_trim_desc_en  : "description",
			//                         zzrequest_qty : "requested Qaty"

			// });
			
				// zzmodel: item.model,
					//		zzsuffix:
					// int_trim_desc_en: item.colour_Trim,
					// zzrequest_qty: item.requested_Volume

					// ===================================================================

					// diff_sugg_req: "0",
					// int_trim_desc_en: "BLACK",
					// int_trim_desc_fr: "BLACK",
					// mktg_desc_en: "test",
					// mktg_desc_fr: "WAR008 FR",
					// name1: "Bailey Toyota 123",
					// pending_allocation: "4",
					// suffix_desc_en: "BASE",
					// suffix_desc_fr: "BASE (FR)",
					// suggested_ds: "4",
					// unfilled__allocation: "4",
					// vkbur: "3000",
					// zsrc_werks: "A",
					// zzalc_qty_2ndcut: "0",
					// zzalc_qty_3rdcut: "0",
					// zzallocated_qty: "0",
					// zzallocation_ind: "S",
					// zzcur_ds: "0",
					// zzcur_stock: "10",
					//	zzdealer_code: item.dealer_code, // "2400042193",
					// zzdealer_release: "",
					//	zzdel_review: "Y", // Review is set to Y
					// zzdlr_ref_no: "",
					// zzdnc_comment: "",
					// zzdnc_ind: "",
					// zzend_date: "20190205110619",
					// zzeta_month: "201812",
					// zzextcol: "0070",
					// zzint_alc_qty: "0",
					// zzintcol: "LC42",
					//	zzmodel: item.model, //"YZ3DCT",

					//	zzmoyr: item.zzmoyr,
					// zzordertype: item.zzordertype,
					// zzpdtsp: "",
					// zzprefix: "E1802",
					// zzprocess_dt: Mon Jan 28 2019 19: 00: 00 GMT - 0500(Eastern Standard Time) {},
					// zzprod_month: "201901",
					// zzreq_eta_from: null,
					// zzreq_eta_to: null,
					// zzrequest_qty: item.requested_Volume, //"5",

					// zzsug_seq_no: item.zzsug_seq_no,
					// zzprocess_dt: item.zzprocess_dt,
					// zzextcol: item.zzextcol,
					// zzintcol: item.zzintcol,
					// zsrc_werks: item.zsrc_werks,
					// zzprod_month: item.zzprod_month,
					// zzeta_month: item.zzeta_month,

					// zzseries: "SIE",
					// zzseries_desc_en: "Sienna-EN",
					// zzseries_tag: "",
					// zzstart_date: "20190129110501",
					// zzsuffix: "AB",
					// zzsug_seq_no: "00000112",
					// zzsuggest_qty: "4",
					// zzurn_no: "",
					// zzvhcle: "",
					// zzvtn: "",
					// zzwin_id: "000010",