require("dotenv").config();

const { REST, Routes } = require("discord.js");


const commands = [

    {
        name:"bans",
        description:"View all banned players"
    },


    {
        name:"unban",
        description:"Remove a ban from a player",
        options:[
            {
                name:"userid",
                description:"Roblox User ID",
                type:3,
                required:true
            }
        ]
    }

];


const rest = new REST({
    version:"10"
}).setToken(
    process.env.DISCORD_TOKEN
);



console.log("Registering commands...");


rest.put(

    Routes.applicationCommands(
        process.env.CLIENT_ID
    ),

    {
        body:commands
    }

)

.then(()=>{

    console.log(
        "Commands registered!"
    );

})

.catch(console.error);