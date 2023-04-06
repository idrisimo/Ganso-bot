const qrcode = require('qrcode-terminal');
const { Client, LocalAuth} = require('whatsapp-web.js');
const {CronJob, CronTime} = require("cron")
const {fetchWeather, cleanTomorrowForecast} = require('./weatherApiHandler');
const { formatForText, getDescription, stringTimeFormatter } = require('./handlers');
require('dotenv').config();

/* User settings */
// const timeTrigger = process.env.TIME_TRIGGER;
const groupName = process.env.WHATSAPP_GROUPNAME;
const apiKey = process.env.WEATHER_API_KEY;


/* Initialisation and authentication */
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true, args: ['--no-sandbox'] }
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

let job

client.on('ready', async () => {
    console.log('Client is ready!');
    // console.log(`evnvar: ${timeTrigger} | ${groupName}`)
    const chats =  await client.getChats()
    const groups = chats.filter(chat => chat.isGroup && chat.name == groupName).map(chat => {
        return chat
    })
    const descriptionData = getDescription(groups[0].description)
    const locations = descriptionData[1]
    const timeTrigger = descriptionData[0]
    console.log('Before job instantiation');
    job = new CronJob(`${timeTrigger} * * *`, () => {
    fetchWeather({apiKey:apiKey, locations:locations}).then(data => {
        const weatherText = formatForText(cleanTomorrowForecast(data)).join("")
        const textToSend = `*🦢🤖--Ganso-bot--🤖🦢*
        *"Tomorrows weather"*
        ${weatherText}`.split("\n").map(s=>s.trim()).join("\n")

        client.sendMessage(groups[0].id._serialized, textToSend)

        console.log("message sent at: ", Date())
    }).catch(err => console.log(err))
});
    console.log('After job instantiation');
    // job.start();
});

client.initialize();

/* Commands go here */
client.on('message_create', async msg=>{
    let chat = await msg.getChat();
    if(chat.isGroup && chat.name === groupName || chat.name === "Test group") {
        let message = ""

        let descriptionData = getDescription(chat.description)
        let timeTrigger = descriptionData[0]
        let locations = descriptionData[1]
        switch(msg.body) {
            case "!ping":
                message = "pong"
                break;
            case "!groupinfo":
                message = `*Name*: ${chat.name}
                *Description*: ${chat.description}
                *Created At*: ${chat.createdAt.toString()}
                *Created By*: ${chat.owner.user}
                *Participant count*: ${chat.participants.length}`.split("\n").map(s=>s.trim()).join("\n")
                break;
            case "!help":
                message = "Command List:\n-*!ping*--pong\n-*!groupinfo*--Provides information about group chat.\n*!astro*--Provides sunrise and sunset times for the following day.\n*!startsched*--Starts the bot's daily weather updates.\n*!refreshsched*--refreshes the timing and cities of the weather updates. Please note that group description needs to be changed and requires very specific formatting for bot to work properly.\n*!checksched*--Checks to see if weather update is running.\n*!stopsched*--Stops the weather updates."
                break;
            case "!astro":
                const getWeatherData = await fetchWeather({apiKey:apiKey, locations:locations})
                const astroData = await cleanTomorrowForecast(getWeatherData)[0]['astro']

                message = `*Sunrise*🌄: ${astroData['sunrise']}
                *Sunset*🌇: ${astroData['sunset']}`.split("\n").map(s=>s.trim()).join("\n")
                break;
            case "!refreshsched":
                descriptionData = getDescription(chat.description)
                job.setTime(new CronTime(`${timeTrigger} * * *`))
                message = `New timer set for ${stringTimeFormatter(timeTrigger)}, Clock has started`
                break;
            case "!startsched":
                console.log("schedule started")
                if(!job.running) {
                    job.start()
                    message = `Schedule timer set for ${stringTimeFormatter(timeTrigger)}, Clock has started`
                } else {
                    message = "Schedule timer already started"
                }
                break;
            case "!checksched":
                if(job.running) {
                    message = "Schedule is running"
                } else {
                    message = "Schedule is not running"
                }
                break;
            case "!stopsched":
                if(job.running) {
                    job.stop()
                    console.log("schedule stopped")
                    message = "Schedule stopped running"
                } else {
                    message = "Schedule was not running to begin with"
                }
            default: 
                message = ""
                break;
        }

        if( message !== "") {
            const messageToSend = `*🦢🤖--Ganso-bot--🤖🦢* says:\n ${message}`
            await client.sendMessage(chat.id._serialized, messageToSend)
        }
    }
}) 
