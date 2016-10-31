//animate rougher seas towards end of game
const createWater = () => {
  const waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 1024, 1800, 32, scene);
  waterMesh.isPickable = false;
  waterMesh.position.y = 0;
  const waterMaterial = new BABYLON.WaterMaterial("water", scene, new BABYLON.Vector2(1024, 1024));
  // waterMaterial.alpha = .8;
  var probe = new BABYLON.ReflectionProbe("main", 512, scene);
  probe.renderList.push(game.opponent.board);
  probe.renderList.push(game.player.board);
  game.player.shipSegments.forEach( segment => probe.renderList.push(segment) )
  waterMaterial.refractionTexture = probe.cubeTexture;
  waterMaterial.indexOfRefraction = 1.05;
  waterMaterial.bumpAffectsReflection = true;
  waterMaterial.bumpTexture = new BABYLON.Texture("textures/waterbump.png", scene);


  waterMaterial.addToRenderList(game.player.board);
  waterMaterial.addToRenderList(game.opponent.board);
  waterMaterial.addToRenderList(skybox);
  game.player.ships.forEach( ship => {
    ship.segments.forEach( segment => waterMaterial.addToRenderList(segment) );
  });
  game.opponent.ships.forEach( ship => {
    ship.segments.forEach( segment => waterMaterial.addToRenderList(segment) );
  });
  waterMaterial.windForce = 5;
  waterMaterial.waveHeight = .3;
  waterMaterial.bumpHeight = 0.05;
  waterMaterial.windDirection = new BABYLON.Vector2(1.0, 1.0);
  waterMaterial.waterColor = new BABYLON.Color3(0.6, 0.6, 0.8);
  // waterMaterial.colorBlendFactor = .1;
  waterMaterial.waveLength = .13;
  waterMaterial.backFaceCulling = false;

  waterMesh.material = waterMaterial;

  return waterMesh;
}
