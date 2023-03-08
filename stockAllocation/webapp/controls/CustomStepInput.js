sap.ui.define(['sap/m/StepInput'],
function(StepInput){
	'use strict';
	var CustomStepInput = StepInput.extend("suggestOrder.controls.CustomStepInput", {
		metadata : {
			events : {
				"change" : {
				
				},
				"handleMouseWheel" : {
					
				}
			}
		},
		onmousedown: function(evt){
			 //console.log(this.mEventRegistry.change[0].oListener.obj.reqThreshold);
			 //this.setMax(this.mEventRegistry.change[0].oListener.obj.reqThreshold);
			 //StockAllocation.whenUserChangesRequestedData();
			 
			 //var oArr = this.getParent().getParent().getModel("stockDataModel").getData();
			 //var nCount = oArr.filter(elm => elm.modelCodeDescription === this.getParent().getCells()[0].getText()).length 
			 //+ Number(this.mEventRegistry.change[0].oListener.allowedtolerance);
			 
			 //this.setMax(nCount);
			 document.getElementById(evt.srcControl.sId).blur();
			 return false;
			 
		},
		
		onmousewheel : function(evt){
			document.getElementById(evt.srcControl.sId).blur();
			return false;
		},
		
		onscroll : function(evt){
			document.getElementById(evt.srcControl.sId).blur();
			return false;
		},
	
		renderer :"sap.m.StepInputRenderer"	
		
	});
	
//changes by Shriram for INC0214976 for step input
		CustomStepInput.prototype.onAfterRendering = function (oEvent) {
		
			if (sap.m.StepInput.prototype.onAfterRendering) {
				sap.m.StepInput.prototype.onAfterRendering.apply(this);
				//sap.m.StepInput.prototype.onAfterRendering.apply(this, arguments);
				document.getElementById(oEvent.srcControl.sId).blur();
				return false;
			}

		};