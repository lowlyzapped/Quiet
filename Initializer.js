var fs = require('fs');

var configPath = "./config.json";
var rulesTextPath = "./files/rules.md";
var welcomeTextPath = "./files/welcome.md";
var linksPath = "./files/links.json";
var birthdaysPath = "./files/birthdays.json";

console.log("Initiating CR34T10N process.");

if (!fs.existsSync(configPath)) { // config.json
    fs.writeFile(
        './config.json',
        '{\n  "token":"",\n  "prefix":"",\n  "ownerID":"",\n  "embedColor":"0x",\n  "logChannel":"",\n  "modRole":"",\n  "muteRole":""\n}',
        function (consoleLog) {
        console.log('+ "./config.json" was created.');
    });
}

if (!fs.existsSync(rulesTextPath)) { // rules.md
    fs.writeFile(
        './files/rules.md',
        "This is the \"rules.md\" document. Add your server's rules here.",
        function (consoleLog) {
        console.log('+ "./files/rules.md" was created.');
    });
}

if (!fs.existsSync(welcomeTextPath)) { // welcome.md
    fs.writeFile(
        './files/welcome.md',
        "This is the \"welcome.md\" document. Add your welcome message at members' arrival here.",
        function (consoleLog) {
        console.log('+ "./files/welcome.md" was created.');
    });
}

if (!fs.existsSync(linksPath)) { // links.json
    fs.writeFile(
        './files/links.json',
        '{\n  "links":[{"name":"repo","link":"https://github.com/TheV0rtex/Quiet","description":"Quiet\'s source code."}]\n}',
        function (consoleLog) {
        console.log('+ "./files/links.json" was created.');
    });
}

if (!fs.existsSync(birthdaysPath)) { // links.json
    fs.writeFile(
        './files/birthdays.json',
        '{}',
        function (consoleLog) {
        console.log('+ "./files/birthdays.json" was created.');
    });
}
