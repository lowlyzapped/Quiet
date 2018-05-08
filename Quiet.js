const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();

var config = require('./config.json');
var rulesTextPath = "./texts/rules.md";
var rulesText;
// var welcomeTextPath = "./texts/welcome.md";
// var welcomeText;

var https = require('https');
var http = require('http');

if (config.token == '' || config.prefix == '') {
    console.log('Please fill in config.json');
    process.exit(1);
}

// if (!fs.existsSync(welcomeTextPath)) {
//     console.log("The file " + welcomeTextPath + " does not exist. This may cause errors.")
// }
// else {
//     fs.readFile(welcomeTextPath, 'utf8', (err, data) => {
//         if (err) {
//             console.log(err);
//             return;
//         }
//         welcomeText = welcomeData;
//     });
// }

if (!fs.existsSync(rulesTextPath)) {
    console.log("The file " + rulesTextPath + " does not exist. This may cause errors.")
}

client.on('ready', () => {
           console.log(client.user.username + " online.");
           client.user.setStatus('online'); //online, idle, dnd, invisible
           client.user.setPresence({game:{name:config.prefix+"help", type:0}});
         });

client.on('error', (err) => console.error(err));

client.on('guildMemberAdd', member => { // when a member joins the server
           var channel = member.guild.channels.find('name', config.logChannel); //searches for a channel named #member-log
           if (!channel) return;  // if channel not found, abort

           var embed = new Discord.RichEmbed()
             .setColor(0x18bb68)
             .setAuthor(client.user.username, client.user.avatarURL)
             .setDescription(""+member+" joined the server.")
             .setTimestamp()
           channel.send({embed}); // fancy message
          });

client.on('guildMemberRemove', member => {
           var channel = member.guild.channels.find('name', config.logChannel);
           if (!channel) return;

           var embed = new Discord.RichEmbed()
             .setColor(0xe9890f)
             .setAuthor(client.user.username, client.user.avatarURL)
             .setDescription("**"+member.user.username+"#"+member.user.discriminator+"** left the server.")
             .setTimestamp()
           channel.send({embed});
         });

