const ms = require("ms");
const Discord = require("discord.js");
module.exports = {
    name:"ping",
    aliases: ["latency"], 
    description:"Gives Bot Api and Message Latency.",
    access: "all",
    run: async (bot,message,args)=>{
    	const msgsent = await message.channel.send(`Calculating......`);
  		const botping = msgsent.createdTimestamp - message.createdTimestamp + "ms";
  		const apilatency = ms(bot.ws.ping);
        
        let Embed = new Discord.MessageEmbed()
     	.setColor(0x4286f4)
     	.setURL(process.env.URL)
     	.setTitle("Bot Ping")
     	.setDescription(`**Api Latency** : ${apilatency} \n**MsgLatency** : ${botping}`)
        msgsent.delete();
      	message.channel.send({ embeds: [Embed] })
    }
}