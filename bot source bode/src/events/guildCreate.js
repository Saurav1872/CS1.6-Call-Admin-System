const {
  setup_guilddata,
} = require("../util/functions.js");
module.exports= {
    name:"guildCreate",
    run: async (bot,guild)=>{
        var guild_data = fs.readFileSync('./src/GuildData.json');
        var guild_json = JSON.parse(guild_data);
		if(!guild_json[guild.Id]) {
            setup_guilddata(guild);
            return;
        }
    }
}