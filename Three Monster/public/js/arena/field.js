/* global LOADER */
/* global LISTENER */
/* global ElevatedGrid */
/* global CardObject */
/* global DeckObj */
/* global $ */

function Monster(card) {
	this.id = card.id;
    this.name = card.name;
    this.power = card.power;
    this.life = card.life;
    this.model = card.model;
    
    Object.freeze(this.id);
	Object.freeze(this.name);
	Object.freeze(this.model);
}

function Field(renderer) {
	var map = [];
	
	this.selected = [null, null];
	this.monsters = [[null, null, null], [null, null, null]];
	
	this.setID = function(playerid) {
		if(map.length == 0) {
			map.splice(playerid - 1, 0, 0);
			map.splice(3 - playerid - 1, 0, 1);
		}
	}
	
	this.add = function(player, card) {
		var slot = map[--player];
		if(!this.monsters[slot][0])			var index = 1;
        else if(!this.monsters[slot][1])	var index = 2;
        else if(!this.monsters[slot][2])	var index = 3;
		
		if(index) {
			var monster = new Monster(card);
			this.monsters[slot][--index] = monster;
			// adiciona monstro no canvas
			LOADER.load(monster.model, true, function(model) {
				position(model, slot, index);
				renderer.add(model, 2 + 3 * slot + index);	
			});
		}
	}
	
	this.get = function(player, index) {
		var slot = map[--player];
		var index = (0 <= index && index < 3) ? index : this.selected[slot];
		return this.monsters[slot][index];
	}

	this.getIndex = function(player) {
		var slot = map[--player];
		if(this.selected[slot] != null) {
			return this.selected[slot];
		} return -1;
	}

	this.remove = function(player, index) {
		var slot = map[--player];
		var index = (0 <= index && index < 3) ? index : this.selected[slot];
		this.monsters[slot][index] = null;
		renderer.remove(2 + 3 * slot + index);
	}
	
	this.select = function(player, index) {
		// seleciona um monstro de um player
		var slot = map[--player];
		this.selected[slot] = index;
		console.log("selecionado no lado", slot, "index", index);
		renderer.select(2 + 3 * slot + index, (slot == 0) ? 0x007700 : 0xFF0000, slot);
	}
	
	this.unselect = function() {
		this.selected[0] = null;
		this.selected[1] = null;
		renderer.unselect();
	}
	
	function position(monster, slot, index) {
		var x = ((slot == 0) ? 4 : -4) * (index - 1);
		var z = ((slot == 0) ? 4 : -4);
		monster.position.set(x, 2.0, z);
		monster.rotation.y = ((slot == 0) ? 180 : 0) * Math.PI / 180;
		monster.updateMatrix();
	}
	
	// inicializa renderer
	(function(that, renderer){
		// insere o campo
		var field = new ElevatedGrid(4, 0x333333);
		renderer.add(field, -1);
		// insere os decks
		var deck = new DeckObj(10); deck.position.set(6, 0, 13); renderer.add(deck, 1);
		var deck = new DeckObj(10); deck.position.set(-6, 0, -13); renderer.add(deck, -1);
		// insere cartas
		var card = new CardObject(11/8, 2); card.position.set(-6, 1, 12); renderer.add(card, -1);
		var card = new CardObject(11/8, 2); card.position.set(-2, 1, 12); renderer.add(card, -1);
		var card = new CardObject(11/8, 2); card.position.set(2, 1, 12); renderer.add(card, -1);
		var card = new CardObject(11/8, 2, true); card.position.set(6, 1, -12); renderer.add(card, -1);
		var card = new CardObject(11/8, 2, true); card.position.set(2, 1, -12); renderer.add(card, -1);
		var card = new CardObject(11/8, 2, true); card.position.set(-2, 1, -12); renderer.add(card, -1);
		// inicia renderer
		renderer.start($('#field-area'));
	}(this, renderer));

	//! Tratadores de eventos sobre o campo
	this.handler = [];
	
	this.handler['click'] = function(evt) {
		evt.preventDefault();
		var mx = (evt.offsetX / $(this).width()) * 2 - 1;
		var my = -(evt.offsetY / $(this).height()) * 2 + 1;
		LISTENER.modelclick({x: mx, y: my}, renderer);
	};
	
	this.handler['mouseover'] = function(evt) {
		evt.preventDefault();
		var mx = (evt.offsetX / $(this).width()) * 2 - 1;
		var my = -(evt.offsetY / $(this).height()) * 2 + 1;
	};
	
	this.handler['reshape'] = function(evt) {
		renderer.setSize($(this).width(), $(this).height());
	};

}