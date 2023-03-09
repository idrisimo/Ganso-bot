const fetch = require("node-fetch")


const fetchWeather = async ({endpointName="Forcast", apiKey, location, days=2, alerts="yes"}) => {
    const baseUrl = "https://api.weatherapi.com/v1"
    const endpointOptions = {"Current weather":"/current.json", "Forcast":"/forecast.json", "Search or Autocomplete":"/search.json", "History":"/history.json", "Future":"/future.json", "Time Zone":"/timezone.json", "Sports":"/sports.json", "Astronomy":"	/astronomy.json ","IP Lookup":"/ip.json"}

    /*Notes on Parameters*/
    // The Days param needs to be set to 2 if you are wanting tomorrows data. Can only be used for the forcast endpoint


    /* Fetch happens here*/
    const selectedEndPoint = endpointOptions[endpointName]

    if(selectedEndPoint === endpointOptions["Forcast"]) {

        const constructedUrl = `${baseUrl}${selectedEndPoint}?key=${apiKey}&q=${location}&days=${days}&alerts=${alerts}` // Eventually this will need to be moved to before the if statement to save on repitition

        const response = await fetch(constructedUrl)
        if(!response.ok) {
            const message = `An error has occured: ${response.status}`
            throw new Error(message)
        }
        const weatherData = await response.json()
        // console.log(weatherData)
        return weatherData
    } else {
        return `endpoint currently unavailable. Selected endpoint: ${selectedEndPoint}`
    }
}


const cleanTomorrowForcast = (weatherData) => {
    const tomorrowData = weatherData['forecast']['forecastday'][1]['day']
    const cleanedData = (({maxtemp_c, mintemp_c, avgtemp_c, daily_will_it_rain,daily_chance_of_snow, condition}) => ({maxtemp_c, mintemp_c, avgtemp_c, daily_will_it_rain,daily_chance_of_snow, condition}))(tomorrowData) // So Object destructuring is cool!
    return cleanedData
}

const weather = fetchWeather({apiKey:"", location:"Luton"}).then(data => cleanTomorrowForcast(data))

// console.log(weather)
