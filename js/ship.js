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
  boxes.forEach( (box, idx) => {
    BABYLON.Tags.AddTagsTo(box, name);
    if (boardName === "playerBoard") {
      box.position.x = 20 * idx;
    } else {
      box.position.x = (20 * idx) - 200;
      box.position.z = 10;
      // box.visibility = false;
      box.isPickable = false;
      box.visibility = false;
    }
  });
  if (boardName === "opponentBoard") {
    rotate(boxes[0], scene);
  }
  return boxes;
}
