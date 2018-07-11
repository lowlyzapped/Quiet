var Discord = require('discord.js');
var config = require('./config.json');
var package = require('./package.json');
// var plugins = require('./plugins.js');
var plugins = [
    'links/links.js'
];

if (config.token == "" || config.prefix == "") {
    console.log("Please fill in \"config.json\".");
    process.exit(1);
}

var client = new Discord.Client();
// var commands = {};
//
// var context = {
//     commands: commands,
//     client: client,
//     config: config,
//     package: package
// };

// plugins.init(context);

// client.on('error', err => {
//     if (err.code && err.code == 'ECONNRESET') {
//         console.error("Connection reset");
//         return;
//     }
// });

client.on('error', (err) => console.error(err));

client.on('ready', () => {
          for (var i = 0; i < plugins.length; i++) {
              var plugin = require('./plugins/'+ plugins[i]);
              plugin.init(client);
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
    var commandName = args.shift().toLowerCase();

    var authorised = message.member.roles.some(r => config.authorisedRoles.includes(r.name));

    for (var i = 0; i < commands.commands.length; i++) {
        if (commands.commands[i].toLowerCase() == command.toLowerCase()) {
            var cmd = commands[command.toLowerCase()];
            if (cmd.needsAuth && !authorised) {
                message.reply('you do not have the permissions needed to use this commands!');
                return;
            }
            cmd.process(message, args);
        }
    }

    if (message.author.id === config.ownerID) { // $!stop
        if (commandName === '!stop') { // STOP THE BOT
            console.log(client.user.username +" has been deactivated.");
            process.exit(1); // Stop the bot, for real.
        }
    }

});

client.login(config.token);
