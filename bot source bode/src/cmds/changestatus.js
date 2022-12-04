const Discord = require('discord.js');
const guildData = require("../util/functions.js");
module.exports = {
	name:"changestatus",
	aliases: ["updatestatus"], 
	description:"Update calladmin report status.",
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
                	
                        
                        const row = new Discord.MessageActionRow()
                        .addComponents(
                            new Discord.MessageSelectMenu()
                                .setCustomId('changestatus')
                                .setPlaceholder('Select a Reason:')
                                .addOptions([
                                    { //edit the option according to you ⚠leave the emoji fields like they are 
                                        label: 'Report Accepted',
                                        value: 'report_accepted',
                                        emoji: {
                                            name: "reportAccepted",
                                            id: '711766547684786217',
                                            animated: true,
                                        },
                                    },
                                    {
                                        label: 'Fake Report',
                                        value: 'fake_report',
                                        emoji: {
                                            name: "fakeReport",
                                            id: '865661866051502080',
                                            animated: true,
                                    	}
                                    },
                                    {
                                        label: 'Report Declined',
                                        value: 'report_declined',
                                        emoji: {
                                            name: "reportDeclined",
                                            id: '858106448776134677',
                                            animated: true,
                                        }
                                       
                                    },
                                    {
                                        label: 'Player Warned',
                                        value: 'player_warned',
                                        emoji: {
                                            name: "playerWarned",
                                            id: '920364231960977468',
                                            animated: true,
                                        }
                                    },
                                    {
                                        label: 'Player Banned',
                                        value: 'player_banned',
                                        emoji: {
                                            name: "playerBanned",
                                            id: '798134233402310666',
                                            animated: true,
                                        }
                                       
                                    },
                                    {
                                        label: 'Reporter Warned',
                                        value: 'reporter_warned',
                                        emoji: {
                                            name: "reporterWarned",
                                            id: '920364231960977468',
                                            animated: true,
                                        }
                                    },
                                    {
                                        label: 'Reporter Banned',
                                        value: 'reporter_banned',
                                        emoji: {
                                            name: "reporterBanned",
                                            id: '798134233402310666',
                                            animated: true,
                                        },
                                    },
                                    {
                                        label: 'Insufficient Evidence',
                                        value: 'insufficient_evidenc',
                                        emoji: {
                                            name: "insufficientEvidence",
                                            id: '920364234284617799',
                                            animated: true,
                                        }
                                    },
                                    {
                                        label: 'Player Left',
                                        value: 'player_left',
                                        emoji: {
                                            name: "playerLeft",
                                            id: '704999470810792007',
                                            animated: true,
                                        },
                                    },
                                ]),
                        );
                        guildData.is_administrator(message.guildId, message.member.roles)
                        .then((status) => {
            				if(!status) {
                                guildData.is_moderator(message.guildId, message.member.roles)
                                .then((status2) => {
                                    if(status2) {
                                        return fetchedMsg.reply({  content: "Select appropriate reason for this report:",  ephemeral: true ,components: [row]});
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
                            else return fetchedMsg.reply({  content: "Select appropriate reason for this report:",  ephemeral: true ,components: [row]});
                        }); 
                 	}
           		});	
     	}
	}
}