function Hand() {
    this.cards = [null, null, null];
    this.count = 0;
    
    this.add = function(card) {
        if(!this.cards[0]) var index = 1;
        else if(!this.cards[1]) var index = 2;
        else if(!this.cards[2]) var index = 3;
        
        if(index) {
            this.cards[--index] = card;
            this.count++;
            return index;
        }
    }
    
    this.remove = function(index) {
        if(0 <= index && index < 3) {
            var card = this.cards[index];
            this.cards[index] = null;
            this.count--;
            return card;
        }
    }
    
    this.full = function() {
        return (this.count == 3);
    }
    
    this.empty = function() {
        return (this.count == 0);
    }
}

module.exports = function() {
    return new Hand();
}