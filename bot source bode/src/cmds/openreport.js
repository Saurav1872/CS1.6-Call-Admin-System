const Discord = require('discord.js');
const guildData = require("../util/functions.js");
module.exports = {
	name:"open",
	aliases: ["reopen", "o"], 
	description:"Open the call admin report.",
    access: "moderator",
	run: async (bot,message,args)=>{
      //  const target = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.member;
      //  message.reply(target.user.displayAvatarURL({dynamic:true,size:4096}))
        if(message.reference){
			let msgid = message.reference.messageId;
            message.channel.messages.fetch(msgid)
  				.then (fetchedMsg => {
                	if(fetchedMsg.author.id !== bot.user.id) return;
                	if(!fetchedMsg.embeds[0]) return;
                	let currentEmbed = fetchedMsg.embeds[0];
                	if(currentEmbed.fields.length < 18) return;
                	if(currentEmbed.fields.length > 18) return;
                    if(currentEmbed.fields.length = 18)  {
                        
                      	let fields1 = currentEmbed.fields[0];
                        let fields2 = currentEmbed.fields[1];
                        let fields3 = currentEmbed.fields[3];
                        let fields4 = currentEmbed.fields[4];
                        let fields5 = currentEmbed.fields[6];
                        let fields6 = currentEmbed.fields[7];
                        let fields7 = currentEmbed.fields[9];
                        let fields8 = currentEmbed.fields[10];
                        let fields9 = currentEmbed.fields[12];
                        let fields10 = currentEmbed.fields[13];
                        let fields11 = currentEmbed.fields[15];
                        let fields12 = currentEmbed.fields[16];
                        
                        if(fields1.name !== 'Server Name') return;
                        if(fields2.name !== 'Server IP') return;
                        if(fields3.name !== 'Steam Connect') return;
                        if(fields4.name !== 'Map') return;
                        if(fields5.name !== 'Dispatcher Name') return;
                        if(fields6.name !== 'Dispatcher SteamID') return;
                        if(fields7.name !== 'Suspect Name') return;
                        if(fields8.name !== 'Suspect SteamID') return;
                        if(fields9.name !== 'Reason') return;
                        if(fields10.name !== 'Date & Time') return;
                        if(fields11.name !== 'Admin') return;
                        if(fields12.name !== 'Status') return;
                	
                        const embednamee = new Discord.MessageEmbed()
                        .setColor('0x#73e405')
                        .addFields(fields1)
                        .addFields(fields2)
                        .addField('_ _', '_ _', true)
                        .addFields(fields3)
                        .addFields(fields4)
                        .addField('_ _', '_ _', true)
                        .addFields(fields5)
                        .addFields(fields6)
                        .addField('_ _', '_ _', true)
                        .addFields(fields7)
                        .addFields(fields8)
                        .addField('_ _', '_ _', true)
                        .addFields(fields9)
                        .addFields(fields10)
                        .addField('_ _', '_ _', true);
                        
                        guildData.is_administrator(message.guildId, message.member.roles)
                        .then((status) => {
            				if(!status) {
                                guildData.is_moderator(message.guildId, message.member.roles)
                                .then((status2) => {
                                    if(status2) {
                                        fetchedMsg.edit({content: `Reopened by ${message.author}\nA new report has been made.`, embeds: [embednamee]});
                        				fetchedMsg.reply({  content: "Report Opened!" }); 
                                        return;
                                    }
                                    else {
                                        guildData.is_admin(message.guildId, message.member.roles)
                                            .then((status3) => {
                                                if(status3) {
                                                    return message.reply({content: "Only moderators can access this command."});
                                                }
                                            	else return;
                                            })
                                    }
                                })
                            }
                            else {
                                fetchedMsg.edit({content: `Reopened by ${message.author}\nA new report has been made.`, embeds: [embednamee]});
                        		fetchedMsg.reply({  content: "Report Opened!" }); 
                                return;
                            }
                        });                    
                 	}
           		});	
     	}
	}
}