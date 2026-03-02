using WeatherService as service from '../../srv/weatherService';

annotate WeatherService.WeatherOverviewResult with @(
    UI.HeaderInfo: {
        Title: { Value: city },
        Description: { Value: date }
    },

    UI.FieldGroup#General: {
        Data: [
            { Value: currentTemperature, Label: 'Temperature' },
            { Value: precipitation, Label: 'Precipitation' },
            //{ Value: precipitationType, Label: 'Precipitation type' },
            { Value: windSpeed, Label: 'Wind speed' },
            { $Type: 'UI.DataFieldWithUrl', Label: 'Forecast',
              Value: 'Open forecast', Url: openWeatherUrl} //Selve linket giver blot alt det json data jeg henter.
            
            /*{ $Type: 'UI.DataFieldWithUrl', Label: 'DMI forecast',
              Value: 'Open forecast', Url: dmiUrl}*/
        ]
    },
);