sap.ui.define(
    [
        'sap/fe/core/PageController'
    ],
    function(PageController) {
        'use strict';

        return PageController.extend('weatherapp.ext.main.Main', {
            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf weatherapp.ext.main.Main
             */
           onInit: function () {
                PageController.prototype.onInit.apply(this, arguments);
              },
            
            onAfterRendering: function () {
                this.loadWeather("Aarhus");
            },

            onSearchCity: async function () {
                const city = this.byId("citySearch").getValue();
                this.loadWeather(city);
            },

            loadWeather: async function (city) {
                const oModel = this.getOwnerComponent().getModel();

                const oAction = oModel.bindContext("/getWeatherOverview(...)");
                oAction.setParameter("city", city);

                await oAction.execute();

                const oContext = oAction.getBoundContext();
                const oResult = oContext.getObject();

                // Sæt context til annotations-formen
                this.getView().setBindingContext(oContext);

                // Chart model
                const oChart = new sap.ui.model.json.JSONModel({data: oResult.hourly});
                this.getView().setModel(oChart, "chart");
            },
/*
            onSuggest: function(oEvent){
                const sValue = oEvent.getParameter("suggestValue");
                const oFilter = new sap.ui.model.Filter(
                    "name",
                    sap.ui.model.FilterOperator.Contains,
                    sValue
                );

                this.byId("citySearch").getBinding("suggestionItems").filter([oFilter]);
            }*/

            /**
             * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
             * (NOT before the first rendering! onInit() is used for that one!).
             * @memberOf weatherapp.ext.main.Main
             */
            //  onBeforeRendering: function() {
            //
            //  },

            /**
             * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
             * This hook is the same one that SAPUI5 controls get after being rendered.
             * @memberOf weatherapp.ext.main.Main
             */
            //  onAfterRendering: function() {
            //
            //  },

            /**
             * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
             * @memberOf weatherapp.ext.main.Main
             */
            //  onExit: function() {
            //
            //  }
        });
    }
);