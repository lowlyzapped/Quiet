const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();

var config = require('./config.json');
var rulesTextPath = "./texts/rules.md";
var rulesText;
// var welcomeTextPath = "./texts/welcome.md";
// var welcomeText;
var https = require('https');
var http = require('http');

if (config.token == '' || config.prefix == '') {
    console.log('Please fill in config.json');
    process.exit(1);
}

// if (!fs.existsSync(welcomeTextPath)) {
//     console.log("The file " + welcomeTextPath + " does not exist. This may cause errors.")
// }
// else {
//     fs.readFile(welcomeTextPath, 'utf8', (err, data) => {
//         if (err) {
//             console.log(err);
//             return;
//         }
//         welcomeText = welcomeData;
//     });
// }

if (!fs.existsSync(rulesTextPath)) {
    console.log("The file " + rulesTextPath + " does not exist. This may cause errors.")
}

client.on('ready', () => {
           console.log(`Quiet online.`);
           client.user.setStatus('online'); //online, idle, dnd, invisible
           client.user.setPresence({game:{name:config.prefix+"help", type:0}});
         });

client.on('error', (err) => console.error(err));

client.on('guildMemberAdd', member => { // when a member joins the server
           var channel = member.guild.channels.find('name', config.logChannel); //searches for a channel named #member-log
           if (!channel) return;  // if channel not found, abort

           var embed = new Discord.RichEmbed()
             .setColor(0x18bb68)
             .setAuthor(client.user.username, client.user.avatarURL)
             .setDescription(""+member+" joined the server.")
             .setTimestamp()
           channel.send({embed}); // fancy message
          });

client.on('guildMemberRemove', member => {
           var channel = member.guild.channels.find('name', config.logChannel);
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
    message.delete(0);
    if (message.author.id !== config.ownerID) return;
    message.channel.send("Latency of **"+Math.round(client.ping)+"** ms.");
}

if (command === 'help') { //$help
    message.delete(5000); // deletes the user's message after ~5 milliseconds
    message.reply("help has been sent.");

    var $ = config.prefix;
    var embed = new Discord.RichEmbed()
      .setColor(config.embedColor)
      .setTitle(client.user.username)
      .setDescription("A complete list of the available commands.")
      .setThumbnail(client.user.avatarURL)
      .addField("Basic Commands:", // Max 25 fields
                "`"+$+"help` - Sends the user a list of the available commands.\n"+
                "`"+$+"rules` - Sends the user the rules of the server.\n"+
                "`"+$+"avatar` - Sends the user his own avatar.\n"+
                "`"+$+"coin` - Flips a coin.\n"+
                "`"+$+"joined` - Displays for how long the user has been on the server.\n"+
                "`"+$+"roll <n> <f>` - Roll n f-sided dice, sums the result.\n",
                true)
      .addField("Admin Commands:",
                "`"+$+"ban <@mention>` - Bans the targeted user from the server.\n"+
                "`"+$+"kick <@mention>` - Kicks the targeted user from the server.\n"+
                "`"+$+"members` - Sends the number of members on the server.\n"+
                "`"+$+"memberlist` - Sends a list of members on the server with set roles.\n"+
                "`"+$+"ping` - Checks the bot's latency.\n"+
                "`"+$+"poll <string>` - Create a yes/no poll.\n"+
                "`"+$+"purge <value>` - Deletes a number of messages. (Max 100)\n"+
                "`"+$+"say` - Talk as the bot.\n"+
                "`"+$+"uptime` - Sends how long the bot has been online",
                true)
      .addField("Poll Commands:",
                "`"+$+"poll <title> | <description>` - Creates a yes/no poll.\n"+
                "`"+$+"epoll <title> | <description> | <choice 1> | <choice 2>` - Creates a poll with 2 to 5 possible choices.",
                 true)
      .addField("Bot Cosmetic Commands:",
                "`"+$+"setgame [keyword]` - Changes the game the bot is playing.\n"+
                "`"+$+"setnickname [keyword]` - Sets the bot's nickname.\n"+
                "`"+$+"setstatus [keyword]` - Changes the bot's status.\n"+
                "`"+$+"reset` - Resets bot's game, status and nickname.",
                 true)
      .setFooter("For additional help, contact TheV0rtex#4553")
      // .setTimestamp() // By default today's date.
    message.author.send({embed});
}

if (command === "rules" || command === "rule") {
    fs.readFile(rulesTextPath, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }

    var embed = new Discord.RichEmbed()
        .setColor(config.embedColor)
        .setAuthor(client.user.username, client.user.avatarURL)
        .setTitle("Rules")
        .setDescription(data)
        .setFooter(new Date())

    message.reply('rules have been sent.')
        .then(m => m.delete(5000))
        .catch(console.log());

    message.author.send({embed})
        .catch(console.log());
    });
}

if (command === 'uptime') {
    message.delete(0);
    if (message.author.id !== config.ownerID) return;

    var date = new Date(new Date() - client.readyAt);
    var embed = new Discord.RichEmbed()
        .setColor(config.embedColor)
        .setTitle("Uptime")
        .setDescription(`I have been online for ${Math.floor(date.getTime() / 86400000)} days, ${date.getHours()} hours and ${date.getMinutes()} minutes.`)
        .setFooter(new Date());

    message.channel.send({embed})
        .catch(console.log());
}






if (message.author.id === config.ownerID) {
    if (command === '!stop') { // STOP THE BOT
        console.log("Quiet has been deactivated.");
        process.exit(0);
    }
}

});

client.login(config.token); //login
