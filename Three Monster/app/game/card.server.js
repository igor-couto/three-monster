function Base() {
	this.urls = [];
	
	this.add = function(key, img, model) { this.urls[key] = {img : img, model : model}; }
	this.get = function(key)	{ return this.urls[key]; }
	this.keys = function()		{ return Object.keys(this.urls); }
}

var base = new Base();

function Card(id, key, power, life) {
	this.id = id;
	this.name = key || "Monstro " + id;
	this.power = power || Math.ceil(Math.random() * 10);
	this.life = life || Math.ceil(Math.random() * 30);
	this.img = base.get(key).img || "";
	this.model = base.get(key).model;
	
	// Congela as propriedades, i.e., torna-os constantes
	Object.freeze(this.id);
	Object.freeze(this.name);
	Object.freeze(this.power);
	Object.freeze(this.life);
}

//! Retorna todas as cartas disponíveis no sistema
module.exports.getCards = function() {
	// base com as urls da imagem e do modelo
	base.add("Mamute de Batalha", "img/mamuteDeBatalha.png", "models/mamuteDeBatalha.dae");
	base.add("Espírito do Gelo", "img/espiritoDoGelo.png", "models/espiritoDoGelo.dae");
	base.add("Guardiao da Floresta", "img/guardiaoDaFloresta.png", "models/guardiaoDaFloresta.dae");
	base.add("Lagosta Aterradora", "img/lagostaAterradora.png", "models/lagostaAterradora.dae");
	base.add("Dragao Voraz", "img/dragaoVoraz.png", "models/dragaoVoraz.dae");
	base.add("Lobo do Deserto", "img/loboDoDeserto.png", "models/loboDoDeserto.dae");
	base.add("Mamute Fantasma", "img/mamuteFantasma.png", "models/mamuteFantasma.dae");
	base.add("Porco Tribal", "img/porcoTribal.png", "models/porcoTribal.dae");
	var keys = base.keys();

	const cards = [];
		cards.push(new Card(1, "Guardiao da Floresta", 6, 5));
		cards.push(new Card(2, "Lobo do Deserto", 7, 4));
		cards.push(new Card(3, "Lagosta Aterradora", 4, 3));
		cards.push(new Card(4, "Mamute de Batalha", 6, 10));
		cards.push(new Card(5, "Espírito do Gelo", 5, 4));
		cards.push(new Card(6, "Dragao Voraz", 9, 6));
		cards.push(new Card(7, "Mamute Fantasma", 6, 10));
		cards.push(new Card(8, "Porco Tribal", 6, 6));
	return cards;
	
	/* Gerador randômico */
	/*
	for(var i = 0; i < 20; i++){
		cards.push(new Card(i+1, keys[Math.floor(Math.random() * keys.length)]));
	}
	*/
}