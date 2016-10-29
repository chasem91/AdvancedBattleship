class OpponentBoard {
  constructor() {
    this.ships = OpponentBoard.createShips();
    this.board = OpponentBoard.createBoard();
    this.grid = this.board.subMeshes;
  }
}

OpponentBoard.createBoard = () => {
  const tiledGround = new BABYLON.Mesh.CreateTiledGround(
    "opponentBoard",
    -100, -140, 100, 140,
    { "w": 1, "h": 1 },
    { 'h': 14, 'w': 10 },
    scene
  );
  tiledGround.position.x = -250;

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
OpponentBoard.createShips = () => {
  let shipSegments = [];
  let ships = [];

  ships.push(createShip("aircraftCarrier2", "opponentBoard", 5, scene));
  ships.push(createShip("battleship2", "opponentBoard", 4, scene));
  ships.push(createShip("destroyer2", "opponentBoard", 3, scene));
  ships.push(createShip("submarine2", "opponentBoard", 3, scene));
  ships.push(createShip("patrolBoat2", "opponentBoard", 2, scene));
  ships.forEach( ship => shipSegments = shipSegments.concat(ship) );

  const shipAnimation = () => {
    const animationSegment = new BABYLON.Animation(
      "myAnimation2",
      "position.y",
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
    const keys = [];
    keys.push({frame: 0, value: 5});
    keys.push({frame: 100, value: -3});
    keys.push({frame: 200, value: 5});
    animationSegment.setKeys(keys);
    const easingFunction = new BABYLON.QuadraticEase();
    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    animationSegment.setEasingFunction(easingFunction);
    return animationSegment;
  }
  ships.forEach( (ship, i) => {
    ship.forEach( segment => {
      // if (segment.hasTags("opponentShip")) {segment.isPickable = false;}
      segment.animations.push(shipAnimation());
      setTimeout(() => scene.beginAnimation(segment, 0, 200, true), (500 * i));
    });
  })
  return shipSegments;
}
