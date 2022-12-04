/*
				Example of creating the function
*/
const fs = require("fs");
const config = require('../config.json')
module.exports = {
    //- will replace the prefix with new prefix
    set_prefix: async function (guildid, prefix) 
    {
        var guild_data = fs.readFileSync('./src/GuildData.json');
        var guild_json = JSON.parse(guild_data);
        if(guild_json[guildid]){
            guild_json[guildid]['prefix'] = prefix;
        	guild_data = JSON.stringify(guild_json, null, 2)
        	fs.writeFileSync("./src/GuildData.json", guild_data);
        	return 1;
        }
        return 0;
    },
    get_prefix: async function (guildid) //- returns prefix of the sv (string)
    {
        var guild_data = fs.readFileSync('./src/GuildData.json');
        var guild_json = JSON.parse(guild_data);
        if(guild_json[guildid]) return guild_json[guildid]['prefix'];
        return 0;
        
    },

    set_admin: async function (guildid, roleid)  //- will add roleid in admin json array
    {
        var guild_data = fs.readFileSync('./src/GuildData.json');
        var guild_json = JSON.parse(guild_data);
        if(guild_json[guildid]) {
            guild_json[guildid]['admin'].push(roleid);
        	guild_data = JSON.stringify(guild_json, null, 2)
        	fs.writeFileSync("./src/GuildData.json", guild_data);
        	return 1;
        }
        return 0;
        
    },
    set_moderator: async function (guildid, roleid)  //- will add roleid in moderator json array
    {
        var guild_data = fs.readFileSync('./src/GuildData.json');
        var guild_json = JSON.parse(guild_data);
         if(guild_json[guildid]) {
          	guild_json[guildid]['moderator'].push(roleid);
        	guild_data = JSON.stringify(guild_json, null, 2)
        	fs.writeFileSync("./src/GuildData.json", guild_data);
             return 1;
         }
        return 0;
    },
    set_administrator: async function (guildid, roleid)  //- will add roleid in administrator json array
    {
        var guild_data = fs.readFileSync('./src/GuildData.json');
        var guild_json = JSON.parse(guild_data);
        if(guild_json[guildid]){
            guild_json[guildid]['administrator'].push(roleid);
        	guild_data = JSON.stringify(guild_json, null, 2)
        	fs.writeFileSync("./src/GuildData.json", guild_data);
        	return 1;
        }
        return 0;
    },

    get_admin: async function (guildid, roleid)  //- returns if the roleid is in admin json array
    {
        var guild_data = fs.readFileSync('./src/GuildData.json');
        var guild_json = JSON.parse(guild_data);
        if(guild_json[guildid]) return guild_json[guildid]['admin'].includes(roleid);
        return 0;
    },
    get_moderator: async function (guildid, roleid)  //- returns if the roleid is in admin json array
    {
        var guild_data = fs.readFileSync('./src/GuildData.json');
        var guild_json = JSON.parse(guild_data);
        if(guild_json[guildid]) return guild_json[guildid]['moderator'].includes(roleid);
        return 0;
    },
    get_administrator: async function (guildid, roleid)  //- returns if the roleid is in admin json array
    {
        var guild_data = fs.readFileSync('./src/GuildData.json');
        var guild_json = JSON.parse(guild_data);
        if(guild_json[guildid]) return guild_json[guildid]['administrator'].includes(roleid);
        return 0;
    },

    remove_admin: async function (guildid, roleid)  //- will delete roleid from admin json array
    {
        var guild_data = fs.readFileSync('./src/GuildData.json');
        var guild_json = JSON.parse(guild_data);
        if(guild_json[guildid]) {
            guild_json[guildid]['admin'].splice(guild_json[guildid]['admin'].indexOf(roleid), 1);
        	guild_data = JSON.stringify(guild_json, null, 2)
        	fs.writeFileSync("./src/GuildData.json", guild_data);
        	return 1;
        }
        return 0;
    },
    remove_moderator: async function (guildid, roleid)  //- will delete roleid from moderator json array
    {
        var guild_data = fs.readFileSync('./src/GuildData.json');
        var guild_json = JSON.parse(guild_data);
        if(guild_json[guildid]) {
            guild_json[guildid]['moderator'].splice(guild_json[guildid]['moderator'].indexOf(roleid), 1);
        	guild_data = JSON.stringify(guild_json, null, 2)
        	fs.writeFileSync("./src/GuildData.json", guild_data);
        	return 1;
        }
        return 0;
    },
    remove_administrator: async function (guildid, roleid)  //- will delete roleid from administrator json array
    {
        var guild_data = fs.readFileSync('./src/GuildData.json');
        var guild_json = JSON.parse(guild_data);
        if(guild_json[guildid]) {
            guild_json[guildid]['administrator'].splice(guild_json[guildid]['administrator'].indexOf(roleid), 1);
        	guild_data = JSON.stringify(guild_json, null, 2)
        	fs.writeFileSync("./src/GuildData.json", guild_data);
        	return 1;
        }
        return 0;
        
    },
    setup_guilddata: async function (guildid) // will add default guild data in the json file
    {
        var guild_data = fs.readFileSync('./src/GuildData.json');
        var guild_json = JSON.parse(guild_data);
        var config_data = fs.readFileSync('./src/config.json');
        var config_json = JSON.parse(config_data);
        var data = {
            "prefix" : config_json['prefix'],
            "admin" : [],
            "moderator" : [],
            "administrator" : []  
        }
        /*console.log(guildid);
        var data = {
            prefix : config.prefix,
            admin : [],
            moderator : [],
            administrator : [],
        }*/
        
        guild_json[guildid] = data;
        guild_data = JSON.stringify(guild_json, null, 2)
        fs.writeFileSync("./src/GuildData.json", guild_data);
        return 1;
    },
    delete_guilddata: async function (guildid) // deletes the guild key from json file.
    {
        var guild_data = fs.readFileSync('./src/GuildData.json');
        var guild_json = JSON.parse(guild_data);
        if(guild_json[guildid]) {
            delete guild_json[guildid]
        	guild_data = JSON.stringify(guild_json, null, 2)
        	fs.writeFileSync("./src/GuildData.json", guild_data);
        	return 1;
        }
        return 1;
    },

    get_messagestatus: async function (messageid) // will return true if messageid is set true
    {
        var message_data = fs.readFileSync('./src/MessageData.json');
        var message_json = JSON.parse(message_data);
        return message_json[messageid];
    },
    set_messagestatus: async function (messageid, status) // will set status true/false for the messageid
    {
        var message_data = fs.readFileSync('./src/MessageData.json');
        var message_json = JSON.parse(message_data);
        if(message_json[messageid]) {
            message_json[messageid] = status;
        	message_data = JSON.stringify(message_json, null, 2)
        	fs.writeFileSync("./src/MessageData.json", message_data);
        	return 1;
        }
        return 0;
    },
    add_message: async function (messageid)     // add/register messageid key in the json file, with the default format (empty) for the message
    {
        var message_data = fs.readFileSync('./src/MessageData.json');
        var message_json = JSON.parse(message_data);
        message_json[messageid] = true;
        message_data = JSON.stringify(message_json, null, 2)
        fs.writeFileSync("./src/MessageData.json", message_data);
        return 1;
    },
    remove_message: async function (messageid)     // removes messageid key from the json file
    {
        var message_data = fs.readFileSync('./src/MessageData.json');
        var message_json = JSON.parse(message_data);
        if(message_json[messageid]) {
            delete message_json[messageid]
        	message_data = JSON.stringify(message_json, null, 2)
        	fs.writeFileSync("./src/MessageData.json", message_data);
        	return 1;
        }
       	return 1;
        
    },
    is_admin: async function (guildid, roles) {
    	var guild_data = fs.readFileSync('./src/GuildData.json');
        var guild_json = JSON.parse(guild_data);
        if(guild_json[guildid]) {
            let admin = guild_json[guildid]['admin']
            for(let i = 0; i < admin.length; i++) {
                if(roles.cache.find(role => role.id === admin[i])){
                    return true;
                }
            }
        }
    	return false;
	},
    is_moderator: async function (guildid, roles) {
    	var guild_data = fs.readFileSync('./src/GuildData.json');
        var guild_json = JSON.parse(guild_data);
        if(guild_json[guildid]) {
            let admin = guild_json[guildid]['moderator']
            for(let i = 0; i < admin.length; i++) {
                if(roles.cache.find(role => role.id === admin[i])){
                    return true;
                }
            }
        }
    	return false;
	},
    is_administrator: async function (guildid, roles) {
    	var guild_data = fs.readFileSync('./src/GuildData.json');
        var guild_json = JSON.parse(guild_data);
        if(guild_json[guildid]) {
            let admin = guild_json[guildid]['administrator']
            for(let i = 0; i < admin.length; i++) {
                if(roles.cache.find(role => role.id === admin[i])){
                    return true;
                }
            }
        }
    	return false;
	},
    get_admin_array: async function (guildid)  //- returns if the roleid is in admin json array
    {
        var guild_data = fs.readFileSync('./src/GuildData.json');
        var guild_json = JSON.parse(guild_data);
        if(guild_json[guildid]) return guild_json[guildid]['admin'];
        return 0;
    },
    get_moderator_array: async function (guildid)  //- returns if the roleid is in admin json array
    {
        var guild_data = fs.readFileSync('./src/GuildData.json');
        var guild_json = JSON.parse(guild_data);
        if(guild_json[guildid]) return guild_json[guildid]['moderator'];
        return 0;
    },
    get_administrator_array: async function (guildid)  //- returns if the roleid is in admin json array
    {
        var guild_data = fs.readFileSync('./src/GuildData.json');
        var guild_json = JSON.parse(guild_data);
        if(guild_json[guildid]) return guild_json[guildid]['administrator'];
        return 0;
    },
    has_access: async function (guildid, roles) {
    	var guild_data = fs.readFileSync('./src/GuildData.json');
        var guild_json = JSON.parse(guild_data);
        if(guild_json[guildid]) {
            let admin = guild_json[guildid]['admin']
            for(let i = 0; i < admin.length; i++) {
                if(roles.cache.find(role => role.id === admin[i])){
                    return true;
                }
            }
            let moderator = guild_json[guildid]['moderator']
            for(let i = 0; i < moderator.length; i++) {
                if(roles.cache.find(role => role.id === admin[i])){
                    return true;
                }
            }
            let administrator = guild_json[guildid]['administrator']
            for(let i = 0; i < administrator.length; i++) {
                if(roles.cache.find(role => role.id === admin[i])){
                    return true;
                }
            }
        }
    	return false;
	}
}