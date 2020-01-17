const Discord = require('discord.js');
const client = new Discord.Client();
const dotenv = require('dotenv');
dotenv.config();


client.on('ready', () => {
    if(!(process.env.PREFIX != undefined))
        console.error('No prefix set')

    console.log('Bot online!')
})

client.on('message', message => {
    if (!message.content.startsWith(process.env.PREFIX) || !message.guild) return;
    const command = message.content.split(' ').slice(1).join(' ');

    switch (command) {
        case 'help':
            help(message.member)
            break;
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
            console.log('Unrecognized command: ' + command)
            break;
    }
})

function help(member){
    const embed = new Discord.RichEmbed()
      .setTitle('AdamBot Guide:')
      .setColor(0xFF0000)
      .setDescription('Bot call prefix: "Adam!"\n"gel": Basic ping function\n"çıkar beni": Removes you from voice channel\n"gezdir beni": Scrolls you through all voice channels');

    member.send(embed);

}

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