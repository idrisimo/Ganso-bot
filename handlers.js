
const formatForText = (dataList) => {
    let text = []

    for (const data of dataList) {
        const string = `*Location*:
        ${data['location']}
        *Min | Avg | Max temp*: 
        ${data['mintemp_c']}°C | ${data['avgtemp_c']}°C | ${data['maxtemp_c']}°C
        *Chance of rain*: 
        ${data['daily_chance_of_rain']}% 
        *Chance of snow*: 
        ${data['daily_chance_of_snow']}%
        
        `.split("\n").map(s=>s.trim()).join("\n")
        text.push(string)
    }
    return text
}

const getDescription = (descriptionString) => {
    const descriptionList = descriptionString.split(",")
    const timeTrigger = descriptionList.shift()
    const citiesList = descriptionList
    return [timeTrigger, citiesList]
}

const stringTimeFormatter = (timeTrigger) => {
    let timeList = timeTrigger.split(" ")
    timeList.push(timeList.shift())
    return timeList.join(":")
}

module.exports = {formatForText, getDescription, stringTimeFormatter}
