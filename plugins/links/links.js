exports.init = function(client) {

exports.commands = [
    "link"
]

exports["link"] = {
    usage: "`$link <link-name>` - Sends the requested link. Will display",
    needsAuth: false,
    process: function(message, args) {
        message.delete(0);

        var linksPath = "./links.json";
        var linksConfig = null;

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
}

}
