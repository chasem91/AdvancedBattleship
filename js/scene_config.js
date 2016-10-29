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
    playerBoard.grid.forEach( subMesh => {
      subMesh.materialIndex = subMesh.originalMaterialIndex
    });
    opponentBoard.grid.forEach( subMesh => {
      subMesh.materialIndex = subMesh.hit ? 3 : subMesh.originalMaterialIndex
    });
    const pickInfo = scene.pick(scene.pointerX, scene.pointerY);
    if (pickInfo.pickedMesh && (pickInfo.pickedMesh.name === "opponentBoard" && playingGame && playerTurn)){
      const subMesh = opponentBoard.grid[pickInfo.subMeshId];
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
            // y param might need to be 1
            let ray = new BABYLON.Ray(
              new BABYLON.Vector3(
                segment.position.x,
                0,
                segment.position.z
              ),
              new BABYLON.Vector3(0, -1, 0)
            );
            const worldInverse = new BABYLON.Matrix();
            playerBoard.board.getWorldMatrix().invertToRef(worldInverse);
            ray = BABYLON.Ray.Transform(ray, worldInverse);
            const pickInfo = playerBoard.board.intersects(ray);
            if (pickInfo.hit) {
              playerBoard.grid[pickInfo.subMeshId].materialIndex = 2;
            }
          });
        }
      });
    });
  return scene;
}
