console.log("Starting bot...");

require("dotenv").config();

console.log("Token exists:", !!process.env.DISCORD_TOKEN);

const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN)
    .catch((error) => {
        console.log("LOGIN ERROR:");
        console.log(error);
    });