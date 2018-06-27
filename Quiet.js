const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();

var config = require('./config.json');
var package = require('./package.json')

if (config.token == '' || config.prefix == '') {
    console.log('Please fill in "config.json".');
    process.exit(1);
}

var https = require('https');
var http = require('http');

var rulesTextPath = "./files/rules.md";
var welcomeTextPath = "./files/welcome.md";

var linksPath = "./files/links.json";
var linksConfig = null;

var helpBTextPath = "./files/help/helpBasic.md"; // TODO make this into a seperate file
var helpBCTextPath = "./files/help/helpBotCosmetic.md";
var helpMTextPath = "./files/help/helpMod.md";
var helpOTextPath = "./files/help/helpOwner.md";
var helpPTextPath = "./files/help/helpPoll.md";

if (!fs.existsSync(helpBTextPath)) {
    console.log("The file \""+ helpBTextPath +"\" does not exist. The "+ config.prefix +"help command will be disabled.");
}

if (!fs.existsSync(welcomeTextPath)) {
    console.log("The file \""+ welcomeTextPath +"\" does not exist. No text will be sent on members' arrival.");
}

if (!fs.existsSync(rulesTextPath)) {
    console.log("The file \""+ rulesTextPath +"\" does not exist. The "+ config.prefix +"rules command will be disabled.");
}

if (fs.existsSync(linksPath)) {
    fs.readFile(linksPath, 'utf8', (e, data) => {
        try {
            linksConfig = JSON.parse(data);
        } catch (e) {
            console.log(e);
        }
    });
} else {
    console.log("The file \""+ linksPath +"\" does not exist. The "+ config.prefix +"link command will be disabled.");
}

client.on('ready', () => {
          console.log(client.user.username +" v"+ package.version +" online.");
          client.user.setStatus('online'); //online, idle, dnd, invisible
          client.user.setPresence({game:{name:config.prefix +"help | v"+ package.version, type:0}});
});

client.on('error', (err) => console.error(err));

client.on('guildMemberAdd', member => { // when a member joins the server
          var logChannel = member.guild.channels.find("name", config.logChannel); //searches for a channel named #member-log
          if (!logChannel) return;  // if channel not found, abort

          var embed = new Discord.RichEmbed()
              .setColor(0x18bb68)
              .setAuthor("Member Joined", member.user.avatarURL)
              .setDescription(member.user +" | "+ member.user.tag)
              .setFooter("Member no. "+ member.guild.memberCount)
              .setTimestamp()

          logChannel.send({embed}).catch(console.error);

          if (!fs.existsSync(welcomeTextPath)) {
              return;
          } else {
              fs.readFile(welcomeTextPath, 'utf8', (err, welcomeText) => {
                  if (err) return console.log(err);

                  member.send("Hello "+ member.user.username +"! "+ welcomeText);
              });
          }

          if (!fs.existsSync(rulesTextPath)) {
              return;
          } else {
              fs.readFile(rulesTextPath, 'utf8', (err, rulesText) => {
                  if (err) return console.log(err);

                  var embed = new Discord.RichEmbed()
                      .setColor(config.embedColor)
                      .setAuthor(member.guild.name+" Rules", member.guild.iconURL)
                      .setDescription(rulesText)
                      .setFooter("Powered by "+ client.user.username +"™")

                  member.send({embed}).catch(console.error);
              });
          }
});

client.on('guildMemberRemove', member => {
           var logChannel = member.guild.channels.find("name", config.logChannel);
           if (!logChannel) return;

           var embed = new Discord.RichEmbed()
               .setColor(0xe9890f)
               .setAuthor("Member Left", member.user.avatarURL)
               .setDescription(member.user +" | "+ member.user.tag)
               .setTimestamp()

           logChannel.send({embed}).catch(console.error);
});

