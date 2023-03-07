const qrcode = require('qrcode-terminal');
const { Client, LocalAuth} = require('whatsapp-web.js');
const {CronJob} = require("cron")



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

client.on('ready', async () => {
    console.log('Client is ready!');

    const groupName = "Test group"
    const chats =  await client.getChats()
    const groups = chats.filter(chat => chat.isGroup && chat.name == groupName).map(chat => {
        return chat
    })
    console.log('Before job instantiation');
    const job = new CronJob('00 10 23 * * *', function() {
        client.sendMessage(groups[0].id._serialized, "test message")
        console.log("message sent at: ", Date().getTime())
    });
    console.log('After job instantiation');
    job.start();
});

client.initialize();


/* Main section of code */
client.on('message', async msg=>{
    // console.log('message: ', msg)
    if(msg.body === "!ping") {
        let chat = await msg.getChat();
        if(chat.isGroup && chat.name === "Test group") {
            // console.log("this is chat", chat)
            client.sendMessage(chat.id._serialized,"*🤖--BAMBOO BOT--🤖* says: pong")
        }
    }
}) 
