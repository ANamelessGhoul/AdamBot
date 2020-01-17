const Discord = require('discord.js')
const client = new Discord.Client()

const token = 'NjY3MzMyNjk4NDY0ODQ1ODI1.XiBNag.05SyXVJFKOsh5GVK99EyvrTkRMs'

const botCall = 'Adam! '

client.on('ready', () => {
    console.log('Bot online!')
})

client.on('message', message => {
    if(message.content === botCall + 'gel'){
        message.reply('Siktir!')
    }
})

client.on('message', message => {
    if (message.content === botCall + 'çıkar beni') 
    {
        if(message.member.voiceChannelID == null)
            message.reply('Ma nerdesin da çıkaracam be!')
        else
        {
            message.reply('Ey be tamam!')
            message.member.setVoiceChannel(null)
        }
            
    }
})

client.on('message', message => {
    if (message.content === botCall + 'gezdir beni') 
    {
        /*
        client.channels.forEach(element => {
            message.member.setVoiceChannel(element)
        }); 
        */
        
        let firstChannel

        
        if(message.member.voiceChannelID != undefined)
            firstChannel = message.member.voiceChannel

        message.guild.channels.filter(g => g.type == 'voice').forEach(element => {

            message.member.setVoiceChannel(element)
        })

        if(firstChannel != undefined)
            message.member.setVoiceChannel(firstChannel)

        
    }
})

client.login(token);