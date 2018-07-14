exports.init = function(client) {

var Discord = require("discord.js");

exports.commands = [
    "coin",
    "roll",
    "rps"
]

exports["coin"] = {
    usage: "Flips a coin.",
    needsAuth: false,
    process: function(message) {
        message.delete(0);
        var flip = Math.floor(Math.random() * 2 + 1);

        if (flip === 1) message.channel.send("Flipped **Tails** !").then(m => m.delete(5000));
        else message.channel.send("Flipped **Heads** !").then(m => m.delete(5000));
    }
}

exports["roll"] = {
    usage: "Rolls <n> <f>-sided dice and sums the result.",
    needsAuth: false,
    process: function(message, args) {
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
}

exports["rps"] = {
    usage: "Play rock-paper-scissors with the bot.",
    needsAuth: false,
    process: function(message, args, config) {
        message.delete(5000);

        if (args[0] != "rock" && args[0] != "paper" && args[0] != "scissors" && args[0] != "scissor") {
            message.reply("an error has occured. Do `"+ config.prefix +"rps <rock/paper/scissors>`");
            return;
        }

        var rps = Math.floor(Math.random() * 3 + 1);
        // rps: rock is 1, paper is 2 and scissors is 3
        if (rps === 1) {
            message.channel.send("Rock!")
            .then(m => {
                if (args[0] == "rock") m.edit("Rock!\nIt's a tie, let's try again!").then(m => m.delete(5000));
                if (args[0] == "paper") m.edit("Rock!\nPaper beats rock, you win!").then(m => m.delete(5000));
                if (args[0] == "scissors" || args[0] == "scissor") m.edit("Rock!\nRock beats scissors, you lose!").then(m => m.delete(5000));
            });
        }

        if (rps === 2) {
            message.channel.send("Paper!")
            .then(m => {
                if (args[0] == "rock") m.edit("Paper!\nPaper beats rock, you lose!").then(m => m.delete(5000));
                if (args[0] == "paper") m.edit("Paper!\nIt's a tie, let's try again!").then(m => m.delete(5000));
                if (args[0] == "scissors" || args[0] == "scissor") m.edit("Paper!\nScissors beat paper, you win!").then(m => m.delete(5000));
            });
        }

        if (rps === 3) {
            message.channel.send("Scissors!")
            .then(m => {
                if (args[0] == "rock") m.edit("Scissors!\nRock beats scissors, you win!").then(m => m.delete(5000));
                if (args[0] == "paper") m.edit("Scissors!\nScissors beat paper, you lose!").then(m => m.delete(5000));
                if (args[0] == "scissors" || args[0] == "scissor") m.edit("Scissors!\nIt's a tie, let's try again!").then(m => m.delete(5000));
            });
        }
    }
}

} // no touchy
