import createPlayerBoard from './player_board';
import createOpponentBoard from './opponent_board';
import createShip from './ship.js';

const canvas = document.getElementById("render-canvas");
const engine = new BABYLON.Engine(canvas, true);

const scene = new BABYLON.Scene(engine);
const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(230, 240, 0), scene);
camera.lockedTarget = new BABYLON.Vector3(-30, 0, 0);
camera.attachControl(canvas, true);
const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 1), scene);
light.intensity = 0.7;

const playerBoard = createPlayerBoard(scene);
const opponentBoard = createOpponentBoard(scene);
opponentBoard.position.x = -250;
createShip("aircraftCarrier1", "playerBoard", 5, scene);
createShip("battleship1", "playerBoard", 4, scene);
createShip("destroyer1", "playerBoard", 3, scene);
createShip("submarine1", "playerBoard", 3, scene);
createShip("patrolBoat1", "playerBoard", 2, scene);
createShip("aircraftCarrier2", "opponentBoard", 5, scene);
createShip("battleship2", "opponentBoard", 4, scene);
createShip("destroyer2", "opponentBoard", 3, scene);
createShip("submarine2", "opponentBoard", 3, scene);
createShip("patrolBoat2", "opponentBoard", 2, scene);

const attatchEmitter = (mesh) => {
  // Create a particle system
  const particleSystem = new BABYLON.ParticleSystem("particles", 600, scene);

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

	const updateFunction = function(particles) {
		for (let index = 0; index < particles.length; index++) {
			const particle = particles[index];
			particle.age += this._scaledUpdateSpeed;

			if (particle.age >= particle.lifeTime) {
				particles.splice(index, 1);
				this._stockParticles.push(particle);
				index--;
				continue;
			} else {
				particle.colorStep.scaleToRef(this._scaledUpdateSpeed, this._scaledColorStep);
				particle.color.addInPlace(this._scaledColorStep);

				if (particle.color.a < 0)
				  particle.color.a = 0;

				particle.angle += particle.angularSpeed * this._scaledUpdateSpeed;

				particle.direction.scaleToRef(this._scaledUpdateSpeed, this._scaledDirection);
				particle.position.addInPlace(this._scaledDirection);

				this.gravity.scaleToRef(this._scaledUpdateSpeed, this._scaledGravity);
				particle.direction.addInPlace(this._scaledGravity);
			}
		}
	}

	particleSystem.updateFunction = updateFunction;

  particleSystem.start();
}

const fireProjectile = (point) => {
  const projectile = new BABYLON.Mesh.CreateSphere("projectile", 16, 4, scene);
  projectile.position = new BABYLON.Vector3(
    (Math.round(point.x / 20) * 20) + 480,
    projectile.position.y,
    (Math.round((point.z + 10) / 20) * 20) - 10,
  );
  const vertAnim1 = () => {
    const animationProjectile = new BABYLON.Animation(
      "myAnimation1",
      "position.y",
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );

    const keys = [];
    keys.push({frame: 0, value: 0});
    keys.push({frame: 75, value: 100});

    animationProjectile.setKeys(keys);

    const easingFunction = new BABYLON.QuadraticEase();
    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);

    animationProjectile.setEasingFunction(easingFunction);

    return animationProjectile;
  }
  const vertAnim2 = () => {
    const animationProjectile = new BABYLON.Animation(
      "myAnimation2",
      "position.y",
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );

    const nextPos = 0;

    const keys = [];
    keys.push({frame: 76, value: 100});
    keys.push({frame: 150, value: 0});

    animationProjectile.setKeys(keys);

    const easingFunction = new BABYLON.QuadraticEase();
    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN);

    animationProjectile.setEasingFunction(easingFunction);

    return animationProjectile;
  }
  const horizAnim = () => {
    const animationProjectile = new BABYLON.Animation(
      "myAnimation3",
      "position.x",
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );

    const nextPos = projectile.position.x - 240;

    const keys = [];
    keys.push({frame: 0, value: projectile.position.x});
    keys.push({frame: 75, value: nextPos});
    keys.push({frame: 75, value: nextPos + 240});
    keys.push({frame: 150, value: nextPos});

    animationProjectile.setKeys(keys);

    return animationProjectile;
  }

  projectile.animations.push(vertAnim1());
  projectile.animations.push(horizAnim());

  attatchEmitter(projectile);

  scene.beginAnimation(
    projectile,
    0, 75, false, 3,
    () => {
      projectile.animations = [];
      projectile.animations.push(vertAnim2());
      projectile.animations.push(horizAnim());
      scene.beginAnimation(
        projectile,
        76, 150, false, 2,
        () => {
          const p = projectile;
          const s = scene;
          debugger
        }
      )
    }
  );
}

let startingPoint;
let currentMesh;

