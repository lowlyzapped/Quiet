exports.init = function(client) {

var Discord = require("discord.js");

exports.commands = [
    "avatar",
    "getavatar",
    "joined",
    "members",
    "memberlist"
]

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

} // no touchy
