const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();

const files = fs.readdirSync(`${__dirname}/img/`).map(path => new Discord.Attachment(`${__dirname}/img/${path}`, path));

client.on('ready', () => {
    console.log(`Logueado como ${client.user.tag}!`);
    client.user.setActivity("!jojo")
});

client.on('message', msg => {
    if (msg.author.bot)
        return;
    
    const lower = msg.content.toLocaleLowerCase();
    if (!lower.startsWith("!jojo")) 
        return;
    
    if (lower === "!jojo help") 
        return msg.reply(
            "SpeedwaBot por <@198493822781620224>\n" +
            "Escribe **!jojo** para recibir la imagen de un jojo aleatorio (seasons 1-8).\n" +
            "También incluye a Gyro Zeppeli y algún *easter egg*."
        );
    
    const file = files[Math.floor(Math.random() * files.length)];
    msg.reply(getName(file.name), file);
});

client.login(process.env.BOT_TOKEN);

const getName = (path) => {
    switch (path.replace(/\d*(\.png)?(\.jpg)?/g, "")) {
        case "jonathan":
            return "Jonathan Joestar";
        case "joseph":
            return "Joseph Joestar";
        case "jotaro":
            return "Jotaro Kujo";
        case "josuke":
            return "Josuke Higashikata";
        case "giorno":
            return "Giorno Giovana";
        case "jolyne":
            return "Jolyne Kujo";
        case "gyro":
            return "Gyro Zeppeli";
        case "johnny":
            return "Johnny Joestar";
        case "gappy":
            return "Gappy Higashikata";
        case "dio":
            return "Esperabas un Jojo, pero era yo, Dio!";
        case "speedwagon":
            return "Yo no estaba hecho para este tipo de trabajos";
        default:
            return "";
    }
}