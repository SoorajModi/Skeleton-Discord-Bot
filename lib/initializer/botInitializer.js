// botInitializer.js
// =================

const {fetchGuildInfo} = require("./fetchGuildInfo");
const {cacheMessage} = require("./cacheMessage");

module.exports = {
    botInitializer: function (client) {
        console.log("Bot is connected to Discord!");

        fetchGuildInfo(client, process.env.DISCORD_GUILD_ID);
        cacheMessage(client, process.env.DISCORD_CHANNEL_ID, process.env.DISCORD_MESSAGE_ID);

        console.log("Bot is now ready!");
    }
};