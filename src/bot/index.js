const { Client, Events, GatewayIntentBits } = require('discord.js');
const Member = require('../schemas/member.schema');
const cachingdb = require('../db/cachingdb');

/**
 * Array of greetings used to identify friendly messages.
 * @type {string[]}
 */
const greetings = [
    'Hello!',
    'Hi there!',
    'Welcome!',
    'Greetings!',
    'Hey!',
    'Good to see you!',
    'Howdy!',
    'Salutations!',
    'Hola!',
    'Namaste!',
];

/**
 * Discord.js client instance for handling bot interactions.
 * @type {Client}
 */
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
    ]
});

/**
 * Event handler for the 'ready' event.
 * @event Client#ready
 * @param {Client} c - The client that emitted the event.
 */
client.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

/**
 * Event handler for the 'messageCreate' event.
 * @event Client#messageCreate
 * @param {Message} message - The message that was created.
 */
client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    let matched;
    const members = await cachingdb.get('members');

    if (!members?.length > 0) matched = await members?.find((member) => (member?.userId === message.author.id && member.username === message.author.username));
    if (!matched) matched = await Member.findOne({ userId: message.author.id });
    if (!matched) return;

    await client.users.cache.get(matched?.owner).send(`Message from:${message.author.username}\n` + message.content);
});

/**
 * Event handler for the 'messageCreate' event to respond to greetings.
 * @event Client#messageCreate
 * @param {Message} message - The message that was created.
 */
client.on(Events.MessageCreate, async (message) => {
    const isGreeting = greetings.some((greeting) => message.content.toLowerCase().includes(greeting.toLowerCase()));
    if (isGreeting) {
        await message.channel.send(`${message.author.toString()} ${message.content} \u{1F60A}`);
    }
});

/**
 * Event handler for the 'guildMemberAdd' event.
 * @event Client#guildMemberAdd
 * @param {GuildMember} member - The member that joined the guild.
 */
client.on(Events.GuildMemberAdd, async (member) => {
    await member.user.send(`Welcome, ${member.user}! You joined ${member.guild.name}. Enjoy your time in the server!`);
});

/**
 * Export the Discord.js client instance.
 * @type {Client}
 */
module.exports = client;
