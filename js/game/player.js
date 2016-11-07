class Player {
  constructor () {
    this.shipSegments = [];
    this.ships = Player.createShips();
    this.ships.forEach( ship => this.shipSegments = this.shipSegments.concat(ship.segments) );
    this.boardObject = new Board(true);
    this.board = this.boardObject.boardMesh;
    this.grid = this.boardObject.grid;
    this.fireEventHandler = Player.createFireEventHandler();
  }

  playTurn() {
    canvas.addEventListener("mouseup", this.fireEventHandler, false);
  }

  fire(point) {
    const projectile = new BABYLON.Mesh.CreateSphere("projectile", 16, 4, scene);
    projectile._checkCollisions = true;
    projectile.position = new BABYLON.Vector3(
      (Math.round(point.x / 20) * 20) + 480,
      projectile.position.y,
      (Math.round((point.z + 10) / 20) * 20) - 10
    );

    const pointXY = { x: projectile.position.x - 480, z: projectile.position.z };
    if (game.opponent.boardObject.hasBeenHit(pointXY)) {
      return;
    } else {
      game.opponent.boardObject.hitSpaces.push(pointXY);
    }

    const vertAnim1 = () => {
      const animationProjectile = new BABYLON.Animation(
        "myAnimation1",
        "position.y",
        30,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
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
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
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
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );

      const nextPos1 = projectile.position.x - 240;

      const keys = [];
      keys.push({frame: 0, value: projectile.position.x});
      keys.push({frame: 75, value: nextPos1});
      keys.push({frame: 75, value: nextPos1 + 240});
      keys.push({frame: 150, value: nextPos1});

      animationProjectile.setKeys(keys);

      return animationProjectile;
    }

    projectile.animations.push(horizAnim());
    projectile.animations.push(vertAnim1());

    const particleSystem = attatchEmitter(projectile);

    const fireLight = new BABYLON.PointLight("Omni1", new BABYLON.Vector3(
      projectile.position.x,
      projectile.position.y + 2,
      projectile.position.z
    ), scene);
    fireLight.diffuse = new BABYLON.Color3(1, 0, 0);
    fireLight.specular = new BABYLON.Color3(1, 1, 1);
    fireLight.parent = projectile;
    fireLight.intensity = 1.5;

    new BABYLON.Sound("Music", "sounds/missile_launch.wav", scene, null, { loop: false, autoplay: true });
    scene.beginAnimation(
      projectile,
      0, 75, false, 2,
      () => {
        projectile.animations = [];
        projectile.animations.push(vertAnim2());
        projectile.animations.push(horizAnim());
        scene.beginAnimation(
          projectile,
          76, 150, false, 2,
          () => {
            let hit = false;
            fireLight.dispose();
            game.opponent.shipSegments.forEach( shipSegment => {
              if (shipSegment.position.x === projectile.position.x && shipSegment.position.z === projectile.position.z) {
                shipSegment.visibility = true;
                shipSegment.material.subMaterials.shift();
                hit = true;
                game.opponent.boardObject.shipHitSpaces.push({x: projectile.position.x, z: projectile.position.z});
                game.opponent.checkShips();
              }
            });
            if (hit) {
              new BABYLON.Sound("Music", "sounds/missile_impact.wav", scene, null, { loop: false, autoplay: true });
            } else {
              particleSystem.emitRate = 0;
              new BABYLON.Sound("Music", "sounds/splash.mp3", scene, null, { loop: false, autoplay: true });
            }
            game.play();
          }
        )
      }
    );
    canvas.removeEventListener("mouseup", this.fireEventHandler);
  }

  checkShips() {
    this.ships = this.ships.filter( ship => {
      if (ship.isDestroyed()) {
        ship.segments.forEach( segment => {
          this.boardObject.shipHitSpaces = this.boardObject.shipHitSpaces.filter( space => {
            return !(space.x === segment.position.x && space.z === segment.position.z);
          });
        });
        ship.sink();
        return false;
      } else {
        return true;
      }
    });
  }
}

Player.createShips = () => {
  let ships = [];

  ships.push(new Ship("aircraftCarrier1", "playerBoard", 5));
  ships.push(new Ship("battleship1", "playerBoard", 4));
  ships.push(new Ship("destroyer1", "playerBoard", 3));
  ships.push(new Ship("submarine1", "playerBoard", 3));
  ships.push(new Ship("patrolBoat1", "playerBoard", 2));
  // ships.push(new Ship("aircraftCarrier3", "playerBoard", 5));
  // ships.push(new Ship("battleship3", "playerBoard", 4));
  // ships.push(new Ship("destroyer3", "playerBoard", 3));
  // ships.push(new Ship("submarine3", "playerBoard", 3));
  // ships.push(new Ship("patrolBoat3", "playerBoard", 2));

  const shipAnimation = () => {
    const animationSegment = new BABYLON.Animation(
      "myAnimation2",
      "position.y",
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
    const keys = [];
    keys.push({frame: 0, value: 5});
    keys.push({frame: 100, value: -3});
    keys.push({frame: 200, value: 5});
    animationSegment.setKeys(keys);
    const easingFunction = new BABYLON.QuadraticEase();
    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    animationSegment.setEasingFunction(easingFunction);
    return animationSegment;
  }
  ships.forEach( (ship, i) => {
    ship.segments.forEach( segment => {
      segment.animations.push(shipAnimation());
      setTimeout(() => scene.beginAnimation(segment, 0, 200, true), (500 * i));
    });
  })
  return ships;
}
Player.createFireEventHandler = () => {
  return () => {
    const pickInfo = scene.pick(scene.pointerX, scene.pointerY);
    if ( pickInfo.pickedMesh && (pickInfo.pickedMesh.name === "opponentBoard") ) {
      game.opponent.grid[pickInfo.subMeshId].hit = true;
      game.player.fire(pickInfo.pickedPoint);
    }
  };
}
