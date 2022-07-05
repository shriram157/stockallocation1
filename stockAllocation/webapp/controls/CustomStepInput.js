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
			 evt.getSource().getId().blur();
			 return false;
			 
		},
		
		onmousewheel : function(evt){
			evt.getSource().getId().blur();
			return false;
		},
		
		onscroll : function(evt){
			evt.getSource().getId().blur();
			return false;
		},
	
		renderer :"sap.m.StepInputRenderer"	
		
	});
	
	CustomStepInput.prototype.onAfterRendering = function (oEvent) {
		CustomStepInput.prototype.onAfterRendering.apply(this, arguments);
			
	};
	
	return CustomStepInput;
});