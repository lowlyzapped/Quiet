exports.init = function(client) {

var Discord = require("discord.js");

exports.commands = [
    "kick",
    "ban",
    "purge",
    "mute",
    "unmute",
    "poll",
    "epoll",
    "say"
]

exports["kick"] = {
    usage: "Kicks the targeted user form the server.",
    needsAuth: true,
    process: function(message, args, config) {
        message.delete(0);

        var target = message.mentions.members.first();
        var authorised = message.member.roles.some(r => config.authorisedRoles.includes(r.name));

        if (target == null) {
            message.reply("no user was mentionned.").then(m => m.delete(5000));
            return;
        }

        if (!authorised || target.id === config.ownerID || target.id === client.user.id) {
            message.reply("I am not allowed to kick this user.").then(m => m.delete(5000));
            return;
        }

        target.kick().then((target) => {
            message.channel.send(target +" has been kicked.").then(m => m.delete(5000));

            var logChannel = message.guild.channels.find("name", config.logChannel);
            if (!logChannel) return;

            logChannel.bulkDelete(1, false).then(() => {
                var embed = new Discord.RichEmbed()
                    .setColor(config.kickColor)
                    .setAuthor("Member Kicked", target.user.avatarURL)
                    .setDescription(target.user +" | "+ target.user.tag +
                                    "\nKicked by "+ message.author)
                    .setTimestamp()

                logChannel.send({embed}).catch(console.error);
            });
        });
    }
}

exports["ban"] = {
    usage: "Bans the targeted user from the server.",
    needsAuth: true,
    process: function(message, args, config) {
        message.delete(0);

        var target = message.mentions.members.first();
        var authorised = message.member.roles.some(r => config.authorisedRoles.includes(r.name));

        if (target == null) {
            message.reply("no user was mentionned.").then(m => m.delete(5000));
            return;
        }

        if (!authorised || target.id === config.ownerID || target.id === client.user.id) {
            message.reply("I am not allowed to kick this user.").then(m => m.delete(5000));
            return;
        }

        target.ban(1).then((target) => {
          message.channel.send(target +" has been banned.").then(m => m.delete(5000));

          var logChannel = message.guild.channels.find("name", config.logChannel);
          if (!logChannel) return;

          logChannel.bulkDelete(1, false).then(() => {
              var target = message.mentions.members.first();

              var embed = new Discord.RichEmbed()
                  .setColor(config.banColor)
                  .setAuthor("Member Banned", target.user.avatarURL)
                  .setDescription(target.user +" | "+ target.user.tag +
                                  "\nBanned by "+ message.author)
                  .setTimestamp()

              logChannel.send({embed}).catch(console.error);
            });
        });
    }
}

exports["purge"] = {
    usage: "Deletes <n> number of messages. (Max. 100)",
    needsAuth: true,
    process: function(message, args, config) {
        message.channel.fetchMessages({limit: 100})
        .then(messages => {
            var messageCount = parseInt(args[0]);
            var msgArray = messages.array();

            msgArray.length = messageCount + 1;
            msgArray.map(m => m.delete().catch(console.error));

            return;
        });
    }
}

exports["mute"] = {
    usage: "Mutes the targeted user.",
    needsAuth: true,
    process: function(message, args, config) {
          message.delete(0);

          var target = message.mentions.members.first();
          var authorised = message.member.roles.some(r => config.authorisedRoles.includes(r.name));
          var role = message.guild.roles.find("name", config.muteRole);

          if (role == undefined) {
              message.reply("this server doesn't have a \`"+ config.muteRole +"\` role.").then(m => m.delete(5000));
              return;
          }

          if (target.roles.has(role.id)) {
              message.reply("this user is already muted.").then(m => m.delete(5000));
              return;
          }

          if (target == null) {
              message.reply("no user was mentionned.").then(m => m.delete(5000));
              return;
          }

          if (!authorised || target.id === config.ownerID || target.id === client.user.id) {
              message.reply("I am not allowed to mute this user.").then(m => m.delete(5000));
              return;
          }

          target.addRole(role).then((target) => {
              message.channel.send(target.user.username +" has been muted.").then(m => m.delete(5000));

              var logChannel = message.guild.channels.find("name", config.logChannel);
              if (!logChannel) return;

              var embed = new Discord.RichEmbed()
                  .setColor(config.muteColor)
                  .setAuthor("Member Muted "+ config.muteEmoji, target.user.avatarURL)
                  .setDescription(target.user +" | "+ target.user.tag +
                                  "\nMuted by "+ message.author)
                  .setTimestamp()

              logChannel.send({embed}).catch(console.error);
          });
    }
}

exports["unmute"] = {
    usage: "Unmutes the targeted user if they were muted.",
    needsAuth: true,
    process: function(message, args, config) {
        message.delete(0);

        var target = message.mentions.members.first();
        var authorised = message.member.roles.some(r => config.authorisedRoles.includes(r.name));
        var role = message.guild.roles.find("name", config.muteRole);

        if (role == undefined) {
            message.reply("this server doesn't have a \`"+ config.muteRole +"\` role.").then(m => m.delete(5000));
            return;
        }

        if (!target.roles.has(role.id)) {
            message.reply("this user is already unmuted.").then(m => m.delete(5000));
            return;
        }

        if (target == null) {
            message.reply("no user was mentionned.").then(m => m.delete(5000));
            return;
        }

        if (!authorised || target.id === config.ownerID || target.id === client.user.id) {
            message.reply("I am not allowed to unmute this user.").then(m => m.delete(5000));
            return;
        }

        target.removeRole(role).then((target) => {
            message.channel.send(target.user.username +" has been unmuted.").then(m => m.delete(5000));

            var logChannel = message.guild.channels.find("name", config.logChannel);
            if (!logChannel) return;

            var embed = new Discord.RichEmbed()
                .setColor(config.unmuteColor)
                .setAuthor("Member Unmuted "+ config.unmuteEmoji, target.user.avatarURL)
                .setDescription(target.user +" | "+ target.user.tag +
                                "\nUnmuted by "+ message.author)
                .setTimestamp()

            logChannel.send({embed}).catch(console.error);
        });
    }
}

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
        .then(msg => {
              msg.react("👍");
              msg.react("👎");
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
                                                          ":regional_indicator_b: "+arg[4]);

            if (arg[5] != undefined) embed.setDescription(arg[1]+"\n\n"+
                                                          ":regional_indicator_a: "+arg[2]+"\n"+
                                                          ":regional_indicator_b: "+arg[3]+"\n"+
                                                          ":regional_indicator_b: "+arg[4]+"\n"+
                                                          ":regional_indicator_b: "+arg[5]);

            if (arg[6] != undefined) embed.setDescription(arg[1]+"\n\n"+
                                                          ":regional_indicator_a: "+arg[2]+"\n"+
                                                          ":regional_indicator_b: "+arg[3]+"\n"+
                                                          ":regional_indicator_b: "+arg[4]+"\n"+
                                                          ":regional_indicator_b: "+arg[5]+"\n"+
                                                          ":regional_indicator_b: "+arg[6]);

            message.channel.send({embed})
            .then(msg => {
                msg.react("🇦");
                msg.react("🇧");
                if (arg[4] != undefined) msg.react("🇨");
                if (arg[5] != undefined) msg.react("🇩");
                if (arg[6] != undefined) msg.react("🇪");
            }).catch(console.error);
    }
}

exports["say"] = {
    usage: "Talk as the bot.",
    needsAuth: true,
    process: function(message, args, config) {
        message.delete(0);

        var msgcontent = message.content.slice(config.prefix.length + 4);

        if (msgcontent.length <= 0) return;
        message.channel.send(msgcontent).catch(console.error);

    }
}

} // no touchy
