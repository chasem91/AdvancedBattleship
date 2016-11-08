class Board {
  constructor(player) {
    this.boardMesh = Board.createGrid(player);
    this.grid = this.boardMesh.subMeshes;
    this.hitSpaces = [];
    this.shipHitSpaces = [];
    this.sunkSpaces = [];
  }

  markSpace(pos) {
    const row = pos[0];
    const col = pos[1];
    const index = (((((row + 110) / 20) - 1)) + ((((col + 150) / 20) - 1)  * 10)) * 2;
    this.grid[index].materialIndex = 3;
  }

  hasBeenHit(pos) {
    return this.hitSpaces.some( space => space.x === pos.x && space.z === pos.z );
  }

  inBounds(pos) {
    return pos.x <= 90 && pos.x >= -90 && pos.z <= 130 && pos.z >= -130;
  }

  validPos(pos) {
    return ((!this.hasBeenHit(pos)) && this.inBounds(pos));
  }
}

Board.createGrid = (player) => {
  const boardName = player ? "playerBoard" : "opponentBoard";

  const tiledGround = new BABYLON.Mesh.CreateTiledGround(
    boardName,
    -100, -140, 100, 140,
    { "w": 1, "h": 1 },
    { 'h': 14, 'w': 10 },
    scene
  );

  tiledGround.position.x = player ? 0 : -250;


  const multimat = new BABYLON.MultiMaterial("multi", scene);

  if (player) {
    const lightGreenMaterial = new BABYLON.StandardMaterial("LightGreen", scene);
    lightGreenMaterial.diffuseColor = new BABYLON.Color3(.41, .61, .45);
    lightGreenMaterial.alpha = .6;

    const darkGreenMaterial = new BABYLON.StandardMaterial("DarkGreen", scene);
    darkGreenMaterial.diffuseColor = new BABYLON.Color3(.79, 1.00, .80);
    darkGreenMaterial.alpha = .6;

    const redMaterial = new BABYLON.StandardMaterial("Red", scene);
    redMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
    redMaterial.alpha = .6;
    redMaterial.emissiveColor = new BABYLON.Color3(1, 0, 0);

    const alphaMaterial = new BABYLON.StandardMaterial("Alpha", scene);
    alphaMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
    alphaMaterial.alpha = 0;
    alphaMaterial.emissiveColor = new BABYLON.Color3(1, 0, 0);

    multimat.subMaterials.push(lightGreenMaterial);
    multimat.subMaterials.push(darkGreenMaterial);
    multimat.subMaterials.push(redMaterial);
    multimat.subMaterials.push(alphaMaterial);
  } else {
    const lightRedMaterial = new BABYLON.StandardMaterial("LightRed", scene);
    lightRedMaterial.diffuseColor = new BABYLON.Color3(.95, 0, 0);
    lightRedMaterial.alpha = .6;

    const darkRedMaterial = new BABYLON.StandardMaterial("DarkRed", scene);
    darkRedMaterial.diffuseColor = new BABYLON.Color3(.25, 0, 0);
    darkRedMaterial.alpha = .6;

    const yellowMaterial = new BABYLON.StandardMaterial("Yellow", scene);
    yellowMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0);
    yellowMaterial.emissiveColor = new BABYLON.Color3(1, 1, 0);
    yellowMaterial.alpha = .6;

    const orangeMaterial = new BABYLON.StandardMaterial("Orange", scene);
    orangeMaterial.diffuseColor = new BABYLON.Color3(1, .8, 0);
    orangeMaterial.alpha = 0;

    multimat.subMaterials.push(lightRedMaterial);
    multimat.subMaterials.push(darkRedMaterial);
    multimat.subMaterials.push(yellowMaterial);
    multimat.subMaterials.push(orangeMaterial);
  }

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
