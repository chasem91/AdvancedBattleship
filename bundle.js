/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _player_board = __webpack_require__(1);
	
	var _player_board2 = _interopRequireDefault(_player_board);
	
	var _opponent_board = __webpack_require__(2);
	
	var _opponent_board2 = _interopRequireDefault(_opponent_board);
	
	var _ship = __webpack_require__(3);
	
	var _ship2 = _interopRequireDefault(_ship);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var canvas = document.getElementById("render-canvas");
	var engine = new BABYLON.Engine(canvas, true);
	
	var scene = new BABYLON.Scene(engine);
	var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(230, 240, 0), scene);
	camera.lockedTarget = new BABYLON.Vector3(-30, 0, 0);
	camera.attachControl(canvas, true);
	var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 1), scene);
	light.intensity = 0.7;
	
	var playerBoard = (0, _player_board2.default)(scene);
	var opponentBoard = (0, _opponent_board2.default)(scene);
	opponentBoard.position.x = -250;
	(0, _ship2.default)("aircraftCarrier1", "playerBoard", 5, scene);
	(0, _ship2.default)("battleship1", "playerBoard", 4, scene);
	(0, _ship2.default)("destroyer1", "playerBoard", 3, scene);
	(0, _ship2.default)("submarine1", "playerBoard", 3, scene);
	(0, _ship2.default)("patrolBoat1", "playerBoard", 2, scene);
	(0, _ship2.default)("aircraftCarrier2", "opponentBoard", 5, scene);
	(0, _ship2.default)("battleship2", "opponentBoard", 4, scene);
	(0, _ship2.default)("destroyer2", "opponentBoard", 3, scene);
	(0, _ship2.default)("submarine2", "opponentBoard", 3, scene);
	(0, _ship2.default)("patrolBoat2", "opponentBoard", 2, scene);
	
	var attatchEmitter = function attatchEmitter(mesh) {
	  // Create a particle system
	  var particleSystem = new BABYLON.ParticleSystem("particles", 600, scene);
	
	  //Texture of each particle
	  particleSystem.particleTexture = new BABYLON.Texture("explosion.png", scene);
	
	  // Where the particles come from
	  particleSystem.emitter = mesh; // the starting object, the emitter
	  particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0); // Starting all from
	  particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0); // To...
	
	  particleSystem.minSize = 1.0;
	  particleSystem.maxSize = 3.0;
	
	  particleSystem.minLifeTime = 0.3;
	  particleSystem.maxLifeTime = 1.5;
	
	  particleSystem.emitRate = 1500;
	
	  // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
	  particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
	
	  particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);
	
	  particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 3);
	  particleSystem.direction2 = new BABYLON.Vector3(7, 8, -3);
	
	  particleSystem.minAngularSpeed = Math.PI;
	  particleSystem.maxAngularSpeed = 2 * Math.PI;
	
	  // Speed
	  particleSystem.minEmitPower = 1;
	  particleSystem.maxEmitPower = 4;
	  particleSystem.updateSpeed = 0.005;
	
	  var updateFunction = function updateFunction(particles) {
	    for (var index = 0; index < particles.length; index++) {
	      var particle = particles[index];
	      particle.age += this._scaledUpdateSpeed;
	
	      if (particle.age >= particle.lifeTime) {
	        particles.splice(index, 1);
	        this._stockParticles.push(particle);
	        index--;
	        continue;
	      } else {
	        particle.colorStep.scaleToRef(this._scaledUpdateSpeed, this._scaledColorStep);
	        particle.color.addInPlace(this._scaledColorStep);
	
	        if (particle.color.a < 0) particle.color.a = 0;
	
	        particle.angle += particle.angularSpeed * this._scaledUpdateSpeed;
	
	        particle.direction.scaleToRef(this._scaledUpdateSpeed, this._scaledDirection);
	        particle.position.addInPlace(this._scaledDirection);
	
	        this.gravity.scaleToRef(this._scaledUpdateSpeed, this._scaledGravity);
	        particle.direction.addInPlace(this._scaledGravity);
	      }
	    }
	  };
	
	  particleSystem.updateFunction = updateFunction;
	
	  particleSystem.start();
	};
	
	var fireProjectile = function fireProjectile(point) {
	  var projectile = new BABYLON.Mesh.CreateSphere("projectile", 16, 4, scene);
	  projectile.position = new BABYLON.Vector3(Math.round(point.x / 20) * 20 + 480, projectile.position.y, Math.round((point.z + 10) / 20) * 20 - 10);
	  var vertAnim1 = function vertAnim1() {
	    var animationProjectile = new BABYLON.Animation("myAnimation1", "position.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
	
	    var keys = [];
	    keys.push({ frame: 0, value: 0 });
	    keys.push({ frame: 75, value: 100 });
	
	    animationProjectile.setKeys(keys);
	
	    var easingFunction = new BABYLON.QuadraticEase();
	    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
	
	    animationProjectile.setEasingFunction(easingFunction);
	
	    return animationProjectile;
	  };
	  var vertAnim2 = function vertAnim2() {
	    var animationProjectile = new BABYLON.Animation("myAnimation2", "position.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
	
	    var nextPos = 0;
	
	    var keys = [];
	    keys.push({ frame: 76, value: 100 });
	    keys.push({ frame: 150, value: 0 });
	
	    animationProjectile.setKeys(keys);
	
	    var easingFunction = new BABYLON.QuadraticEase();
	    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN);
	
	    animationProjectile.setEasingFunction(easingFunction);
	
	    return animationProjectile;
	  };
	  var horizAnim = function horizAnim() {
	    var animationProjectile = new BABYLON.Animation("myAnimation3", "position.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
	
	    var nextPos = projectile.position.x - 240;
	
	    var keys = [];
	    keys.push({ frame: 0, value: projectile.position.x });
	    keys.push({ frame: 75, value: nextPos });
	    keys.push({ frame: 75, value: nextPos + 240 });
	    keys.push({ frame: 150, value: nextPos });
	
	    animationProjectile.setKeys(keys);
	
	    return animationProjectile;
	  };
	
	  projectile.animations.push(vertAnim1());
	  projectile.animations.push(horizAnim());
	
	  attatchEmitter(projectile);
	
	  scene.beginAnimation(projectile, 0, 75, false, 3, function () {
	    projectile.animations = [];
	    projectile.animations.push(vertAnim2());
	    projectile.animations.push(horizAnim());
	    scene.beginAnimation(projectile, 76, 150, false, 2, function () {
	      var p = projectile;
	      var s = scene;
	      debugger;
	    });
	  });
	};
	
	var startingPoint = void 0;
	var currentMesh = void 0;
	
	var snapToGrid = function snapToGrid() {
	  var shipSegments = scene.getMeshesByTags(currentMesh.id);
	  shipSegments.forEach(function (segment) {
	    segment.position = new BABYLON.Vector3(Math.round((segment.position.x + 10) / 20) * 20 - 10, segment.position.y, Math.round((segment.position.z + 10) / 20) * 20 - 10);
	  });
	};
	var getGroundPosition = function getGroundPosition() {
	  var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
	    return mesh == playerBoard;
	  });
	  if (pickInfo.hit) {
	    return pickInfo.pickedPoint;
	  }
	  return null;
	};
	var onMouseDown = function onMouseDown(e) {
	  if (e.button !== 0) {
	    return;
	  }
	  var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
	    return mesh !== playerBoard;
	  });
	  if (pickInfo.hit) {
	    currentMesh = pickInfo.pickedMesh;
	    startingPoint = getGroundPosition();
	    if (startingPoint) {
	      setTimeout(function () {
	        camera.detachControl(canvas);
	      }, 0);
	    }
	  }
	};
	var onMouseUp = function onMouseUp() {
	  var pickInfo = scene.pick(scene.pointerX, scene.pointerY);
	  if (startingPoint) {
	    camera.attachControl(canvas, true);
	    startingPoint = null;
	    snapToGrid();
	    return;
	  } else if (pickInfo.pickedMesh && pickInfo.pickedMesh.name === "opponentBoard") {
	    opponentBoard.subMeshes[pickInfo.subMeshId].hit = true;
	    fireProjectile(pickInfo.pickedPoint);
	  }
	};
	var onMouseMove = function onMouseMove(e) {
	  if (!startingPoint) {
	    return;
	  }
	
	  var current = getGroundPosition(e);
	
	  if (!current) {
	    return;
	  }
	
	  var diff = current.subtract(startingPoint);
	  var currentMeshes = scene.getMeshesByTags(currentMesh.id);
	  if (currentMeshes.length > 0) {
	    currentMeshes.forEach(function (mesh) {
	      mesh.position.addInPlace(diff);
	    });
	  } else {
	    currentMesh.position.addInPlace(diff);
	  }
	
	  startingPoint = current;
	};
	var onMouseOver = function onMouseOver(e) {
	  e.preventDefault();
	  var s = scene;
	};
	var onKeyPress = function onKeyPress(e) {
	  if (e.key === " ") {
	    if (currentMesh) {
	      (function () {
	        var currentMeshes = scene.getMeshesByTags(currentMesh.id);
	        var oldPosition = currentMesh.position;
	        currentMeshes.forEach(function (mesh) {
	          mesh.position = new BABYLON.Vector3(mesh.position.z, mesh.position.y, mesh.position.x);
	        });
	        var newPosition = currentMesh.position;
	        var positionOffset = new BABYLON.Vector3(oldPosition.x - newPosition.x, oldPosition.y - newPosition.y, oldPosition.z - newPosition.z);
	        currentMeshes.forEach(function (mesh) {
	          mesh.position.addInPlace(positionOffset);
	        });
	      })();
	    }
	  }
	};
	
	canvas.addEventListener("mousedown", onMouseDown, false);
	canvas.addEventListener("mouseup", onMouseUp, false);
	canvas.addEventListener("mousemove", onMouseMove, false);
	canvas.addEventListener("mouseover", onMouseOver, false);
	window.addEventListener("keypress", onKeyPress, false);
	
	scene.onDispose = function () {
	  canvas.removeEventListener("mousedown", onMouseDown);
	  canvas.removeEventListener("mouseup", onMouseUp);
	  canvas.removeEventListener("mousemove", onMouseMove);
	  canvas.removeEventListener("mouseover", onMouseOver);
	  window.removeEventListener("keypress", onKeyPress);
	};
	
	var playerShipNames = ["aircraftCarrier1", "battleship1", "destroyer1", "submarine1", "patrolBoat1"];
	
	scene.registerBeforeRender(function () {
	  playerBoard.subMeshes.forEach(function (subMesh) {
	    subMesh.materialIndex = subMesh.originalMaterialIndex;
	  });
	  playerShipNames.forEach(function (shipName) {
	    var shipSegments = scene.getMeshesByTags(shipName);
	    shipSegments.forEach(function (segment) {
	      var ray = new BABYLON.Ray(new BABYLON.Vector3(segment.position.x, playerBoard.getBoundingInfo().boundingBox.maximumWorld.y + 1, segment.position.z), new BABYLON.Vector3(0, -1, 0));
	      var worldInverse = new BABYLON.Matrix();
	      playerBoard.getWorldMatrix().invertToRef(worldInverse);
	      ray = BABYLON.Ray.Transform(ray, worldInverse);
	      var pickInfo = playerBoard.intersects(ray);
	      if (pickInfo.hit) {
	        playerBoard.subMeshes[pickInfo.subMeshId].materialIndex = 2;
	      }
	    });
	  });
	  opponentBoard.subMeshes.forEach(function (subMesh) {
	    subMesh.materialIndex = subMesh.hit ? 3 : subMesh.originalMaterialIndex;
	  });
	  var pickInfo = scene.pick(scene.pointerX, scene.pointerY);
	  if (pickInfo.pickedMesh && pickInfo.pickedMesh.name === "opponentBoard") {
	    var subMesh = opponentBoard.subMeshes[pickInfo.subMeshId];
	    if (subMesh.hit) {
	      subMesh.materialIndex = 3;
	    } else {
	      subMesh.materialIndex = 2;
	    }
	  }
	});
	
	engine.runRenderLoop(function () {
	  scene.render();
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (scene) {
	  var tiledGround = new BABYLON.Mesh.CreateTiledGround("playerBoard", -100, -140, 100, 140, { "w": 1, "h": 1 }, { 'h': 14, 'w': 10 }, scene);
	  var lightGreenMaterial = new BABYLON.StandardMaterial("LightGreen", scene);
	  lightGreenMaterial.diffuseColor = new BABYLON.Color3(.41, .61, .45);
	
	  var darkGreenMaterial = new BABYLON.StandardMaterial("DarkGreen", scene);
	  darkGreenMaterial.diffuseColor = new BABYLON.Color3(.59, .80, .60);
	
	  var redMaterial = new BABYLON.StandardMaterial("Red", scene);
	  redMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
	
	  var multimat = new BABYLON.MultiMaterial("multi", scene);
	  multimat.subMaterials.push(lightGreenMaterial);
	  multimat.subMaterials.push(darkGreenMaterial);
	  multimat.subMaterials.push(redMaterial);
	
	  tiledGround.material = multimat;
	
	  var verticesCount = tiledGround.getTotalVertices();
	  var tileIndicesLength = tiledGround.getIndices().length / (14 * 10);
	
	  tiledGround.subMeshes = [];
	  var base = 0;
	  for (var row = 0; row < 14; row++) {
	    for (var col = 0; col < 10; col++) {
	      var materialIndex = row % 2 ^ col % 2;
	      var subMesh = new BABYLON.SubMesh(materialIndex, 0, verticesCount, base, tileIndicesLength, tiledGround);
	      subMesh.originalMaterialIndex = materialIndex;
	      tiledGround.subMeshes.push(subMesh);
	      base += tileIndicesLength;
	    }
	  }
	  return tiledGround;
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (scene) {
	  var tiledGround = new BABYLON.Mesh.CreateTiledGround("opponentBoard", -100, -140, 100, 140, { "w": 1, "h": 1 }, { 'h': 14, 'w': 10 }, scene);
	  var lightRedMaterial = new BABYLON.StandardMaterial("LightRed", scene);
	  lightRedMaterial.diffuseColor = new BABYLON.Color3(.95, 0, 0);
	
	  var darkRedMaterial = new BABYLON.StandardMaterial("DarkRed", scene);
	  darkRedMaterial.diffuseColor = new BABYLON.Color3(.65, 0, 0);
	
	  var yellowMaterial = new BABYLON.StandardMaterial("Yellow", scene);
	  yellowMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0);
	
	  var orangeMaterial = new BABYLON.StandardMaterial("Orange", scene);
	  orangeMaterial.diffuseColor = new BABYLON.Color3(1, .8, 0);
	
	  var multimat = new BABYLON.MultiMaterial("multi", scene);
	  multimat.subMaterials.push(lightRedMaterial);
	  multimat.subMaterials.push(darkRedMaterial);
	  multimat.subMaterials.push(yellowMaterial);
	  multimat.subMaterials.push(orangeMaterial);
	
	  tiledGround.material = multimat;
	  var verticesCount = tiledGround.getTotalVertices();
	  var tileIndicesLength = tiledGround.getIndices().length / (14 * 10);
	
	  tiledGround.subMeshes = [];
	  var base = 0;
	  for (var row = 0; row < 14; row++) {
	    for (var col = 0; col < 10; col++) {
	      var materialIndex = row % 2 ^ col % 2;
	      var subMesh = new BABYLON.SubMesh(materialIndex, 0, verticesCount, base, tileIndicesLength, tiledGround);
	      subMesh.originalMaterialIndex = materialIndex;
	      tiledGround.subMeshes.push(subMesh);
	      base += tileIndicesLength;
	    }
	  }
	  return tiledGround;
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var rotate = function rotate(mesh, scene) {
	  var currentMeshes = scene.getMeshesByTags(mesh.id);
	  var oldPosition = mesh.position;
	  currentMeshes.forEach(function (mesh) {
	    mesh.position = new BABYLON.Vector3(mesh.position.z, mesh.position.y, mesh.position.x);
	  });
	  var newPosition = mesh.position;
	  var positionOffset = new BABYLON.Vector3(oldPosition.x - newPosition.x, oldPosition.y - newPosition.y, oldPosition.z - newPosition.z);
	  currentMeshes.forEach(function (mesh) {
	    mesh.position.addInPlace(positionOffset);
	  });
	};
	
	exports.default = function (name, boardName, length, scene) {
	  // const ship = new BABYLON.Mesh.CreateBox("ship1", 20, scene);
	  // ship.isVisible = false;
	  var boxes = [];
	  for (var i = 1; i <= length; i++) {
	    boxes.push(new BABYLON.Mesh.CreateBox(name, 20, scene));
	  }
	  boxes.forEach(function (box, idx) {
	    BABYLON.Tags.AddTagsTo(box, name);
	    if (boardName === "playerBoard") {
	      box.position.x = 20 * idx;
	    } else {
	      box.position.x = 20 * idx - 200;
	      box.position.z = 10;
	      // box.visibility = false;
	      box.isPickable = false;
	    }
	  });
	  if (boardName === "opponentBoard") {
	    rotate(boxes[0], scene);
	  }
	};

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map