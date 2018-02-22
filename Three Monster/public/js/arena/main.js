/*
	global Chat
	global Hand
	global Field
	global Renderer
	global log
	global logDraw
	global logSummon
	global logAttack
	global LISTENER
	global vex
	global $
*/

const MAX_MONSTERS = 6;

function start(socket) {
	vex.dialog.prompt({
		message: "<span style='color: #333'>Escolha um nickname para você</span>",
		placeholder: "Nickname",
		callback: function(value) {
			if(value) {
				$('#nick').text(value);
			}
		}
	});
	
	var chat = new Chat(socket);
	var renderer = new Renderer(MAX_MONSTERS + 2);
    var field = new Field(renderer);
    var hand = new Hand();
    var attacking = false;
    
    var handler = [];
    handler["draw"] = function(player, response) {
    	if(!response["warning"]) {
    		hand.add(response["card"]);
    		logDraw(player);
    	} else logDraw(3 - player);
    	attacking = false;
    }
    handler["summon"] = function(player, response) {
    	if(!response["warning"]) {
    		var card = hand.get(response["index"]);
			hand.remove(response["index"]);
			field.add(player, card);
			logSummon(player, card);
    	} else {
    		var monster = response["monster"];
    		field.add(3 - player, monster);
    		logSummon(3 - player, monster);
    	}
    	attacking = false;
    }
    handler["attack"] = function(player, response) {
    	// se resposta é um aviso então o player aqui é o defender
		player = (response["player"]);
		// obtém os monstros atacante e defensor
		var attacker = field.get(player, response["source"]["index"]);
		var defender = field.get(3 - player, response["target"]["index"]);
		// verifica se monstro foi destuído e atualiza o campo em cada caso
		if(response["target"]["life"] == 0) {
			field.remove(3 - player, response["target"]["index"]);
			logAttack(player, attacker, defender, true);
		} else {
			defender.life = response["target"]["life"];
			logAttack(player, attacker, defender, false);
		}
		field.unselect();
		attacking = false;
    }
    handler["end-game"] = function(player, response) {
    	attacking = false;
    	var winner = response["winner"];
    	alert(player == winner ? "You Winner!" : "You Lost!");
    }
    
    socket.on('player', function(player) {
        const ID = player["id"];
        field.setID(ID);
        $('#myid').text("Player " + ID);
        
        // preenche a mão inicial
        player["hand"].forEach(function(card) {
        	hand.add(card);
        });
        
        // Abre sala do jogo
        socket.on('game', function(res) {
            if(res["sucess"]) {
            	// passa a resposta para o handler da ação
            	handler[res["action"]](ID, res);
            } else {
            	log(res["what"], true);
            }
        });
		
		//! botão voltar na área de invocação
		$('#summon-area .back').on('click', function(evt){
			$('#summon-area').css("opacity", "0");
			setTimeout(function(){
				$('#summon-area').css("width", "0");
			}, 600);
		});
		
		//! evento de clique sobre a área do canvas
		$('#field-area').on('click', field.handler['click']);
		//! evento de motion sobre a área do canvas
		$('#field-area').on('mouseover', field.handler['mouseover']);
		//! evento de redimensionamento da janela
		$('#field-area').on('reshape', field.handler['reshape']);
		
		/* 
			Eventos que disparam solicitações ao servidor 
			- Ao clicar no deck solicita compra
			- Ao clicar em INVOCAR solicita summon
			- Ao clicar em sobre um monstro em seu lado de campo e em um do oponente solicita ataque
		*/
		
		renderer.on('deckclick', function(evt) {
			attacking = false;
			field.unselect();
			renderer.select(1, 0x007700, 0);
			
			vex.dialog.confirm({
		        message: '<p style="color:#3288e6">Comprar Carta?</p>',
		        callback: function(value) {
		            if(value === true) {
		            	socket.emit("game", {
							"action" : "draw",
							"player" : ID,
						});
		            }
		            renderer.unselect();
		        }
		    });
		});

		$('#summon-area #summon').on('click', function(evt) {
        	attacking = false;
        	field.unselect();
        	
        	socket.emit("game", {
				"action" : "summon",
				"player" : ID,
				"index" : hand.selected
			});
			// volta para a visualização da mão
			$('#summon-area .back').trigger('click');
		});

		renderer.on('monsterclick', function(evt) {
			if(!attacking) {
				if(evt.side == 1) { // no attacking e my side
					// monstro atacante selecionado --> habilitar ataque
					attacking = true;
					field.unselect();
					field.select(ID, evt.index);
				} else { // no attacking e oponent side
					// clicou no adversário antes de selecionar o próprio monstro
					// agora não faz nada, no futuro abrir informações do monstro clicado
					field.unselect();
				}
			} else { 
				if(evt.side == 2) { // attacking e oponent side
					// monstro defensor selecionado --> solicitar ataque
					field.select(3 - ID, evt.index);
					var source = field.getIndex(ID);
			    	var target = field.getIndex(3 - ID);
			    	// envia requisição
					socket.emit("game", {
						"action" : "attack",
						"player" : ID,
						"source" : source,
						"target" : target
					});
				} else { // attacking e my side
					// modo ataque, mas clicou em outro de seus monstros
					field.unselect();
					field.select(ID, evt.index);
				}
			}
		});
		
    }); // on 'player'
}