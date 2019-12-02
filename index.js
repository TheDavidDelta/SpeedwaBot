const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const i18n = require('./i18n.json');
const files = fs.readdirSync(`${__dirname}/img/`).map(path => new Discord.Attachment(`${__dirname}/img/${path}`, path));

const url = process.env.MONGODB_URI;
const conOptions = { useUnifiedTopology: true, useNewUrlParser: true };

// TODO: top-level await still not working
let languages = [];
MongoClient.connect(url, conOptions).then(client => 
    client.db().collection("language").find().toArray()
        .then(res => languages = res)
        .catch(err => console.error("ERROR: ", err))
        .finally(client.close())
).catch(err => console.error("ERROR: ", err));

client.on('ready', () => {
    client.user.setActivity("!jojo");
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('guildCreate', guild => {
    // TODO: optional chaining still not implemented
    const objLang = languages.find(e => e._id === +guild.id);
    const lang = objLang ? objLang.lang : "en";

    guild.channels.find(ch => ch.type === "text").send(i18n[lang].help);
});

client.on('message', msg => {
    if (msg.author.bot)
        return;
    
    const lower = msg.content.toLocaleLowerCase();
    if (!lower.startsWith("!jojo")) 
        return;
    
    const id = msg.guild ? +msg.guild.id : +msg.author.id;

    // TODO: optional chaining still not implemented
    const objLang = languages.find(e => e._id === id);
    const lang = objLang ? objLang.lang : "en";

    if (lower === "!jojo help") 
        return msg.reply(i18n[lang].help);
    
    if (lower.startsWith("!jojo lang")) {
        const newLang = lower.slice(11);
        if (!i18n.hasOwnProperty(newLang))
            return msg.reply(i18n[lang].langerror);
        
        MongoClient.connect(url, conOptions).then(client => 
            client.db().collection("language").updateOne({ _id: id }, {$set: { lang: newLang }}, { upsert: true })
                .catch(err => console.error("ERROR: ", err))
                .finally(client.close())
        ).catch(err => console.error("ERROR: ", err));

        objLang ? objLang.lang = newLang : languages.push({ _id: +id, lang: newLang });
        
        return msg.reply(i18n[newLang].langsuccess);
    }

    const file = files[Math.floor(Math.random() * files.length)];

    // remove numbers (if present) and file extension
    const name = file.name.replace(/\d*\.(png|jpg)/, "");
    const replyText = i18n[lang][name] || i18n["en"][name];

    msg.reply(replyText, file);
});

client.login(process.env.BOT_TOKEN);