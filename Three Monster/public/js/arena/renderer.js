/* global THREE */
/* global Detector */
/* global requestAnimationFrame */
/* global CustomEvent */
/* global $ */

// Verifica se navegador suporta o webgl
if (!Detector.webgl) Detector.addGetWebGLMessage();

// Classe para renderização
function Renderer(capacity) {
	// modelos 3D na cena e o atualmente selecionado
	var models 	 = new Array(capacity);
	for(var i = 0; i < capacity; i++) {
		// inicializa slots dos modelos
		models[i] = null;
	}
	var selected = [ { model: null, hex: 0x0 } , { model: null, hex: 0x0 } ];
	
	// parâmetros
	var scene = new THREE.Scene();
	var wgl = new THREE.WebGLRenderer({antialias:true, alpha: true});
	var cam = null, controls = null;
	
	// utils
	var rad = function(deg) { return deg * (Math.PI/180); }
	var deg = function(rad) { return rad * (180/Math.PI); }
	
	this.start = function(screen) {
		/**
		 *	Sistema de Coordenadas	y---x
		 *							|
		 *							z
		 */
		 
		// configura cena e define a luz
		scene.fog = new THREE.Fog(0x111111, 0, 50);
		scene.add(new THREE.AmbientLight(0xffffff));
		
		// configura a câmera
		cam = new THREE.PerspectiveCamera(60, screen.width() / screen.height(), 0.05, 200);
		cam.position.set(0, 8, 23);
		cam.lookAt(scene.position);
		cam.updateProjectionMatrix();
		
		controls = new THREE.OrbitControls(cam);
		controls.enablePan = false; // translação da cena
		controls.mouseButtons.ORBIT = THREE.MOUSE.RIGHT;
		// range do zoom
		controls.minDistance = 12;	// dentro
		controls.maxDistance = 30;	// fora
		// range da rotação
		controls.minAzimuthAngle = rad(-110); // esquerda
		controls.maxAzimuthAngle = rad(110);  // direita
		// range da altura
		controls.minPolarAngle = rad(0);  // topo
		controls.maxPolarAngle = rad(89); // base
		// velocidades
		controls.rotateSpeed = 0.5;
		controls.zoomSpeed = 1.0;

		// configura o renderer e o adiciona na tela
		wgl.setClearColor(scene.fog.color, 1);
		wgl.setPixelRatio(window.devicePixelRatio);
		wgl.setSize(screen.width(), screen.height());
		screen[0].appendChild(wgl.domElement);
		
		// inicia loop de renderização
		animate();
	}
	
	// adiciona um modelo na cena, desde o slot esteja disponível
	this.add = function(model, slot) {
		if(0 <= slot && slot < models.length) {
			models[slot] = model;
			scene.add(models[slot]);
		} else scene.add(model);
	}
	// remove um modelo da cena dado o slot
	this.remove = function(slot) {
		if(0 <= slot && slot < models.length) {
			if(models[slot]) {
				scene.remove(models[slot]);
				models[slot] = null;
			}
		}
	}
	
	// retorna a referência para a câmera
	this.camera = function() { 
		return cam;
	}
	
	// retorna um modelo na cena
	this.model = function(slot) {
		if(0 <= slot && slot < models.length)
			return models[slot];
		else return selected.model[0];
	}
	
	// seleciona um modelo na cena
	this.select = function(slot, _hex, side) {
		if(0 <= slot && slot < models.length) {
			selected[side] = { model: models[slot], hex: _hex };
			models[slot].traverse(function (child){
				if(child.material){
					child.material.emissive.setHex(_hex);
				}
			});
		}
	}
	// deseleciona o modelo 
	this.unselect = function() {
		if(selected[0].model){
			selected[0].model.traverse(function (child){
				if(child.material){
					child.material.emissive.setHex(0x0);
				}
			});
			selected[0] = { model: null, hex: 0x0 };
		}
		
		if(selected[1].model){
			selected[1].model.traverse(function (child){
				if(child.material){
					child.material.emissive.setHex(0x0);
				}
			});
			selected[1] = { model: null, hex: 0x0 };
		}
	}
	
	this.setSize = function(width, height) {
		wgl.setSize(width, height);
		cam.aspect = width / height
		cam.updateProjectionMatrix();
	}
	
	// Renderização
	var clock = new THREE.Clock();
	
	// define loop da renderização
	function animate() {
		requestAnimationFrame(animate);
		THREE.AnimationHandler.update(clock.getDelta());
		controls.update();
		render();
	}
	
	function render() {
		wgl.render(scene, cam);
	}
	
	// Eventos
	var listeners = {};
	
	this.on = function(key, handler) {
		listeners[key] = handler;
	}
	
	this.trigger = function(key, event) {
		if(listeners[key]) {
			listeners[key](event);
		}
	}
}

