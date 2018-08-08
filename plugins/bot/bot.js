exports.init = function(client) {

var Discord = require("discord.js");

exports.commands = [
    "setgame",
    "setstream",
    "setnickname",
    "setstatus",
    "reset",
    "uptime"
]

exports["setgame"] = {
    usage: "Sets the game the bot is playing.",
    needsAuth: true,
    process: function(message, args, config) {
        message.delete(0);

        var msgcontent = message.content.slice(config.prefix.length + 7);
        client.user.setPresence({game:{name:msgcontent, type:0}}).catch(console.error);

        message.channel.send("I am now playing `"+ msgcontent +"`.").then(m => m.delete(5000));

    }
}

exports["setstream"] = {
    usage: "Sets the stream the bot is streaming. Limited to Twitch streams.",
    needsAuth: true,
    process: function(message, args, config) {
        message.delete(0);

        if (args[0] == null || args[1] == null) return message.reply("you are missing arguments.").then(m => m.delete(5000));
        if (!message.content.includes("https://twitch.tv/")) return message.reply("this is an invalid Twitch URL.").then(m => m.delete(5000));

        var msgcontent = message.content.slice(config.prefix.length + 9 + args[0].length + 2);
        client.user.setPresence({game:{name:msgcontent, type:1, url:args[0]}}).catch(console.error);

        message.channel.send("I am now streaming `"+ msgcontent +"` at "+ args[0] +".").then(m => m.delete(5000));
    }
}

exports["setnickname"] = {
    usage: "Sets the bot's nickname.",
    needsAuth: true,
    process: function(message, args, config) {
        message.delete(0);

        var msgcontent = message.content.substring(config.prefix.length + 11);
        message.guild.member(client.user).setNickname(msgcontent).catch(console.error);

        message.channel.send("My nickname is now `"+ msgcontent +"`.").then(m => m.delete(5000));
    }
}

exports["setstatus"] = {
    usage: "Sets the bot's status.",
    needsAuth: true,
    process: function(message, args, config) {
        message.delete(0);

        var msgcontent = message.content.slice(config.prefix.length + 10);
        client.user.setStatus(msgcontent).catch(console.error);  //online, idle, dnd, invisible

    }
}

exports["reset"] = {
    usage: "Restores the bot's default game and status, and removes its nickname.",
    needsAuth: true,
    process: function(message, args, config) {
        message.delete(0);

        client.user.setPresence({game:{name:config.prefix +"help", type:0}, status: "online"});
        message.guild.member(client.user).setNickname("");
    }
}

exports["uptime"] = {
    usage: "Sends for how long the bot has been online.",
    needsAuth: true,
    process: function(message, args, config) {
        message.delete(0);

        var days = Math.floor(process.uptime() / 86400);
        var hours = Math.floor((process.uptime() % 86400) / 3600);
        var minutes = Math.floor(((process.uptime() % 86400) % 3600) / 60);

        var textDays = "days";
        var textHours = "hours";
        var textMinutes = "minutes";

        if (days === 1) textDays = "day";
        if (hours === 1) textHours = "hour";
        if (minutes === 1) textMinutes = "minute";


        if (days === 0 && hours === 0 && minutes === 0) {
            message.channel.send("I just have been launched. Give me a minute to get ready.");
        } else if (days === 0 && hours === 0 && minutes !== 0) {
            message.channel.send("I have been online for **"+ minutes +"** "+textMinutes+".");
        } else if (days === 0 && hours !== 0) {
            message.channel.send("I have been online for **"+ hours +"** "+textHours+" and **"+ minutes +"** "+textMinutes+".");
        } else {
            message.channel.send("I have been online for **"+ days +"** "+textDays+", **"+ hours +"** "+textHours+" and **"+ minutes +"** "+textMinutes+".");
        }

    }
}

} // no touchy
