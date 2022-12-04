module.exports = {
  name: "interactionCreate",
  run: async (client, interaction) => {
     if (interaction.isCommand()){
  	  	await interaction.deferReply({ ephemeral: true });
		
    	const command = client.slashcmds.get(interaction.commandName);
    	if (!command) interaction.followUp("Wtf!");
    	command.run(client,interaction)	
	}
    if (interaction.isSelectMenu()){
 	 	await interaction.deferReply({ ephemeral: true });
		
    	const command = client.selectCommands.get(interaction.customId);
    	if (!command) interaction.followUp("Failed to execute!");
        
    	command.run(client, interaction);
	}
  },
};
