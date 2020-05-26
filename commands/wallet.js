const {prefix} = require("../config.json");

async function checkWallet(message, doc){
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows(); 

    let userEmbed = {
        color: 0x98ff98,
        description: "",
        author: {
            name: "Wallet", 
        },
        fields: []
    }

    //Checks wallet
    rows.forEach(row => {
        if(row.id !== undefined && row.id === message.author.id){
            userEmbed.description = row.User + " --------------- " + row.Currency

            return message.reply({embed: userEmbed});
        }
    });

  }

module.exports = {
    name: 'wallet', 
    description: "checks your own wallet",
    args: false, 
    usage: "",
    cooldown: 3, 
    adminOnly: false, 
    guildOnly: false,
    execute(message, args, doc){
        checkWallet(message, doc);
    }
}