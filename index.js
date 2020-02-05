const Discord = require('discord.js');
const client = new Discord.Client();
const Util = Discord.Util;

const dotenv = require('dotenv');
dotenv.config();

const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.YOUTUBE_API_KEY);

const ytdl = require('ytdl-core');



client.on('ready', () => {
    if(!(process.env.PREFIX != undefined))
        console.error('No prefix set');

    console.log('Bot online!');
})


client.on('warn', console.warn);

client.on('error', console.error);

client.on('disconnect', () => console.log('I just disconnected, making sure you know, I will reconnect now...'));

client.on('reconnecting', () => console.log('I am reconnecting now!'));




client.on('message', async message => {
    if (!message.content.startsWith(process.env.PREFIX) || !message.guild || message.author.bot) return;
    const parts = message.content.split(' ');
    const command = parts[1];
    const params = parts.slice(2, parts.length);


    switch (command) {
        case 'help':
            help(message.member);
            break;
        case 'ping':
            ping(message);
            break;
        case 'gel':
            gel(message);
            break;
        case 'git':
            git(message.member.voiceChannel);
            break;
        case 'çıkarbeni':
            cikar(message);
            break;
        case 'gezdirbeni':
            gezdir(message);
            break;
        case 'gezdirbizi':
            gezdirAll(message);
            break;
        case 'play':
            playSong(message, params);
            break;
        default:
            message.reply('Öyle bişey yok be yarrak!')
            break;
    }
})

function help(member){
    const embed = new Discord.RichEmbed()
      .setTitle('AdamBot Guide:')
      .setColor(0xFF0000)
      .setDescription(`Bot call prefix: "${process.env.PREFIX}"\n
      "ping": Basic ping function\n
      "gel": Bot joins your voice channel\n
      "git": Bot leaves voice channel\n
      "çıkar beni": Removes you from voice channel\n
      "gezdir beni": Scrolls you through all voice channels\n
      "gezdir bizi": Scrolls everyone in the voice channel through all the voice channels
      (removed becuse it was too OP)\n
      `);

    member.send(embed);

}

function ping(message){
    message.reply('Siktir!');
}

function gel(message){
    var member = message.member;
    if(member.voiceChannelID == null)
    {
        message.reply('Sikdir be! Sen nerdesin da geleyim!');
        return;
    }

    vc = member.voiceChannel;

    vc.join()
    .then(connection => {
        message.reply('Geldim!');
        const dispatcher = connection.playFile('./music/test.m4a');

        dispatcher.on('end', async () => {
            await sleepForSeconds(2);
            vc.leave()
          });
          
          dispatcher.on('error', err => {
            console.log(err);
          });

      })
    .catch(console.log);

    
}

function git(voiceChannel){
    if(voiceChannel)
        voiceChannel.leave();
}

function cikar(message){
    if(!message.member.voiceChannel)
    {
        message.reply('Ma nerdesin da çıkaracam be!');
        return;
    }
    
    message.reply('Ey be tamam!');
    message.member.setVoiceChannel(null);
    
}

function gezdir(message)
{
    var user = message.member;

    if(!user.voiceChannel)
    {
        message.reply('Girmeden bir yere nasıl gezdireyim be seni!');
        return;
    } 

    var firstChannel = user.voiceChannel;

    message.guild.channels.filter(g => g.type == 'voice').forEach(element => {
        user.setVoiceChannel(element);
    })

    user.setVoiceChannel(firstChannel);
}

function gezdirAll(message)
{
    message.reply('Yok sana!');
    return;

    /*
    var user = message.member;

    if(!user.voiceChannel)
    {
        message.reply('Girmeden bir yere nasıl gezdireyim be sizi!');
        return;
    } 

    var firstChannel = user.voiceChannel;

    var allUsers = user.voiceChannel.members;

    message.guild.channels.filter(g => g.type == 'voice').forEach(element => {
        allUsers.forEach(singleUser => {
            singleUser.setVoiceChannel(element);
        })
        
    })

    allUsers.forEach(singleUser => {
        singleUser.setVoiceChannel(firstChannel);
    })  
    */
}


async function playSong(message, params)
{
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT')) {
        return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
    }
    if (!permissions.has('SPEAK')) {
        return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
    }

    const searchString = params.join(' ');

    message.channel.send(`Searching for "${searchString}"`)


    await youtube.searchVideos(searchString, 1)
    .then(results => {
        const video = results[0];
        message.channel.send(`Found: ${video.title}\nURL: ${video.shortURL}`)
        handleVideo(video, message, voiceChannel)
        })
    .catch(console.log)

    //message.reply(videos);
}

async function handleVideo(video, message, voiceChannel){
	console.log(video);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	try {
		var connection = await voiceChannel.join();
        const dispatcher = connection.playStream(ytdl(song.url))
            .on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
		})
        .on('error', error => console.error(error));
        return message.channel.send(`🎶 Start playing: **${song.title}**`);
	} catch (error) {
		console.error(`I could not join the voice channel: ${error}`);
		return message.channel.send(`I could not join the voice channel: ${error}`);
    }
}




function sleepForSeconds(s) {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
  }


client.login(process.env.TOKEN)