const qrcode = require('qrcode-terminal');
const { Client, LocalAuth} = require('whatsapp-web.js');
const {CronJob} = require("cron")
const {fetchWeather, cleanTomorrowForecast} = require('./weatherApiHandler');
const { formatForText, getLocations } = require('./handlers');
require('dotenv').config();

/* User settings */
const timeTrigger = process.env.TIME_TRIGGER;
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

client.on('ready', async () => {
    console.log('Client is ready!');
    console.log(`evnvar: ${timeTrigger} | ${groupName}`)
    const chats =  await client.getChats()
    const groups = chats.filter(chat => chat.isGroup && chat.name == groupName).map(chat => {
        return chat
    })
    console.log('Before job instantiation');
    const job = new CronJob(`${timeTrigger} * * *`, function() {
        const locations = getLocations(groups[0].description)
        fetchWeather({apiKey:apiKey, locations:locations}).then(data => {
            const weatherText = formatForText(cleanTomorrowForecast(data)).join("")
            const textToSend = `*🦢🤖--Ganso-bot--🤖🦢*
            "Tomorrows weather"
            ${weatherText}`.split("\n").map(s=>s.trim()).join("\n")

            client.sendMessage(groups[0].id._serialized, textToSend)

            console.log("message sent at: ", Date())
        }).catch(err => console.log(err))
    });
    console.log('After job instantiation');
    job.start();
});

client.initialize();

/* Commands go here */
client.on('message_create', async msg=>{
    let chat = await msg.getChat();
    if(chat.isGroup && chat.name === groupName) {
        let message = ""
        switch(msg.body){
            case "!ping":
                message = "pong"
                break;
            case "!groupinfo":
                message = `Name: ${chat.name}
                Description: ${chat.description}
                Created At: ${chat.createdAt.toString()}
                Created By: ${chat.owner.user}
                Participant count: ${chat.participants.length}`.split("\n").map(s=>s.trim()).join("\n")
                break;
            case "!help":
                message = "Command List:\n-*!ping*--pong\n-*!groupinfo*--Provides information about group chat."
                break;
            default: 
                message = ""
                break;
        }

        if( message !== "") {
            const messageToSend = `*🦢🤖--Ganso-bot--🤖🦢* says: ${message}`
            client.sendMessage(chat.id._serialized, messageToSend)
        }
    }
}) 
