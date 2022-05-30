sap.ui.define(['sap/m/StepInput'],
function(StepInput){
	'use strict';
	var CustomStepInput = StepInput.extend("suggestOrder.controls.CustomStepInput", {
		metadata : {
			events : {
				"change" : {
				
				}
			}
		},
		onmousedown: function(evt){
			console.log(this.mEventRegistry.change[0].oListener.obj.reqThreshold);
			this.setMax(this.mEventRegistry.change[0].oListener.obj.reqThreshold);
			
		},
	
		renderer :"sap.m.StepInputRenderer"	
		
	});
	
	return CustomStepInput;
});