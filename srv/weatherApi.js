//URL hentet direkte fra dmi's hjemmeside via Nioclais trick
const dmiUrl = 'https://www.dmi.dk/NinJo2DmiDk/ninjo2dmidk?cmd=llj&id=2624652'
//Henter vejret fra Open-Meteo for Aarhus C (fundet via lattitude og longitude)
const OpenWeatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=56.1572&longitude=10.2107&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunset,sunrise,uv_index_max,rain_sum&hourly=temperature_2m,relative_humidity_2m,rain,apparent_temperature,wind_speed_10m,uv_index&current=temperature_2m,relative_humidity_2m,apparent_temperature,rain,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=Europe%2FBerlin&wind_speed_unit=ms'

//------------------Søge funktioner for DMI weather------------------
const dmiIdMap = new Map()
dmiIdMap.set('aarhus', {id: 2624652, link:'https://www.dmi.dk/lokation/show/DK/2624652/Aarhus'})
dmiIdMap.set('københavn', {id: 2618425, link:'https://www.dmi.dk/lokation/show/DK/2618425/K%C3%B8benhavn'})
dmiIdMap.set('aalborg', {id: 2624886, link:'https://www.dmi.dk/lokation/show/DK/2624886/Aalborg'})
dmiIdMap.set('berlin', {id: 2950159, link: 'https://www.dmi.dk/lokation/show/DE/2950159/Berlin'})
dmiIdMap.set('rom', {id: 3169070, link:'https://www.dmi.dk/lokation/show/IT/3169070/Rom'})
dmiIdMap.set('odense', {id: 2615876, link: 'https://www.dmi.dk/lokation/show/DK/2615876/Odense'})
dmiIdMap.set('nuuk', {id: 3421319, link: 'https://www.dmi.dk/lokation/show/GL/3421319/Nuuk'})
dmiIdMap.set('new delhi', {id: 1261481, link: 'https://www.dmi.dk/lokation/show/IN/1261481/New_Delhi'})
dmiIdMap.set('paris', {id: 2988507, link:'https://www.dmi.dk/NinJo2DmiDk/ninjo2dmidk?cmd=llj&id=2988507'})

async function getSearchCityDmi(city){
    try{
        //Hvis byen ikke er i mit map burde hele funktionen fejle, men den retunere undefined i stedet for at stoppe.
        const cityId = dmiIdMap.get(city.toLowerCase()).id
        
        //URL fra dmi hjemmeside hvor id er "stjålet"/taget og puttet i dmiIdMap
        const dmiUrlForCity = `https://www.dmi.dk/NinJo2DmiDk/ninjo2dmidk?cmd=llj&id=${cityId}`
        const response = await fetch(dmiUrlForCity)
        const data = await response.json()
        const returnUrl = dmiIdMap.get(city.toLowerCase()).link
        
        return {
            dmiOutput: getDmiOutput(data), 
            url: returnUrl
        }
    }
    catch(error){
        console.log("-----------Error in searchCityDmi-----------" + error.message)
    }
}

//Metode til at lave det DMI output data jeg viser i frontend
function getDmiOutput(data){
    try{
        const sunrise = data.sunrise
        const sunset = data.sunset

        const nextSixHours = []
        let rainData = null;

        //Finder vejret for de næste 24 timer
        for(let i = 0; i < 24; i++){
            //prec50 er median for hvor meget regn der vil falde.
            if(data.timeserie[i].prec50 === null){
             rainData = data.timeserie[i].precip1;
            } else{
                rainData = data.timeserie[i].prec50
            }

          nextSixHours.push({
            time: data.timeserie[i].localTimeIso.split("T")[1].split(":")[0],
             //parse for at kunne afrunde tallet, da jeg viser det i min frontpage graf
            temperature: parseFloat(data.timeserie[i].temp).toFixed(1),
            precipitationType: data.timeserie[i].precipType,
            rain: parseFloat(rainData).toFixed(1),
            windspeed: parseInt(data.timeserie[i].windSpeed),
            windGust: data.timeserie[i].windGust,
            humidity: data.timeserie[i].humidity
          })
        }

        return {
         sunrise: sunrise, 
         sunset: sunset,
         dmiNextSixHours: nextSixHours,
         daily: {
             date: data.aggData[0].localTimeIso.split("T")[0],
             maxTemp: data.aggData[0].maxTemp,
             minTemp: data.aggData[0].minTemp,
             avgTemp: data.aggData[0].meanTemp,
             totalRain: data.aggData[0].precipSum,
             maxUv: data.aggData[0].uvRadiation
          }
      }
    }
    catch(error){
        console.log("-----------Error in getDmiOutput-----------" + error.message)
    }
}

