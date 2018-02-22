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

module.exports = function(card) {
    return new Monster(card);
}