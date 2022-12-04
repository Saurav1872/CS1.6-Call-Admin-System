const fs = require("fs");
const path = require("path");
module.exports = {
  cmd_handler: async function (client) {
    const route = path.join(__dirname, "..", "/", "cmds");
    const files = fs.readdirSync(route);
    files.forEach(async (file) => {
      if(!file.endsWith('.js')) return;
      let command = require(`${route}/${file}`);
      client.commands.set(command.name, command);
      if (command.aliases) {
        command.aliases.forEach(alias => {
           client.aliases.set(alias, command);
        });
      };
    });
  },
  event_handler: async function (client) {
    const route = path.join(__dirname, "..", "/", "events");
    const files = fs.readdirSync(route);
    files.forEach(async (file) => {
      if(!file.endsWith('.js')) return;
      let event = require(`${route}/${file}`);
      client.events.set(event.name, event);
    });

    client.events.forEach(async (event) => {
      if (event.name == "ready") event.run(client);
      else{
      client.on(event.name, (...args) => {
        event.run(client, ...args);
      });}
    })
  },

  slash_handler: async function (client) {
    const route = path.join(__dirname, "..", "/", "slashcmds");
    const files = fs.readdirSync(route);
    const slashcmdsdata = [];
    files.forEach(async (file) => {
      if(!file.endsWith('.js')) return;
      let slashfile = require(`${route}/${file}`);
      client.slashcmds.set(slashfile.name, slashfile);
      slashcmdsdata.push(slashfile);
    });
      // mannual registering in UGC Discord Server
    client.guilds.cache.get("354018139538849793").commands.set(slashcmdsdata);
  },
  selectmenu_handler: async function (client) {
    const route = path.join(__dirname, "..", "/", "interactions");
    const files = fs.readdirSync(route);
    files.forEach(async (file) => {
      if(!file.endsWith('.js')) return;
      let command = require(`${route}/${file}`);
      client.selectCommands.set(command.id, command);
    });
  }
};