const snapToGrid = () => {
  const shipSegments = scene.getMeshesByTags(currentMesh.id);
  shipSegments.forEach(segment => {
    segment.position = new BABYLON.Vector3(
      (Math.round((segment.position.x + 10) / 20) * 20) - 10,
      segment.position.y,
      (Math.round((segment.position.z + 10) / 20) * 20) - 10,
    )
  });
}
const getGroundPosition = () => {
  const pickInfo = scene.pick(scene.pointerX, scene.pointerY, (mesh) => {
    return mesh == playerBoard;
  });
  if (pickInfo.hit) {
    return pickInfo.pickedPoint;
  }
  return null;
}
const onMouseDown = (e) => {
  if (e.button !== 0) {
    return;
  }
  const pickInfo = scene.pick(scene.pointerX, scene.pointerY, (mesh) => {
    return mesh !== playerBoard;
  });
  if (pickInfo.hit) {
    currentMesh = pickInfo.pickedMesh;
    startingPoint = getGroundPosition();
    if (startingPoint) {
      setTimeout(() => {
        camera.detachControl(canvas);
      }, 0);
    }
  }
}
const onMouseUp = () => {
  const pickInfo = scene.pick(scene.pointerX, scene.pointerY);
  if (startingPoint) {
    camera.attachControl(canvas, true);
    startingPoint = null;
    snapToGrid();
    return;
  } else if (pickInfo.pickedMesh && (pickInfo.pickedMesh.name === "opponentBoard")) {
    opponentBoard.subMeshes[pickInfo.subMeshId].hit = true;
    fireProjectile(pickInfo.pickedPoint);
  }
}
const onMouseMove = (e) => {
    if (!startingPoint) {
        return;
    }

    const current = getGroundPosition(e);

    if (!current) {
        return;
    }

    const diff = current.subtract(startingPoint);
    const currentMeshes = scene.getMeshesByTags(currentMesh.id);
    if (currentMeshes.length > 0) {
      currentMeshes.forEach( mesh => {
        mesh.position.addInPlace(diff);
      });
    } else {
      currentMesh.position.addInPlace(diff);
    }

    startingPoint = current;

}
const onMouseOver = (e) => {
  e.preventDefault();
  const s = scene;
}
const onKeyPress = (e) => {
  if (e.key === " ") {
    if (currentMesh) {
      const currentMeshes = scene.getMeshesByTags(currentMesh.id);
      const oldPosition = currentMesh.position;
      currentMeshes.forEach( mesh => {
        mesh.position = new BABYLON.Vector3(
          mesh.position.z,
          mesh.position.y,
          mesh.position.x
        );
      });
      const newPosition = currentMesh.position;
      const positionOffset = new BABYLON.Vector3(
        (oldPosition.x - newPosition.x),
        (oldPosition.y - newPosition.y),
        (oldPosition.z - newPosition.z),
      );
      currentMeshes.forEach( mesh => {
        mesh.position.addInPlace(positionOffset);
      });
    }
  }
}

canvas.addEventListener("mousedown", onMouseDown, false);
canvas.addEventListener("mouseup", onMouseUp, false);
canvas.addEventListener("mousemove", onMouseMove, false);
canvas.addEventListener("mouseover", onMouseOver, false);
window.addEventListener("keypress", onKeyPress, false);

scene.onDispose = () => {
  canvas.removeEventListener("mousedown", onMouseDown);
  canvas.removeEventListener("mouseup", onMouseUp);
  canvas.removeEventListener("mousemove", onMouseMove);
  canvas.removeEventListener("mouseover", onMouseOver);
  window.removeEventListener("keypress", onKeyPress);
}

const playerShipNames = [
  "aircraftCarrier1",
  "battleship1",
  "destroyer1",
  "submarine1",
  "patrolBoat1"
];

scene.registerBeforeRender(() => {
  playerBoard.subMeshes.forEach( subMesh => {
    subMesh.materialIndex = subMesh.originalMaterialIndex
  });
  playerShipNames.forEach( shipName => {
    const shipSegments = scene.getMeshesByTags(shipName);
    shipSegments.forEach(segment => {
      let ray = new BABYLON.Ray(
        new BABYLON.Vector3(
          segment.position.x,
          playerBoard.getBoundingInfo().boundingBox.maximumWorld.y + 1,
          segment.position.z),
          new BABYLON.Vector3(0, -1, 0)
        );
        const worldInverse = new BABYLON.Matrix();
        playerBoard.getWorldMatrix().invertToRef(worldInverse);
        ray = BABYLON.Ray.Transform(ray, worldInverse);
        const pickInfo = playerBoard.intersects(ray);
        if (pickInfo.hit) {
          playerBoard.subMeshes[pickInfo.subMeshId].materialIndex = 2;
        }
      })
  });
  opponentBoard.subMeshes.forEach( subMesh => {
    subMesh.materialIndex = subMesh.hit ? 3 : subMesh.originalMaterialIndex
  });
  const pickInfo = scene.pick(scene.pointerX, scene.pointerY);
  if (pickInfo.pickedMesh && (pickInfo.pickedMesh.name === "opponentBoard")){
    const subMesh = opponentBoard.subMeshes[pickInfo.subMeshId];
    if (subMesh.hit) {
      subMesh.materialIndex = 3;
    } else {
      subMesh.materialIndex = 2;
    }
  }
});

engine.runRenderLoop(() => {
  scene.render();
});
