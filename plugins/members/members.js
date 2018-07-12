exports.init = function(client) {

var Discord = require("discord.js");

exports.commands = [
    "avatar",
    "members"
]

exports["avatar"] = {
    usage: "Sends the user his own avatar.",
    needsAuth: false,
    process: function(message, config) {
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

exports["members"] = {
    usage: "Sends the number of members on the server.",
    needsAuth: true,
    process: function(message) {
        message.delete(0);

        message.channel.send("There are currently **"+ message.guild.memberCount +"** members on this server.").catch(console.error);
    }
}

}
