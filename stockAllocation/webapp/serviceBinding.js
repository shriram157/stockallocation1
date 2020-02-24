function initModel() {
	var sUrl = "/sap/opu/odata/sap/ZVMS_STOCK_ALLOC_SALES_DATA_SRV/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}