client.on('message', message => {  // message function

if (message.channel.type === 'dm' && message.content.startsWith(config.prefix) && message.author.id !== config.ownerID) { //if a message sent in DM starts with $
    message.author.send("**ACCESS DENIED**\nCan't perform commands in DM."); //denies everything
    return;
}

if (message.author.bot) { //auto-deletion for maximum cleaning
    if (message.content.includes("help has been sent.")) message.delete(5000);
    if (message.content.includes("the rules have been sent.")) message.delete(5000);
    if (message.content.includes("an error has occured. Please execute")) message.delete(5000);
    if (message.content.includes("you are missing an argument")) message.delete(5000);
    if (message.content.includes("It's a tie, let's try again!")) message.delete(5000); // $rps
    if (message.content.includes("beat") || message.content.includes("win!")) message.delete(5000);
    if (message.content.includes("Rock!") || message.content.includes("Paper!") ||message.content.includes("Scissors!")) message.delete(5000);
    return; // ignores bots
}

var modRole = message.guild.roles.find("name", config.modRole);
if (message.content.includes("discord.gg/")) {
    if (!message.member.roles.has(modRole.id)) message.delete(0);
}

if (!message.content.startsWith(config.prefix)) return; // if message doesn't start with $ abort
const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
const command = args.shift().toLowerCase(); // fancy magic

if (command === 'ping') { // gets reply time
    message.delete(0);
    if (message.author.id !== config.ownerID) return;
    message.channel.send("Latency of **"+Math.round(client.ping)+"** ms.");
}

if (command === 'help') {
    message.delete(5000); // deletes the user's message after ~5 seconds
    message.reply("help has been sent.");
    var $ = config.prefix;

    if (!message.member.roles.has(modRole.id) && message.author.id !== config.ownerID) {
        var embed = new Discord.RichEmbed()
          .setColor(config.embedColor)
          .setTitle(client.user.username)
          .setDescription("A complete list of the available commands.")
          .setThumbnail(client.user.avatarURL)
          .addField("Basic Commands:", // Max 25 fields
                    "`"+$+"help` - Sends the user a list of the available commands.\n"+
                    "`"+$+"rules` - Sends the user the rules of the server.\n"+
                    "`"+$+"avatar` - Sends the user his own avatar.\n"+
                    "`"+$+"coin` - Flips a coin.\n"+
                    "`"+$+"joined` - Displays for how long the user has been on the server.\n"+
                    "`"+$+"roll <n> <f>` - Roll n f-sided dice, sums the result.\n"+
                    "`"+$+"rps <rock/paper/scissors>` - Play rock-paper-scissors with the bot.\n",
                    true)
          .setFooter("For additional help, contact TheV0rtex#4553")
          // .setTimestamp() // By default today's date.
        message.author.send({embed});
        return;
    }

    if (message.member.roles.has(modRole.id) && message.author.id !== config.ownerID) {
        var embed = new Discord.RichEmbed()
          .setColor(config.embedColor)
          .setTitle(client.user.username)
          .setDescription("A complete list of the available commands.")
          .setThumbnail(client.user.avatarURL)
          .addField("Basic Commands:", // Max 25 fields
                    "`"+$+"help` - Sends the user a list of the available commands.\n"+
                    "`"+$+"rules` - Sends the user the rules of the server.\n"+
                    "`"+$+"avatar` - Sends the user his own avatar.\n"+
                    "`"+$+"coin` - Flips a coin.\n"+
                    "`"+$+"joined` - Displays for how long the user has been on the server.\n"+
                    "`"+$+"roll <n> <f>` - Roll n f-sided dice, sums the result.\n"+
                    "`"+$+"rps <rock/paper/scissors>` - Play rock-paper-scissors with the bot.\n",
                    true)
          .addField("Moderator Commands:",
                    "`"+$+"ban <@mention>` - Bans the targeted user from the server.\n"+
                    "`"+$+"kick <@mention>` - Kicks the targeted user from the server.\n"+
                    "`"+$+"members` - Sends the number of members on the server.\n"+
                    "`"+$+"memberlist` - Sends a list of members on the server with set roles.\n"+
                    "`"+$+"purge <value>` - Deletes a number of messages. (Max 100)\n"+
                    "`"+$+"say` - Talk as the bot.\n",
                    true)
          .addField("Poll Commands:",
                    "`"+$+"poll <title> | <description>` - Creates a yes/no poll.\n"+
                    "`"+$+"epoll <title> | <description> | <choice 1> | <choice 2>` - Creates a poll with 2 to 5 possible choices.\n",
                     true)
          .setFooter("For additional help, contact TheV0rtex#4553")
        // .setTimestamp() // By default today's date.
      message.author.send({embed});
      return;
    }

    var embed = new Discord.RichEmbed()
      .setColor(config.embedColor)
      .setTitle(client.user.username)
      .setDescription("A complete list of the available commands.")
      .setThumbnail(client.user.avatarURL)
      .addField("Basic Commands:", // Max 25 fields
                "`"+$+"help` - Sends the user a list of the available commands.\n"+
                "`"+$+"rules` - Sends the user the rules of the server.\n"+
                "`"+$+"avatar` - Sends the user his own avatar.\n"+
                "`"+$+"coin` - Flips a coin.\n"+
                "`"+$+"joined` - Displays for how long the user has been on the server.\n"+
                "`"+$+"roll <n> <f>` - Roll n f-sided dice, sums the result.\n"+
                "`"+$+"rps <rock/paper/scissors>` - Play rock-paper-scissors with the bot.\n",
                true)
      .addField("Moderator Commands:",
                "`"+$+"ban <@mention>` - Bans the targeted user from the server.\n"+
                "`"+$+"kick <@mention>` - Kicks the targeted user from the server.\n"+
                "`"+$+"members` - Sends the number of members on the server.\n"+
                "`"+$+"memberlist` - Sends a list of members on the server with set roles.\n"+
                "`"+$+"purge <value>` - Deletes a number of messages. (Max 100)\n"+
                "`"+$+"say` - Talk as the bot.\n",
                true)
      .addField("Poll Commands:",
                "`"+$+"poll <title> § <description>` - Creates a yes/no poll.\n"+
                "`"+$+"epoll <title> § <description> § <choice 1> § <choice 2>` - Creates a poll with 2 to 5 possible choices.\n",
                 true)
      .addField("Owner Commands:",
                "`"+$+"ping` - Checks the bot's latency.\n"+
                "`"+$+"serverinfo` - Displays information about the server.\n"+
                "`"+$+"uptime` - Sends how long the bot has been online.\n",
                true)
      .addField("Bot Cosmetic Commands:",
                "`"+$+"setgame [keyword]` - Changes the game the bot is playing.\n"+
                "`"+$+"setnickname [keyword]` - Sets the bot's nickname.\n"+
                "`"+$+"setstatus [keyword]` - Changes the bot's status.\n"+
                "`"+$+"reset` - Resets bot's game, status and nickname.\n",
                 true)
      .setFooter("For additional help, contact TheV0rtex#4553")
      // .setTimestamp() // By default today's date.
    message.author.send({embed});
}

if (command === "rules" || command === "rule") {
    message.delete(5000);
    fs.readFile(rulesTextPath, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }

    var embed = new Discord.RichEmbed()
        .setColor(config.embedColor)
        .setAuthor(client.user.username, client.user.avatarURL)
        .setTitle("Rules")
        .setDescription(data)
        .setFooter(new Date())

    message.reply('rules have been sent.')
        .then(m => m.delete(5000))
        .catch(console.log());

    message.author.send({embed})
        .catch(console.log());
    });
}

