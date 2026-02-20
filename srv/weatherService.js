const cds = require('@sap/cds')
const { json } = require('@sap/cds/lib/compile/parse')
const {
  getSearchCityDmi,
  getsearchCityOpenWeather,
  getAvailableCities
} = require('./weatherApi')

module.exports = cds.service.impl(async function(){

    this.on('getWeatherOverview', async (req) => {

    const city = req.data.city

    const dmi = await getSearchCityDmi(city)
    const openWeather = await getsearchCityOpenWeather(city)

    const hourly = dmi.dmiOutput.dmiNextSixHours.map(h => ({
        hour: h.time,
        temperature: h.temperature,
        rain: h.rain,
        windSpeed: h.windspeed
    }))

    return {
        city,
        date: dmi.dmiOutput.daily.date,
        currentTemperature: parseInt(dmi.dmiOutput.dmiNextSixHours[0].temperature),
        precipitation: parseInt(dmi.dmiOutput.dmiNextSixHours[0].rain),
        precipitationType: dmi.dmiOutput.dmiNextSixHours[0].precipitationType,
        windSpeed: dmi.dmiOutput.dmiNextSixHours[0].windspeed,
        dmiUrl: dmi.url,
        openWeatherUrl: openWeather.url,
        hourly
    }
    })
})