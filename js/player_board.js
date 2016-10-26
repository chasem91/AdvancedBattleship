export default (scene) => {
  const tiledGround = new BABYLON.Mesh.CreateTiledGround(
    "playerBoard",
    -100, -140, 100, 140,
    { "w": 1, "h": 1 },
    { 'h': 14, 'w': 10 },
    scene
  );
  const lightGreenMaterial = new BABYLON.StandardMaterial("LightGreen", scene);
  lightGreenMaterial.diffuseColor = new BABYLON.Color3(.41, .61, .45);

  const darkGreenMaterial = new BABYLON.StandardMaterial("DarkGreen", scene);
  darkGreenMaterial.diffuseColor = new BABYLON.Color3(.59, .80, .60);

  const redMaterial = new BABYLON.StandardMaterial("Red", scene);
  redMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);

  const multimat = new BABYLON.MultiMaterial("multi", scene);
  multimat.subMaterials.push(lightGreenMaterial);
  multimat.subMaterials.push(darkGreenMaterial);
  multimat.subMaterials.push(redMaterial);

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
