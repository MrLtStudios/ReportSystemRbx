const fs = require("fs");


const path = require("path");

const FILE = path.join(__dirname, "bans.json");

console.log("BAN DATABASE LOCATION:", FILE);

if(!fs.existsSync(FILE)){

    fs.writeFileSync(
        FILE,
        JSON.stringify([])
    );

}



// ADD BAN

function addBan(userid, reason, length){


    let bans =
    JSON.parse(
        fs.readFileSync(FILE)
    );


    let expires = null;


    if(length === "1 Day"){

        expires =
        Date.now() + (24 * 60 * 60 * 1000);

    }


    if(length === "7 Days"){

        expires =
        Date.now() + (7 * 24 * 60 * 60 * 1000);

    }


    if(length === "30 Days"){

        expires =
        Date.now() + (30 * 24 * 60 * 60 * 1000);

    }


    if(length === "Permanent"){

        expires = "Permanent";

    }



    const ban = {


        userid:String(userid),

        reason:reason,

        length:length,

        created:
        new Date().toISOString(),

        expires:expires


    };



    bans.push(ban);



    fs.writeFileSync(

        FILE,

        JSON.stringify(
            bans,
            null,
            4
        )

    );


    console.log(
        "BAN SAVED:",
        ban
    );


}




// CHECK BAN

function isBanned(userid){


    let bans =
    JSON.parse(
        fs.readFileSync(FILE)
    );



    const ban =
    bans.find(
        b => 
        String(b.userid) === String(userid)
    );



    if(!ban){

        return null;

    }



    // Permanent ban

    if(ban.expires === "Permanent"){

        return ban;

    }



    // Expired

    if(Date.now() > ban.expires){


        removeBan(userid);


        return null;

    }



    return ban;


}




// REMOVE BAN

function removeBan(userid){


    let bans =
    JSON.parse(
        fs.readFileSync(FILE)
    );


    bans =
    bans.filter(
        b =>
        String(b.userid) !== String(userid)
    );



    fs.writeFileSync(

        FILE,

        JSON.stringify(
            bans,
            null,
            4
        )

    );


    console.log(
        "BAN REMOVED:",
        userid
    );


}



function getBans(){


    return JSON.parse(
        fs.readFileSync(FILE)
    );


}



module.exports = {


    addBan,

    getBans,

    isBanned,

    removeBan


};