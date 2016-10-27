const rotate = (mesh, scene) => {
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
};

const getRandomCoords = () => {
  let row;
  let col;
  let signed;
  if (Math.random() < .5) { signed = -1; } else { signed = 1; }
  row = ((Math.floor(Math.random() * 5) * signed) * 20) - 260;

  if (Math.random() < .5) { signed = -1; } else { signed = 1; }
  col = ((Math.floor(Math.random() * 7) * signed) * 20) + 10;

  return [row, col];
}

const createShip = (name, boardName, length, scene) => {
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
    dir = "LEFT";

    const coords = getRandomCoords();
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
        (testPos.x > -140 || testPos.x < -340) ||
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
      box.visibility = false;
      box.isPickable = false;
    }
  });
  return boxes;
}
