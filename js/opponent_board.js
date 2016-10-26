const createOpponentBoard = (scene) => {
  const tiledGround = new BABYLON.Mesh.CreateTiledGround(
    "opponentBoard",
    -100, -140, 100, 140,
    { "w": 1, "h": 1 },
    { 'h': 14, 'w': 10 },
    scene
  );
  const lightRedMaterial = new BABYLON.StandardMaterial("LightRed", scene);
  lightRedMaterial.diffuseColor = new BABYLON.Color3(.95, 0, 0);
  // lightRedMaterial.alpha = .2;

  const darkRedMaterial = new BABYLON.StandardMaterial("DarkRed", scene);
  darkRedMaterial.diffuseColor = new BABYLON.Color3(.25, 0, 0);
  // darkRedMaterial.alpha = .2;

  const yellowMaterial = new BABYLON.StandardMaterial("Yellow", scene);
  yellowMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0);
  yellowMaterial.emissiveColor = new BABYLON.Color3(1, 1, 0);
  // yellowMaterial.alpha = .2;

  const orangeMaterial = new BABYLON.StandardMaterial("Orange", scene);
  orangeMaterial.diffuseColor = new BABYLON.Color3(1, .8, 0);
  // orangeMaterial.alpha = .2;

  const multimat = new BABYLON.MultiMaterial("multi", scene);
  multimat.subMaterials.push(lightRedMaterial);
  multimat.subMaterials.push(darkRedMaterial);
  multimat.subMaterials.push(yellowMaterial);
  multimat.subMaterials.push(orangeMaterial);

  tiledGround.material = multimat;
  const verticesCount = tiledGround.getTotalVertices();
  const tileIndicesLength = tiledGround.getIndices().length / (14 * 10);

  tiledGround.subMeshes = [];
  let base = 0;
  for (let row = 0; row < 14; row++) {
    for (let col = 0; col < 10; col++) {
      const materialIndex = row%2 ^ col%2;
      const subMesh = new BABYLON.SubMesh(
        materialIndex,
        0,
        verticesCount,
        base,
        tileIndicesLength,
        tiledGround
      );
      subMesh.originalMaterialIndex = materialIndex;
      tiledGround.subMeshes.push(subMesh);
      base += tileIndicesLength;
    }
  }
  return tiledGround;
}