client.on('message', message => {  // message function

if (message.channel.type === 'dm' && message.content.startsWith(config.prefix)) { //if a message sent in DM starts with $
    message.author.send("**ACCESS DENIED**\nCan't perform commands in DM."); //denies everything
    return;
}

if (message.author.bot) return; // ignores bots and itself

var modRole = message.guild.roles.find("name", config.modRole);

if (message.content.includes("discord.gg/")) {
    if (!message.member.roles.has(modRole.id) && message.author.id !== ownerID) return message.delete(0);
}

if (!message.content.startsWith(config.prefix)) return; // if message doesn't start with $ abort
const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
const command = args.shift().toLowerCase(); // fancy magic

if (command === 'ping') { // $ping
    message.delete(0); // Automatically deletes the author's message.
    if (message.author.id !== config.ownerID) return; // If the author isn't the owner, stop.
    message.channel.send("Latency of **"+Math.round(client.ping)+"** ms.").then(m => m.delete(2000)); // Checks pings
}

if (command === 'help') { // $help
    message.delete(5000); // Deletes the author's message after ~5 seconds.

    if (!fs.existsSync(helpBTextPath)) return; // If the directory isn't found, stop the command.

    message.reply("help has been sent.").then(m => m.delete(5000)); // Replies to the command author, then self-deletes.

    fs.readFile(helpBTextPath, 'utf8', (err, helpBasic) => { // Reads and parses data from each file into a separate variable.
        if (err) return console.log(err);

    fs.readFile(helpMTextPath, 'utf8', (err, helpMod) => { // (I should make a seperate .js for all this.)
        if (err) return console.log(err);

    fs.readFile(helpPTextPath, 'utf8', (err, helpPoll) => {
        if (err) return console.log(err);

    fs.readFile(helpBCTextPath, 'utf8', (err, helpBotCosmetic) => {
        if (err) return console.log(err);

    fs.readFile(helpOTextPath, 'utf8', (err, helpOwner) => {
        if (err) return console.log(err);

    var embed = new Discord.RichEmbed() // Creates an embed with the propreties below.
        .setColor(config.embedColor) // Hex color set in config.json
        .setTitle(client.user.username) // The bot's name.
        .setDescription("A complete list of the available commands.")
        .setThumbnail(client.user.avatarURL) // The bot's avatar, will return empty if it's a lame bot with no pic.
        .addField("Basic Commands:", helpBasic, true) // Sends the parsed data here.
        .setFooter("For additional help, contact TheV0rtex#4553")
        // .setTimestamp() // By default today's date.

      if (message.member.roles.has(modRole.id) || message.author.id === config.ownerID) {
          embed.addField("Moderator Commands:", helpMod, true); // If the author is the owner or has the mod role,
          embed.addField("Poll Commands:", helpPoll, true); // send the following parsed texts.
      }

      if (message.author.id === config.ownerID) { // If the author is the owner...
          embed.addField("Bot Cosmetic Commands:", helpBotCosmetic, true)
          embed.addField("Owner Commands:", helpOwner, true)
      }

    message.author.send({embed}).catch(console.error); // Send the embed with all the text.

    }); }); }); }); });
}

if (command === "rules") {
    message.delete(5000);

    if (!fs.existsSync(rulesTextPath)) return;

    fs.readFile(rulesTextPath, 'utf8', (err, rulesText) => {
        if (err) return console.log(err);

    var embed = new Discord.RichEmbed()
        .setColor(config.embedColor)
        .setAuthor(message.guild.name+" Rules", message.guild.iconURL)
        .setDescription(rulesText)
        .setFooter("Powered by "+ client.user.username +"™")

    message.reply('rules have been sent.')
        .then(m => m.delete(5000));

    message.author.send({embed})
        .catch(console.error);
    });
}

if (command === 'joined') {
    message.delete(0);

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
      }).catch(console.error);
}

if (command === 'avatar') {
    message.delete(5000);

    var embed = new Discord.RichEmbed()
        .setColor(0x696799)
        .setDescription('[Direct Link](' + message.author.avatarURL + ')')
        .setImage(message.author.avatarURL)
        .setFooter("Powered by "+ client.user.username +"™")

    message.reply('your avatar:');
    message.channel.send({embed}).catch(console.error);
}

if (command === 'servericon') {
    message.delete(5000);

    var embed = new Discord.RichEmbed()
        .setColor(config.embedColor)
        .setTitle(message.guild.name+"'s icon!")
        .setDescription("[Direct Link]("+message.guild.iconURL+")")
        .setImage(message.guild.iconURL)
        .setFooter("Powered by "+ client.user.username +"™")

    message.channel.send({embed}).catch(console.error);
}

