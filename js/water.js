//animate rougher seas towards end of game
const createWater = () => {
  const waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 1024, 1800, 32, scene);
  waterMesh.isPickable = false;
  waterMesh.position.y = 0;
  const waterMaterial = new BABYLON.WaterMaterial("water", scene);
  waterMaterial.alpha = .8;
  var probe = new BABYLON.ReflectionProbe("main", 512, scene);
  probe.renderList.push(opponentBoard);
  probe.renderList.push(playerBoard);
  waterMaterial.refractionTexture = probe.cubeTexture;
  waterMaterial.indexOfRefraction = 1.05;
  waterMaterial.bumpTexture = new BABYLON.Texture("waterbump.png", scene);

  waterMesh.material = waterMaterial;

  waterMaterial.addToRenderList(playerBoard);
  waterMaterial.addToRenderList(opponentBoard);
  waterMaterial.addToRenderList(skybox);
  shipSegments.forEach( segment => waterMaterial.addToRenderList(segment) );
  waterMaterial.windForce = 5;
  waterMaterial.waveHeight = .6;
  waterMaterial.bumpHeight = 0.13;
  waterMaterial.windDirection = new BABYLON.Vector2(1.0, 1.0);
  // waterMaterial.waterColor = new BABYLON.Color3(0.1, 0.1, 0.6);
  // waterMaterial.colorBlendFactor = 2.2;
  waterMaterial.waveLength = 0.1;
  // waterMaterial.backFaceCulling = true
}
