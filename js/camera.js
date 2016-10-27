const createCamera = () => {
  const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(230, 240, 0), scene);
  camera.lockedTarget = new BABYLON.Vector3(-30, 0, 0);
  camera.attachControl(canvas, true);
  return camera;
}
