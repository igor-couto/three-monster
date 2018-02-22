const MAX_CARDS = 5;

function Deck() {
	this.cards = [];

	this.add = function(card) {
		if(this.cards.length < MAX_CARDS) {
			this.cards.push(card);
		}
	}
	
	this.remove = function() {
		if(this.cards.length > 0) {
			return this.cards.pop();
		}
	}
	
	this.empty = function() {
		return (this.cards.length <= 0);
	}
}

//! Gera um deck randomicamente passando as cartas disponíveis
module.exports.generate = function() {
	var cards = require("./card.server").getCards();
	// seleciona MAX_CARDS cartas randomicamente
	var deck = new Deck();
	for(var i = 0; i < MAX_CARDS; i++){
		deck.add(cards[Math.floor(Math.random() * cards.length)]);
	}
	return deck;
}

//! Gera um deck vazio
module.exports.create = function() {
	return new Deck();
}


