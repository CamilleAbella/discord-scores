# DiscordScores

```js
const client = new Discord.Client()
```

## Start using

Simple use:

```js
const score = new DiscordScores( client, '👍' )

score.on( 'add', event => {

    // 👍 is add (event.emoji)
    // by event.user 
    // on event.message
    // in event.channel
    // for event.message.author

})
```

With value:

```js
const score = new DiscordScores( client, { '👍': 1 } )

score.on( 'remove', event => {

    // 👍 is remove
    // The score of message.author drops by 1 (event.value)

})
```

Multi entries:

```js
const score = new DiscordScores( client, [
    { '👍': 1 }, 
    { '👎': -1 } 
])

score.on( 'remove', event => {

    // 👎 is remove
    // The score of message.author increases by 1 (the reverse of this value)

})
```

Simple multi entries:

```js
const score = new DiscordScores( client, ['👍','👎'])

score.on( 'add', event => {

    // 👍 is add
    // Anyway...

})
```

## It's up to you to do the overlay!

- Stockage in database
- Anti cheat for double accounts
- Your personnal values and emojis

> Custom emojis are accepted!