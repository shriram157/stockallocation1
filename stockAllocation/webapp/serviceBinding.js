function initModel() {
	var sUrl = "/sap/opu/odata/sap/ZIBP_VMS_SUGGEST_ORD_ETL_SRV/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}