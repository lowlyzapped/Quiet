var Discord = require('discord.js');

var config = require('./config.json');
var package = require('./package.json');
var plugins = [
    'admin/admin.js',
    'bot/bot.js',
    'games/games.js',
    'links/links.js',
    'members/members.js',
    'server/server.js'
];

if (config.token == "" || config.prefix == "") {
    console.log("Please fill in \"config.json\".");
    process.exit(1);
}

var client = new Discord.Client();
var commands = [];
var commandObjs = [];

client.on('error', (err) => console.error(err));

client.on('ready', () => {
    for (var i = 0; i < plugins.length; i++) {
        var plugin = require('./plugins/'+ plugins[i]);
        plugin.init(client);

        for (var j = 0; j < plugin.commands.length; j++) {
            commands.push(plugin.commands[j]);
            commandObjs.push(plugin[plugin.commands[j]])
        }
    }

          console.log(client.user.username +" v"+ package.version +" online.");

          client.user.setStatus("online"); //online, idle, dnd, invisible
          client.user.setPresence({game:{name:config.prefix +"help | v"+ package.version, type:0}});
});

client.on('message', async message => {
    if (message.channel.type === "dm" && message.content.startsWith(config.prefix)) { //if a message sent in DM starts with $
        message.author.send("**ACCESS DENIED**\nCan't perform commands in DM."); //denies everything
        return;
    }

    if (message.author.bot || !message.content.startsWith(config.prefix)) return; // if message doesn't start with $, abort

    var args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    var command = args.shift().toLowerCase();

    var authorised = message.member.roles.some(r => config.authorisedRoles.includes(r.name));

    for (var i = 0; i < commands.length; i++) {
        if (commands[i].toLowerCase() == command.toLowerCase()) {
            var cmd = commandObjs[i];
            if (cmd.needsAuth && !authorised) {
                message.reply("you do not have the permissions needed to use this command.");
                return;
            }
            cmd.process(message, args, config);
        }
    }

    if (message.author.id === config.ownerID) {
        if (command === 'ping') { // $ping
            message.delete(0); // Automatically deletes the author's message.
            message.channel.send("Latency of **"+ Math.round(client.ping) +"** ms.").then(m => m.delete(2000)); // Checks ping
        }

        if (command === '!stop') { // $!stop
            console.log(client.user.username +" has been deactivated."); // Output in console
            process.exit(1); // Stop the bot, for real.
        }

        if (command === 'version') {
            message.delete(0);

            message.channel.send("I am currently on version **"+ package.version +"**.").catch(console.error);
        }
    }

});

client.login(config.token);
