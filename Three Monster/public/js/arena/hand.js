function Hand() {
    this.dom = $('#hand-area img');
    this.cards = [null, null, null];
    this.selected = undefined;
    
    this.add = function(card) {
        if(!this.cards[0])      var index = 1;
        else if(!this.cards[1]) var index = 2;
        else if(!this.cards[2]) var index = 3;

        if(index) {
            this.cards[--index] = card;
            this.dom[index].src = card.img;
            this.dom[index].onload = function() {
                $(this).css('display', "block");
                //this.dom[index].style.display = "block";
            }
        }
    }
    
    this.get = function(index) {
        index = index || this.selected;
        return this.cards[index];
    }
    
    this.remove = function(index) {
        index = index || this.selected;
        this.cards[index] = null;
        this.dom[index].src = "#";
        this.dom[index].style.display = "none";
    }
    
    // DOM setup //
    this.dom.css('display', "none");
    
    this.dom.on('mousemove', (function(that) {
        return function(evt) {
    		that.dom.css('z-index', 0);
    		$(this).css('z-index', 1);	
	    }
	})(this));
	
	this.dom.on('click', (function(that) {
	    return function(evt) {
    		evt.preventDefault();
    		
    		// configura img da área de invocação para a carta clicada
    		var fig = $('#summon-area img');
    		fig.attr("src", $(this).attr('src'));
    		fig.attr("width", $(this).width() * 90 / $('#hand-area').width() + "%");
    		
    		// captura o índice da carta clicada e configura descrição do monstro
    		that.selected = $(this).index();
    		var card = that.cards[that.selected];
    		$('#summon-area p').text(card.id + ": " + card.name + " [" + card.power + "/" + card.life + "]");
    		
    		// faz a área de invocação aparecer
    		$('#summon-area').css("width", "100%");
    		$('#summon-area').css("opacity", "0.9");
	    }
    })(this));
}