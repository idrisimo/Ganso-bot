

const formatForText = (dataList) => {
    let text = []

    for (const data of dataList) {
        const string = `*Location*:
        ${data['location']}
        *Min | Avg | Max temp*: 
        ${data['mintemp_c']}°C | ${data['avgtemp_c']}°C | ${data['maxtemp_c']}°C
        *Chance of rain*: 
        ${data['daily_chance_of_rain']}% 
        *Change of snow*: 
        ${data['daily_chance_of_snow']}%

        `.split("\n").map(s=>s.trim()).join("\n")
        text.push(string)
    }
    return text
}

const getLocations = (descriptionString) => {
    const citiesList = descriptionString.split(",")
    return citiesList
}

module.exports = {formatForText, getLocations}
