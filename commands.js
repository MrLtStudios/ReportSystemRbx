const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");


const FILE = path.join(__dirname, "bans.json");



function getBans(){

    console.log("READING BAN FILE:", FILE);


    if(!fs.existsSync(FILE)){
        return [];
    }


    return JSON.parse(
        fs.readFileSync(FILE, "utf8")
    );

}



function saveBans(bans){

    fs.writeFileSync(
        FILE,
        JSON.stringify(
            bans,
            null,
            4
        )
    );

}





async function handleCommand(interaction){


    try{


        console.log(
            "COMMAND RECEIVED:",
            interaction.commandName
        );



        // =====================
        // /bans
        // =====================

        if(interaction.commandName === "bans"){


            await interaction.deferReply();


            const bans = getBans();



            if(bans.length === 0){

                await interaction.editReply(
                    "✅ No active bans"
                );

                return;

            }



            let text = "";



            bans.forEach((ban)=>{


                text +=
                `👤 **${ban.userid}**\n`+
                `Reason: ${ban.reason}\n`+
                `Length: ${ban.length}\n\n`;


            });



            const embed =
            new EmbedBuilder()

            .setTitle(
                "🚫 Active Bans"
            )

            .setDescription(
                text.substring(0,4000)
            )

            .setTimestamp();



            await interaction.editReply({

                embeds:[
                    embed
                ]

            });


            return;


        }





        // =====================
        // /unban
        // =====================

        if(interaction.commandName === "unban"){


            await interaction.deferReply();



            const userid =
            interaction.options.getString(
                "userid"
            );



            let bans = getBans();



            const before =
            bans.length;



            bans =
            bans.filter(
                ban =>
                String(ban.userid)
                !==
                String(userid)
            );



            if(bans.length === before){


                await interaction.editReply(
                    `❌ No ban found for ${userid}`
                );


                return;

            }



            saveBans(bans);



            await interaction.editReply(
                `✅ Unbanned ${userid}`
            );


        }



    }
    catch(error){


        console.log(
            "COMMAND ERROR:",
            error
        );


        if(interaction.deferred){

            await interaction.editReply(
                "❌ Command failed. Check console."
            );

        }
        else{

            await interaction.reply({
                content:
                "❌ Command failed.",
                ephemeral:true
            });

        }


    }


}



module.exports = {
    handleCommand
};