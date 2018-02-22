function Field() {
	this.monsters = [null, null, null];
	this.count = 0;

	this.add = function(monster) {
		if(!this.monsters[0])		var index = 1;
		else if(!this.monsters[1]) 	var index = 2;
		else if(!this.monsters[2]) 	var index = 3;
		
		if(index) {
			this.monsters[--index] = monster;
			this.count++;
			return index;
		}
	}
	
	this.get = function(index) {
		if(0 <= index && index < 3) {
			return this.monsters[index];
		}
	}

	this.remove = function(index) {
		if(0 <= index && index < 3) {
			var monster = this.monsters[index];
            this.monsters[index] = null;
            this.count--;
            return monster;
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
	return new Field();
};