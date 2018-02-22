var server = require("./config/server")();
var game = require("./app/application");
var io = require("socket.io")(server);
var users = 0;

io.on('connection', function(socket){
   // emite o id do usuário
   socket.emit('chat', ++users);
   
   // abre a sala do chat para todos que conectarem, mesmo que não estejam jogando
   socket.on('chat-message', function(message) {
      io.emit('chat-message', message);
   });
   
   // adiciona o usuário aos players, caso haja slot disponível
   var player = game.addPlayer(socket);
   if(!player) return;
   
   // transfere dados do player somente para quem acabou de se conectar
   io.to(socket.id).emit("player", player);
   // inicia a máquina de estados do jogo
   game.start(socket);
   
   socket.on('disconnect', function(){
      game.removePlayer(socket);
      // remove o player de todas as salas que estava
      //var rooms = io.sockets.manager.roomClients[socket.id];
      //for(var room in rooms) {
      //   socket.leave(room);
      //}
   });
});

server.listen("8080");
console.log("Executando a aplicação em :8080");