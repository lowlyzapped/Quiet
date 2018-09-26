exports.init = function(client) {

var Discord = require("discord.js");

exports.commands = [
    "poll",
    "epoll"
]

exports["poll"] = {
    usage: "Creates a yes/no poll.",
    needsAuth: true,
    process: function(message, args, config) {
        message.delete(0);

        var str = message.content.slice(config.prefix.length + 4).trim();
        var arg = str.split("|");
        var title = arg[0];
        var desc = arg[1];

        if (arg[1] == undefined) {
            message.reply("there are missing arguments. Please execute `"+ config.prefix +"poll <title> | <description>`.").then(m => m.delete(5000));
            return;
        }

        var embed = new Discord.RichEmbed()
            .setColor(config.embedColor)
            .setTitle(title)
            .setDescription(desc)
            .setTimestamp()

        message.channel.send({embed})
        .then(asunc function msg {
              await msg.react("👍");
              await msg.react("👎");
        }).catch(console.error);
    }
}

exports["epoll"] = {
    usage: "Creates a poll with 2 to 5 possible choices.",
    needsAuth: true,
    process: function(message, args, config) {
        message.delete(0);

        var str = message.content.slice(config.prefix.length + 5).trim();
        var arg = str.split("|");

        if (arg[1] == undefined || arg[2] == undefined || arg[3] == undefined) {
            message.reply("there are missing arguments. Please excute `"+ config.prefix +"epoll <title> | <description> | <choice 1> | <choice 2>`")
            .then(m => m.delete(5000))
            .catch(console.error);
            return;
        }

        var embed = new Discord.RichEmbed()
            .setColor(config.embedColor)
            .setTitle(arg[0])
            .setDescription(arg[1]+"\n\n"+
                            ":regional_indicator_a: "+arg[2]+"\n"+
                            ":regional_indicator_b: "+arg[3])
            .setTimestamp()

            if (arg[4] != undefined) embed.setDescription(arg[1]+"\n\n"+
                                                          ":regional_indicator_a: "+arg[2]+"\n"+
                                                          ":regional_indicator_b: "+arg[3]+"\n"+
                                                          ":regional_indicator_c: "+arg[4]);

            if (arg[5] != undefined) embed.setDescription(arg[1]+"\n\n"+
                                                          ":regional_indicator_a: "+arg[2]+"\n"+
                                                          ":regional_indicator_b: "+arg[3]+"\n"+
                                                          ":regional_indicator_c: "+arg[4]+"\n"+
                                                          ":regional_indicator_d: "+arg[5]);

            if (arg[6] != undefined) embed.setDescription(arg[1]+"\n\n"+
                                                          ":regional_indicator_a: "+arg[2]+"\n"+
                                                          ":regional_indicator_b: "+arg[3]+"\n"+
                                                          ":regional_indicator_c: "+arg[4]+"\n"+
                                                          ":regional_indicator_d: "+arg[5]+"\n"+
                                                          ":regional_indicator_e: "+arg[6]);

            message.channel.send({embed})
            .then(async function msg {
                msg.react("🇦");
                msg.react("🇧");
                if (arg[4] != undefined) await msg.react("🇨");
                if (arg[5] != undefined) await msg.react("🇩");
                if (arg[6] != undefined) await msg.react("🇪");
            }).catch(console.error);
    }
}

} // no touchy
