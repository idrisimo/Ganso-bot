

const makeTable = (dataList) => {
    let tables = []
    for (const data of dataList) {
        const table = `
        =======${data['location']}=======\n
        | Max temp | Avg temp | Min temp |
        =================================
        | ${data['maxtemp_c']} | ${data['avgtemp_c']} | ${data['mintemp_c']} | 
        `
    }
}

const formatForText = (dataList) => {
    // console.log(dataList)
    let text = []
    for (const data of dataList) {
        const string = `=====${data['location']}=====
        *Min/Avg/Max temp*: ${data['mintemp_c']}°C/${data['avgtemp_c']}°C/${data['maxtemp_c']}°C
        *Chance of rain*: ${data['daily_chance_of_rain']}% 
        *Change of snow*: ${data['daily_chance_of_snow']}% 
        *Description*: ${data['condition']['text']}`.split("\n").map(s=>s.trim()).join("\n")
        // console.log(string)
        text.push(string)
    }
    console.log(text[0])
    return text
}

module.exports = {formatForText}
