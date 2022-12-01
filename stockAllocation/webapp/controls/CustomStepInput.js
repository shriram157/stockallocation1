sap.ui.define(['sap/m/StepInput'],
	function (StepInput) {
		'use strict';
		var CustomStepInput = StepInput.extend("suggestOrder.controls.CustomStepInput", {
			metadata: {
				events: {
					"change": {

					},
					"handleMouseWheel": {

					}
				}
			},
			onmousedown: function (evt) {
				//console.log(this.mEventRegistry.change[0].oListener.obj.reqThreshold);
				//this.setMax(this.mEventRegistry.change[0].oListener.obj.reqThreshold);
				//StockAllocation.whenUserChangesRequestedData();

				//var oArr = this.getParent().getParent().getModel("stockDataModel").getData();
				//var nCount = oArr.filter(elm => elm.modelCodeDescription === this.getParent().getCells()[0].getText()).length 
				//+ Number(this.mEventRegistry.change[0].oListener.allowedtolerance);

				//this.setMax(nCount);
				// document.getElementById(evt.srcControl.sId).focus();
				// document.getElementById(evt.srcControl.sId).blur();
				//  console.log("Element:"+evt.srcControl.sId);
				//   document.getElementById(evt.srcControl.sId).focus();
				//   console.log("Focus!!!! :");
				//  console.log("Element:"+evt.srcControl.sId);
			  document.getElementById(evt.srcControl.sId).blur();
			//				 document.getElementById(evt.srcControl.sId).blur(function() {
				//   alert( "Lose focus from Field1" );
				// });
				//  console.log("blur@@@@@@ :");
				//  console.log("Element:"+evt.srcControl.sId);
				//  document.getElementById(evt.srcControl.sId).style.pointerEvents = "none";
				//  console.log("PointerEvents%%%%%% :");
				//  console.log("Element:"+evt.srcControl.sId);
				return false;

			},

			onmousewheel: function (evt) {
				 document.getElementById(evt.srcControl.sId).blur();
				// return false;
			},

			onscroll: function (evt) {
				 document.getElementById(evt.srcControl.sId).blur();
				// return false;
			},
			_spinValues : function(bIncrementButton) {
			// var that = this;
			// if (this._btndown) {
			// 	this._spinTimeoutId = setTimeout(function () {
			// 		if (that._btndown) {
			// 			that._bSpinStarted = true;
			// 			////////////////// just the code for setting a value, not firing an event
			// 			var oNewValue = that._calculateNewValue(1, bIncrementButton);

			// 			that.setValue(oNewValue.value);
			// 			that._verifyValue();

			// 			if (!that._getIncrementButton().getEnabled() || !that._getDecrementButton().getEnabled()) {
			// 				_resetSpinValues.call(that);
			// 				// fire change event when the buttons get disabled since then no mouseup event is fired
			// 				that.fireChange({value: that.getValue()});
			// 			}

			// 			that._spinValues(bIncrementButton);
			// 		}
			// 	}, that._calcWaitTimeout());
			// }
		},

			renderer: "sap.m.StepInputRenderer"

		});

		//Commenting the below codes

		CustomStepInput.prototype.onAfterRendering = function (oEvent) {
		
			if (sap.m.StepInput.prototype.onAfterRendering) {
				sap.m.StepInput.prototype.onAfterRendering.apply(this);
				//sap.m.StepInput.prototype.onAfterRendering.apply(this, arguments);
				document.getElementById(oEvent.srcControl.sId).blur();
				return false;
			}

		};

		return CustomStepInput;
	});