const Discord = require('discord.js'); //require discord.js 
const client = new Discord.Client();
const {token, prefix} = require('./config.json'); //Using config to store infromation also .env could be use
const color = 0x7f17ff //Cool Color
const fs = require('fs'); //Required to make command hanlder

//This is the foundation of the command handler 
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file=>file.endsWith('.js'));
for (const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
//-----------------------------------------------------------------------------------

//Ready Event 

client.on('ready', ()=>{
    console.log(`${client.user.username} is online!`)
    client.user.setActivity("Am I good Enough yet?", {type: 'PLAYING'})
})

//Message Event for command Handler

client.on('message', message=>{
    /*If the message doesnt start with the prefix it returns 
    If the message is equal to the bot it will return so it doesn't create an infinite loop of 
    the bot responding to itself*/
    if(!message.content.startsWith(prefix) || message.author.equals(client.user)) return;
    //Prevents people from trying to crash bot by sending commands in dms
    if(message.channel.type ==='dm'){return message.author.send('Commands can\'t be sent in dms')}
    //Defining Args
    const args = message.content.slice(prefix.length).split(" ");
    //shifting the command to be in lowercase
    const command = args.shift().toLowerCase();
    //Finishing Command Handler and Catching Error
    if(!client.commands.has(command)) return; //If no command name found return
    try{ 
        client.commands.get(command).execute(message, args);
    } catch(error){
        /*If there is an error the bot wont stop working it will just console log it
        and it will sent a reply message which will delete after 10secs. */
        console.log(error)
        message.reply('There was an error').then(msg=>{
            msg.delete({timeout: 10000})
        })
    }
})

//Connecting to Discord Server
client.login(token);