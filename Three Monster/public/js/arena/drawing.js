/* Módulo com configurações do WebGL e Three js */

/* global extend rad deg */
/* global THREE Detector */
/* global requestAnimationFrame */

// verifica se navegador suporta o webgl
if (!Detector.webgl) Detector.addGetWebGLMessage();

// namespace com todas as funcionalidades do módulo
var WGL = (function() { 
return {
    // configura cenas, câmeras, renderizadores...
    Scene: function() {
        THREE.Scene.call(this);
        
        // configura o estado inicial
        this.fog = new THREE.Fog(0x111111, 8, 50);
		this.add(new THREE.AmbientLight(0xffffff));
    },
    
    Camera: function() {
        THREE.PerspectiveCamera.call(this, 60, 16/9, 0.05, 100);
        
        // configura o estado inicial
        this.position.set(0, 8, 23);
        this.lookAt(new THREE.Vector3(0, 0, 0));
		this.updateProjectionMatrix();
        
        // configura o controlador da câmera
        this.controls = new THREE.OrbitControls(this);
		this.controls.enablePan = false; // translação da cena
		this.controls.mouseButtons.ORBIT = THREE.MOUSE.LEFT;
		//< range do zoom
		this.controls.minDistance = 12;	// dentro
		this.controls.maxDistance = 30;	// fora
		//< range da rotação
		this.controls.minAzimuthAngle = rad(-110); // esquerda
		this.controls.maxAzimuthAngle = rad(110);  // direita
		//< range da altura
		this.controls.minPolarAngle = rad(0);  // topo
		this.controls.maxPolarAngle = rad(89); // base
		//< velocidades
		this.controls.rotateSpeed = 0.5;
		this.controls.zoomSpeed = 1.0;
    },
    
    Renderer: function() {
        THREE.Renderer.call(this, {
            antialias: true,
            alpha: true
        });
        this.setClearColor(0x111111, 1);
		this.setPixelRatio(window.devicePixelRatio);
		this.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.domElement);
		
		this.scene = new WGL.Scene();
		this.camera = new WGL.Camera();
		
		var that = this;
		var clock = new THREE.Clock();
		
		function animate() {
    		requestAnimationFrame(animate);
    		THREE.AnimationHandler.update(clock.getDelta());
    		that.camera.controls.update();
    		that.render(that.scene, that.camera);
    	}
    	
    	this.start = function() {
    	    animate();
    	}
    },
    
    // namespace relacionado a criação e carregamento de objetos 3D
    Loader: function(path, isAnimated, onFinished) {
        THREE.ColladaLoader.call(this);
        this.options.convertUpAxis = true;
        this.load(path, function(object) {
			var model = object.scene;
			if(isAnimated) {
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
    },
    
    FieldGridObj: function(slots) {
        THREE.Object3D.call(this);
        
        const minsz = 50;
        const step  = {x: 6, z: 8}
        const range = {
            min: -0.5 * step * slots, 
            max: +0.5 * step * slots
        };
        const size = {
            x: minsz + (minsz % step.x) + step.x, 
            z: minsz + (minsz % step.z) + step.z
        };
        const height = 2.0; 
        const _base = -0.05;
    	
    	var geometry = new THREE.Geometry();
    	var material = new THREE.LineBasicMaterial();
    	material.color.setHex(0x333333);
    	
    	// Adiciona vértices das linhas verticais
    	for(var i = -size.x; i <= size.x; i += step.x) {
    		geometry.vertices.push(new THREE.Vector3(i, _base, -size.z));
    		if(range.min <= i && i <= range.max) {
    			geometry.vertices.push(new THREE.Vector3(i, _base, range.min - step.z));
    			
    			geometry.vertices.push(new THREE.Vector3(i, _base, range.min - step.z));
    			geometry.vertices.push(new THREE.Vector3(i, _base + height, range.min));
    			
    			geometry.vertices.push(new THREE.Vector3(i, _base + height, range.min));
    			geometry.vertices.push(new THREE.Vector3(i, _base + height, range.max));
    			
    			geometry.vertices.push(new THREE.Vector3(i, _base + height, range.max));
    			geometry.vertices.push(new THREE.Vector3(i, _base, range.max + step.z));
    			
    			geometry.vertices.push(new THREE.Vector3(i, _base, range.max + step.z));
    		} geometry.vertices.push(new THREE.Vector3(i, _base, size.z));
    	} 
    	
    	// Adiciona vértices das linhas horizontais
    	for(var i = -size.z; i <= size.z; i += step.z) {
    		geometry.vertices.push(new THREE.Vector3(-size.x, _base, i));
    		if(range.min <= i && i <= range.max) {
    			geometry.vertices.push(new THREE.Vector3(range.min - step.x, _base, i));
    			
    			geometry.vertices.push(new THREE.Vector3(range.min - step.x, _base, i));
    			geometry.vertices.push(new THREE.Vector3(range.min, _base + height, i));
    			
    			geometry.vertices.push(new THREE.Vector3(range.min, _base + height, i));
    			geometry.vertices.push(new THREE.Vector3(range.max, _base + height, i));
    			
    			geometry.vertices.push(new THREE.Vector3(range.max, _base + height, i));
    			geometry.vertices.push(new THREE.Vector3(range.max + step.x, _base, i));
    			
    			geometry.vertices.push(new THREE.Vector3(range.max + step.x, _base, i));
    		} geometry.vertices.push(new THREE.Vector3(size.x, _base, i));
    	}
    	
    	this.add(new THREE.LineSegments(this, geometry, material));
    },
    
    CardObj: function(width, height, invert, _imgpath) {
        THREE.Object3D.call(this);
        // define a geometria
    	var geometryFront = new THREE.PlaneGeometry(width, height);
    	var geometryBack = new THREE.PlaneGeometry(width, height);
    	// define os lados da frente e de trás
    	if(!invert) geometryBack.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI));
    	else geometryFront.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI));
    	
    	// cria as texturas da carta
    	var textureFront = (_imgpath) ? new THREE.ImageUtils.loadTexture(_imgpath) : undefined;
    	var textureBack = new THREE.ImageUtils.loadTexture('img/card_back.png');
    	
    	// define os materiais
    	var materialFront = new THREE.MeshBasicMaterial({ color: 0xffffff, map: textureFront });
    	var materialBack = new THREE.MeshBasicMaterial({ color: 0x304b55, map: textureBack });
    	
    	this.add(new THREE.Mesh(geometryFront, materialFront));
    	this.add(new THREE.Mesh(geometryBack, materialBack));
    	
    	this.setTexture = function(path) {
    	    var tex = new THREE.ImageUtils.loadTexture(path);
    	    this.children[0].material.map = tex;
    	}
    },
    
    DeckObj: function(numberCards) {
        THREE.Object3D.call(this);
        
        var mid = numberCards >> 1;
        for(var i = 0; i < numberCards; i++, mid++) {
            var card = new WGL.CardObj(11/8, 2);
            card.position.set(0, 1, mid * 0.1);
            this.add(card);
        }
        
        this.rotation.x = Math.PI / 2;
    }
}})(); // WGL

extend(THREE.Scene, WGL.Scene);
extend(THREE.PerspectiveCamera, WGL.Camera);
extend(THREE.WebGLRenderer, WGL.Renderer);
extend(THREE.ColladaLoader, WGL.Loader);
extend(THREE.Object3D, WGL.FieldGridObj);
extend(THREE.Object3D, WGL.CardObj);
extend(THREE.Object3D, WGL.DeckObj);
