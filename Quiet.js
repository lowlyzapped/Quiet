const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();

var config = require('./config.json');
var package = require('./package.json')

var rulesTextPath = "./texts/rules.md";
var welcomeTextPath = "./texts/welcome.md";

var helpBTextPath = "./texts/help/helpBasic.md"; // TODO make this into a seperate .js file ???
var helpBCTextPath = "./texts/help/helpBotCosmetic.md";
var helpMTextPath = "./texts/help/helpMod.md";
var helpOTextPath = "./texts/help/helpOwner.md";
var helpPTextPath = "./texts/help/helpPoll.md";

var https = require('https');
var http = require('http');

if (config.token == '' || config.prefix == '') {
    console.log('Please fill in config.json');
    process.exit(1);
}

if (!fs.existsSync(helpBTextPath)) {
    console.log("The file " + helpBTextPath + " does not exist. This may cause errors.");
}

if (!fs.existsSync(welcomeTextPath)) {
    console.log("The file " + welcomeTextPath + " does not exist. This may cause errors.");
}

if (!fs.existsSync(rulesTextPath)) {
    console.log("The file " + rulesTextPath + " does not exist. This may cause errors.");
}

client.on('ready', () => {
           console.log(client.user.username + " online.");
           client.user.setStatus('online'); //online, idle, dnd, invisible
           client.user.setPresence({game:{name:config.prefix+"help | v"+ package.version, type:0}});
         });

client.on('error', (err) => console.error(err));

client.on('guildMemberAdd', member => { // when a member joins the server
           var channel = member.guild.channels.find('name', config.logChannel); //searches for a channel named #member-log
           if (!channel) return;  // if channel not found, abort

           var embed = new Discord.RichEmbed()
             .setColor(0x18bb68)
             .setAuthor(client.user.username, client.user.avatarURL)
             .setDescription(""+member.user+" joined the server.")
             .setTimestamp()
           channel.send({embed}).catch(console.error);

           if (!fs.existsSync(welcomeTextPath)) return;

           fs.readFile(welcomeTextPath, 'utf8', (err, welcomeText) => {
               if (err) return console.log(err);

           fs.readFile(rulesTextPath, 'utf8', (err, rulesText) => {
               if (err) return console.log(err);

           var embed = new Discord.RichEmbed()
               .setColor(config.embedColor)
               .setAuthor(member.guild.name+" Rules", member.guild.iconURL)
               .setDescription(rulesText)
               .setFooter(new Date())

           member.send("Hello "+member.user.username+"! "+ welcomeText);

           if (!fs.existsSync(rulesTextPath)) return;
           member.send({embed})
               .catch(console.error);
           });
           });
});

client.on('guildMemberRemove', member => {
           var channel = member.guild.channels.find('name', config.logChannel);
           if (!channel) return;

           var embed = new Discord.RichEmbed()
             .setColor(0xe9890f)
             .setAuthor(client.user.username, client.user.avatarURL)
             .setDescription("**"+member.user.username+"#"+member.user.discriminator+"** left the server.")
             .setTimestamp()
           channel.send({embed}).catch(console.error);
});

