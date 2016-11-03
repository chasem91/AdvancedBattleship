class Opponent {
  constructor() {
    this.shipSegments = [];
    this.ships = Opponent.createShips();
    this.ships.forEach( ship => this.shipSegments = this.shipSegments.concat(ship.segments) );
    this.boardObject = new Board(false);
    this.board = this.boardObject.boardMesh;
    this.grid = this.boardObject.grid
  }

  playTurn() {
    setTimeout(() => {
      this.fire();
    }, 1000);
  }

  fire() {
    let row;
    let col;
    let beenHit = true;
    let pointXY;
    const projectile = new BABYLON.Mesh.CreateSphere("projectile", 16, 4, scene);
    while (beenHit) {
      const nextSpace = this._nextFirePos();

      if (nextSpace) {
        row = nextSpace.x;
        col = nextSpace.z;
      } else {
        let signed;
        if (Math.random() < .5) { signed = -1; } else { signed = 1; }
        row = ((Math.floor(Math.random() * 6) * signed) * 20) + 10;
        if (row === 110) {
          row -= 20;
        }

        if (Math.random() < .5) { signed = -1; } else { signed = 1; }
        col = ((Math.floor(Math.random() * 7) * signed) * 20) + 10;
      }

      projectile.position = new BABYLON.Vector3(
        (Math.round(row / 20) * 20) - 490,
        projectile.position.y,
        (Math.round((col + 10) / 20) * 20) - 10
      );

      pointXY = { x: projectile.position.x - 480, z: projectile.position.z };
      beenHit = game.player.boardObject.hasBeenHit(pointXY);
    }
    // game.player.boardObject.hitSpaces.push(pointXY);

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

      const nextPos1 = projectile.position.x + 240;

      const keys = [];
      keys.push({frame: 0, value: projectile.position.x});
      keys.push({frame: 75, value: nextPos1});
      keys.push({frame: 75, value: nextPos1 - 240});
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
            game.player.shipSegments.forEach( shipSegment => {
              if (shipSegment.position.x === projectile.position.x && shipSegment.position.z === projectile.position.z) {
                shipSegment.visibility = true;
                shipSegment.material.subMaterials.shift();
                hit = true;
                game.player.boardObject.shipHitSpaces.push({x: projectile.position.x, z: projectile.position.z});
                game.player.checkShips();
              }
            });
            game.player.boardObject.hitSpaces.push({x: projectile.position.x, z: projectile.position.z});
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
  }

  checkShips() {
    this.ships = this.ships.filter( ship => {
      if (ship.isDestroyed()) {
        ship.sink();
        return false;
      } else {
        return true;
      }
    });
  }

  _nextFirePos() {
    let validSurrounding = [];
    let inValid = true;
    while (validSurrounding.length === 0) {
      const hitSpaces = game.player.boardObject.shipHitSpaces;
      if (hitSpaces.length === 0) { return null; }
      const randomIndex = Math.floor(hitSpaces.length * Math.random());
      const randomSpace = hitSpaces[randomIndex];
      const surrounding = [
        {x: randomSpace.x, z: randomSpace.z + 20},
        {x: randomSpace.x, z: randomSpace.z - 20},
        {x: randomSpace.x + 20, z: randomSpace.z},
        {x: randomSpace.x - 20, z: randomSpace.z}
      ];
      validSurrounding = surrounding.filter( space => !game.player.boardObject.hasBeenHit(space) );
    }
    return validSurrounding[Math.floor(Math.random() * validSurrounding.length)];
  }
}

Opponent.createShips = () => {
  let ships = [];

  ships.push(new Ship("aircraftCarrier2", "opponentBoard", 5));
  ships.push(new Ship("battleship2", "opponentBoard", 4));
  ships.push(new Ship("destroyer2", "opponentBoard", 3));
  ships.push(new Ship("submarine2", "opponentBoard", 3));
  ships.push(new Ship("patrolBoat2", "opponentBoard", 2));

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
