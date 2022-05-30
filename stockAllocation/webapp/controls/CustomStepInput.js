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
			console.log(evt);
		},
	
		renderer :"sap.m.StepInputRenderer"	
		
	});
	
	return CustomStepInput;
});