const configureScene = () => {
  scene.collisionsEnabled = true;

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
    game.player.grid.forEach( subMesh => {
      subMesh.materialIndex = subMesh.originalMaterialIndex
    });
    game.opponent.grid.forEach( subMesh => {
      subMesh.materialIndex = subMesh.hit ? 3 : subMesh.originalMaterialIndex
    });
    const pickInfo = scene.pick(scene.pointerX, scene.pointerY);
    if (pickInfo.pickedMesh && (pickInfo.pickedMesh.name === "opponentBoard" && playingGame && game.currentPlayer() === game.player)){
      const subMesh = game.opponent.grid[pickInfo.subMeshId];
      if (subMesh.hit) {
        subMesh.materialIndex = 3;
      } else {
        subMesh.materialIndex = 2;
      }
    }
    if (preGame) {
      game.player.shipSegments.forEach(segment => {
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
        game.player.board.getWorldMatrix().invertToRef(worldInverse);
        ray = BABYLON.Ray.Transform(ray, worldInverse);
        const pickInfo = game.player.board.intersects(ray);
        if (pickInfo.hit) {
          game.player.grid[pickInfo.subMeshId].materialIndex = 2;
        }
      });
    }
  });
  return scene;
}
