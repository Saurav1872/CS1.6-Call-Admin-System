const Discord = require("discord.js");
const config = require('../config.json');
module.exports = {
    name:"help",
    aliases: ["h"], 
    description: `See a list of commands available. If you run ${config.prefix}help <name of a command> It will also give you more info such as a description.`, 
    access: "all",
    run: async (bot,message,args)=> {
            const { commands } = message.client;

            // If there are no args, it means it needs whole help command.

            if (!args.length) {
                /**
                 * @type {Object}
                 * @description Help command embed object
                 */
                
                /*let administrator = false;
                let moderator = false;
                let admin = false;
                
				guildData.is_administrator(message.guildId, message.member.roles)
                .then((status0) => {
            		if(status0) administrator = true;
                   		guildData.is_moderator(message.guildId, message.member.roles)
						.then((status2) => {
							if(status2) moderator = true;
                           	guildData.is_admin(message.guildId, message.member.roles)
                          	.then((status3) => {
                            	if(status3) admin = true;*/
                                
				let zeroCommands = "";
				let adminCommands = "";
				let modCommands = "";
				let administratorCommands = "";
				
				commands.map((command) => {
				    if(command.access === 'all') {
				        if(zeroCommands === "") {
				            zeroCommands += "`" + command.name + "`";
				        }
				        else {
				            zeroCommands += ", `" + command.name + "`"
				        } 
				    }
				    if(command.access === 'admin') {
				        if(adminCommands === "") {
				            adminCommands += "`" + command.name + "`";
				        }
				        else {
				            adminCommands += ", `" + command.name + "`"
				        } 
				    }
				    if(command.access === 'moderator') {
				        if(modCommands === "") {
				            modCommands += "`" + command.name + "`";
				        }
				        else {
				            modCommands += ", `" + command.name + "`"
				        } 
				    }
				    if(command.access === 'administrator') {
				        if(administratorCommands === "") {
				            administratorCommands += "`" + command.name + "`";
				        }
				        else {
				            administratorCommands += ", `" + command.name + "`"
				        } 
				    }
				})
				
				//console.log(commands)
				let helpEmbed = new Discord.MessageEmbed()
				helpEmbed.setColor(0x4286f4)
				helpEmbed.setURL(process.env.URL)
				helpEmbed.setTitle("List of all my commands")
				//helpEmbed.setDescription(
				//    "`" + commands.map((command) => command.name).join("`, `") + "`"
				//)
				if(zeroCommands !== "") {
					helpEmbed.addField("Generic Commands", `${zeroCommands}`, false)
                }
                if(adminCommands !== "") {
					helpEmbed.addField("Admin Commands", `${adminCommands}`, false)
                }
                if(modCommands !== "") {
					helpEmbed.addField("Moderator Commands", `${modCommands}`, false)
                }
                if(administratorCommands !== "") {
					helpEmbed.addField("Administrator Commands", `${administratorCommands}`, false)
                }
				helpEmbed.addField(
				    "Usage",
				    `\nYou can send **${config.prefix}help [command name]** to get info on a specific command!`
				);

				//Attempts to send embed in DMs.

				return message.author
				.send({ embeds: [helpEmbed] })

				.then(() => {
				    if (message.channel.type === "dm") return;

				    // On validation, reply back.

				    message.reply({
				        content: "I've sent you a DM with all my commands!",
				    });
				})
				.catch((error) => {
				    // On failing, throw error.

				    console.log(`Could not send help DM to ${message.author.tag}.\n`);
				    message.reply({ content: "It seems like I can't DM you!" });
				});
         	}
				/*			}
                   		})
					}
				}); 
                */
        
            // If argument is provided, check if it's a command.

            /**
             * @type {String}
             * @description First argument in lower case
             */

            const name = args[0].toLowerCase();

            /**
             * @type {Object}
             * @description The command object
             */

            const command = bot.commands.get(name)  || bot.aliases.get(name);

            // If it's an invalid command.

            if (!command) {
                return message.reply({ content: "That's not a valid command!" });
            }

            /**
             * @type {Object}
             * @description Embed of Help command for a specific command.
             */

            let commandEmbed = new Discord.MessageEmbed()
                .setColor(0x4286f4)
                .setTitle("Command Help");

            if (command.description)
                commandEmbed.setDescription(`${command.description}`);

            if (command.aliases)
                commandEmbed
                    .addField("Aliases", `\`${command.aliases.join(", ")}\``, true)

            // Finally send the embed.

            message.channel.send({ embeds: [commandEmbed] });
        },
    
}