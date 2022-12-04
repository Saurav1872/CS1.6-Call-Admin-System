const Discord = require("discord.js");
const config = require('../config.json');
module.exports = {
	name: "help",
  	description: "See a list of commands available.",
  	options: [],
  	run: async (client,interaction)=> {
        const { commands } = interaction.client;
        
  		let helpEmbed = new Discord.MessageEmbed()
		.setColor(0x4286f4)
		.setURL(process.env.URL)
		.setTitle("List of all my commands")
		.setDescription(
			"`" + commands.map((command) => command.name).join("`, `") + "`"
		)
		.addField(
		"Usage",
		`\nYou can send **${config.prefix}help [command name]** to get info on a specific command!`
		);
		// Attempts to send embed in DMs.
		return interaction.user
			.send({ embeds: [helpEmbed] })
			.then(() => {
				// On validation, reply back.
				interaction.followUp({
					content: "I've sent you a DM with all my commands!",
				});
			})
			.catch((error) => {
				// On failing, throw error.
				console.log(`Could not send help DM to ${interaction.user.tag}.\n`);
				interaction.followUp({ content: "It seems like I can't DM you!" });
			});
		
	}
};
