exports.init = function(client) {

var Discord = require("discord.js"),
    fs = require('fs'),
    path = require('path');

var linksFile = "links.json";
var linksConfig = null;

exports.commands = [
    "link"
]

var linksPath = path.join(__dirname, linksFile);
if (fs.existsSync(linksPath)) {
    fs.readFile(linksPath, 'utf8', (err, data) => {
        try {
            linksConfig = JSON.parse(data);
        } catch (err) {
            console.error("Unable to parse \"links.json\".");
        }
    });
} else {
    console.error("\"links.json\" does not exist.");
}

exports["link"] = {
    usage: "Sends the requested link. Will display all available links if none is specified.",
    needsAuth: false,
    process: function(message, args, config) {
        message.delete(0);

        if (config.sendLinks == true) {
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
        else message.reply("the `"+ config.prefix +"link` command is disabled.").then(m => m.delete(5000));

    }
}

} // no touchy
