const {prefix} = require("../config.json");

async function addUser(message, users, doc){
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows(); 

    let existingUsers = new Map(); 
    let exist = [];
    let reply = "";

    //Adds the users to a Map
    rows.forEach(row => {
        if(row.id !== undefined){
            existingUsers.set(row.id.trim(), row.Currency)
        }
    });

    //create a new list of non existing users to add
    let new_users = users.filter(user => {
        if(existingUsers.get(user.id) === undefined){
            return true; 
        }
        else{
            exist.push(user.User); 
            return false;
        }
    })
     
    //Add Users to the database and print out success message
    if(new_users.length !== 0){
        if(new_users.length > 15){
            await sheet.addRows(new_users); 
            reply += "Users have been added!";
        }
        else{
            let userReply = ""; 
            await sheet.addRows(new_users); 
            new_users.forEach(user => {
                userReply += user.User + " "; 
            })

            userReply = "<" + userReply.trim() + ">"; 

            reply += "These users: " + userReply + " have been added successfully!\n"; 
        }
    }

    //Show which users already exist 
    if(exist.length !== 0){
        if(exist.length > 15){
            reply += "Some users already exist!";
        }
        else{
            let existingUsers = "";
            exist.forEach(user => {
                existingUsers += user + " "
            })
            existingUsers = "<" + existingUsers.trim() + ">";

            reply += "These users: " + existingUsers + " already exist!"; 
        }
    }

    return message.reply(reply);
  }

module.exports = {
    name: 'add', 
    description: "adds a new user",
    args: true, 
    usage: "@user... [optional] <currency amt>",
    cooldown: 3, 
    adminOnly: true, 
    guildOnly: false,
    execute(message, args, doc){
        if(args.length >= 1){
            if(!message.mentions.users.size){
                if(args[0] !== "all"){
                    return message.reply("you need to tag a user in order to pay them!"); 
                }
            }
        
            let userList = message.mentions.users.map(user => {
                let value = parseInt(args[args.length - 1]);
                return {
                    "id" : user.id, 
                    "Currency": value !== undefined && !isNaN(value) ? Number.isInteger(value) ? value : 0 : 0, 
                    "User" : user.username + user.discriminator
                }
            })

            if(args[0] === "all"){
                message.guild.members.fetch().then( members => {
                    userList = members.map(member => {
                        let value = parseInt(args[args.length - 1]);
                        user = member.user;
                        return {
                            "id" : user.id, 
                            "Currency": value !== undefined && !isNaN(value) ? Number.isInteger(value) ? value : 0 : 0, 
                            "User" : user.username + user.discriminator
                        }
                    });
                    addUser(message, userList, doc);
                })
            }
            else{
                addUser(message, userList, doc);
            }
            
        }
        else{
            return message.reply(`\nThe proper usage would be: \`${prefix}${this.name} ${this.usage}\``);
        }
    }
}