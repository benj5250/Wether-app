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
            { Value: precipitationType, Label: 'Type' },
            { Value: windSpeed, Label: 'Wind speed' },
            { $Type: 'UI.DataFieldWithUrl', Label: 'DMI forecast',
              Value: 'Open forecast', Url: dmiUrl}
        ]
    },
)