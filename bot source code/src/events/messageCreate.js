const config = require('../config.json');
const guildData = require("../util/functions.js");
module.exports = {
    name: "messageCreate",
    run: async (bot, message) => {
        if(message.author.bot) return;
  	  	if(message.channel.type === "dm") return;
        
        const mentionPrefix = message.content.match(new RegExp(`^<@!?(${bot.user.id})>`));
        
  	  	let messageArray = message.content.split(" ")
     	const actionword = messageArray[0].toLowerCase();
     	//const cmd = client.commands.get(actionword);
        let args = messageArray.slice(1);
        //if(!actionword.startsWith(config.prefix)) return;
        guildData.get_prefix(message.guildId)
        .then((prefixs) => {
            if(prefixs){
                if(mentionPrefix){
   		 			message.channel.send(`My Prefix is \`${prefixs}\``)
  				}
                
                if(!actionword.startsWith(prefixs)) return;
                
                let cmd = bot.commands.get(actionword.slice(prefixs.length)) || bot.aliases.get(actionword.slice(prefixs.length));
                if(cmd){
                    
                    guildData.has_access(message.guildId, message.member.roles)
                        .then((status) => {
                        //if (message.member.roles.cache.find(role => role.id === '918546797734027284') || message.member.permissions.has('ADMINISTRATOR')){
                        if (message.member.permissions.has('ADMINISTRATOR')){
                        	cmd.run(bot, message, args);
                    		return;
                    	}
                        if(!status) return;
                        cmd.run(bot, message, args);
                    	return;
                    })
                }
            }
            else {
                if(mentionPrefix){
   		 			message.channel.send(`My Prefix is \`${config.prefix}\``)
  				}
                
                if(!actionword.startsWith(config.prefix)) return;
                
                
                let cmd = bot.commands.get(actionword.slice(config.prefix.length)) || bot.aliases.get(actionword.slice(config.prefix.length));
                if(cmd){
                    
                    guildData.has_access(message.guildId, message.member.roles)
                        .then((status) => {
                        //if (message.member.roles.cache.find(role => role.id === '918546797734027284') || message.member.permissions.has("ADMINISTRATOR")){
                        if (message.member.permissions.has('ADMINISTRATOR')){
                        	cmd.run(bot, message, args);
                    		return;
                    	}
                        if(!status) return;
                        cmd.run(bot, message, args);
                    	return;
                    })
                }
            }
        })	
    },
  };
  