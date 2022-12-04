const Discord = require('discord.js');
module.exports = {
	id: "changestatus",
	run: async (client, interaction)=>{
        		let choice = interaction.values[0] 
                const member = interaction.member
                
                let msgid = interaction.message.reference.messageId;
            	//let fetchedMsg = interaction.message.channel.messages.fetch(msgid);
        		interaction.message.channel.messages.fetch(msgid)
  				.then (fetchedMsg => {
                    	
                        if(!fetchedMsg.embeds[0]) {
                            interaction.editReply('Cant find report in that message!');
                            return;
                        }
						let currentEmbed = fetchedMsg.embeds[0];
                        if(currentEmbed.fields.length > 18) {
							interaction.editReply(`Failed. [ Reason: Detected as Fake Report ].`);
                            interaction.message.delete();
                            return;
                        }
                    	if(currentEmbed.fields.length < 18) {
							interaction.editReply(`Failed. [ Reason: Detected as Fake Report ].`);
                            interaction.message.delete();
                            return;
                        }
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
                            embednamee.setColor('0x#73e405')
                            embednamee.addFields(fields1)
                            embednamee.addFields(fields2)
                            embednamee.addField('_ _', '_ _', true)
                            embednamee.addFields(fields3)
                            embednamee.addFields(fields4)
                            embednamee.addField('_ _', '_ _', true)
                            embednamee.addFields(fields5)
                            embednamee.addFields(fields6)
                            embednamee.addField('_ _', '_ _', true)
                            embednamee.addFields(fields7)
                            embednamee.addFields(fields8)
                            embednamee.addField('_ _', '_ _', true)
                            embednamee.addFields(fields9)
                            embednamee.addFields(fields10)
                            embednamee.addField('_ _', '_ _', true)
                            embednamee.addFields(fields11)

                            if(choice == 'report_accepted'){
                                embednamee.addField('Status', 'Report Accepted', true);
                                embednamee.setImage('https://media.discordapp.net/attachments/703164131926343811/914503043532337152/emb1.png');
                            }
                            else if(choice == 'fake_report'){
                                embednamee.addField('Status', 'Fake Report', true);
                                embednamee.setImage('https://media.discordapp.net/attachments/703164131926343811/914503043712700426/emb2.png');
                            }
                            else if(choice == 'report_declined'){
                                embednamee.addField('Status', 'Report Declined', true);
                                embednamee.setImage('https://media.discordapp.net/attachments/703164131926343811/914503044425723944/emb3.png');
                            }
                            else if(choice == 'player_warned'){
                                embednamee.addField('Status', 'Player Warned', true);
                                embednamee.setImage('https://media.discordapp.net/attachments/703164131926343811/914503043951783936/emb4.png');
                            }
                            else if(choice == 'player_banned'){
                                embednamee.addField('Status', 'Player Banned', true);
                                embednamee.setImage('https://media.discordapp.net/attachments/703164131926343811/914503044723515472/emb5.png');
                            }
                            else if(choice == 'reporter_warned'){
                                embednamee.addField('Status', 'Reporter Warned', true);
                                embednamee.setImage('https://media.discordapp.net/attachments/703164131926343811/914503044937433170/emb6.png');
                            }
                            else if(choice == 'reporter_banned'){
                                embednamee.addField('Status', 'Reporter Banned', true);
                                embednamee.setImage('https://media.discordapp.net/attachments/703164131926343811/914503045134553119/emb7.png');
                            }
                            else if(choice == 'insufficient_evidence'){
                                embednamee.addField('Status', 'Insufficient Evidence', true);
                                embednamee.setImage('https://media.discordapp.net/attachments/703164131926343811/914503045495267328/emb8.png');
                            }
                            else if(choice == 'player_left'){
                                embednamee.addField('Status', 'Player Left', true);
                                embednamee.setImage('https://media.discordapp.net/attachments/703164131926343811/914503045948272710/emb9.png');
                            }
                            embednamee.addField('_ _', '_ _', true);

                            fetchedMsg.edit({content: `${fetchedMsg.content}`, embeds: [embednamee]});
                            
                            interaction.editReply('Done!');
                            interaction.message.delete();
                        }
                });
        		
	},
};