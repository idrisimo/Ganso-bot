
const fetchWeather = async (endpointName="Forcast", apiKey, location, days=2, alerts="yes") => {
    const baseUrl = "http://api.weatherapi.com/v1"

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
        return weatherData
    } else {
        return "endpoint currently unavailable"
    }
}


const formatWeather = (weatherData) => {

}
