const guildData = require("../util/functions.js");
module.exports = {
	id: "closereport",
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
                        if(currentEmbed.fields.length > 15) {
							interaction.editReply(`The report has already been closed.`);
                            interaction.message.delete();
                            return;
                        }
                        let usersname = interaction.user.username;
                        currentEmbed.addField('Admin', usersname, true);

                        if(choice == 'report_accepted'){
                            currentEmbed.addField('Status', 'Report Accepted', true);
                            currentEmbed.setImage('https://media.discordapp.net/attachments/703164131926343811/914503043532337152/emb1.png');
                        }
                        else if(choice == 'fake_report'){
                            currentEmbed.addField('Status', 'Fake Report', true);
                            currentEmbed.setImage('https://media.discordapp.net/attachments/703164131926343811/914503043712700426/emb2.png');
                        }
                        else if(choice == 'report_declined'){
                            currentEmbed.addField('Status', 'Report Declined', true);
                            currentEmbed.setImage('https://media.discordapp.net/attachments/703164131926343811/914503044425723944/emb3.png');
                        }
                        else if(choice == 'player_warned'){
                            currentEmbed.addField('Status', 'Player Warned', true);
                            currentEmbed.setImage('https://media.discordapp.net/attachments/703164131926343811/914503043951783936/emb4.png');
                        }
                        else if(choice == 'player_banned'){
                            currentEmbed.addField('Status', 'Player Banned', true);
                            currentEmbed.setImage('https://media.discordapp.net/attachments/703164131926343811/914503044723515472/emb5.png');
                        }
                        else if(choice == 'reporter_warned'){
                            currentEmbed.addField('Status', 'Reporter Warned', true);
                            currentEmbed.setImage('https://media.discordapp.net/attachments/703164131926343811/914503044937433170/emb6.png');
                        }
                        else if(choice == 'reporter_banned'){
                            currentEmbed.addField('Status', 'Reporter Banned', true);
                            currentEmbed.setImage('https://media.discordapp.net/attachments/703164131926343811/914503045134553119/emb7.png');
                        }
                        else if(choice == 'insufficient_evidence'){
                            currentEmbed.addField('Status', 'Insufficient Evidence', true);
                            currentEmbed.setImage('https://media.discordapp.net/attachments/703164131926343811/914503045495267328/emb8.png');
                        }
                        else if(choice == 'player_left'){
                            currentEmbed.addField('Status', 'Player Left', true);
                            currentEmbed.setImage('https://media.discordapp.net/attachments/703164131926343811/914503045948272710/emb9.png');
                        }
                        currentEmbed.addField('_ _', '_ _', true);

                        fetchedMsg.edit({content: `Report Closed from Discord by ${interaction.user}`, embeds: [currentEmbed]});

                        interaction.editReply('Done!');
                    	guildData.get_messagestatus(fetchedMsg.id)
                    		.then((success) => {
                            if(!success) {
                                guildData.remove_message(fetchedMsg.id);
                                guildData.add_message(fetchedMsg.id);
                            }
                            guildData.set_messagestatus(fetchedMsg.id, true);
                        })
                        interaction.message.delete();
                });
        		
	},
};