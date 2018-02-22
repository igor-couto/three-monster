/* Interface entre os comandos do servidor e o renderizador da arena */

/* global WGL */

const MAX_CARDS_DECK   = 10;
const MAX_CARDS_HAND   = 3;
const MAX_CARDS_FIELD  = 3;

function Arena() {
    var dn = MAX_CARDS_DECK;
    var hn = MAX_CARDS_HAND;
    var fn = MAX_CARDS_FIELD;
    
    this.deck  = [null, null];
    this.hand  = [new Array(hn), new Array(hn)];
    this.field = [new Array(fn), new Array(fn)];
    this.scenario = new WGL.FieldGridObj(fn);
    this.renderer = new WGL.Renderer();
    
    this._init_(dn);
}

Arena.prototype = {
    constructor: Arena,
    
    // Animações das jogadas //
    //< Compra uma carta
    draw: function() {
        // remover do children do deck correspondente a carta (CardObj)
        // setar a imagem da carta para textura (setTexture)
        // adicionar ao hand correspondente e a cena
        // fazer a animação: 
        //  - pegar a posição do slot vazio no hand, 
        //  - criar a matriz final (rotação -90° em x), 
        //  - fazer a interpolação com a matriz corrente, 
        //  - atualizar a matriz a cada quadro
    },
    //< Invoca um monstro
    summon: function() {
        // remover do hand a carta em questão
        // adicionar ao field correspondente e a cena
        // fazer a animação:
        //  - pegar a posição do slot vazio no field
        //  - ciar a matriz final (rotação -90° em x)
        //  - fazer a interpolação e atualizar a cada frame
        // carregar o monstro sobre a carta
    },
    //< Ataca o oponente
    fight: function() {
        // executar as animações de ataque e defesa
    },
    
    // Inicializador //
    _init_: function(dn) {
        // insere o cenário
        this.renderer.scene.add(this.scenario);
        
        // cria os decks
		var mydeck = new WGL.DeckObj(dn), opdeck = new WGL.DeckObj(dn);
		mydeck.position.set(6, 0, 12); opdeck.position.set(-6, 0, -12);
		this.deck[0] = mydeck; this.deck[1] = opdeck;
		Object.freeze(this.deck);
		
		// insere os decks
		this.renderer.scene.add(this.deck[0]);
		this.renderer.scene.add(this.deck[1]);
		
		// erase function
		this._init_ = undefined;
    },
};