sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"weatherapp/test/integration/pages/WeatherOverviewResultMain"
], function (JourneyRunner, WeatherOverviewResultMain) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('weatherapp') + '/test/flp.html#app-preview',
        pages: {
			onTheWeatherOverviewResultMain: WeatherOverviewResultMain
        },
        async: true
    });

    return runner;
});

