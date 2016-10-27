const canvas = document.getElementById("render-canvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

configureScene();
createLight();
const camera = createCamera();
const skybox = createSkybox();
const playerBoard = createPlayerBoard(scene);
const opponentBoard = createOpponentBoard(scene);
const shipSegments = createShips();
createWater();
createAnimations();
createEventListeners();

engine.runRenderLoop(() => {
  scene.render();
});
