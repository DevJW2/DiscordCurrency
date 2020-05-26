const {prefix} = require("../config.json");

async function transferFunds(message, userList, amt, doc){  
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows(); 
    let existingUsers = new Map(); 
    let noExist = []
    let payedUser = []; 
    let payingUser = null; 
    let totalAmount = 0;
    let noExistMsg = "";

    if(amt <= 0){
        return message.reply("Invalid Amount!");
    }

    //Adds the payed users to a Map
    for(let value = 0; value < rows.length; value++){
        let row = rows[value];
        if(row.id !== undefined){
            existingUsers.set(row.id.trim(), value); 
        }
    }

    //Checks wallet
    for(let value = 0; value < rows.length; value++){
        let row = rows[value]; 
        if(row.id !== undefined && row.id === message.author.id){
            payingUser = row; 
        }
    }

    //gets all the payed users
    for(let value = 0; value < userList.length; value++){
        let user = userList[value];
        let username = user.username + user.discriminator; 
        let index = existingUsers.get(user.id);
        
        if(index !== undefined){
            payedUser.push(rows[index])
            if(payingUser !== null && payingUser.User === rows[index].User){
                return message.reply("You're transferring funds to yourself!");
            }
        }
        else{
            noExist.push(username); 
        }
    }

    totalAmount = amt * payedUser.length;

    if(payingUser === null || payingUser === undefined){
        return message.reply("Please contact an Administrator!");
    }

    if(payingUser.Currency < totalAmount){
        return message.reply("You don't have enough funds!");
    }    

    if(noExist.length !== 0){
        let noExistUsers = "";
        noExist.forEach(user => {
            noExistUsers += user + " "
        })
        noExistUsers = "<" + noExistUsers.trim() + ">";

        noExistMsg += "These users: " + noExistUsers + " do not exist!\n"; 
    }

    //Verification Step
    let msg = ""
    const filter = m => m.author.id === message.author.id; 
    if(payedUser.length !== 0){
        let payedUserMsg = "";
        for(let n = 0; n < payedUser.length; n++){
            let user = payedUser[n]; 
            payedUserMsg += user.User + " ";
        }
        payedUserMsg = "<" + payedUserMsg.trim() + ">";
        msg = "Please Confirm Transaction\n" + totalAmount + " to " + payedUserMsg + "\n" + "Type Y / N\n" + "(Expires in 30 seconds)" + "\n" + noExistMsg
    }
    else{
        return message.reply("These users don't have an account!"); 
    }
    
    message.author.send(msg)
        .then((new_msg) => {
            //Waits for the response of the new message
            new_msg.channel.awaitMessages(filter, {max: 1, time: 30000}).then(async (collected) => {
                let response = collected.first().content.toLowerCase();

                if(response === "yes" || response === "y"){
                    if(payedUser.length !== 0 && payingUser !== null){
                        
                        payingUser.Currency = parseInt(payingUser.Currency) - totalAmount; 
                        await payingUser.save();

                        let payedUserMsg = "";
                        
                        for(let n = 0; n < payedUser.length; n++){
                            let user = payedUser[n]; 
                            payedUserMsg += user.User + " ";
                            user.Currency = parseInt(user.Currency) + amt; 
                            await user.save();
                            message.client.users.fetch(user.id).then((user) => {
                                user.send("You just received " + amt + " from " + payingUser.User);
                            });
                        }
                        payedUserMsg = "<" + payedUserMsg.trim() + ">";

                        return new_msg.reply(":tada: Transaction Accepted! :tada:\nYou transferred: " + amt + " to " + payedUserMsg + "\nYou now have " + payingUser.Currency + " in your wallet!"); 
                    }
                    else{
                        return new_msg.reply("Something went wrong with the Transaction! Please contact an Administrator!");
                    }
                }
                else{
                    return new_msg.reply("Transaction Canceled!"); 
                }
            }).catch((err) => {return new_msg.reply("Transaction Timed Out!");})

            new_msg.delete({timeout: 30000}); //Deletes the message

            if (message.channel.type === 'dm') return;
            message.reply('I\'ve sent you a DM to confirm your transaction!');
        })
        .catch(error => {
            console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
            message.reply('it seems like I can\'t DM you!');
        });
  }

module.exports = {
    name: 'transfer', 
    description: "transfer funds",
    aliases: ['pay', 'spend'],
    args: true, 
    usage: "<user>... <amount>",
    cooldown: 5, 
    adminOnly: false, 
    guildOnly: false,
    execute(message, args, doc){
        if(args.length >= 2){
            if(!message.mentions.users.size){
                //Test for all 
                if(args[0] !== "all"){
                    return message.reply("you need to tag a user in order to pay them!"); 
                }
            }

            let value = parseInt(args[args.length - 1]);

            if(value === undefined || isNaN(value)){
                return message.reply("you need to input a valid value!");
            }

            let userList = message.mentions.users.map(user => {
                return user;
            })

            if(args[0] === "all"){
                message.guild.members.fetch().then( members => {
                    members.delete(message.author.id); //Deletes yourself
                    userList = members.map(user => user.user);
                    transferFunds(message, userList, value, doc);
                })
            }
            else{
                transferFunds(message, userList, value, doc);
            }
        }
        else{
            return message.reply(`\nThe proper usage would be: \`${prefix}${this.name} ${this.usage}\``);
        }
        
    }
}