const {MessageEmbed} = require('discord.js');
const color = 0x7f17ff

//Creates object for suggestion being accepted or denied
const embedStatus = {
    Accepted: {
        text: '✅ Suggestion Has Been Accepted',
        color: 0x34eb5b
    },
    Denied: {
        text: '❌ Suggestion Has Been Denied',
        color: 0xc20808,
    },
}

module.exports = {
    name: 'setstatus',
    description: 'set embed status',
    async execute(message, args){
        message.delete();
        let channel = message.guild.channels.cache.find(c=>c.name==='suggestions');
        if(!channel){return message.reply('Please Create Channel named suggestions').then(msg=>{
            msg.delete({timeout: 10000})
        })}

        //Making it only so people with admin perms can use this command

        if(!message.member.hasPermission('ADMINISTRATOR')){return message.reply('No Perms').then(msg=>{
            msg.delete({timeout: 10000})
        })}

        //Declaring what msgId is

        let msgId = args[0]
        if(!msgId){return message.reply('Please Provide Message Id').then(msg=>{
            msg.delete({timeout: 10000})
        })}

        //Fetching messageId

        const fetchedMessage = await channel.messages.fetch(msgId, false, true)
        if(!fetchedMessage){
            message.reply('Message doesn\'t exist anymore').then(msg=>{
                msg.delete({timeout: 10000})
            })
        }

        //our status is either Accepted or Denied

        const status = args[1]
        const newStatus = embedStatus[status]
        if(!newStatus){
            return message.reply(`Unknown Status ${status}, please use ${Object.keys(embedStatus)}`).then(msg=>{
                msg.delete({timeout: 10000})
            })
        }

        //This is the reason of why you are accepting the suggestion
        let reason = args.slice(2).join(" ")
        if(!reason){return message.reply('You Need to Provide a reason either Accepted or Denied').then(msg=>{
            msg.delete({timeout: 10000})
        })}

        const editEmbed = fetchedMessage.embeds[0]

        //Making the New Embed in which the old embed will be made into

        const newEmbed = new MessageEmbed()
        .setTitle('Server Suggestions')
        .setDescription(editEmbed.description)
        .setColor(newStatus.color)
        //Says who accepted or denied the suggestion as a footer
        .setFooter(status+ ` By ${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))

        if(editEmbed.fields.length === 2){
            newEmbed.addFields(editEmbed.fields[0]),{
                name: 'Status',
                value: `${newStatus.text} ${reason ? `Reason: ${reason}`: ''}`
            }
        } else {
            newEmbed.addFields({
                name: 'Status',
                value: `${newStatus.text} ${reason ? `Reason: ${reason}` : ''}`
            })
        }
        fetchedMessage.edit(newEmbed)
    }
}