const guildData = require("../util/functions.js");
const fs = require("fs");
module.exports = {
    name:"setup",
    aliases: ["s"], 
    description:"Setups the bot for the guild if its not been set.",
    access: "administrator",
    run: async (bot,message,args)=>{
        
        guildData.is_administrator(message.guildId, message.member.roles)
		.then((status) => {
			if(status) {
                let guild = message.guildId;
                var guild_data = fs.readFileSync('./src/GuildData.json');
                var guild_json = JSON.parse(guild_data);
                if(guild_json[guild]) return message.reply('Bot already been set for this server.');
                guildData.setup_guilddata(guild);
                message.reply('Bot has been set for this server.');
            }
        });
    }
}