if (command === 'joined') {
    var member = message.channel.guild.fetchMember(message.author)
    .then(member => {
        var date = member.joinedAt;

        var year = date.getUTCFullYear();
        var month = date.getUTCMonth() + 1;
        var day = date.getUTCDate();
        var hours = date.getUTCHours();
        var mins = date.getUTCMinutes();

        var end = "**" + day.toString() + "/" + month.toString() + "/" + year.toString() + "** at " + hours.toString() + ":";

        if (mins.toString().length == 1) end += "0";

        end += mins.toString() + " (UTC)"

       message.reply("you joined on " + end)
     });
}

if (command === 'avatar') {
    message.delete(5000);
    var embed = new Discord.RichEmbed()
        .setColor(0x696799)
        .setDescription('[Direct Link](' + message.author.avatarURL + ')')
        .setImage(message.author.avatarURL)
        .setFooter('Powered by '+client.user.username+'™')

    message.reply('your avatar:');
    message.channel.send({embed});
}

if (command === 'coin') { // flip a coin
  message.delete();
  var flip = Math.floor(Math.random() * 2 + 1);
  if (flip === 1) {
      message.channel.send("Flipped **Tails** !");
  }
  else {
      message.channel.send("Flipped **Heads** !");
  }
}

if (command === 'roll') { // roll a dice
    message.delete();
    var dice = parseFloat(args[0]);
    if (args.length != 2) return;

    var dice = parseInt(args[0]);
    var sides = parseInt(args[1]);

    if (isNaN(dice) || isNaN(sides)) return;

    if (dice < 1 || sides < 1) return;

    var total = Math.floor(dice * ((Math.random() * sides) + 1));
    if (total > Math.floor(dice * sides)) total = Math.floor(dice * sides);
    message.channel.send("Rolled **" + dice + "** " + sides + "-sided dice and got **" + total + "**")
      .then(message.delete(5000));
}

