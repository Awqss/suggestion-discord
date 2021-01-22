//Makes it so we dont need to type out Discord.MessageEmbed()
const {MessageEmbed} = require('discord.js');

//This is the Object we are going to use for every new suggestion made
const waitingStatus = {
    Waiting: {
        text: '⏰ The Suggestion is waiting for more feedback',
        color: 0xFFFF00,
    }
}
//cool color
const color = 0xff5331

//Adding a cooldown on command so people don't spam suggestions and prevents trolling
const commandUsedRecently = new Set()

module.exports = {
    //this is the command example if name is hello the command is .hello
    //the command will be .suggest since the prefix currently set is '.'
    name: 'suggest',
    //this doesn't matter just makes it more organized
    description: 'suggestion command',
    /*Using execute instead of run since it was set to execute in the index.js file
    You can use either but make sure you also change it in the index.js file, I prefer 
    execute since it sounds cooler*/
    async execute(message, args){
        //I Like keeping chat clean dont really like to see too many bot commands in my
        //discord servers
        message.delete();
        //Checks if user used command recently
        if(commandUsedRecently.has(message.author.id)){
            return message.reply('Must Wait 5mins before sending another suggestion').then(msg=>{
                msg.delete({timeout: 10000})
            })
        }

        //Finds Channel called suggestions and if not found reminds you to create one
        let channel = message.guild.channels.cache.find(c=>c.name ==='suggestions')
        if(!channel) {return message.reply('Please Create a channel called Suggestions').then(msg=>{
            msg.delete({timeout: 10000})
        })}

        //This is the part where the use types to suggestion, it cuts out the .suggest part of the command
        let description = args.slice(0).join(" ")
        if(!description){return message.reply('Please make a suggestion').then(msg=>{
            msg.delete({timeout: 10000})
        })}

        //creating Embed
        const suggestionEmbed = new MessageEmbed()
        .setTitle('Incoming Suggestion')
        //Used the description variable
        .setDescription(description)
        /*Sets footer to the the users username and it displays the users pfp in a dynamic way so it they have a 
        a gif as theyre pfp it will show onto the embed*/
        .setFooter(`Sent By ${message.author.username}`, `${message.author.displayAvatarURL({dynamic: true})}`)
        //Shows time sent in the footer
        .setTimestamp()
        //gets object created called waitingStatus
        .addFields({
            name: 'status',
            value: waitingStatus.Waiting.text
        })
        .setColor(waitingStatus.Waiting.color)


        //Sends Embed to channel called suggestions 
        //Use await so that it always reacts with ✅ first then ❌
        channel.send(suggestionEmbed).then(async msgEmbed=>{
            await msgEmbed.react('✅')
            await msgEmbed.react('❌')
        })

        //New embed to show that the suggestion has been created
        //Embed will be sent to users dm
        const successEmbed = new MessageEmbed()
        .setTitle('Congratulations')
        .setDescription(`Your Suggestion has been posted in <#${channel.id}>`)
        .setColor(color)
        message.author.send(successEmbed)
        //Logs author.id in the collection
        commandUsedRecently.add(message.author.id);
        //After 5mins it removes it from the collection
        setTimeout(() => {
            commandUsedRecently.delete(message.author.id)
        }, 300000);

    }
}