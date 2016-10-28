const fireProjectile = (point) => {
  const projectile = new BABYLON.Mesh.CreateSphere("projectile", 16, 4, scene);
  projectile._checkCollisions = true;
  if (opponentTurn) { playerTurn = false; }
  const currentPlayer = playerTurn;
  playerTurn = false;
  if (currentPlayer) {
    projectile.position = new BABYLON.Vector3(
      (Math.round(point.x / 20) * 20) + 480,
      projectile.position.y,
      (Math.round((point.z + 10) / 20) * 20) - 10
    );
  } else if (opponentTurn) {
    let row;
    let col;
    let signed;
    if (Math.random() < .5) { signed = -1; } else { signed = 1; }
    row = ((Math.floor(Math.random() * 6) * signed) * 20) + 10;
    if (row === 110) {
      row -= 20;
    }

    if (Math.random() < .5) { signed = -1; } else { signed = 1; }
    col = ((Math.floor(Math.random() * 7) * signed) * 20) + 10;

    projectile.position = new BABYLON.Vector3(
      (Math.round(row / 20) * 20) - 490,
      projectile.position.y,
      (Math.round((col + 10) / 20) * 20) - 10
    );
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

    if (currentPlayer) {
      const nextPos1 = projectile.position.x - 240;

      const keys = [];
      keys.push({frame: 0, value: projectile.position.x});
      keys.push({frame: 75, value: nextPos1});
      keys.push({frame: 75, value: nextPos1 + 240});
      keys.push({frame: 150, value: nextPos1});

      animationProjectile.setKeys(keys);
    } else if (opponentTurn) {
      const nextPos1 = projectile.position.x + 240;

      const keys = [];
      keys.push({frame: 0, value: projectile.position.x});
      keys.push({frame: 75, value: nextPos1});
      keys.push({frame: 75, value: nextPos1 - 240});
      keys.push({frame: 150, value: nextPos1});

      animationProjectile.setKeys(keys);
    }

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
          const opponentShipNames = [ "aircraftCarrier2", "battleship2", "destroyer2", "submarine2", "patrolBoat2" ];
          let hit = false;
          opponentShipNames.forEach( name => {
            scene.getMeshesByTags(name).forEach( shipSegment => {
              fireLight.dispose();
              if (shipSegment.intersectsMesh(projectile)) {
                shipSegment.visibility = 1;
                hit = true;
              }
            })
          })
          if (!hit) {particleSystem.emitRate = 0;}
          takeTurn();
        }
      )
    }
  );
}
