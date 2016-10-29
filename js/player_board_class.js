class PlayerBoard {
  constructor () {
    this.ships = PlayerBoard.createShips();
    this.board = PlayerBoard.createBoard();
    this.grid = this.board.subMeshes;
  }
}

PlayerBoard.createBoard = () => {
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
  darkGreenMaterial.diffuseColor = new BABYLON.Color3(.79, 1.00, .80);

  const redMaterial = new BABYLON.StandardMaterial("Red", scene);
  redMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
  redMaterial.emissiveColor = new BABYLON.Color3(1, 0, 0);

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
PlayerBoard.createShips = () => {
  let shipSegments = [];
  let ships = [];

  ships.push(createShip("aircraftCarrier1", "playerBoard", 5, scene));
  ships.push(createShip("battleship1", "playerBoard", 4, scene));
  ships.push(createShip("destroyer1", "playerBoard", 3, scene));
  ships.push(createShip("submarine1", "playerBoard", 3, scene));
  ships.push(createShip("patrolBoat1", "playerBoard", 2, scene));
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
