//Require Packages..
const { Client, Intents, Collection } = require("discord.js");
const config = require('./config.json')
//const mongo = require('./util/mongo.js')
const {
  cmd_handler,
  event_handler,
  slash_handler,
  selectmenu_handler,
} = require("./util/handlers");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_WEBHOOKS],

});
client.commands = new Collection();
client.aliases = new Collection();
client.events = new Collection();
client.slashcmds = new Collection();
client.selectCommands = new Collection();
require("dotenv").config();

//Events.
 // mongo()
client.on("ready", () => {
 // console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("ugc-gaming.net", { type: "WATCHING" });
  cmd_handler(client);
  event_handler(client);
  slash_handler(client);
  selectmenu_handler(client);
});

//Login.
client.login(config.token);
