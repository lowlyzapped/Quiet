const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
var https = require('https');
var http = require('http');

if (config.token == '' || config.prefix == '') {
    console.log('Please fill in config.json');
    process.exit(1);
}

client.on('ready', () => {
           console.log(`Quiet online.`);
           client.user.setStatus('online'); //online, idle, dnd, invisible
           client.user.setPresence({game:{name:config.prefix+"help", type:0}});
         });

client.on('error', (e) => console.error(e));

client.on('guildMemberAdd', member => { // when a member joins the server
           var channel = member.guild.channels.find('name', config.memberlog); //searches for a channel named #member-log
           if (!channel) return;  // if channel not found, abort
           var embed = new Discord.RichEmbed()
             .setColor(0x18bb68)
             .setAuthor(client.user.username, client.user.avatarURL)
             .setDescription(""+member+" joined the server.")
             .setTimestamp()
           channel.send({embed}); // fancy message
          });

client.on('guildMemberRemove', member => {
           var channel = member.guild.channels.find('name', config.memberlog);
           if (!channel) return;
           var embed = new Discord.RichEmbed()
             .setColor(0xe9890f)
             .setAuthor(client.user.username, client.user.avatarURL)
             .setDescription("**"+member.user.username+"#"+member.user.discriminator+"** left the server.")
             .setTimestamp()
           channel.send({embed});
         });

client.on('message', message => {  // message function

if (message.channel.type === 'dm' && message.content.startsWith(config.prefix) && message.author.id !== config.ownerID) { //if a message sent in DM starts with $
    message.author.send("**ACCESS DENIED**\nCan't perform commands in DM."); //denies everything
    return;
}

if (message.author.bot) { //auto-deletion for maximum cleaning
    if (message.content.includes("help has been sent.")) message.delete(5000);
    if (message.content.includes("the rules have been sent.")) message.delete(5000);
    if (message.content.includes("an error has occured. Please execute")) message.delete(5000);
    if (message.content.includes("you are missing an argument")) message.delete(5000);
    return; // ignores bots
}

if (!message.content.startsWith(config.prefix)) return; // if message doesn't start with $ abort
const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
const command = args.shift().toLowerCase(); //fancy magic

if (command === 'ping') { // gets reply time
    message.delete();
    message.channel.send("Latency of **"+Math.round(client.ping)+"** ms.");
}

if (message.author.id === config.ownerID) {
    if (command === '!stop') { // STOP THE BOT
        console.log("Quiet has been deactivated.");
        process.exit(0);
    }
}

});

client.login(config.token); //login
