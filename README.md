nodeJS + set
============

**Updated to work with modern node.js**

This is a multiplayer, realtime implementation of the popular ["Set" card game][1].
It uses [socket.io][2] to achieve realtime feedback with clients and [jQuery][3] for
various clientside animations.

### Docker instructions

See example docker-compose.yml

### Running directly

After cloning:

    npm install

The server runs in dev mode (supervisor to watch for code changes, extra logging) with:

    npm run-script dev

or production mode:

    npm start

[1]: http://en.wikipedia.org/wiki/Set_(game)
[2]: http://socket.io/
[3]: https://github.com/jquery/jquery
