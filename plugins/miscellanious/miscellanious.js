exports.init = function(client) {

var Discord = require("discord.js");
var encode = require('strict-uri-encode');

exports.commands = [
    "lmgtfy"
]

exports["lmgtfy"] = {
    usage: "Let Quiet google that for you.",
    needsAuth: false,
    process: function(message, args, config) {
        message.delete(0);

        var question = encode(args.join(" "));
        var link = "https://www.lmgtfy.com/?q="+ question;

        message.channel.send("<"+link+">"); // Enclosing in ** makes it bold, enclosing in <> hides the embed that comes from the link.

    }
}

} // no touchy
