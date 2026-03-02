using { cuid } from '@sap/cds/common';

service WeatherService @(path: 'weather') {

    entity WeatherOverviewResult : cuid{
        city : String;
        date: Date;
        currentTemperature: Integer;
        precipitation: Integer;
        precipitationType: String;
        windSpeed: Integer;
        dmiUrl: String;
        openWeatherUrl: String;
        hourly : Association  to many HourlyWeather on hourly.parent =$self;
    }

    entity HourlyWeather : cuid{
        parent : Association to WeatherOverviewResult;
        hour: String;
        temperature : Integer;
        rain : Integer;
        windSpeed : Integer;
    }

    entity Cities {
        key name : String;
    }

    action getWeatherOverview(city : String) returns WeatherOverviewResult

}