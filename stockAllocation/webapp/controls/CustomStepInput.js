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
	      _onmousewheel : function (oEvent) {
			// var bIsFocused = this.getDomRef().contains(document.activeElement);
			// if (bIsFocused) {
			// 	oEvent.preventDefault();
			// 	var oOriginalEvent = oEvent.originalEvent,
			// 		bDirectionPositive = oOriginalEvent.detail ? (-oOriginalEvent.detail > 0) : (oOriginalEvent.wheelDelta > 0);

			// 	this._applyValue(this._calculateNewValue(1, bDirectionPositive).displayValue);
			// 	this._verifyValue();
			// }
		},
		onkeydown : function (oEvent) {
			// var bVerifyValue = false;

			// this._bPaste = (oEvent.ctrlKey || oEvent.metaKey) && (oEvent.which === KeyCodes.V);

			// if (oEvent.which === KeyCodes.ARROW_UP && !oEvent.altKey && oEvent.shiftKey &&
			// 	(oEvent.ctrlKey || oEvent.metaKey)) { //ctrl+shift+up
			// 	this._applyValue(this._getMax());
			// 	bVerifyValue = true;
			// }
			// if (oEvent.which === KeyCodes.ARROW_DOWN && !oEvent.altKey && oEvent.shiftKey &&
			// 	(oEvent.ctrlKey || oEvent.metaKey)) { //ctrl+shift+down
			// 	this._applyValue(this._getMin());
			// 	bVerifyValue = true;
			// }
			// if (oEvent.which === KeyCodes.ARROW_UP && !(oEvent.ctrlKey || oEvent.metaKey || oEvent.altKey) && oEvent.shiftKey) { //shift+up
			// 	oEvent.preventDefault(); //preventing to be added both the minimum step (1) and the larger step
			// 	this._applyValue(this._calculateNewValue(this.getLargerStep(), true).displayValue);
			// 	bVerifyValue = true;
			// }
			// if (oEvent.which === KeyCodes.ARROW_DOWN && !(oEvent.ctrlKey || oEvent.metaKey || oEvent.altKey) && oEvent.shiftKey) { //shift+down
			// 	oEvent.preventDefault(); //preventing to be subtracted  both the minimum step (1) and the larger step
			// 	this._applyValue(this._calculateNewValue(this.getLargerStep(), false).displayValue);
			// 	bVerifyValue = true;
			// }
			// if (oEvent.which === KeyCodes.ARROW_UP && (oEvent.ctrlKey || oEvent.metaKey)) { // ctrl + up
			// 	oEvent.preventDefault();
			// 	this._applyValue(this._calculateNewValue(1, true).displayValue);
			// 	bVerifyValue = true;
			// }
			// if (oEvent.which === KeyCodes.ARROW_DOWN && (oEvent.ctrlKey || oEvent.metaKey)) { // ctrl + down
			// 	oEvent.preventDefault();
			// 	this._applyValue(this._calculateNewValue(1, false).displayValue);
			// 	bVerifyValue = true;
			// }
			// if (oEvent.which === KeyCodes.ARROW_UP && oEvent.altKey) { // alt + up
			// 	oEvent.preventDefault();
			// 	this._applyValue(this._calculateNewValue(1, true).displayValue);
			// 	bVerifyValue = true;
			// }
			// if (oEvent.which === KeyCodes.ARROW_DOWN && oEvent.altKey) { // alt + down
			// 	oEvent.preventDefault();
			// 	this._applyValue(this._calculateNewValue(1, false).displayValue);
			// 	bVerifyValue = true;
			// }
			// if (bVerifyValue) {
			// 	this._verifyValue();
			// }
			// this._disableButtons(this._getInput().getValue(), this._getMax(), this._getMin());
		},
	onsappageup : function (oEvent) {
			// this._applyValue(this._calculateNewValue(this.getLargerStep(), true).displayValue);
			// this._verifyValue();
			// this._disableButtons(this._getInput().getValue(), this._getMax(), this._getMin());
			// // prevent document scrolling when page up key is pressed
			// oEvent.preventDefault();
		},
		onsappagedown : function (oEvent) {
			// this._applyValue(this._calculateNewValue(this.getLargerStep(), false).displayValue);
			// this._verifyValue();
			// this._disableButtons(this._getInput().getValue(), this._getMax(), this._getMin());
			// // prevent document scrolling when page down key is pressed
			// oEvent.preventDefault();
		},
		onsappageupmodifiers : function (oEvent) {
			// if (this._isNumericLike(this._getMax()) && !(oEvent.ctrlKey || oEvent.metaKey || oEvent.altKey) && oEvent.shiftKey) {
			// 	this._applyValue(this._getMax());
			// }
			// this._disableButtons(this._getInput().getValue(), this._getMax(), this._getMin());
		},
		onsappagedownmodifiers : function (oEvent) {
			// if (this._isNumericLike(this._getMin()) && !(oEvent.ctrlKey || oEvent.metaKey || oEvent.altKey) && oEvent.shiftKey) {
			// 	this._applyValue(this._getMin());
			// }
			// this._disableButtons(this._getInput().getValue(), this._getMax(), this._getMin());
		},
		onsapup : function (oEvent) {
			// oEvent.preventDefault(); //prevents the value to increase by one (Chrome and Firefox default behavior)
			// this._applyValue(this._calculateNewValue(1, true).displayValue);
			// this._verifyValue();
			// this._disableButtons(this._getInput().getValue(), this._getMax(), this._getMin());
			// oEvent.setMarked();
		},
		onsapdown : function (oEvent) {
			// oEvent.preventDefault(); //prevents the value to decrease by one (Chrome and Firefox default behavior)
			// this._applyValue(this._calculateNewValue(1, false).displayValue);
			// this._verifyValue();
			// this._disableButtons(this._getInput().getValue(), this._getMax(), this._getMin());
			// oEvent.setMarked();
		},
		_liveChange : function () {
			// this._verifyValue();
			// this._disableButtons(this._getInput().getValue(), this._getMax(), this._getMin());
		},

			renderer: "sap.m.StepInputRenderer"

		});

		//Commenting the below codes
		//changes by Shriram for INC0214976 for step input
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