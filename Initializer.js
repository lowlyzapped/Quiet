var fs = require('fs');

var configPath = "./config.json";
var pluginOrderPath = "./pluginOrder.json";
var rulesPath = "./plugins/members/rules.md";
var welcomePath = "./plugins/members/welcome.md";
var linksPath = "./plugins/links/links.json";

console.log("Initiating CR34T10N process.");

if (!fs.existsSync(configPath)) { // config.json
    fs.writeFile(
        configPath,
        '{\n  "token":"",\n  "prefix":"",\n  "ownerID":"",\n\n'+
        '  "logChannelName":"",\n\n'+
        '  "sendRules":false,\n  "sendWelcome":false,\n  "sendLinks":false,\n\n'+
        '  "muteRole":"",\n  "muteEmoji":"",\n  "unmuteEmoji":"",\n\n'+
        '  "embedColor":"0x",\n  "joinColor":"0x18bb68",\n  "leaveColor":"0xe9890f",\n'+
        '  "kickColor":"0xff3b00",\n  "banColor":"0xff0000",\n  "muteColor":"0x696969",\n\n'+
        '  "authorisedRoles":[]\n}',
        function (log) {
            console.log("+ \""+ configPath +"\" was created.");
        }
    );
}

if (!fs.existsSync(pluginOrderPath)) { // pluginOrder.json
    fs.writeFile(
        pluginOrderPath,
        '[{"name":"bot","sortOrder":1},\n{"name":"games","sortOrder":2},\n{"name":"links","sortOrder":3},\n'+
        '{"name":"members","sortOrder":4},\n{"name":"moderation","sortOrder":5},\n'+
        '{"name":"polls","sortOrder":6},\n{"name":"server","sortOrder":7}]',
        function (log) {
            console.log("+ \""+ pluginOrderPath +"\" was created.");
        }
    );
}

if (!fs.existsSync(rulesPath)) { // rules.md
    fs.writeFile(
        rulesPath,
        "This is the \"rules.md\" document. Add your server's rules here.",
        function (log) {
            console.log("+ \""+ rulesPath +"\" was created.");
        }
    );
}

if (!fs.existsSync(welcomePath)) { // welcome.md
    fs.writeFile(
        welcomePath,
        "This is the \"welcome.md\" document. Add your welcome message at members' arrival here.",
        function (log) {
            console.log("+ \""+ welcomePath +"\" was created.");
        }
    );
}

if (!fs.existsSync(linksPath)) { // links.json
    fs.writeFile(
        linksPath,
        '{\n  "links":[{"name":"repo","link":"https://github.com/TheV0rtex/Quiet","description":"Quiet\'s source code."}]\n}',
        function (log) {
            console.log("+ \""+ linksPath +"\" was created.");
        }
    );
}

if (!fs.existsSync(pollsPath)) { // polls.json
    fs.writeFile(
        './files/polls.json',
        '{}',
        function (pollsLog) {
        console.log('+ "./files/polls.json" was created.');
    });
}
