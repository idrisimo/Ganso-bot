const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, Buttons, List } = require('whatsapp-web.js');
const { lfgxup, waitFor } = require('./handlers');
// require('dotenv').config();



/* User settings */

const timer = parseInt(process.env.TIMER) //In seconds
const groupName = process.env.WHATSAPP_GROUPNAME;


/* Initialisation and authentication */
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
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

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();


/* Main section of code */
client.on('message', async msg=>{
    console.log('message: ', msg)
    if(msg.body === "!ping") {
        let chat = await msg.getChat();
        if(chat.isGroup && chat.name === "Test group") {
            console.log("this is chat", chat)
            client.sendMessage(chat.id._serialized,"*🤖--BAMBOO BOT--🤖* says: pong")
        }
    }
}) 

