const ms = require("ms");
const guildData = require("../util/functions.js");
const Discord = require("discord.js");
module.exports = {
    name:"uptime",
    aliases: [], 
    description:"Gives the avatar of a user.",
    access: "administrator",
    run: async (bot,message,args)=>{
        guildData.is_administrator(message.guildId, message.member.roles)
		.then((status) => {
			if(status) {
                let Embed = new Discord.MessageEmbed()
                .setColor(0x4286f4)
                .setURL(process.env.URL)
                .setDescription(`**Bot Uptime** : ${ms(bot.uptime)}`)
    			return message.reply({ embeds: [Embed] });
            }
        });
    }
}