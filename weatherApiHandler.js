const fetch = require("node-fetch")
const { formatForText } = require("./handlers")

// https://www.weatherapi.com/

const fetchWeather = async ({endpointName="Forcast", apiKey, locations, days=2, alerts="yes"}) => {
    const baseUrl = "https://api.weatherapi.com/v1"
    const endpointOptions = {"Current weather":"/current.json", "Forcast":"/forecast.json", "Search or Autocomplete":"/search.json", "History":"/history.json", "Future":"/future.json", "Time Zone":"/timezone.json", "Sports":"/sports.json", "Astronomy":"	/astronomy.json ","IP Lookup":"/ip.json"}

    /*Notes on Parameters*/
    // The Days param needs to be set to 2 if you are wanting tomorrows data. Can only be used for the forcast endpoint

    /* Fetch happens here*/
    const selectedEndPoint = endpointOptions[endpointName]

    if(selectedEndPoint === endpointOptions["Forcast"]) {
        let weatherData = []
        for (const location of locations) {
            const constructedUrl = `${baseUrl}${selectedEndPoint}?key=${apiKey}&q=${location}&days=${days}&alerts=${alerts}` // Eventually this will need to be moved to before the if statement to save on repitition

            let response = await fetch(constructedUrl)
            if(!response.ok) {
                const message = `An error has occured: ${response.status}`
                throw new Error(message)
            }
            weatherData.push(await response.json())
        }
        return weatherData
    } else {
        console.log(`endpoint currently unavailable. Selected endpoint: ${selectedEndPoint}`)
        return `endpoint currently unavailable. Selected endpoint: ${selectedEndPoint}`
    }
}


const cleanTomorrowForecast = (weatherDataList) => {
    let cleanedDataList = []
    
    for (const weatherData of weatherDataList) {
        const forecastData = weatherData['forecast']['forecastday'][1]['day']
        const astro = weatherData['forecast']['forecastday'][1]['astro']
        const cleanedData = (({maxtemp_c, mintemp_c, avgtemp_c, daily_chance_of_rain,daily_chance_of_snow, condition}) => ({maxtemp_c, mintemp_c, avgtemp_c, daily_chance_of_rain, daily_chance_of_snow, condition}))(forecastData) // So Object destructuring is cool!
        cleanedData['location'] = weatherData['location']['name']
        cleanedData['astro'] = {'sunrise': astro['sunrise'], 'sunset': astro['sunset']}
        
        if(cleanedData['condition']['text'] === null) {
            cleanedData['condition']['text'] = "Nothing to report."
        }
        // console.log(cleanedData["condition"])
        cleanedDataList.push(cleanedData)
    }
    return cleanedDataList
}

module.exports = {fetchWeather, cleanTomorrowForecast}