function ElevatedGrid(slots, _color) {
	const minsz = 50;
    const step  = {x: 4, z: 4}
    const range = {
        x: 0.5 * step.x * slots, 
        z: 0.5 * step.z * slots
    };
    const size = {
        x: minsz - (minsz % step.x) + step.x, 
        z: minsz - (minsz % step.z) + step.z
    };
    const height = 2.0; 
    const _base = -0.05;
	
	var geometry = new THREE.Geometry();
	var material = new THREE.LineBasicMaterial();
	material.color.setHex(_color || 0xffffff);
	
	// Adiciona vértices das linhas verticais
	for(var i = -size.x; i <= size.x; i += step.x) {
		geometry.vertices.push(new THREE.Vector3(i, _base, -size.z));
		if(-range.x <= i && i <= range.x) {
			geometry.vertices.push(new THREE.Vector3(i, _base, -range.z - step.z));
			
			geometry.vertices.push(new THREE.Vector3(i, _base, -range.z - step.z));
			geometry.vertices.push(new THREE.Vector3(i, _base + height, -range.z));
			
			geometry.vertices.push(new THREE.Vector3(i, _base + height, -range.z));
			geometry.vertices.push(new THREE.Vector3(i, _base + height, range.z));
			
			geometry.vertices.push(new THREE.Vector3(i, _base + height, range.z));
			geometry.vertices.push(new THREE.Vector3(i, _base, range.z + step.z));
			
			geometry.vertices.push(new THREE.Vector3(i, _base, range.z + step.z));
		} geometry.vertices.push(new THREE.Vector3(i, _base, size.z));
	} 
	
	// Adiciona vértices das linhas horizontais
	for(var i = -size.z; i <= size.z; i += step.z) {
		geometry.vertices.push(new THREE.Vector3(-size.x, _base, i));
		if(-range.z <= i && i <= range.z) {
			geometry.vertices.push(new THREE.Vector3(-range.x - step.x, _base, i));
			
			geometry.vertices.push(new THREE.Vector3(-range.x - step.x, _base, i));
			geometry.vertices.push(new THREE.Vector3(-range.x, _base + height, i));
			
			geometry.vertices.push(new THREE.Vector3(-range.x, _base + height, i));
			geometry.vertices.push(new THREE.Vector3(range.x, _base + height, i));
			
			geometry.vertices.push(new THREE.Vector3(range.x, _base + height, i));
			geometry.vertices.push(new THREE.Vector3(range.x + step.x, _base, i));
			
			geometry.vertices.push(new THREE.Vector3(range.x + step.x, _base, i));
		} geometry.vertices.push(new THREE.Vector3(size.x, _base, i));
	}
	 
	// construtor da superclasse, controi o grid
	THREE.LineSegments.call(this, geometry, material);
}
// Herança
ElevatedGrid.prototype = Object.create(THREE.LineSegments.prototype);
ElevatedGrid.prototype.constructor = ElevatedGrid;

function CardObject(width, height, invert, textureFront) {
	var geometryFront = new THREE.PlaneGeometry(width, height);
	var geometryBack = new THREE.PlaneGeometry(width, height);
	// define os lados da frente e de trás
	if(!invert) geometryBack.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI));
	else geometryFront.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI));
	
	var textureBack = new THREE.ImageUtils.loadTexture('img/card_back.png');
	
	var materialFront = new THREE.MeshBasicMaterial({ color: 0xffffff });
	var materialBack = new THREE.MeshBasicMaterial({ color: 0x304b55, map: textureBack });
	
	var front = new THREE.Mesh(geometryFront, materialFront);
	var back = new THREE.Mesh(geometryBack, materialBack);
	
	THREE.Object3D.call(this);
	this.add(front);
	this.add(back);
}
// Herança
CardObject.prototype = Object.create(THREE.Object3D.prototype);
CardObject.prototype.constructor = CardObject;

