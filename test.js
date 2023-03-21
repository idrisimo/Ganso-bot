const {fetchWeather, cleanTomorrowForecast} = require('./weatherApiHandler');
const { formatForText, getLocations } = require('./handlers');
require('dotenv').config();


const apiKey = process.env.WEATHER_API_KEY;
const locations = ["Luton"]

fetchWeather({apiKey:apiKey, locations:locations}).then(data => {
    const weatherText = formatForText(cleanTomorrowForecast(data)).join("")
    console.log(data[0]['forecast']['forecastday'][1]['astro'])
    console.log("weather text: ",weatherText)

}).catch(err => console.log(err))
