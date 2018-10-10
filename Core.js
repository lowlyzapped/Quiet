var Discord = require('discord.js'),
    fs = require('fs'),
    path = require('path');

var config = require('./config.json');
var package = require('./package.json');

var plugins = [
    'bot/bot.js',
    'games/games.js',
    'links/links.js',
    'members/members.js',
    'moderation/moderation.js',
    'polls/polls.js',
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
            commandObjs.push(plugin[plugin.commands[j]]);
        }
    }

    if (config.permissions.sendRules == false) console.log("> Rules will not be sent to new members.");
    if (config.permissions.sendWelcome == false) console.log("> Greetings will not be sent to new members.");

    if (config.permissions.sendLinks == false) console.log("> The \""+ config.prefix +"link\" command is disabled.");
    if (config.permissions.sendRules == false) console.log("> The \""+ config.prefix +"rules\" command is disabled.");

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
                message.reply("you do not have the permissions needed to use this command.").then(m => m.delete(5000));
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

        if (command === 'version') { // $version
            message.delete(0);
            message.channel.send("I am currently on version **"+ package.version +"**.").catch(console.error);
        }
    }

    function getDirectories(srcPath) {
        return fs.readdirSync(srcPath)
            .filter(f => {
                return fs.statSync(path.join(srcPath, f))
                    .isDirectory();
            });
    }

    if (command === 'help') { // $help
        message.delete(5000);

        var pluginDirectory = 'plugins/';
        var pluginFolders = null;

        var result = "";
        var member = message.member;
        var pluginOrder = [];

        var canOrder = fs.existsSync('./pluginOrder.json'); // THIS WORKS
        if (canOrder) {
            pluginOrder = require('./pluginOrder.json');

            pluginOrder.sort(function(a, b) {
                return a.sortOrder - b.sortOrder;
            });

        } else {
            console.log("The file \"pluginorder.json\" does not exist. This file is required for custom ordering of the help command.");
            pluginOrder = plugins.map(pd => pd.name);
        }

        var pluginsPath = path.join(__dirname, pluginDirectory); // THIS WORKS
        if (!fs.existsSync(pluginsPath)) {
            console.error("No plugins directory available.");
        } else {
            pluginFolders = getDirectories(pluginsPath);
        }

        for (var p = 0; p < plugins.length; p++) { // It's not loading...
            var pluginData = plugins.find(pd => pd.split("/")[0] == pluginOrder[p].name);
            if (!pluginData) continue;

            var plugin = require('./plugins/' + pluginData);
            var pluginName = pluginData.split("/")[0];

            var commandLines = [];
            for (var c = 0; c < plugin.commands.length; c++) {
                var commandName = plugin.commands[c];

                var command = plugin[commandName];
                var commandText = "`" + config.prefix + commandName + "` - ";

                if (command.needsAuth && !authorised) continue;
                commandLines.push(commandText + (command.usage ? command.usage : "No usage defined.") + "\n");
            }

            if (commandLines.length) {
                pluginName = pluginName.charAt(0).toUpperCase() + pluginName.slice(1);

                result += "**"+ pluginName +"**\n";
                result += commandLines.join("");
                result += "\n";
            }
        }

        var ownerResult = "";
        if (message.author.id === config.ownerID) {
            ownerResult = "**Owner**\n"+
                          "`"+ config.prefix +"ping` - Checks the bot's latency.\n"+
                          "`"+ config.prefix +"version` - Sends what version the bot is running.\n"+
                          "`"+ config.prefix +"!stop` - Stops the bot.";
        }

        var embed = new Discord.RichEmbed()
            .setColor(config.embedColor)
            .setTitle(client.user.username +" Commands")
            .setDescription("`"+ config.prefix +"help` - Sends the user a list of the available commands.\n\n"+ result + ownerResult)
            .setThumbnail(client.user.avatarURL)
            .setFooter("For additional help, contact TheV0rtex#4553")
            .setTimestamp();

        message.author.send({embed})
            .then(() => { })
            .catch(console.error);

        message.reply("help has been sent.")
            .then(m => m.delete(5000))
            .catch(console.error);
    }

});

client.login(config.token);
