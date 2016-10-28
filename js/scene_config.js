const configureScene = () => {
  scene.collisionsEnabled = true;

  const playerShipNames = [
    "aircraftCarrier1",
    "battleship1",
    "destroyer1",
    "submarine1",
    "patrolBoat1"
  ];

  // scene.debugLayer.show();
  //
  // scene.debugLayer.axisRatio = 0.04; // 4% of canvas width
  //
  // scene.debugLayer.shouldDisplayLabel = function(node) {
  //   return node.name === "playerBoard";
  // }
  //
  // scene.debugLayer.shouldDisplayAxis = function(mesh) {
  //   return mesh.name === "playerBoard";
  // }

  scene.registerBeforeRender(() => {
    playerBoard.subMeshes.forEach( subMesh => {
      subMesh.materialIndex = subMesh.originalMaterialIndex
    });
    opponentBoard.subMeshes.forEach( subMesh => {
      subMesh.materialIndex = subMesh.hit ? 3 : subMesh.originalMaterialIndex
    });
    const pickInfo = scene.pick(scene.pointerX, scene.pointerY);
    if (pickInfo.pickedMesh && (pickInfo.pickedMesh.name === "opponentBoard" && playingGame && playerTurn)){
      const subMesh = opponentBoard.subMeshes[pickInfo.subMeshId];
      if (subMesh.hit) {
        subMesh.materialIndex = 3;
      } else {
        subMesh.materialIndex = 2;
      }
    }
    playerShipNames.forEach( shipName => {
        const shipSegments = scene.getMeshesByTags(shipName);
        if (preGame) {
          shipSegments.forEach(segment => {
            let ray = new BABYLON.Ray(
              new BABYLON.Vector3(
                segment.position.x,
                playerBoard.getBoundingInfo().boundingBox.maximumWorld.y + 1,
                segment.position.z
              ),
              new BABYLON.Vector3(0, -1, 0)
            );
            const worldInverse = new BABYLON.Matrix();
            playerBoard.getWorldMatrix().invertToRef(worldInverse);
            ray = BABYLON.Ray.Transform(ray, worldInverse);
            const pickInfo = playerBoard.intersects(ray);
            if (pickInfo.hit) {
              playerBoard.subMeshes[pickInfo.subMeshId].materialIndex = 2;
            }
          });
        }
      });
    });
  return scene;
}