function getOpenWeatherOutput(data){
    const current = data.current

    //Meget grim måde at finde ud af hvilken time vi er ved. parseInt() bruges for at fjerne eventuelt 0 foran f.eks. 08 til 8
    let hourIndex = parseInt(current.time.split("T")[1].split(":")[0])

    const nextHours = []
    for (let i = 0; i < 6; i++) {
        nextHours.push({
            hour: hourIndex + i,
            temperature: data.hourly.temperature_2m[hourIndex + i],
            feelsLike: data.hourly.apparent_temperature[hourIndex+i],
            humidity: data.hourly.relative_humidity_2m[hourIndex + i],
            wind: data.hourly.wind_speed_10m[hourIndex + i],
            rain: data.hourly.rain[hourIndex + i],
            uv: data.hourly.uv_index[hourIndex + i]
        })
    }

    return {
        current: {
            time: current.time,
            temperature: current.temperature_2m,
            feelsLike: data.current.apparent_temperature,
            humidity: current.relative_humidity_2m,
            rain: current.rain,
            windSpeed: data.current.wind_speed_10m,
            windDirection: data.current.wind_direction_10m,
            windGusts: data.current.wind_gusts_10m
        },
        hourly: nextHours,
        daily: {
            sunrise: data.daily.sunrise[0].split("T")[1],
            sunset: data.daily.sunset[0].split("T")[1],
            tempMax: data.daily.temperature_2m_max[0],
            tempMin: data.daily.temperature_2m_min[0],
            feelsLikeMax: data.daily.apparent_temperature_max[0],
            feelsLikeMin: data.daily.apparent_temperature_min[0],
            rainSum: data.daily.rain_sum[0],
            uvMax: data.daily.uv_index_max[0]
        }
    }
}

//------------------Søge funktioner for open weather------------------
async function getsearchCityOpenWeather(city){
    try{
        //Henter info om city, såsom longitude og latitude. lige nu retuner den kun 1 by (count=1)
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`)
        const geoData = await response.json()

        const latitude = geoData.results[0].latitude 
        const longitude = geoData.results[0].longitude

        //Henter data/vejr for den by/placering med de specifikke koordinator
        const data = await getWeatherByLatAndLong(latitude, longitude)

        const returnUrl = data.Url
        const returnWeatherOutput = getOpenWeatherOutput(data.weatherData)

        return {OpenWeatherOutput: returnWeatherOutput, url: returnUrl}
    }
    catch(error){
        console.log("-----------Error in getCityLatAndLong-----------" + error.message)
    }
}

async function getWeatherByLatAndLong(latitude, longitude){
    try{
        const openWeatherUrlForCity = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunset,sunrise,uv_index_max,rain_sum&hourly=temperature_2m,relative_humidity_2m,rain,apparent_temperature,wind_speed_10m,uv_index&current=temperature_2m,relative_humidity_2m,apparent_temperature,rain,wind_speed_10m,wind_gusts_10m&timezone=Europe%2FBerlin&wind_speed_unit=ms`
        const response = await fetch(openWeatherUrlForCity)
        const weatherData = await response.json()
        return {weatherData: weatherData, Url: openWeatherUrlForCity}
    }
    catch(error) {
        console.log("-----------Error in getWeatherByLatAndLong-----------" + error.message);
    }
}

module.exports = {
    getSearchCityDmi,
    getsearchCityOpenWeather,
}