if (command === 'link') {
    message.delete(0);

    if (!fs.existsSync(linksPath)) return;

    var links = linksConfig.links;

    if (args[0] == null) {
        var embed = new Discord.RichEmbed()
            .setColor(config.embedColor)
            .setTitle("All Links")
            .setFooter("Powered by "+ client.user.username +"™")

        var text = "";
        for (var i = 0; i < links.length; i++) {
            text += "`" + links[i].name + "` - " + links[i].description + "\n";
        }
          embed.setDescription(text);

          message.channel.send({embed}).catch(console.error);
          return;
    }

    var x = null;
    for (var i = 0; i < links.length; i++) {
         if (links[i].name.toLowerCase() == args[0].toLowerCase())
         x = i;
    }

    if (x == null) {
        var linkName = args[0].toLowerCase();
        message.reply("the link `"+ linkName +"` doesn't exist.");
        return;
    }

    var embed = new Discord.RichEmbed()
        .setColor(config.embedColor)
        .setAuthor("Link: "+ links[x].name.toLowerCase())
        .setTitle(links[x].link)
        .setDescription(links[x].description)
        .setFooter("Powered by "+ client.user.username +"™")

        message.channel.send({embed}).catch(console.error);
}

if (command === 'coin') { // flip a coin
  message.delete(0);
  var flip = Math.floor(Math.random() * 2 + 1);
  if (flip === 1) {
      message.channel.send("Flipped **Tails** !").then(m => m.delete(5000));
  }
  else {
      message.channel.send("Flipped **Heads** !").then(m => m.delete(5000));
  }
}

if (command === 'roll') { // roll a dice
    message.delete(5000);
    var dice = parseFloat(args[0]);
    if (args.length != 2) return;

    var dice = parseInt(args[0]);
    var sides = parseInt(args[1]);

    if (isNaN(dice) || isNaN(sides)) return;

    if (dice < 1 || sides < 1) return;

    var total = Math.floor(dice * ((Math.random() * sides) + 1));
    if (total > Math.floor(dice * sides)) total = Math.floor(dice * sides);
    message.channel.send("Rolled **"+ dice +"** "+ sides +"-sided dice and got **"+ total +"**.")
      .then(m => m.delete(5000))
      .catch(console.error);
}

if (command === 'rps') { // rock paper scissor
    message.delete(5000);
    if (args[0] != "rock" && args[0] != "paper" && args[0] != "scissors" && args[0] != "scissor") {
        message.reply("an error occured. Do `"+config.prefix+"rps <rock/paper/scissors>`");
        return;
    }

    var rps = Math.floor(Math.random() * 3 + 1);
    // rps: rock is 1, paper is 2 and scissors is 3
    if (rps === 1) {
        message.channel.send("Rock!").then(m => m.delete(5000));
        if (args[0] == "rock") message.channel.send("It's a tie, let's try again!")
          .then(m => m.delete(5000));
        if (args[0] == "paper") message.channel.send("Paper beats rock, you win!")
          .then(m => m.delete(5000));
        if (args[0] == "scissors" || args[0] == "scissor") message.channel.send("Rock beats scissors, I win!")
          .then(m => m.delete(5000));
    }
    if (rps === 2) {
        message.channel.send("Paper!").then(m => m.delete(5000));
        if (args[0] == "rock") message.channel.send("Paper beats rock, I win!")
          .then(m => m.delete(5000));
        if (args[0] == "paper") message.channel.send("It's a tie, let's try again!")
          .then(m => m.delete(5000));
        if (args[0] == "scissors" || args[0] == "scissor") message.channel.send("Scissors beat paper, you win!")
          .then(m => m.delete(5000));
    }
    if (rps === 3) {
        message.channel.send("Scissors!").then(m => m.delete(5000));
        if (args[0] == "rock") message.channel.send("Rock beats scissors, you win!")
          .then(m => m.delete(5000));
        if (args[0] == "paper") message.channel.send("Scissors beat paper, I win!")
          .then(m => m.delete(5000));
        if (args[0] == "scissors" || args[0] == "scissor") message.channel.send("It's a tie, let's try again!")
          .then(m => m.delete(5000));
    }
}