client.on('message', message => {  // message function

if (message.channel.type === 'dm' && message.content.startsWith(config.prefix)) { //if a message sent in DM starts with $
    message.author.send("**ACCESS DENIED**\nCan't perform commands in DM."); //denies everything
    return;
}

if (message.author.bot) return; // ignores bots

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
    message.channel.send("Latency of **"+Math.round(client.ping)+"** ms.").then(m => m.delete(2000));
}

if (command === 'help') {
    message.delete(5000); // deletes the user's message after ~5 seconds
    message.reply("help has been sent.").then(m => m.delete(5000));

    if (!message.member.roles.has(modRole.id) && message.author.id !== config.ownerID) {
        fs.readFile(helpBTextPath, 'utf8', (err, helpBasic) => {
            if (err) return console.log(err);

        var embed = new Discord.RichEmbed()
          .setColor(config.embedColor)
          .setTitle(client.user.username)
          .setDescription("A complete list of the available commands.")
          .setThumbnail(client.user.avatarURL)
          .addField("Basic Commands:", helpBasic, true)
          .setFooter("For additional help, contact TheV0rtex#4553")
          // .setTimestamp() // By default today's date.
        message.author.send({embed}).catch(console.error);
        return;

        });
    }

    else if (message.member.roles.has(modRole.id) && message.author.id !== config.ownerID) {
        fs.readFile(helpBTextPath, 'utf8', (err, helpBasic) => {
            if (err) return console.log(err);

        fs.readFile(helpMTextPath, 'utf8', (err, helpMod) => {
            if (err) return console.log(err);

        fs.readFile(helpPTextPath, 'utf8', (err, helpPoll) => {
            if (err) return console.log(err);

        var embed = new Discord.RichEmbed()
          .setColor(config.embedColor)
          .setTitle(client.user.username)
          .setDescription("A complete list of the available commands.")
          .setThumbnail(client.user.avatarURL)
          .addField("Basic Commands:", helpBasic, true)
          .addField("Moderator Commands:", helpMod, true)
          .addField("Poll Commands:", helpPoll, true)
          .setFooter("For additional help, contact TheV0rtex#4553")
        // .setTimestamp() // By default today's date.
        message.author.send({embed}).catch(console.error);
        return;

        }); }); });
    }

    else {
        fs.readFile(helpBTextPath, 'utf8', (err, helpBasic) => {
            if (err) return console.log(err);

        fs.readFile(helpMTextPath, 'utf8', (err, helpMod) => {
            if (err) return console.log(err);

        fs.readFile(helpPTextPath, 'utf8', (err, helpPoll) => {
            if (err) return console.log(err);

        fs.readFile(helpBCTextPath, 'utf8', (err, helpBotCosmetic) => {
            if (err) return console.log(err);

        fs.readFile(helpOTextPath, 'utf8', (err, helpOwner) => {
            if (err) return console.log(err);

        var embed = new Discord.RichEmbed()
          .setColor(config.embedColor)
          .setTitle(client.user.username)
          .setDescription("A complete list of the available commands.")
          .setThumbnail(client.user.avatarURL)
          .addField("Basic Commands:", helpBasic, true)
          .addField("Moderator Commands:", helpMod, true)
          .addField("Poll Commands:", helpPoll, true)
          .addField("Bot Cosmetic Commands:", helpBotCosmetic, true)
          .addField("Owner Commands:", helpOwner, true)
          .setFooter("For additional help, contact TheV0rtex#4553")
          // .setTimestamp() // By default today's date.
        message.author.send({embed}).catch(console.error);

        }); }); }); }); });
    }
}

if (command === "rules" || command === "rule") {
    message.delete(5000);
    if (!fs.existsSync(rulesTextPath)) return;

    fs.readFile(rulesTextPath, 'utf8', (err, rulesText) => {
        if (err) return console.log(err);

    var embed = new Discord.RichEmbed()
        .setColor(config.embedColor)
        .setAuthor(message.guild.name+" Rules", message.guild.iconURL)
        .setDescription(rulesText)
        .setFooter(new Date())

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
        .setFooter('Powered by '+client.user.username+'™')

    message.reply('your avatar:');
    message.channel.send({embed})
      .catch(console.error);
}

if (command === 'coin') { // flip a coin
  message.delete(0);
  var flip = Math.floor(Math.random() * 2 + 1);
  if (flip === 1) {
      message.channel.send("Flipped **Tails** !")
        .then(m => m.delete(5000));
  }
  else {
      message.channel.send("Flipped **Heads** !")
        .then(m => m.delete(5000));
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
    message.channel.send("Rolled **" + dice + "** " + sides + "-sided dice and got **" + total + "**")
      .then(m => m.delete(5000))
      .catch(console.error);
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
        if (args[0] == "rock" || args[0] == "r") message.channel.send("It's a tie, let's try again!")
          .then(m => m.delete(5000));
        if (args[0] == "paper" || args[0] == "p") message.channel.send("Paper beats rock, you win!")
          .then(m => m.delete(5000));
        if (args[0] == "scissors" || args[0] == "scissor" || args[0] == "s") message.channel.send("Rock beats scissors, I win!")
          .then(m => m.delete(5000));
    }
    if (rps === 2) {
        message.channel.send("Paper!");
        if (args[0] == "rock" || args[0] == "r") message.channel.send("Paper beats rock, I win!")
          .then(m => m.delete(5000));
        if (args[0] == "paper" || args[0] == "p") message.channel.send("It's a tie, let's try again!")
          .then(m => m.delete(5000));
        if (args[0] == "scissors" || args[0] == "scissor" || args[0] == "s") message.channel.send("Scissors beat paper, you win!")
          .then(m => m.delete(5000));
    }
    if (rps === 3) {
        message.channel.send("Scissors!");
        if (args[0] == "rock" || args[0] == "r") message.channel.send("Rock beats scissors, you win!")
          .then(m => m.delete(5000));
        if (args[0] == "paper" || args[0] == "p") message.channel.send("Scissors beat paper, I win!")
          .then(m => m.delete(5000));
        if (args[0] == "scissors" || args[0] == "scissor" || args[0] == "s") message.channel.send("It's a tie, let's try again!")
          .then(m => m.delete(5000));
    }
}

if (!message.member.roles.has(modRole.id) && message.author.id !== config.ownerID) { // Mod Commands
    return;
} else {

if (command === 'say') { // $say <message>
    message.delete(0);

    var msgcontent = message.content.slice(config.prefix.length + 3); // ignores the first 4 characters of the message
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
                          "**Streaners**: "+streamerRole.members.keyArray().length)
      .catch(console.error);
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
        message.reply("no user mentionned.").then(m => m.delete(5000));
        return;
    }

    member.kick().then((member) => { //kicks member @mentionned
    message.channel.send(member +" has been kicked.").then(m => m.delete(5000))
      }).catch(() => {
    message.channel.send("An error has occured.").then(m => m.delete(5000))
      });
}

if (command === "ban") { // $ban <@mention>
    message.delete(0);

    var member = message.mentions.members.first();
    if (message.mentions.members.first() == null) {
        message.reply("no user mentionned.").then(m => m.delete(5000));
        return;
    }

    member.ban().then((member) => {
    message.channel.send(member +" has been banned.").then(m => m.delete(5000))
      }).catch(() => {
    message.channel.send("An error has occured.").then(m => m.delete(5000));
      });
}

if (command === 'mute') {
    message.delete(0);

    var role = message.guild.roles.find("name", config.muteRole);
    if (role == undefined || role == null) { // aborts if role doesn't exist
        message.reply("this server doesn't have a \`"+ config.muteRole +"\` role.").then(m => m.delete(5000));
    }

    var userMute = message.guild.member(message.mentions.users.first());
    if (userMute == undefined || userMute == null) { // aborts if no one tagged
        message.reply("no user was mentionned.").then(m => m.delete(5000));
        return;
    }
    if (userMute.roles.has(role.id)) return message.reply("this user is already muted.").then(m => m.delete(5000));

    userMute.addRole(role).then((userMute) => {
    message.channel.send("User has been muted.").then(m => m.delete(5000))
      .catch(() => {
    message.channel.send("An error has occured.").then(m => m.delete(5000))
      })
    });
}

if (command === 'unmute') {
    message.delete(0);

    var role = message.guild.roles.find("name", config.muteRole);
    if (role == undefined || role == null) { // aborts if role doesn't exist
        message.reply("this server doesn't have a \`"+ config.muteRole +"\` role.").then(m => m.delete(5000));
        return;
    }

    var userUnmute = message.guild.member(message.mentions.users.first());
    if (userUnmute == undefined  || userUnmute == null) { // aborts if no one tagged
        message.reply("no was user mentionned.").then(m => m.delete(5000));
        return;
    }
    if (!userUnmute.roles.has(role.id)) return message.reply("this user is not muted.").then(m => m.delete(5000));

    userUnmute.removeRole(role).then((userUnmute) => {
    message.channel.send("User has been unmuted.").then(m => m.delete(5000))
      .catch(() => {
    message.channel.send("An error has occured.").then(m => m.delete(5000))
      })
    });
}

// Poll Commands
if (command === "poll") { // $poll <title> § <description>
    message.delete(0);

    var str = message.content.slice(config.prefix.length + 5).trim();
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
        .then(function(msg) {
            msg.react("👍");
            msg.react("👎");
        }).catch(console.error);
}

if (command === "epoll") { // $epoll <title> § <descrition> § <choice A> § <choice B> § etc. up to 5
    message.delete(0);

    var str = message.content.slice(config.prefix.length + 6).trim();
    var arg = str.split("|");

    if (arg[1] == undefined || arg[2] == undefined || arg[3] == undefined) {
        message.reply("an error has occured. Please excute `"+config.prefix+"epoll <title> | <description> | <choice 1> | <choice 2>`")
          .then(m => m.delete(5000))
          .catch(console.error);
        return;
    }

    if (arg[4] == undefined) {
        var embed = new Discord.RichEmbed()
          .setColor(config.embedColor)
          .setTitle(arg[0])
          .setDescription(arg[1]+"\n\n"+
                          ":regional_indicator_a: "+arg[2]+"\n"+
                          ":regional_indicator_b: "+arg[3])
          .setTimestamp()

          message.channel.send({embed})
              .then(function(msg) {
                  msg.react("🇦");
                  msg.react("🇧");
              }).catch(console.error);
          return;
    }

    if (arg[5] == undefined) {
        var embed = new Discord.RichEmbed()
          .setColor(config.embedColor)
          .setTitle(arg[0])
          .setDescription(arg[1]+"\n\n"+
                          ":regional_indicator_a: "+arg[2]+"\n"+
                          ":regional_indicator_b: "+arg[3]+"\n"+
                          ":regional_indicator_c: "+arg[4])
          .setTimestamp()

          message.channel.send({embed})
              .then(function(msg) {
                  msg.react("🇦");
                  msg.react("🇧");
                  msg.react("🇨");
              }).catch(console.error);
          return;
    }

    if (arg[6] == undefined) {
        var embed = new Discord.RichEmbed()
          .setColor(config.embedColor)
          .setTitle(arg[0])
          .setDescription(arg[1]+"\n\n"+
                          ":regional_indicator_a: "+arg[2]+"\n"+
                          ":regional_indicator_b: "+arg[3]+"\n"+
                          ":regional_indicator_c: "+arg[4]+"\n"+
                          ":regional_indicator_d: "+arg[5])
          .setTimestamp()

          message.channel.send({embed})
              .then(function(msg) {
                  msg.react("🇦");
                  msg.react("🇧");
                  msg.react("🇨");
                  msg.react("🇩");
              }).catch(console.error);
          return;
    }

    var embed = new Discord.RichEmbed()
      .setColor(config.embedColor)
      .setTitle(arg[0])
      .setDescription(arg[1]+"\n\n"+
                      ":regional_indicator_a: "+arg[2]+"\n"+
                      ":regional_indicator_b: "+arg[3]+"\n"+
                      ":regional_indicator_c: "+arg[4]+"\n"+
                      ":regional_indicator_d: "+arg[5]+"\n"+
                      ":regional_indicator_e: "+arg[6])
      .setTimestamp()

      message.channel.send({embed})
          .then(function(msg) {
              msg.react("🇦");
              msg.react("🇧");
              msg.react("🇨");
              msg.react("🇩");
              msg.react("🇪");
          }).catch(console.error);
      return;
} // End Poll Commands

} // End Mod Commands

if (message.author.id !== config.ownerID) { // Owner Commands
    return;
} else {

if (command === 'uptime') {
    message.delete(0);

    var days = Math.floor(process.uptime() / 86400);
    var hours = Math.floor((process.uptime() % 86400) / 3600);
    var minutes = Math.floor(((process.uptime() % 86400) % 3600) / 60);

    if (days === 0 && hours === 0 && minutes !== 0) {
        message.channel.send("I have been online for "+ minutes +" minute(s).");
    } else if (days === 0 && hours !== 0) {
        message.channel.send("I have been online for "+ hours +" hour(s) and "+ minutes +" minute(s).");
    } else {
        message.channel.send("I have been online for "+ days +" day(s), "+ hours +" hour(s) and "+ minutes +" minute(s).");
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
        .setFooter(new Date())

    message.channel.send({embed})
      .catch(console.error);

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
    else {
        voice++
    }
  }

  return ""+ text +" text channels and "+ voice +" voice channels";
  }
}

if (command === 'version') {
    message.delete(0);

    message.channel.send("I am currently on version **"+ package.version +"**.").catch(console.error);

}

// Bot Cosmetic Commands
if (command === 'setgame') {
    message.delete(0);

    msgcontent = message.content.slice(config.prefix.length+7);
    client.user.setPresence({game:{name:''+msgcontent+'', type:0}}).catch(console.error);
    console.log("Game set to "+ msgcontent +".");
}

if (command === 'setstatus') {
    message.delete(0);

    msgcontent = message.content.slice(config.prefix.length+10);
    client.user.setStatus(msgcontent).catch(console.error);  //online, idle, dnd, invisible
    console.log("Status set to "+ msgcontent +".");
}

if (command === 'setnickname') {
    message.delete(0);

    msgcontent = message.content.substring(config.prefix.length+11);
    message.guild.member(client.user).setNickname(msgcontent).catch(console.error);
    console.log("Nickname set to "+ msgcontent +".");
}

if (command === 'reset') {
    message.delete(0);

    client.user.setPresence({game:{name:config.prefix + "help", type:0}});
    client.user.setStatus("online");
    message.guild.member(client.user).setNickname('');
    console.log("Bot cosmetics were reset.");
} // End Bot Cosmetic Commands

} // End Owner commands





if (message.author.id === config.ownerID) {
    if (command === '!stop') { // STOP THE BOT
        console.log(client.user.username + " has been deactivated.");
        process.exit(1);
    }
}

});

client.login(config.token); //login
