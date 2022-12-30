const config = require('../config.json');
const guildData = require("../util/functions.js");
const Discord = require("discord.js");
module.exports = {
    name:"get",
    aliases: ["g"], 
    description:"Get roles added for different position.",
    access: "administrator",
    run: async (bot,message,args)=>{
		if(!args) return;
		if(args === "") return;
		if(args === " ") return;
		//let prefix = args.join(" ");
		let rank = args[0];
        
        let administrator = false;
        let guildAdmin = false;
        guildAdmin = message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR);
        guildData.is_administrator(message.guildId, message.member.roles)
        .then((status) => {
            if(status) administrator = true;
            if(guildAdmin || administrator) {
                
                if(status) administrator = true;
                if(rank === 'administrator'){
                    guildData.get_administrator_array(message.guildId)
                    .then((administratorar) => {
                        if(!administratorar) return  message.reply(`No role set for Administrator Rank.`)
                        let roledata = "";
                            for(let i = 0; i < administratorar.length; i++) {
                                let role = message.guild.roles.cache.find(role => role.id === administratorar[i])
                                if(i > 0) roledata += ", "
                                roledata += `\`${role.name}\``;
                      	}
                        let Embed = new Discord.MessageEmbed()
                            .setColor(0x4286f4)
                            .setURL(process.env.URL)
                            .setTitle("List of Calladmin Administrators")
                        	.setDescription(roledata)
                        message.reply({ embeds: [Embed] })
                    })
                }
                if(rank === 'admin'){
                    guildData.get_admin_array(message.guildId)
                    .then((adminar) => {
                        if(!adminar) return  message.reply(`No role set for Admin Rank.`)
                        let roledata = "";
                            for(let i = 0; i < adminar.length; i++) {
                                let role = message.guild.roles.cache.find(role => role.id === adminar[i])
                                if(i > 0) roledata += ", "
                                roledata += `\`${role.name}\``;
                      	}
                        let Embed = new Discord.MessageEmbed()
                            .setColor(0x4286f4)
                            .setURL(process.env.URL)
                            .setTitle("List of Calladmin Admins")
                        	.setDescription(roledata)
                        message.reply({ embeds: [Embed] })
                    })
                }

                if(rank === 'moderator'){
                    guildData.get_moderator_array(message.guildId)
                    .then((adminar) => {
                        if(!adminar) return  message.reply(`No role set for Moderator Rank.`)
                        let roledata = "";
                            for(let i = 0; i < adminar.length; i++) {
                                let role = message.guild.roles.cache.find(role => role.id === adminar[i])
                                if(i > 0) roledata += ", "
                                roledata += `\`${role.name}\``;
                      	}
                        let Embed = new Discord.MessageEmbed()
                            .setColor(0x4286f4)
                            .setURL(process.env.URL)
                            .setTitle("List of Calladmin Moderators")
                        	.setDescription(roledata)
                        message.reply({ embeds: [Embed] })
                    })
                }
        	} 
        });
        //else return message.reply('failed! []')
    }
}