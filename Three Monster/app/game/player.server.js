var Deck = require("./deck.server");
var Hand = require("./hand.server");
var Field = require("./field.server");
var Monster = require("./monster.server");

function Player(id, deck) {
    this.id = id;
    this.deck = deck || Deck();
    this.hand = Hand();
    this.field = Field();
    
    Object.freeze(this.id);
    
    this.draw = function() {
        if(!this.deck.empty() && !this.hand.full()) {
            var card = this.deck.remove();
            this.hand.add(card);
            return card;
        }
    }
    
    this.summon = function(index) {
        if(!this.hand.empty() && !this.field.full()) {
            var card = this.hand.remove(index);
            if(card) {
                var monster = Monster(card);
                this.field.add(monster);
                return monster;
            }
        }
    }
    
    this.attack = function(player, sourceIndex, targetIndex) {
        if(player && 0 <= sourceIndex && sourceIndex < 3 && 0 <= targetIndex && targetIndex < 3) {
            var source = this.field.get(sourceIndex);
            var target = player.field.get(targetIndex);
            var powerAtk = Math.min(source.power, target.life);
            
            target.life = target.life - powerAtk;
            if(target.life == 0) {
                var destroyed = true;
                player.field.remove(targetIndex);
            }
            
            return {"sucess" : true, "destroy" : destroyed};
        } return {"sucess" : false};
    }
    
    this.hasAction = function() {
        // pode comprar ou pode invocar ou pode atacar (só comprar)
        return (!this.deck.empty()); // || !this.hand.empty() || !this.field.empty());
    }
}

module.exports = function(id, deck) {
    return new Player(id, deck);
}