if (command === 'rps') { // rock paper scissor
    message.delete(5000);
    if (args[0] != "rock" && args[0] != "paper" && args[0] != "scissors" && args[0] != "scissor" && args[0] != "r" && args[0] != "p" && args[0] != "s") {
        message.reply("an error occured. Do `"+config.prefix+"rps <rock/paper/scissors>`");
        return;
    }

    var rps = Math.floor(Math.random() * 3 + 1);
    // rps: rock is 1, paper is 2 and scissors is 3
    if (rps === 1) {
        message.channel.send("Rock!");
        if (args[0] == "rock" || args[0] == "r") message.channel.send("It's a tie, let's try again!");
        if (args[0] == "paper" || args[0] == "p") message.channel.send("Paper beats rock, you win!");
        if (args[0] == "scissors" || args[0] == "scissor" || args[0] == "s") message.channel.send("Rock beats scissors, I win!");
    }
    if (rps === 2) {
        message.channel.send("Paper!");
        if (args[0] == "rock" || args[0] == "r") message.channel.send("Paper beats rock, I win!");
        if (args[0] == "paper" || args[0] == "p") message.channel.send("It's a tie, let's try again!");
        if (args[0] == "scissors" || args[0] == "scissor" || args[0] == "s") message.channel.send("Scissors beat paper, you win!");
    }
    if (rps === 3) {
        message.channel.send("Scissors!");
        if (args[0] == "rock" || args[0] == "r") message.channel.send("Rock beats scissors, you win!");
        if (args[0] == "paper" || args[0] == "p") message.channel.send("Scissors beat paper, I win!");
        if (args[0] == "scissors" || args[0] == "scissor" || args[0] == "s") message.channel.send("It's a tie, let's try again!");
    }
}

