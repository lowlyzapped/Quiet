exports.init = function(client) {

var Discord = require("discord.js");

exports.commands = [
    "servericon",
    "serverinfo"
]

exports["servericon"] = {
    usage: "Sends the server's icon.",
    needsAuth: false,
    process: function(message, args, config) {
        message.delete(5000);

        var embed = new Discord.RichEmbed()
            .setColor(config.embedColor)
            .setTitle(message.guild.name +"'s icon!")
            .setDescription("[Direct Link]("+ message.guild.iconURL +")")
            .setImage(message.guild.iconURL)
            .setFooter("Powered by "+ client.user.username +"™")

        message.channel.send({embed}).catch(console.error);
    }
}

exports["serverinfo"] = {
    usage: "Sends information about the server.",
    needsAuth: true,
    process: function(message, args, config) {
        message.delete(0);

        var guild = message.channel.guild;
        var embed = new Discord.RichEmbed()
            .setColor(config.embedColor)
            .setAuthor(guild.name)
            .setThumbnail(guild.iconURL)
            .addField("Created:", getDate(guild.createdAt))
            .addField("Owner:", guild.owner.user.tag)
            .addField("Region:", guild.region)
            .addField("Verification Level:", getVerification(guild))
            .addField("Member Count:", guild.memberCount)
            .addField("Channels:", getChannels(guild))
            .setFooter("Powered by "+ client.user.username +"™")

        message.channel.send({embed}).catch(console.error);

        function getDate(date) {
            var mins = date.getUTCMinutes();
            if (mins.toString().length == 1) mins = "0" + mins;

            var str = "";
            str += date.getUTCDate() + "/";
            str += (date.getUTCMonth() + 1) + "/";
            str += date.getUTCFullYear() + " at ";
            str += date.getUTCHours() + ":";
            str += mins + " (UTC)";
            return str;
        }

        function getVerification(guild) {
            var verificationLevel = "";
            switch (guild.verificationLevel) {
                case 0: {
                    verificationLevel = "None: Unrestricted."
                    break;
                }
                case 1: {
                    verificationLevel = "Low: Users must have a verified email on their Discord account."
                    break;
                }
                case 2: {
                    verificationLevel = "Medium: Users must have a verified email on their Discord account and be registered on Discord for longer than 5 minutes."
                    break;
                }
                case 3: {
                    verificationLevel = "High: Users must have a verified email on their Discord account and be registered on Discord for longer than 5 minutes. Users must also be a member of the server for longer than 10 minutes."
                    break;
                }
                case 4: {
                    verificationLevel = "Extreme: Users must have a verified phone on their Discord account."
                    break;
                }
            }
            return verificationLevel;
        }

        function getChannels(guild) {
            var channels = guild.channels.array();
            var text = 0;
            var voice = 0;

            for (var x = 0; x < channels.length; x++) {
                if (channels[x].type == "text") {
                    text++
                }
                else voice++;
            }

            return ""+ text +" text channels and "+ voice +" voice channels";
        }
    }
}

} // no touchy
