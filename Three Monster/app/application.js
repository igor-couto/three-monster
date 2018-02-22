var Deck = require("./game/deck.server");
var Player = require("./game/player.server");

var turn = 1;
var players = [undefined, undefined];

var handler = [];
handler["draw"] = function(request) {
	var p = players[request["player"] - 1];
	var card = p.draw();
	// prepara resposta à ser emitida
	var res = [];
	if(card) {
	    res["sender"]   = { 
	        "action" : "draw", 
	        "sucess" : true, 
	        "card"   : card
	    }; res["listener"] = { 
	        "action" : "draw", 
	        "sucess" : true, 
	        "warning": true
	    }; return res;
	} else {
	    res["sender"] = {
	        "sucess" : false,
	        "what"   : ((p.deck.empty()) ? "Não há cartas no seu deck, " : "Sua mão está cheia, ") + " realize outra jogada"
	    }; return res;
	}
}
handler["summon"] = function(request) {
	var p = players[request["player"] - 1];
	var monster = p.summon(request["index"]);
	// prepara resposta à ser emitida
	var res = [];
	if(monster) {
	    res["sender"] = {
	        "action" : "summon",
	        "sucess" : true,
	        "index"  : request["index"]
	    }; res["listener"] = {
	        "action" : "summon",
	        "sucess" : true,
	        "warning": true,
	        "monster": monster
	    }; return res;
	} else {
	    res["sender"] = {
	        "sucess" : false,
	        "what" : ((p.field.full()) ? "Campo cheio, " : "Mão vazia, ") + " realize outra jogada"
	    }; return res;
	}
}
handler["attack"] = function(request) {
	// define o player atacante e o player defensor da rodada
	var attacker = players[request["player"] - 1];
	var defender = players[3 - request["player"] - 1];
	// realiza o ataque
	var status = attacker.attack(defender, request["source"], request["target"]);
	// prepara resposta à ser emitida
	var res = [];
	if(status["sucess"]) {
	    var target = defender.field.get(request["target"]);
	    res["sender"] = res["listener"] = {
	        "action" : "attack",
	        "sucess" : true,
	        "player": request["player"],
	        "source" : {
	            "index" : request["source"]
	        },
	        "target" : {
	            "index" : request["target"],
	            "life"  : (target) ? target.life : 0
	        }
	    }; return res;
	} else {
	    res["sender"] = {
	        "sucess" : false,
	        "what" : "Monstro inválido, tente novamente"
	    }; return res;
	}
}

var endGame = function(socket, winner, loser) {
	var res = {
		"action" : "end-game",
		"sucess" : true,
		"winner" : winner
	}
	socket.emit('game', res);
	socket.broadcast.to(loser.id).emit('game', res);
	
	//socket.disconnect();
}

//! Máquina de estados do jogo
module.exports.start = function(socket) {
    socket.on('game', function(req){
        if(req["player"] == turn) {
            var res = handler[req["action"]](req);
            if(res["listener"]) {
                turn = 3 - turn;
                socket.emit('game', res["sender"]);
                socket.broadcast.to(players[turn-1].id).emit('game', res["listener"]);
                if(!players[turn-1].hasAction()) {
                	// próximo player a jogar não tem opção de jogada, fim de jogo
                	endGame(socket, 3 - turn, players[turn - 1]);
                }
            } else {
                socket.emit("game", res["sender"]);   
            }
        } else {
            socket.emit("game", {
                "sucess" : false,
                "what" : "Oponente não terminou sua jogada"
            });
        }
    });
}

//! Adiciona um player ao jogo
module.exports.addPlayer = function(socket) {
    if(!players[0]) {
        console.log("player 1 connected"); 
        var p1 = ( players[0] = Player(socket.id, Deck.generate()) );
        // retorna o id do player e sua mão inicial
        return { "id": 1, "hand": [p1.draw(), p1.draw(), p1.draw()] };
    }
    if(!players[1]) {
        console.log("player 2 connected"); 
        var p2 = ( players[1] = Player(socket.id, Deck.generate()) );
        // retorna o id do player e sua mão inicial
        return { "id": 2, "hand": [p2.draw(), p2.draw(), p2.draw()] };
    }
    console.log("player 3 unable to connect"); // Não há mais slots
    return undefined;
}

//! Remove um player do jogo
module.exports.removePlayer = function(socket) {
    if(players[0] && players[0].id === socket.id){
        console.log("player 1 disconnected");  
        players[0] = undefined;
    } else if(players[1] && players[1].id === socket.id){
        console.log("player 2 disconnected");  
        players[1] = undefined;
    }
}