function DeckObj(numberCards) {
    THREE.Object3D.call(this);
    
    var mid = -(numberCards >> 1);
    for(var i = 0; i < numberCards; i++, mid++) {
        var card = new CardObject(11/8, 2);
        card.position.set(0, 0, mid * 0.01);
        this.add(card);
    }
    
    this.rotation.x = Math.PI / 2;
}

DeckObj.prototype = Object.create(THREE.Object3D.prototype);
DeckObj.prototype.constructor = DeckObj;

// Namespace para carregamento dos modelos collada
var LOADER = (function() {
	var collada = new THREE.ColladaLoader();
	collada.options.convertUpAxis = true;
	
	return {
		load: function(path, animate, onFinished) {
			collada.load(path, function(object) {
				var model = object.scene;
				if(animate) {
					model.traverse(function(child) {
						if (child instanceof THREE.SkinnedMesh) {
							var animation = new THREE.Animation(child, child.geometry.animation);
							animation.timeScale = 1/20;
							animation.play();
						}
					});
				}
				model.scale.x = model.scale.y = model.scale.z = 0.002;
				if(onFinished) onFinished(model);
			});
		}
	}
})(); // cria o loader

var LISTENER = (function() {
	const FIELD_ID 		= 0;
	const DECK_ID  		= 1;
	const MONSTER_P1	= 2;
	const MONSTER_P2	= MONSTER_P1 + 3;
	
	var raycaster = new THREE.Raycaster();
	var monsterclick = false;
	
	return {
		modelclick: function(cursor, renderer) {
			// configura o raycaster para partir da posição do cursor
			raycaster.setFromCamera(cursor, renderer.camera());
			
			// verifica o click sobre o deck
			var intersects = raycaster.intersectObjects([renderer.model(DECK_ID)], true);
			if(intersects.length > 0) {
				// dispara o evento de clique sobre o deck
				renderer.trigger('deckclick', {
					mouse: cursor,
				});
			}
			
			// verifica o clique sobre monstros lado P1
			var monsters = [], indexes = [];
			for(var i = 0, j = 0; i < 3; i++) {
				if(renderer.model(MONSTER_P1 + i)) {
					monsters.push(renderer.model(MONSTER_P1 + i));
					indexes[j++] = i; // salva o índice
				}
			} if(monsters.length == 0) return;
			
			intersects = raycaster.intersectObjects(monsters, true);
			if(intersects.length > 0) {
				monsterclick = true;
				
				var idx, stop = false;
				for(var i = 0; i < monsters.length && !stop; i++){
					monsters[i].traverse(function(child) {
						if(child.id == intersects[0].object.parent.id) {
							idx = indexes[i]; stop = true;
						}
					});
				}
				
				renderer.trigger('monsterclick', {
					mouse: cursor,
					index: idx,
					side:  1
				});
			}
			
			if(monsterclick) {
				// verifica o clique sobre monstros lado P2
				var monsters = [], indexes = [];
				for(var i = 0, j = 0; i < 3; i++) {
					if(renderer.model(MONSTER_P2 + i)) {
						monsters.push(renderer.model(MONSTER_P2 + i));
						indexes[j++] = i; // salva o índice
					}
				} if(monsters.length == 0) return;
				
				intersects = raycaster.intersectObjects(monsters, true);
				if(intersects.length > 0) {
					monsterclick = false;
					
					var idx, stop = false;
					for(var i = 0; i < monsters.length && !stop; i++) {
						monsters[i].traverse(function(child) {
							if(child.id == intersects[0].object.parent.id) {
								idx = indexes[i]; stop = true;
							}
						});
					}

					renderer.trigger('monsterclick', {
						mouse: cursor,
						index: idx,
						side:  2
					});
				}
			}
		} // modelhover
	};
})(); // cria o listener