if (message.member.roles.has(modRole.id) || message.author.id === config.ownerID) { // Mod Commands

if (command === 'say') { // $say <message>
    message.delete(0);

    var msgcontent = message.content.slice(config.prefix.length + command.length);
    message.channel.send(msgcontent).catch(console.error);
}

if (command === 'members') { // $members
    message.delete(0);

    message.channel.send("There are currently **"+ message.guild.memberCount +"** members on this server.").catch(console.error);
}

if (command === 'memberlist') { // $memberlist
    message.delete(0);

    var modRole = message.guild.roles.find("name", config.modRole); // to be extended
    var youtuberRole = message.guild.roles.find("name", "YouTuber");
    var streamerRole = message.guild.roles.find("name", "Streamer");

    message.channel.send("There are currently **"+ message.guild.memberCount +"** members on this server:\n"+
                          "**Moderators**: "+modRole.members.keyArray().length+"\n"+
                          "**YouTubers**: "+youtuberRole.members.keyArray().length+"\n"+
                          "**Streamers**: "+streamerRole.members.keyArray().length)
      .catch(console.error);
}

if (command === 'getavatar') {
    message.delete(0);

    var member = message.mentions.members.first();
    if (message.mentions.members.first() == null) return message.reply("no user was mentionned.").then(m => m.delete(5000));

    var embed = new Discord.RichEmbed()
        .setColor(config.embedColor)
        .setTitle(member.user.username +"'s avatar!")
        .setDescription("[Direct Link]("+ member.user.avatarURL +")")
        .setImage(member.user.avatarURL)
        .setFooter("Powered by "+ client.user.username +"™")

    message.channel.send({embed}).catch(console.error);
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

    var target = message.mentions.members.first();
    if (target == null) return message.reply("no user was mentionned.").then(m => m.delete(5000));

    if (target.roles.has(modRole.id) || target.id === config.ownerID || target.id === client.id) return message.reply("I am not allowed to kick this user.").then(m => m.delete(5000));

    target.kick().then((target) => { //kicks member @mentionned
      message.channel.send(target +" has been kicked.").then(m => m.delete(5000));

      var logChannel = message.guild.channels.find("name", config.logChannel);
      if (!logChannel) return;

      logChannel.bulkDelete(1, false).then(() => {
        var target = message.mentions.members.first();

        var embed = new Discord.RichEmbed()
            .setColor(0xff0000)
            .setAuthor("Member Kicked", target.user.avatarURL)
            .setDescription(target.user +" | "+ target.user.tag +
                            "\nKicked by: "+ message.author)
            .setTimestamp()

        logChannel.send({embed}).catch(console.error);
      })
    }).catch(() => {
        message.reply("an error has occured.").then(m => m.delete(5000))
      });
}

if (command === "ban") { // $ban <@mention>
    message.delete(0);

    var target = message.mentions.members.first();
    if (target == null) return message.reply("no user was mentionned.").then(m => m.delete(5000));

    if (target.roles.has(modRole.id) || target.id === config.ownerID || target.id === client.id) return message.reply("I am not allowed to ban this user.").then(m => m.delete(5000));

    target.ban(1).then((target) => {
      message.channel.send(target +" has been banned.").then(m => m.delete(5000));

      var logChannel = message.guild.channels.find("name", config.logChannel);
      if (!logChannel) return;

      logChannel.bulkDelete(1, false).then(() => {
        var target = message.mentions.members.first();

        var embed = new Discord.RichEmbed()
            .setColor(0x000000)
            .setAuthor("Member Banned", target.user.avatarURL)
            .setDescription(target.user +" | "+ target.user.tag +
                            "\nBanned by: "+ message.author)
            .setTimestamp()

        logChannel.send({embed}).catch(console.error);
      })
    }).catch(() => {
        message.reply("an error has occured.").then(m => m.delete(5000))
      });
}

if (command === 'mute') {
    message.delete(0);

    var target = message.mentions.members.first();
    var role = message.guild.roles.find("name", config.muteRole);

    if (role == undefined || role == null) return message.reply("this server doesn't have a \`"+ config.muteRole +"\` role.").then(m => m.delete(5000));
    if (target.roles.has(role.id)) return message.reply("this user is already muted.").then(m => m.delete(5000));

    if (target == null) return message.reply("no user was mentionned.").then(m => m.delete(5000));
    if (target.roles.has(modRole.id) || target.id === config.ownerID || target.id === client.id) return message.reply("I am not allowed to mute this user.").then(m => m.delete(5000));

    target.addRole(role).then((target) => {
      message.channel.send(target.user.username +" has been muted.").then(m => m.delete(5000));

      var logChannel = message.guild.channels.find("name", config.logChannel);
      if (!logChannel) return;

      var embed = new Discord.RichEmbed()
          .setColor(0x696969)
          .setAuthor("Member Muted", target.user.avatarURL)
          .setDescription(target.user +" | "+ target.user.tag +
                          "\nMuted by: "+ message.author)
          .setTimestamp()

      logChannel.send({embed}).catch(console.error);
    }).catch(() => {
          message.reply("an error has occured.").then(m => m.delete(5000))
        });
}

if (command === 'unmute') {
    message.delete(0);

    var target = message.mentions.members.first();
    var role = message.guild.roles.find("name", config.muteRole);

    if (role == undefined || role == null) return message.reply("this server doesn't have a \`"+ config.muteRole +"\` role.").then(m => m.delete(5000));
    if (!target.roles.has(role.id)) return message.reply("this user is not muted.").then(m => m.delete(5000));

    if (target == null) return message.reply("no user was mentionned.").then(m => m.delete(5000));
    if (target.roles.has(modRole.id) || target.id === config.ownerID || target.id === client.id) return message.reply("I am not allowed to unmute this user.").then(m => m.delete(5000));

    target.removeRole(role).then((target) => {
      message.channel.send(target.user.username +" has been unmuted.").then(m => m.delete(5000));

      var logChannel = message.guild.channels.find("name", config.logChannel);
      if (!logChannel) return;

      var embed = new Discord.RichEmbed()
          .setColor(0x696969)
          .setAuthor("Member Unmuted", target.user.avatarURL)
          .setDescription(target.user +" | "+ target.user.tag +
                          "\nUnmuted by: "+ message.author)
          .setTimestamp()

      logChannel.send({embed}).catch(console.error);
      }).catch(() => {
        message.reply("an error has occured.").then(m => m.delete(5000))
    });
}

// Poll Commands
if (command === "poll") { // $poll <title> | <description>
    message.delete(0);

    var str = message.content.slice(config.prefix.length + command.length).trim();
    var arg = str.split("|");
    var title = arg[0];
    var desc = arg[1];

    if (arg[1] == undefined) {
        message.reply("an error has occured. Please execute `"+config.prefix+"poll <title> | <description>`.").then(m => m.delete(5000));
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

if (command === "epoll") { // $epoll <title> | <descrition> | <choice A> | <choice B> | etc. up to 5
    message.delete(0);

    var str = message.content.slice(config.prefix.length + command.length).trim();
    var arg = str.split("|");

    if (arg[1] == undefined || arg[2] == undefined || arg[3] == undefined) {
        message.reply("there are missing arguments. Please excute `"+config.prefix+"epoll <title> | <description> | <choice 1> | <choice 2>`")
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
// End Poll Commands

} // End Mod Commands

if (message.author.id === config.ownerID) { // Owner Commands

if (command === 'uptime') {
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

if (command === 'version') {
    message.delete(0);

    message.channel.send("I am currently on version **"+ package.version +"**.").catch(console.error).then(m => m.delete(5000));
}

// Bot Cosmetic Commands
if (command === 'setgame') {
    message.delete(0);

    var msgcontent = message.content.slice(config.prefix.length + command.length);
    client.user.setPresence({game:{name:''+msgcontent+'', type:0}}).catch(console.error);
}

if (command === 'setstatus') {
    message.delete(0);

    var msgcontent = message.content.slice(config.prefix.length + command.length);
    client.user.setStatus(msgcontent).catch(console.error);  //online, idle, dnd, invisible
}

if (command === 'setnickname') {
    message.delete(0);

    var msgcontent = message.content.substring(config.prefix.length + command.length);
    message.guild.member(client.user).setNickname(msgcontent).catch(console.error);
}

if (command === 'reset') {
    message.delete(0);

    client.user.setPresence({game:{name:config.prefix + "help", type:0}});
    client.user.setStatus("online");
    message.guild.member(client.user).setNickname('');
}
// End Bot Cosmetic Commands

} // End Owner commands

if (message.author.id === config.ownerID) { // $!
    if (command === '!stop') { // STOP THE BOT
        console.log(client.user.username +" has been deactivated.");
        process.exit(1); // Stop the bot, for real.
    }
}

});

client.login(config.token); // Login