if (!message.member.roles.has(modRole.id) && message.author.id !== config.ownerID) { // Mod Commands
    return;
} else {

if (command === 'say') { // $say <message>
    message.delete(0);

    var msgcontent = message.content.slice(config.prefix.length + 3); // ignores the first 4 characters of the message
    message.channel.send(msgcontent); // sends back everything else typed
}

if (command === 'members') { // $members
    message.delete(0);

    message.channel.send(`There are currently **${message.guild.memberCount}** members on this server.`);
}

if (command === 'memberlist') { // $memberlist
    message.delete(0);

    var modRole = message.guild.roles.find("name", "Mod");
    var youtuberRole = message.guild.roles.find("name", "YouTuber");
    var streamerRole = message.guild.roles.find("name", "Streamer");

    message.channel.send(`There are currently **${message.guild.memberCount}** members on this server:\n`+
                          "**Mods**: "+modRole.members.keyArray().length+"\n"+
                          "**YouTubers**: "+youtuberRole.members.keyArray().length+"\n"+
                          "**Streaners**: "+streamerRole.members.keyArray().length);
    }

if (command === 'purge') { // $purge <value> (max 100)
    var messageCount = parseInt(args[0]);
    message.channel.fetchMessages({limit: 100})
      .then(messages => {
        var msgArray = messages.array()
        msgArray.length = messageCount + 1;
        msgArray.map(m => m.delete().catch(console.error));
        return;
      });
}

if (command === 'kick') { // $kick <@mention>
    message.delete(0);

    var member = message.mentions.members.first();
    if (message.mentions.members.first() == null) { //aborts if no @mention
        message.reply("no user mentionned.")
        return;
    }
    member.kick().then((member) => { //kicks member @mentionned
    message.channel.send(`${member} has been kicked.`);
      }).catch(() => {
    message.channel.send("An error has occured.");
      });
}

if (command === "ban") { // $ban <@mention>
    message.delete(0);

    var member = message.mentions.members.first();
    if (message.mentions.members.first() == null) {
        message.reply("no user mentionned.")
        return;
    }
    member.ban().then((member) => {
    message.channel.send(`${member} has been banned.`);
      }).catch(() => {
    message.channel.send("An error has occured.");
      });
}

if (command === 'mute') {
    if (!message.member.roles.has(circle1.id) && !message.member.roles.has(circle2.id) && !message.member.roles.has(circle3.id) && !message.member.roles.has(cman.id) && !message.member.roles.has(mino.id)) {
    var role = message.guild.roles.find("name", "Muted");
    if (role == undefined || role == null) { // aborts if role doesn't exist
        message.reply("this server doesn't have a \`Muted\` role.");
    }

    var userMute = message.guild.member(message.mentions.users.first());
    if (userMute == undefined || userMute == null) { // aborts if no one tagged
        message.reply("no user was mentionned.")
        return;
    }
    if (userMute.roles.has(role.id)) return message.reply("this user is already muted."); // aborts if target already muted

    userMute.addRole(role).then((userMute) => {
    message.channel.send("User has been muted.");
    }).catch(() => {
    message.channel.send("An error has occured.");
    });
}}

if (command === 'unmute') {
    var role = message.guild.roles.find("name", "Muted");
    if (role == undefined || role == null) { // aborts if role doesn't exist
        message.reply("this server doesn't have a \`Muted\` role.");
        return;
    }

    var userUnmute = message.guild.member(message.mentions.users.first());
    if (userUnmute == undefined  || userUnmute == null) { // aborts if no one tagged
        message.reply("no was user mentionned.")
        return;
    }
    if (!userUnmute.roles.has(role.id)) return message.reply("this user is not muted.");

    userUnmute.removeRole(role).catch(console.error);
    message.channel.send("User has been unmuted.");
}

// Poll Commands
if (command === "poll") { // $poll <title> § <description>
    message.delete(0);
    var str = message.content.slice(config.prefix.length + 5).trim();
    var arg = str.split("§");
    var title = arg[0];
    var desc = arg[1];

    if (arg[1] == undefined) {
        message.reply("an error has occured. Please execute `"+config.prefix+"poll <title> § <description>`.");
        return;
    }

    var embed = new Discord.RichEmbed()
      .setColor(0x696799)
      .setTitle(title)
      .setDescription(desc)
      .setTimestamp() // By default today's date.

    message.channel.send({embed})
        .then(function(msg) {
            msg.react("👍");
            msg.react("👎");
        });
}

if (command === "epoll") { // $epoll <title> § <descrition> § <choice A> § <choice B> § etc. up to 5
    message.delete(0);
    var str = message.content.slice(config.prefix.length + 6).trim();
    var arg = str.split("§");

    if (arg[1] == undefined || arg[2] == undefined || arg[3] == undefined) {
        message.reply("an error has occured. Please excute `"+config.prefix+"epoll <title> § <description> § <choice 1> § <choice 2>`");
        return;
    }

    if (arg[4] == undefined) {
        var embed = new Discord.RichEmbed()
          .setColor(0x696799)
          .setTitle(arg[0])
          .setDescription(arg[1]+"\n\n"+
                          ":regional_indicator_a: "+arg[2]+"\n"+
                          ":regional_indicator_b: "+arg[3])
          .setTimestamp()

          message.channel.send({embed})
              .then(function(msg) {
                  msg.react("🇦");
                  msg.react("🇧");
              });
          return;
    }

    if (arg[5] == undefined) {
        var embed = new Discord.RichEmbed()
          .setColor(0x696799)
          .setTitle(arg[0])
          .setDescription(arg[1]+"\n\n"+
                          ":regional_indicator_a: "+arg[2]+"\n"+
                          ":regional_indicator_b: "+arg[3]+"\n"+
                          ":regional_indicator_c: "+arg[4])
          .setTimestamp() // By default today's date.

          message.channel.send({embed})
              .then(function(msg) {
                  msg.react("🇦");
                  msg.react("🇧");
                  msg.react("🇨");
              });
          return;
    }

    if (arg[6] == undefined) {
      var embed = new Discord.RichEmbed()
        .setColor(0x696799)
        .setTitle(arg[0])
        .setDescription(arg[1]+"\n\n"+
                        ":regional_indicator_a: "+arg[2]+"\n"+
                        ":regional_indicator_b: "+arg[3]+"\n"+
                        ":regional_indicator_c: "+arg[4]+"\n"+
                        ":regional_indicator_d: "+arg[5])
        .setTimestamp() // By default today's date.

        message.channel.send({embed})
            .then(function(msg) {
                msg.react("🇦");
                msg.react("🇧");
                msg.react("🇨");
                msg.react("🇩");
            });
        return;
    }

    var embed = new Discord.RichEmbed()
      .setColor(0x696799)
      .setTitle(arg[0])
      .setDescription(arg[1]+"\n\n"+
                      ":regional_indicator_a: "+arg[2]+"\n"+
                      ":regional_indicator_b: "+arg[3]+"\n"+
                      ":regional_indicator_c: "+arg[4]+"\n"+
                      ":regional_indicator_d: "+arg[5]+"\n"+
                      ":regional_indicator_e: "+arg[6])
      .setTimestamp() // By default today's date.

      message.channel.send({embed})
          .then(function(msg) {
              msg.react("🇦");
              msg.react("🇧");
              msg.react("🇨");
              msg.react("🇩");
              msg.react("🇪");
          });
      return;
} // End Poll Commands

} // End Mod Commands

