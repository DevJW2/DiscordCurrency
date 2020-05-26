const {prefix} = require("../config.json");

async function removeUsers(message, theUser, doc){
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows(); 

    let username = theUser.username + theUser.discriminator;
    let deleted = "";

    //Delete the user if the user exists
    for(let value = 0; value < rows.length; value++){
        row = rows[value]; 
        if(row.id !== undefined && row.id.trim() === theUser.id){
            deleted = username;
            await row.del();
        }
    }

    let reply = "";
    if(deleted === ""){
        reply += "The user: <" + username + "> does not exist!"; 
    }
    else{
        reply += "The user: <" + deleted + "> has been deleted!";
    }

    return message.reply(reply);
    
  }

module.exports = {
    name: 'remove', 
    description: "removes a user",
    args: true, 
    usage: "@user",
    cooldown: 3, 
    adminOnly: true, 
    guildOnly: false,
    execute(message, args, doc){
        if(args.length == 1){
            if(!message.mentions.users.size){
                return message.reply("you need to tag a user in order to remove them!"); 
            }

            theUser = message.mentions.users.first(); 
            removeUsers(message, theUser, doc);
            
        }
        else{
            return message.reply(`\nThe proper usage would be: \`${prefix}${this.name} ${this.usage}\``);
        }
    }
}