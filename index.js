const Discord = require('discord.js')
const client = new Discord.Client()


const token = 'NjY3NjQwMDM5NjI2MjQ0MTIx.XiFqXA.yQPRpa5Z_ZlxEXzSzaoM-8FT_Yo' //beta
//const token = 'NjY3MzMyNjk4NDY0ODQ1ODI1.XiBNag.05SyXVJFKOsh5GVK99EyvrTkRMs' //release



const botPrefix = 'Adam!'

client.on('ready', () => {
    console.log('Bot online!')
})

client.on('message', message => {
    if (!message.content.startsWith(botPrefix) || !message.guild) return;
    //const command = message.content.split(' ')[1];
    const command = message.content.split(' ').slice(1).join(' ');

    switch (command) {
        case 'gel':
            gel(message)
            break;
        case 'çıkar beni':
            cikar(message)
            break;
        case 'gezdir beni':
            gezdir(message)
            break;
        default:
            break;
    }
})

function gel(message){
    message.reply('Siktir!')
}

function cikar(message){
    if(message.member.voiceChannelID == null)
        message.reply('Ma nerdesin da çıkaracam be!')
    else
    {
        message.reply('Ey be tamam!')
        message.member.setVoiceChannel(null)
    }
}

function gezdir(message)
{
    var user = message.member

    if(user.voiceChannelID == null)
    {
        message.reply('Girmeden bir yere nasıl gezdireyim be seni!')
        return;
    } 

    var firstChannel = user.voiceChannel

    message.guild.channels.filter(g => g.type == 'voice').forEach(element => {
        user.setVoiceChannel(element)
    })

    user.setVoiceChannel(firstChannel)    
}
    

client.login(process.env.TOKEN)
    .catch( err => {
        client.login(token)

        console.error(err)
    })