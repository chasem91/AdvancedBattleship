const createShips = () => {
  let shipSegments = [];
  let ships = [];

  ships.push(createShip("aircraftCarrier1", "playerBoard", 5, scene));
  ships.push(createShip("battleship1", "playerBoard", 4, scene));
  ships.push(createShip("destroyer1", "playerBoard", 3, scene));
  ships.push(createShip("submarine1", "playerBoard", 3, scene));
  ships.push(createShip("patrolBoat1", "playerBoard", 2, scene));
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
