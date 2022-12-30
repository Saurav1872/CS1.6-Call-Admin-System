const Discord = require("discord.js");
const guildData = require("../util/functions.js");
module.exports = {
    name:"fakereport",
    aliases: ["fr"], 
    description:"Creates a fake call admin report.",
    access: "administrator",
	run: async (bot,message,args)=>{
		const embednamee = new Discord.MessageEmbed()

		.setColor('0x#73e405')

        .addFields(
                { name: 'Server Name', value: '[UGC.LT | Updating ZPLM](http://ugc.gs/steam.php?addr=172.18.0.2:27016)', inline: true },
                { name: 'Server IP', value: '172.18.0.2:27016', inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
                { name: 'Steam Connect', value: 'steam://connect/172.18.0.2:27016', inline: true },
                { name: 'Map', value: 'de_dust2', inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
                { name: 'Dispatcher Name', value: 'Bot', inline: true },
                { name: 'Dispatcher SteamID', value: '[STEAM_ID_BOT](http://steamcommunity.com/profiles/bot)', inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
                { name: 'Suspect Name', value: 'Bot', inline: true },
                { name: 'Suspect SteamID', value: '[STEAM_ID_BOT](http://steamcommunity.com/profiles/bot)', inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
                { name: 'Reason', value: 'TesT', inline: true },
                { name: 'Date & Time', value: '12/08/2021 - 15:51:10', inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
            )
        //.setTimestamp();
        guildData.is_administrator(message.guildId, message.member.roles)
 		.then((status) => {
			if(status) {
                return message.channel.send({ content: 'A new report has been made.', embeds: [embednamee] });
            }
        });
    }
}