if (message.author.id !== config.ownerID) { // Owner Commands
    return;
} else {

if (command === 'uptime') {
    message.delete(0);

    var date = new Date(new Date() - client.readyAt);
    var embed = new Discord.RichEmbed()
        .setColor(config.embedColor)
        .setTitle("Uptime")
        .setDescription(`I have been online for ${Math.floor(date.getTime() / 86400000)} days, ${date.getHours()} hours and ${date.getMinutes()} minutes.`)
        .setFooter(new Date());

    message.channel.send({embed})
        .catch(console.log());
}

if (command === 'serverinfo') {
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
        .addField("Member Status:", getStatus(guild))
        .addField("Channels:", getChannels(guild))
        .addField("Custom Emojis:", getEmoji(guild))
        .setFooter(new Date())

    message.channel.send({embed})
      .catch(console.log());

    function getDate(date) {
    var mins = date.getUTCMinutes();
    if (mins.toString().length == 1) mins = "0" + mins;

    var str = '';
    str += date.getUTCDate() + '/';
    str += (date.getUTCMonth() + 1) + '/';
    str += date.getUTCFullYear() + ' at ';
    str += date.getUTCHours() + ':';
    str += mins + " (UTC)";
    return str;
    }

    function getVerification(guild) {
    var verificationLevel = "";
    switch (guild.verificationLevel) {
      case 0: {
          verificationLevel = "None: Unrestricted"
          break;
      }
      case 1: {
          verificationLevel = "Low: Users must have a verified email on their Discord account"
          break;
      }
      case 2: {
          verificationLevel = "Medium: Users must have a verified email on their Discord account and be registered on Discord for longer than 5 minutes"
          break;
      }
      case 3: {
          verificationLevel = "High: Users must have a verified email on their Discord account and be registered on Discord for longer than 5 minutes. Users must also be a member of the server for longer than 10 minutes"
          break;
      }
      case 4: {
          verificationLevel = "Extreme: Users must have a verified phone on their Discord account"
          break;
      }
    }
    return verificationLevel;
    }

    function getStatus(guild) {
    var status = guild.presences.array();
    var online = 0;
    var idle = 0;
    var dnd = 0;

    for (var i = 0; i < status.length; i++) {
         switch (status[i].status) {
             case "online": {
               online++;
               break;
             }
             case "idle": {
               idle++;
               break;
             }
             case "dnd": {
               dnd++;
               break;
             }
        }
  }

  return `${online} online, ${idle} idle, ${dnd} do not disturb, ${guild.memberCount - (online + idle + dnd)} offline`;
  }

  function getChannels(guild) {
  var channels = guild.channels.array();
  var text = 0;
  var voice = 0;

  for (var x = 0; x < channels.length; x++) {
    if (channels[x].type == "text") {
        text++
    }
    else {
        voice++
    }
  }

  return `${text} text channels, ${voice} voice channels`;
  }
}

// Bot Cosmetic Commands
if (command === 'setgame') {
    message.delete(0);

    msgcontent = message.content.slice(config.prefix.length+7);
    client.user.setPresence({game:{name:''+msgcontent+'', type:0}});
}

if (command === 'setstatus') {
    message.delete(0);

    msgcontent = message.content.slice(config.prefix.length+9);
    client.user.setStatus(msgcontent);  //online, idle, dnd, invisible
}

if (command ==='setnickname') {
    message.delete(0);

    msgcontent = message.content.substring(config.prefix.length+11);
    message.guild.member(client.user).setNickname(msgcontent);
}

if (command === 'reset') {
    message.delete(0);

    client.user.setPresence({game:{name:'$help', type:0}});
    client.user.setStatus('online');
    message.guild.member(client.user).setNickname('');
} // End Bot Cosmetic Commands

} // End Owner commands





if (message.author.id === config.ownerID) {
    if (command === '!stop') { // STOP THE BOT
        console.log(client.user.username + " has been deactivated.");
        process.exit(0);
    }
}

});

client.login(config.token); //login
