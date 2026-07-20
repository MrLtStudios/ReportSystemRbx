require("dotenv").config();

const { handleCommand } = require("./commands");

const express = require("express");

const {
    addBan,
    getBans
} = require("./bans");


const {
    Client,
    GatewayIntentBits,
    Events,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");



const app = express();

app.use(express.json());



// =========================
// DISCORD BOT
// =========================

const client = new Client({

    intents:[
        GatewayIntentBits.Guilds
    ]

});



client.once(
    Events.ClientReady,
    (bot)=>{

        console.log(
            `${bot.user.tag} is online`
        );

    }
);





// =========================
// RECEIVE REPORT
// =========================

app.post(
"/sendReport",
async(req,res)=>{


    try{


        const report = req.body;


        console.log(
            "Report Received:",
            report
        );



        const channel =
        await client.channels.fetch(
            process.env.REPORT_CHANNEL_ID
        );



        const embed =
        new EmbedBuilder()

        .setTitle(
            "🚨 New Player Report"
        )

        .setThumbnail(
            report.avatar
        )

        .addFields(

            {
                name:"Reported Player",
                value:
                `${report.username}\nID: ${report.userid}`
            },


            {
                name:"Reporter",
                value:
                report.reporter
            },


            {
                name:"Reason",
                value:
                report.reason
            },


            {
                name:"Evidence",
                value:
                report.evidence
            }

        )

        .setTimestamp();




        const row =
        new ActionRowBuilder()

        .addComponents(

            new ButtonBuilder()
            .setCustomId(
                `accept_${report.userid}`
            )
            .setLabel(
                "Accept Report"
            )
            .setEmoji("✅")
            .setStyle(
                ButtonStyle.Success
            ),


            new ButtonBuilder()
            .setCustomId(
                `reject_${report.userid}`
            )
            .setLabel(
                "Reject"
            )
            .setEmoji("❌")
            .setStyle(
                ButtonStyle.Danger
            )

        );



        await channel.send({

            embeds:[
                embed
            ],

            components:[
                row
            ]

        });



        res.json({
            success:true
        });


    }
    catch(err){

        console.log(err);

        res.status(500).json({
            error:err.message
        });

    }


});






// =========================
// BUTTON HANDLER
// =========================

client.on(
Events.InteractionCreate,
async(interaction)=>{

   console.log(
    "RAW INTERACTION:",
    interaction.type,
    interaction.commandName
);

    // SLASH COMMANDS
    if(interaction.isChatInputCommand()){

    console.log(
        "SLASH COMMAND RECEIVED:",
        interaction.commandName
    );


    try {

        await handleCommand(interaction);

    } catch(error){

        console.log(
            "SLASH COMMAND ERROR:",
            error
        );


        if(!interaction.replied){

            await interaction.reply({
                content:"❌ Command crashed",
                ephemeral:true
            });

        }

    }


    return;

}


    if(!interaction.isButton())
        return;



    console.log(
        "BUTTON:",
        interaction.customId
    );



    const [
        action,
        userid
    ] =
    interaction.customId.split("_");



    console.log(
        "ACTION:",
        action
    );





    // ACCEPT REPORT

    if(action === "accept"){



        const row =
        new ActionRowBuilder()

        .addComponents(


            new ButtonBuilder()
            .setCustomId(
                `ban_${userid}`
            )
            .setLabel(
                "🔨 Ban Player"
            )
            .setStyle(
                ButtonStyle.Danger
            ),


            new ButtonBuilder()
            .setCustomId(
                `ipban_${userid}`
            )
            .setLabel(
                "🌐 IP Ban"
            )
            .setStyle(
                ButtonStyle.Danger
            ),


            new ButtonBuilder()
            .setCustomId(
                `cancel_${userid}`
            )
            .setLabel(
                "Cancel"
            )
            .setStyle(
                ButtonStyle.Secondary
            )


        );



        await interaction.reply({

            content:
            `⚖️ Choose Punishment\nPlayer ID: ${userid}`,

            components:[
                row
            ]

        });



        return;

    }






    // OPEN BAN LENGTH MENU

    if(action === "ban"){


        console.log(
            "OPENING BAN LENGTH"
        );



        const row =
        new ActionRowBuilder()

        .addComponents(


            new ButtonBuilder()
            .setCustomId(
                `ban1_${userid}`
            )
            .setLabel(
                "1 Day"
            )
            .setStyle(
                ButtonStyle.Primary
            ),


            new ButtonBuilder()
            .setCustomId(
                `ban7_${userid}`
            )
            .setLabel(
                "7 Days"
            )
            .setStyle(
                ButtonStyle.Primary
            ),


            new ButtonBuilder()
            .setCustomId(
                `ban30_${userid}`
            )
            .setLabel(
                "30 Days"
            )
            .setStyle(
                ButtonStyle.Primary
            ),


            new ButtonBuilder()
            .setCustomId(
                `banperm_${userid}`
            )
            .setLabel(
                "Permanent"
            )
            .setStyle(
                ButtonStyle.Danger
            )

        );



        await interaction.update({

            content:
            `🔨 Choose Ban Length\nPlayer ID: ${userid}`,

            components:[
                row
            ]

        });


        return;

    }






    // BAN LENGTH SELECTED

    if(
        [
            "ban1",
            "ban7",
            "ban30",
            "banperm"
        ].includes(action)
    ){



        let length;



        if(action==="ban1")
            length="1 Day";


        if(action==="ban7")
            length="7 Days";


        if(action==="ban30")
            length="30 Days";


        if(action==="banperm")
            length="Permanent";



        console.log(
            "BAN SAVING:",
            userid,
            length
        );



        console.log("ADDING BAN TO DATABASE:", userid);

addBan(
    userid,
    "Normal Ban",
    length
);



        await interaction.update({

            content:
            `🔨 BAN CREATED\n\nPlayer: ${userid}\nLength: ${length}`,

            components:[]

        });



        return;

    }







    if(action==="reject"){


        await interaction.reply({

            content:
            "❌ Report rejected",

            flags:64

        });


        return;

    }





    if(action==="cancel"){


        await interaction.reply({

            content:
            "Cancelled",

            flags:64

        });


        return;

    }


});







// =========================
// ROBLOX BAN CHECK API
// =========================

app.get("/checkBan/:userid", (req, res)=>{

    const userid = req.params.userid;


    const { isBanned } = require("./bans");


    const ban = isBanned(userid);



    if(ban){

        return res.json({

            banned:true,

            userid:ban.userid,

            reason:ban.reason,

            length:ban.length,

            created:ban.created

        });

    }



    res.json({

        banned:false

    });


});

// =========================
// START
// =========================

app.listen(
4000,
()=>{

    console.log(
        "Report API running on port 4000"
    );

});



client.login(
process.env.DISCORD_TOKEN
);