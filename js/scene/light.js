const createLight = () => {
  const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 1), scene);
  light.intensity = 0.7;
}
