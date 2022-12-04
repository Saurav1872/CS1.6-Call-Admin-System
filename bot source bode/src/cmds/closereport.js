const Discord = require('discord.js');
const guildData = require("../util/functions.js");
module.exports = {
	name:"close",
	aliases: ["end", "c"], 
	description:"Closes calladmin report.",
    access: "admin",
	run: async (bot,message,args)=>{
      //  const target = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.member;
      //  message.reply(target.user.displayAvatarURL({dynamic:true,size:4096}))
        if(message.reference){
			let msgid = message.reference.messageId;
            message.channel.messages.fetch(msgid)
  				.then (fetchedMsg => {
                	if(!fetchedMsg.embeds[0]) return;
                	//console.log(fetchedMsg.embeds)
                	let currentEmbed = fetchedMsg.embeds[0];
                	if(currentEmbed.fields.length < 15) return;
                	if(currentEmbed.fields.length > 15) {
                        guildData.is_administrator(message.guildId, message.member.roles)
                        .then((status1) => {
                        	if(!status1) {
                        	    guildData.is_moderator(message.guildId, message.member.roles)
                        	    .then((status2) => {
                        	        if(!status2) {
                        	            guildData.is_admin(message.guildId, message.member.roles)
                        	            .then((status3) => {
                        	                if(status3) {
                        	                    message.reply(`The report has already been closed.`)
                        	                }
                                            else return;
                        	            })
                        	        }
                       				else message.reply(`The report has already been closed.`)
                        		})
                        	}
                    		else return message.reply(`The report has already been closed.`)
                       	});
                        return;
                    }
                	//console.log(currentEmbed);
                	//if(currentEmbed.fields){
                    if(currentEmbed.fields.length = 15)  {
                        
                      	let field1 = currentEmbed.fields[0];
                        let fields2 = currentEmbed.fields[1];
                        let fields3 = currentEmbed.fields[3];
                        let fields4 = currentEmbed.fields[4];
                        let fields5 = currentEmbed.fields[6];
                        let fields6 = currentEmbed.fields[7];
                        let fields7 = currentEmbed.fields[9];
                        let fields8 = currentEmbed.fields[10];
                        let fields9 = currentEmbed.fields[12];
                        let fields10 = currentEmbed.fields[13];
                        
                        if(field1.name !== 'Server Name') return;
                        if(fields2.name !== 'Server IP') return;
                        if(fields3.name !== 'Steam Connect') return;
                        if(fields4.name !== 'Map') return;
                        if(fields5.name !== 'Dispatcher Name') return;
                        if(fields6.name !== 'Dispatcher SteamID') return;
                        if(fields7.name !== 'Suspect Name') return;
                        if(fields8.name !== 'Suspect SteamID') return;
                        if(fields9.name !== 'Reason') return;
                        if(fields10.name !== 'Date & Time') return;
                	
                        
                        const row = new Discord.MessageActionRow()
                        .addComponents(
                            new Discord.MessageSelectMenu()
                                .setCustomId('closereport')
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
                        guildData.get_messagestatus(fetchedMsg.id)
                        .then((status) => {
                            
                            guildData.is_administrator(message.guildId, message.member.roles)
                            .then((status1) => {
                                if(!status1) {
                                    guildData.is_moderator(message.guildId, message.member.roles)
                                    .then((status2) => {
                                        if(!status2) {
                                            guildData.is_admin(message.guildId, message.member.roles)
                                            .then((status3) => {
                                                if(status3) {
                                                    if(!status) return fetchedMsg.reply({  content: "Select appropriate reason for this report:",  ephemeral: true ,components: [row]});
                                                    else if(status3) return message.reply('Message is already closed. Contact a moderator to perform this action.');
                                                    else return;
                                                }
                                            })
                                        }
                                        else fetchedMsg.reply({  content: "Select appropriate reason for this report:",  ephemeral: true ,components: [row]});
                                    })
                                }
                                else return fetchedMsg.reply({  content: "Select appropriate reason for this report:",  ephemeral: true ,components: [row]});
                            });
                            
                        })
                        
                        
                 	}
           		});
                
       		
     	}
	}
}