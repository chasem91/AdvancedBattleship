class Ship {
  constructor (name, boardName, length) {
    this.segments = Ship.createSegments(name, boardName, length)
  }

  rotate() {
    const currentMeshes = scene.getMeshesByTags(mesh.id);
    const oldPosition = mesh.position;
    currentMeshes.forEach( mesh => {
      mesh.position = new BABYLON.Vector3(
        mesh.position.z,
        mesh.position.y,
        mesh.position.x
      );
    });
    const newPosition = mesh.position;
    const positionOffset = new BABYLON.Vector3(
      (oldPosition.x - newPosition.x),
      (oldPosition.y - newPosition.y),
      (oldPosition.z - newPosition.z)
    );
    currentMeshes.forEach( mesh => {
      mesh.position.addInPlace(positionOffset);
    });
  }

  isDestroyed() {
    return this.segments.every( segment => segment.visibility === true );
  }

  sink() {
    let center;
    const length = this.segments.length;
    if (length % 2 === 0) {
      const first = this.segments[(length / 2) - 1].position;
      const second = this.segments[length / 2].position;
      center = BABYLON.Vector3.Center(first, second);
    } else {
      center = this.segments[Math.floor(length / 2)].position;
    }
    const parent = new BABYLON.Mesh.CreateBox("parent", 10, scene);
    parent.position = center;
    this.segments.forEach( segment => {
      scene.stopAnimation(segment);
      // segment.animations = [];
      segment.position = segment.position.subtract(parent.position);
      segment.parent = parent;
    });

    this._sinkAnimation(parent);
  }

  _sinkAnimation(parent) {
    const animationSinkY = new BABYLON.Animation(
      "sinkAnimation",
      "position.y",
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    const animationSinkRotationY = new BABYLON.Animation(
      "sinkAnimation",
      "rotation.y",
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    const animationSinkRotationZ = new BABYLON.Animation(

      "sinkAnimation",
      "rotation.z",
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    let keys = [];
    keys.push({frame: 0, value: parent.position.y});
    keys.push({frame: 3000, value: parent.position.y - 2000});
    animationSinkY.setKeys(keys);
    keys = [];
    keys.push({frame: 0, value: parent.rotation.y});
    keys.push({frame: 3000, value: parent.rotation.y - 20});
    animationSinkRotationY.setKeys(keys);
    keys = [];
    keys.push({frame: 0, value: parent.rotation.z});
    keys.push({frame: 3000, value: parent.rotation.z - 20});
    animationSinkRotationZ.setKeys(keys);


    const easingFunction = new BABYLON.QuadraticEase();
    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN);
    animationSinkY.setEasingFunction(easingFunction);
    animationSinkRotationY.setEasingFunction(easingFunction);
    animationSinkRotationZ.setEasingFunction(easingFunction);

    parent.animations.push(animationSinkY);
    parent.animations.push(animationSinkRotationY);
    parent.animations.push(animationSinkRotationZ);

    const missile_impact = new BABYLON.Sound( "Music", "sounds/missile_impact.wav",
      scene, null, { loop: false, autoplay: true }
    );
    for (var i = 0; i < 5; i++) {
      setTimeout(
        () => {
          missile_impact.play();
        },
        i * 300
      );
    }
    scene.beginAnimation(parent, 0, 3000, false);
  }
}

Ship.createSegments = (name, boardName, length) => {
  let invalidPostion = true;
  let dir = "";
  let row;
  let col;

  while (invalidPostion) {
    invalidPostion = false;

    let rand = Math.random();
    if (rand < .25) {
      dir = "UP";
    } else if (rand < .50) {
      dir = "DOWN";
    } else if (rand < .75) {
      dir = "LEFT";
    } else {
      dir = "RIGHT";
    }

    const coords = Ship.getRandomCoords();
    row = coords[0];
    col = coords[1];

    let i = 0;
    while (i < length) {
      let testPos;
      let sphere;
      switch(dir) {
        case "UP":
        testPos = new BABYLON.Vector3(row - (i * 20), 0, col);
        break;
        case "DOWN":
        testPos = new BABYLON.Vector3(row + (i * 20), 0, col);
        break;
        case "LEFT":
        testPos = new BABYLON.Vector3(row, 0, col - (i * 20));
        break;
        case "RIGHT":
        testPos = new BABYLON.Vector3(row, 0, col + (i * 20));
        break;
      }
      scene.getMeshesByTags("opponentShip").forEach(ship => {
        if (((ship.position.x === testPos.x) && (ship.position.z === testPos.z))) {
          invalidPostion = true;
        }
      });
      if (
        (testPos.x > -160 || testPos.x < -340) ||
        (testPos.z > 130 || testPos.z < -130)
      ) {
        invalidPostion = true;
      }
      i++;
    }
  }

  const boxes = [];
  for (let i = 1; i <= length; i ++) {
    const box = new BABYLON.Mesh.CreateBox( name, 20, scene );

    const lightGrayMaterial = new BABYLON.StandardMaterial("LightGray", scene);
    lightGrayMaterial.diffuseColor = new BABYLON.Color3(.85, .85, .85);

    const blackMaterial = new BABYLON.StandardMaterial("Black", scene);
    blackMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);

    const multimat = new BABYLON.MultiMaterial("multi", scene);
    multimat.subMaterials.push(lightGrayMaterial);
    multimat.subMaterials.push(blackMaterial);

    box.material = multimat;

    boxes.push(box);
  }
  boxes.forEach( (box, idx) => {
    BABYLON.Tags.EnableFor(box);
    BABYLON.Tags.AddTagsTo(box, name);
    if (boardName === "playerBoard") {
      box.position.x = 20 * idx;
    } else {
      BABYLON.Tags.AddTagsTo(box, "opponentShip");
      switch(dir) {
        case "UP":
          box.position.x = (row - (idx * 20));
          box.position.z = col
          break;
        case "DOWN":
          box.position.x = (row + (idx * 20));
          box.position.z = col
          break;
        case "LEFT":
          box.position.x = row
          box.position.z = (col - (idx * 20));
          break;
        case "RIGHT":
          box.position.x = row
          box.position.z = (col + (idx * 20));
          break;
      }
      // box.visibility = false;
      box.isPickable = false;
    }
  });
  return boxes;
}
Ship.getRandomCoords = () => {
  let row;
  let col;
  let signed;
  if (Math.random() < .5) { signed = -1; } else { signed = 1; }
  row = ((Math.floor(Math.random() * 5) * signed) * 20) - 260;

  if (Math.random() < .5) { signed = -1; } else { signed = 1; }
  col = ((Math.floor(Math.random() * 7) * signed) * 20) + 10;

  return [row, col];
}
