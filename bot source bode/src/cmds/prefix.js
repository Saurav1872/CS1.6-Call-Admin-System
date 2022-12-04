const config = require('../config.json');
const guildData = require("../util/functions.js");
module.exports = {
    name:"prefix",
    aliases: [], 
    description:"Set bot prefix for server.",
    access: "administrator",
    run: async (bot,message,args)=>{
		if(!args) return;
		if(args === "") return;
		if(args === " ") return;
		let prefix = args.join(" ");
		
        guildData.is_administrator(message.guildId, message.member.roles)
		.then((status) => {
			if(status) {
                guildData.get_prefix(message.guildId)
                .then((svPrefix) => {

                    if(!svPrefix) return message.reply(`Bot is not set for this guild. Set it up with ${config.prefix}setup.`);
                    if (prefix === " " || prefix === "") return message.reply(`Server Prefix: \`${svPrefix}\``);;
                    if(svPrefix === prefix) return message.reply(`${prefix} is already the bot prefix.`);
                    guildData.set_prefix(message.guildId, prefix)
                    .then(() => {
                        message.reply(`Bot Prefix set to \`${prefix}\``)
                    });

                });
            }
        });
    }
}