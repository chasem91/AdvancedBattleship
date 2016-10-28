const createCamera = () => {
  const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(230, 240, 0), scene);
  const cameraTarget = new BABYLON.Mesh.CreateBox("target", 0, scene );
  cameraTarget.isPickable = false;
  cameraTarget.visibility = false;
  cameraTarget.position = new BABYLON.Vector3(-30, 0, 0);
  camera.lockedTarget = cameraTarget;
  camera.attachControl(canvas, true);
  return [camera, cameraTarget];
}
