const canvas = document.getElementById("render-canvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

let preGame =  true;
let playingGame = false;
let playerTurn = false;
let opponentTurn = false;

configureScene();
createLight();
const createCameraOutput = createCamera();
const camera = createCameraOutput[0];
const cameraTarget = createCameraOutput[1];
const skybox = createSkybox();
const playerBoard = new PlayerBoard();
const opponentBoard = new OpponentBoard();
createWater();
createAnimations();
createEventListeners();

engine.runRenderLoop(() => {
    scene.render();
  });
