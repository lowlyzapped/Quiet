exports.init = function(client, config) {

var Discord = require("discord.js"),
    fs = require('fs'),
    path = require('path');

var rulesFile = "rules.md";
var rulesPath = path.join(__dirname, rulesFile);

var welcomeFile = "welcome.md";
var welcomePath = path.join(__dirname, welcomeFile);

var configFile = "config.json";
var configContent = null;
var configPath = path.join(__dirname + '../../..', configFile); // Only for the memberAddEvent

exports.commands = [
    "avatar",
    "getavatar",
    "joined",
    "members",
    "memberlist",
    "rules"
]

if (!fs.existsSync(rulesPath)) console.error("\""+ rulesFile +"\" does not exist. No rules will be sent to new members.");

if (!fs.existsSync(welcomePath)) console.error("\""+ welcomeFile +"\" does not exist. No greetings will be sent to new members.");

if (fs.existsSync(configPath)) {
    fs.readFile(configPath, 'utf8', (error, data) => {
        try {
            configContent = JSON.parse(data);
        } catch (error) {
            console.error("Unable to parse \""+ configFile +"\".");
        }
    });
} else {
    console.error("\""+ configFile +"\" does not exist.");
}

client.on('guildMemberAdd', (member) => {
    var config = configContent;
    memberAddEvent(member, config);
});

client.on('guildMemberRemove', (member) => {
    var config = configContent;
    memberRemoveEvent(member, config);
});

exports["avatar"] = {
    usage: "Sends the user his own avatar.",
    needsAuth: false,
    process: function(message, args, config) {
        message.delete(5000);

        var embed = new Discord.RichEmbed()
            .setColor(config.embedColor)
            .setTitle(message.author.username)
            .setDescription("[Direct Link]("+ message.author.avatarURL +")")
            .setImage(message.author.avatarURL)
            .setFooter("Powered by "+ client.user.username +"™")

        message.channel.send({embed}).catch(console.error);
    }
}

exports["getavatar"] = {
    usage: "Sends the targeted user's avatar.",
    needsAuth: true,
    process: function(message, args, config) {
        message.delete(0);
        var member = message.mentions.members.first();

        if (message.mentions.members.first() == null) {
            message.reply("no user was mentionned.").then(m => m.delete(5000));
            return;
        }

        var embed = new Discord.RichEmbed()
            .setColor(config.embedColor)
            .setTitle(member.user.username +"'s avatar!")
            .setDescription("[Direct Link]("+ member.user.avatarURL +")")
            .setImage(member.user.avatarURL)
            .setFooter("Powered by "+ client.user.username +"™")

        message.channel.send({embed}).catch(console.error);
    }
}

exports["joined"] = {
    usage: "Sends for how long the user has been on the server.",
    needsAuth: false,
    process: function(message) {
        message.delete(0);

        var member = message.channel.guild.fetchMember(message.author)
            .then(member => {
                var date = member.joinedAt;

                var year = date.getUTCFullYear();
                var month = date.getUTCMonth() + 1;
                var day = date.getUTCDate();
                var hours = date.getUTCHours();
                var mins = date.getUTCMinutes();

                var end = "**" + day.toString() + "/" + month.toString() + "/" + year.toString() + "** at " + hours.toString() + ":";

                if (mins.toString().length == 1) end += "0";

                end += mins.toString() + " (UTC)"

                message.reply("you joined on " + end)
            }).catch(console.error);
    }
}

exports["members"] = {
    usage: "Sends the number of members on the server.",
    needsAuth: true,
    process: function(message) {
        message.delete(0);

        message.channel.send("There are currently **"+ message.guild.memberCount +"** members on this server.").catch(console.error);
    }
}

exports["memberlist"] = {
    usage: "Sends a list of members on the server with set roles.",
    needsAuth: true,
    process: function(message, config) {
        message.delete(0);

        var modRole = message.guild.roles.find("name", "Mod"); // to be extended
        var youtuberRole = message.guild.roles.find("name", "YouTuber");
        var streamerRole = message.guild.roles.find("name", "Streamer");

        message.channel.send("There are currently **"+ message.guild.memberCount +"** members on this server:\n"+
                              "**Moderators**: "+ modRole.members.keyArray().length +"\n"+
                              "**YouTubers**: "+ youtuberRole.members.keyArray().length +"\n"+
                              "**Streamers**: "+ streamerRole.members.keyArray().length).catch(console.error);
    }
}

exports["rules"] = {
    usage: "Sends the user the rules of the server.",
    needsAuth: false,
    process: function(message, args, config) {
        message.delete(5000);

        if (config.permissions.sendRules == true) {
            if (fs.existsSync(rulesPath)) {
                fs.readFile(rulesPath, 'utf8', (err, rulesContent) => {
                    if (err) return console.log(err);

                    var embed = new Discord.RichEmbed()
                        .setColor(config.embedColor)
                        .setAuthor(message.guild.name +" Rules", message.guild.iconURL)
                        .setDescription(rulesContent)
                        .setFooter("Powered by "+ client.user.username +"™")

                    message.author.send({embed}).catch(console.error);
                    message.reply("rules have been sent.").then(m => m.delete(5000));
                });
            }
        } else message.reply("the `"+ config.prefix +"rules` command is disabled.").then(m => m.delete(5000));

    }
}


function memberAddEvent(member, config) {
    var logChannel = member.guild.channels.find("name", config.logChannelName);
    if (!logChannel) return;

    var embed = new Discord.RichEmbed()
        .setColor(config.joinColor)
        .setAuthor("Member Joined", member.user.avatarURL)
        .setDescription(member.user +" | "+ member.user.tag)
        .setFooter("Member no. "+ member.guild.memberCount)
        .setTimestamp()

    logChannel.send({embed}).catch(console.error);

    if (config.permissions.sendWelcome == true) {
        if (fs.existsSync(welcomePath)) {
            fs.readFile(welcomePath, 'utf8', (err, welcomeContent) => {
                if (err) return console.log(err);

                member.send("Hello "+ member.user.username +"! "+ welcomeContent);
            });
        }
    }

    if (config.permissions.sendRules == true) {
        if (fs.existsSync(rulesPath)) {
            fs.readFile(rulesPath, 'utf8', (err, rulesContent) => {
                if (err) return console.log(err);

                var embed = new Discord.RichEmbed()
                    .setColor(config.embedColor)
                    .setAuthor(member.guild.name +" Rules", member.guild.iconURL)
                    .setDescription(rulesContent)
                    .setFooter("Powered by "+ client.user.username +"™")

                member.send({embed}).catch(console.error);
            });
        }
    }
}

function memberRemoveEvent(member, config) {
    var logChannel = member.guild.channels.find("name", config.logChannelName);
    if (!logChannel) return;

    var embed = new Discord.RichEmbed()
        .setColor(config.leaveColor)
        .setAuthor("Member Left", member.user.avatarURL)
        .setDescription(member.user +" | "+ member.user.tag)
        .setTimestamp()

    logChannel.send({embed}).catch(console.error);
}

} // no touchy
