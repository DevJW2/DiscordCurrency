const {prefix} = require("../config.json");

async function list(message, args, doc){
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows(); 

    let serverSize = false; 
    let msg = "";

    let userEmbed = {
        color: 0x98ff98,
        title: 'Bank', 
        description: 'User Wallets', 
        fields : []
    }

    if(args === "all"){    
        //Get all the users
        if(rows.length > 25){
            serverSize = true; 
            rows.forEach(row => {
                if(row.id !== undefined){
                    msg += "name: " + row.User + ", value: " + row.Currency + "\n";
                }
            });
        }
        else{
            rows.forEach(row => {
                if(row.id !== undefined){
                    userEmbed.fields.push({
                        name: row.User, 
                        value: row.Currency,
                        inline: true
                    })
                }
            });
        }
    }
    else{
        rows.forEach(row => {
            if(row.id !== undefined && args.includes(row.id)){
                userEmbed.fields.push({
                    name: row.User, 
                    value: row.Currency,
                    inline: true
                })
            }
        });
    }
    

    return message.author.send(serverSize ? msg : {embed: userEmbed})
        .then(() => {
            if (message.channel.type === 'dm') return;
            message.reply('I\'ve sent you a DM!');
        })
        .catch(error => {
            console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
            message.reply('it seems like I can\'t DM you!');
        });
 
  }

module.exports = {
    name: "list", 
    args: true, 
    description: "list the users and their currencies", 
    usage: "<user>... /!list all", 
    cooldown: 3, 
    guildOnly: false, 
    adminOnly: true,
    execute(message, args, doc){
        if(args[0] === "all"){
            list(message, "all", doc)
        }
        else{
            if(!message.mentions.users.size){
                return message.reply("you need to tag a user in order to list them!"); 
            }

            const userList = message.mentions.users.map(user => {        
                return user.id
            })
            
            list(message, userList, doc);
        }
    }
}