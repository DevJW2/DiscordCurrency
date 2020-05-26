const {prefix} = require("../config.json");

async function updateUser(message, users, new_currency, doc){
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows(); 

    let existingUsers = new Map(); 
    let noExist = [];
    let updated = []; 

    //Adds the users to a Map
    for(let value = 0; value < rows.length; value++){
        let row = rows[value];
        if(row.id !== undefined){
            existingUsers.set(row.id.trim(), value); 
        }
    }

    //Updates the respective currencies for the user
    for(let value = 0; value < users.length; value++){
        let user = users[value];
        let username = user.username + user.discriminator; 
        let index = existingUsers.get(user.id);
        
        if(index !== undefined){
            rows[index].Currency = new_currency;
            await rows[index].save();
            updated.push(username);
        }
        else{
            noExist.push(username); 
        }
    }

    let reply = "";
    //Show which users already exist 
    if(updated.length !== 0){
        let updatedUsers = "";
        updated.forEach(user => {
            updatedUsers += user + " "
        })
        updatedUsers = "<" + updatedUsers.trim() + ">";

        reply += "These users: " + updatedUsers + " successfully updated!\n"; 
    }

    if(noExist.length !== 0){
        let noExistUsers = "";
        noExist.forEach(user => {
            noExistUsers += user + " "
        })
        noExistUsers = "<" + noExistUsers.trim() + ">";

        reply += "These users: " + noExistUsers + " do not exist!\n"; 

    }

    return message.reply(reply);
    
  }

module.exports = {
    name: 'update', 
    description: "updates user currency",
    args: true, 
    usage: "@user... <currency amt>",
    cooldown: 3, 
    adminOnly: true, 
    guildOnly: false,
    execute(message, args, doc){
        if(args.length >= 2){
            if(!message.mentions.users.size){
                return message.reply("you need to tag a user in order to update them!"); 
            }
            let value = parseInt(args[args.length - 1]);
            
            if(value === undefined || isNaN(value)){
                return message.reply("you need to input a value to update the currency with!");
            }
            const userList = message.mentions.users.map(user => {
                return user;
            })
            
            updateUser(message, userList, value, doc);
            
        }
        else{
            return message.reply(`\nThe proper usage would be: \`${prefix}${this.name} ${this.usage}\``);
        }
    }
}