require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Events
} = require("discord.js");


const client = new Client({
    intents:[
        GatewayIntentBits.Guilds
    ]
});


client.once(Events.ClientReady, async () => {

    console.log("BOT ONLINE");


    const channel = await client.channels.fetch(
        process.env.REPORT_CHANNEL_ID
    );


    console.log("CHANNEL:", channel.name);



    const row = new ActionRowBuilder()
    .addComponents(

        new ButtonBuilder()
        .setCustomId("test_accept")
        .setLabel("Accept Test")
        .setStyle(ButtonStyle.Success),


        new ButtonBuilder()
        .setCustomId("test_reject")
        .setLabel("Reject Test")
        .setStyle(ButtonStyle.Danger)

    );



    await channel.send({

        content:"BUTTON TEST MESSAGE",

        components:[
            row
        ]

    });


    console.log("MESSAGE SENT");


    process.exit();

});


client.login(process.env.DISCORD_TOKEN);