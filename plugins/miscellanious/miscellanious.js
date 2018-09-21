exports.init = function(client) {

var Discord = require("discord.js");

exports.commands = [
    "lmgtfy"
]

exports["lmgtfy"] = {
    usage: "Let Quiet google that for you.",
    needsAuth: false,
    process: function(message, args, config) {
        message.delete(0);

        var str = message.content.slice(config.prefix.length + 7);
        var res = str.replace(/ +/g, "+");
        var link = "https://www.lmgtfy.com/?q="+ res;

        message.channel.send("<"+link+">"); // Enclosing in <> hides the embed that comes from the link.

    }
}

} // no touchy
