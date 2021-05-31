const source = require('rfr');

const { sendMessage } = source('bot/utils/util');

const logger = source('bot/utils/logger');
const { Settings } = source('models/settings');
const { Message } = source('models/message');

function auditHandler(message, client) {
    const guild = client.guilds.cache.get(message.guild.id);
    let channel;
    let username = 'unknown';
    let content = 'unknown';

    return Message.find(message.guild.id, message.channel.id, message.id)
        .then((m) => {
            if (!m) return null;

            content = m.content;
            return guild.members.fetch(m.authorID);
        })
        .then((u) => {
            if (u) username = u.user.username;
            return Settings.getServerSettings(message.guild.id);
        })
        .then((config) => {
            if (!config || !config.auditChannel) {
                throw new Error('No audit channel is specified for the guild');
            }

            channel = guild.channels.cache.get(config.auditChannel);
            if (!channel) {
                logger.error(`audit channel for guild ${message.guild.id} does not exist`);
                return;
            }
            sendMessage(channel, `**DELETED MESSAGE**\nauthor: ${username}\nChannel: <#${message.channel.id}>\nContent: ${content}`);
        })
        .catch((e) => {
            logger.error('failed to send the delete message to the audit channel');
            logger.error(e);
        });
}

module.exports = {
    name: 'messageDelete',
    once: false,
    execute: auditHandler,
};