
const EventEmitter = require('events')

/**
 * @typedef {Object} EmojiKeyWithValue { emojiKey: neededValue }
 * @property {string} value the emoji value
 */

/**
 * @typedef {Object} ScoreMovedEventData
 * @property {(DiscordEmoji|string)} emoji emoji or emoji name
 * @property {DiscordGuildTextChannel} channel
 * @property {DiscordMessage} message
 * @property {DiscordUser} user
 * @property {number} value
 */

module.exports = class DiscordScores extends EventEmitter {

    /**
     * @constructor DiscordPoint
     * @param {DiscordClient} client the Discord.js current client
     * @param {(Object|string[]|string)} emojiKeys emoji(s) id to capture
     * @param {(EmojiKeyWithValue|string)} emojiKeys.emojiKey emoji id to capture
     * @param {(EmojiKeyWithValue|string)} emojiKeys[].emojiKey emoji id to capture
     */

    constructor( client, emojiKeys ){

        super()

        this.client = client
        this.emojiKeys = []
        this.values = []

        if(Array.isArray(emojiKeys)){

            for(const emojiKey of emojiKeys){
                if(typeof emojiKey === "string"){
                    this.emojiKeys.push(emojiKey)
                }else{
                    for(const key in emojiKey){
                        this.emojiKeys.push(key)
                        this.values.push(emojiKey[key])
                    }
                }
            }

        }else if(typeof emojiKeys === "string"){

            this.emojiKeys = [emojiKeys]

        }else{

            for(const key in emojiKeys){
                this.emojiKeys.push(key)
                this.values.push(emojiKeys[key])
            }

        }

        /**
         * Check the raw event
         * @param {string} eventName
         * @param {onRawCallback} onRaw
         */

        this.client.on('raw', event => this.onRaw(event))

    }

    /**
     * @async
     * @callback onRawCallback
     * @param {Object} event event to analyse
     */

    async onRaw( event ){

        const eventNames = [
            "MESSAGE_REACTION_REMOVE",
            "MESSAGE_REACTION_ADD"
        ]

        const eventData = event.d

        const eventType = event.t
        if(!eventNames.includes(eventType)) return

        const emitName = eventNames.indexOf(eventType) ? 'add' : 'remove'

        const user = this.client.users.get(eventData.user_id)

        const channel = this.client.channels.get(eventData.channel_id)
        if(!channel) return

        const emojiKey = eventData.emoji.id || eventData.emoji.name
        if(!this.emojiKeys.includes(emojiKey)) return

        const emoji = this.client.emojis.get(emojiKey) || emojiKey

        const value = this.values.length > 0 ? this.values[this.emojiKeys.indexOf(emojiKey)] : 0

        const message = await channel.fetchMessage(eventData.message_id)

        if(message.author.id === user.id || user.bot || message.author.bot) return

        /**
         * Emit score moved event
         * @param {string} eventName
         * @param {ScoreMovedEventData} scoreMovedEventData
         */

        this.emit(emitName, {
            emoji: emoji,
            user: user,
            channel: channel,
            message: message,
            value: value
        })

    }

}