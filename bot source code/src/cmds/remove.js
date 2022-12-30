const config = require('../config.json');
const guildData = require("../util/functions.js");
const { Permissions } = require('discord.js');
module.exports = {
    name:"remove",
    aliases: ["r"], 
    description:"Removes roles from different position.",
    access: "administrator",
    run: async (bot,message,args)=>{
		if(!args) return;
		if(args === "") return;
		if(args === " ") return;
		//let prefix = args.join(" ");
		let rank = args[0];
        let roleid = args[1];
        
        let administrator = false;
        let guildAdmin = false;
        guildAdmin = message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);
        guildData.is_administrator(message.guildId, message.member.roles)
        .then((status0) => {
            if(status0) administrator = true;
            if(guildAdmin || administrator) {
                
                if(rank === 'administrator'){
                    if(!guildAdmin) return message.reply('Only Guild Administrator can remove administrator role.');
                    let role = message.guild.roles.cache.find(role => role.id === roleid)
                    if(!role) return message.reply('No such role found. Provide a valid roleid.');
                    guildData.get_administrator(message.guildId, roleid)
                    .then((status) => {
                        if(!status) return  message.reply(`${role.name} is not set as administrator.`)
                        guildData.remove_administrator(message.guildId, roleid)
                        .then(() => {
                            return message.reply(`Removed the role ${role.name} from administrator.`)
                        })
                    })
                    
                }
                if(rank === 'admin'){
                    if(!administrator) {
                        if(!guildAdmin) return message.reply('Only Bot/Guild Administrator can remove admin role.');
                    } 
                    let role = message.guild.roles.cache.find(role => role.id === roleid)
                    if(!role) return message.reply('No such role found. Provide a valid roleid.');

                    guildData.get_admin(message.guildId, roleid)
                    .then((status) => {
                        if(!status) return  message.reply(`${role.name} is not set as admin.`)
                        guildData.remove_admin(message.guildId, roleid)
                        .then(() => {
                            return message.reply(`Removed the role ${role.name} from admin.`)
                        })
                    })
                }

                if(rank === 'moderator'){
                    if(!administrator) {
                        if(!guildAdmin) return message.reply('Only Bot/Guild Administrator can add moderator role.');
                    }

                    let role = message.guild.roles.cache.find(role => role.id === roleid)
                    if(!role) return message.reply('No such role found. Provide a valid roleid.');

                    guildData.get_moderator(message.guildId, roleid)
                    .then((status) => {
                        if(!status) return  message.reply(`${role.name} is not set as moderator.`)
                        guildData.remove_moderator(message.guildId, roleid)
                        .then(() => {
                            return message.reply(`Removed the role ${role.name} from moderator.`)
                        })
                    })
                }
        	} 
        });
        //else return message.reply('failed! []')
    }
}