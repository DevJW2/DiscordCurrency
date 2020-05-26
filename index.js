require('dotenv').config()

const {prefix} = require("./config.json");
const fs = require("fs");
const Discord = require('discord.js');
const {GoogleSpreadsheet} = require('google-spreadsheet'); 
const doc = new GoogleSpreadsheet(process.env.SHEET_TOKEN);
const client = new Discord.Client();

client.commands = new Discord.Collection(); //Create a new Collection(Map)
const cooldowns = new Discord.Collection(); //Create a new Cooldowns Collection
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('js'));

//Populate the Map with command objects
for(const file of commandFiles){
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

/**
 * Bot Login
 */
client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  //Load in Service Account
  await doc.useServiceAccountAuth(require("./client_secret.json")); 
  await doc.loadInfo(); 
});

/**
 * Adds users to the database(google sheet) when a new member joins
 */
client.on('guildMemberAdd', async (member) => {
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows(); 
  let userExists = false; 
  //Adds the users to a Map
  rows.forEach(row => {
      if(row.id === member.user.id){
        console.log("user already exists!");
        userExists = true;
      }
  });

  if(!userExists){
    await sheet.addRow({
      "id" : member.user.id,
      "Currency" : 0, 
      "User": member.user.username + member.user.discriminator    
    })
  }
})

/**
 * Handle server messages
 */
client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

  //Test if the command Exists
  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  //Test for Arguments
  if(command.args && !args.length){
    let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
  }

  //Server Only Commands
  if (command.guildOnly && message.channel.type !== 'text') {
    return message.reply('I can\'t execute that command inside DMs!');
  }

  if(command.adminOnly && (message.member === undefined || message.member === null) ){
    return message.reply("Server only command!");
  }
  //Admin Only Commands
  if(command.adminOnly && !message.member.hasPermission("ADMINISTRATOR")){
    return message.reply("This command is for admin usage only!");
  }

  //Set Cooldowns
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  //Execution of the Command
	try {
		command.execute(message, args, doc);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});


client.login(process.env.TOKEN);