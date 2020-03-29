var http = require('http')
  , fs = require('fs')
  , io = require('socket.io')
  , servestatic = require('serve-static')
  , connect = require('connect')
  , nowww = require('connect-no-www')
  , Game = require('./game')
  , server
  , games = {}
  , latestPublicGame
  , clientDir = __dirname + '/client'
  , publicDir = __dirname + '/public'
  , depsDir = __dirname + '/deps'
  , prod = process.env.NODE_ENV === 'production';

function niceifyURL(req, res, next){
  if (/^\/game\/public/.exec(req.url)) {
    res.writeHead(302, {
      'Location': '/game/#!/' + getLatestPublicGame().hash
    });
    return res.end();
  }
  if (/^\/game$/.exec(req.url)) {
    res.writeHead(301, { 'Location': '/game/' });
    return res.end();
  }
  if (/^\/game\//.exec(req.url)) {
    req.url = '/game.html';
  } else if (/^\/about/.exec(req.url)) {
    req.url = '/about.html';
  } else if (/^\/help/.exec(req.url)) {
    req.url = '/help.html';
  } else if (/^\/?$/.exec(req.url)) {
    req.url = '/index.html';
  }
  return next();
}

server = connect.createServer(
    connect.logger(':status :remote-addr :url in :response-timems')
  , nowww()
  , niceifyURL
  , servestatic(publicDir, {
        matchType: /text|javascript/
      , maxAge: prod ? 86400000 : 0
    })
  , servestatic(publicDir + '/perm', {
        matchType: /image|font/
      , maxAge: prod ? 604800000 : 0
    })
);

server.listen(8000);

io = io.listen(server);
io.configure('production', function() {
  io.enable('browser client minification');  // send minified client
  io.enable('browser client etag');          // apply etag caching logic based on version number
  io.enable('browser client gzip');          // gzip the file
  io.set('log level', 1);                    // reduce logging
  io.set('transports', [                     // enable all transports (optional if you want flashsocket)
      'websocket'
    , 'flashsocket'
    , 'htmlfile'
    , 'xhr-polling'
    , 'jsonp-polling'
  ]);
});

function getUnusedHash() {
  do { var hash = randString(4); } while (hash in games);
  return hash;
}
function getGame(hash) {
  if (hash && hash in games) return games[hash];
  hash = getUnusedHash();
  return (games[hash] = new Game(io, hash));
}

function getLatestPublicGame() {
  if (!latestPublicGame ||
    latestPublicGame.started ||
    !(latestPublicGame.hash in games))
  {
    var hash = getUnusedHash();
    latestPublicGame = games[hash] = new Game(io, hash, 2);
  }
  return latestPublicGame;
}

io.sockets.on('connection', function(socket){
  var game = null;
  socket.on('init', function(message){
    console.log('connecting socket ' + socket.id);
    game = getGame(message.game);
    game.registerClient(socket, message.sess);
    (game.handleClientMessage('init', socket)).call(game, message);
    if (message.game !== game.hash) socket.emit('setHash', game.hash);
  });

  socket.on('disconnect', function() {
    if (!game) return;
    var hash = game.hash;
    game.unregisterClient(socket, function gameOver() {
      console.log('gameover called');
      delete games[hash];
    });
    game = null;
  });
});

var CHARSET = ['A','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','T','V','W','X','Y','Z'];

function randString(size) {
  var ret = "";
  while (size-- > 0) {
    ret += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }
  return ret;
}
