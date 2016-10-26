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

const createShip = (name, boardName, length, scene) => {
  // const ship = new BABYLON.Mesh.CreateBox("ship1", 20, scene);
  // ship.isVisible = false;
  const boxes = [];
  for (let i = 1; i <= length; i ++) {
    boxes.push(new BABYLON.Mesh.CreateBox( name, 20, scene ));
  }
  let notValidPosition = true;
  let row;
  let col;
  let dir = "up";
  while (notValidPosition) {
    let signed;
    if (Math.random() < .5) { signed = -1; } else { signed = 1; }
    row = ((Math.floor(Math.random() * 8) * signed) * 20) + 10;
    if (row === 150) { row -= 20; }
    if (Math.random() < .5) { signed = -1; } else { signed = 1; }
    col = ((Math.floor(Math.random() * 4) * signed) * 20) - 300;
    if (col === -360) { col += 20; }
    // let rand = Math.random();
    // if (rand < .25) { dir = "up" } else if (rand < .50) { dir = "down" }
    //   else if (rand < .75) { dir = "left" } else { dir = "right"}
    let i = 0;
    while (i < length) {
      if (dir === "up") {
        let vec = new BABYLON.Vector3(row, 1, (col + (i * 20)))
        let ray = new BABYLON.Ray(vec, vec);
        let pickInfo = scene.pickWithRay(ray, null);
        if (pickInfo.hit === false && i === length) { notValidPosition = false }
      }
      i++;
    }


    notValidPosition = false;
  }


  boxes.forEach( (box, idx) => {
    BABYLON.Tags.AddTagsTo(box, name);
    if (boardName === "playerBoard") {
      box.position.x = 20 * idx;
    } else {
      BABYLON.Tags.AddTagsTo(box, "opponentShip");
      if (dir === "up") {
        box.position.x = col;
        box.position.z = (row + (idx * 20));
        box.visibility = false;
      }
    }
  });
  if (boardName === "opponentBoard") {
    rotate(boxes[0], scene);
  }
  return boxes;
}
