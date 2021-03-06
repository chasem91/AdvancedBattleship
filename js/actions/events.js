const createEventListeners = () => {
  let startingPoint;
  let currentMesh;
  const lockPlayerBoard = () => {
    preGame = false;
    playingGame = true;
    game.player.grid.forEach( subMesh => {
      subMesh.materialIndex = subMesh.originalMaterialIndex
    });
  }
  const snapToGrid = () => {
    const shipSegments = scene.getMeshesByTags(currentMesh.id);
    shipSegments.forEach(segment => {
      segment.position = new BABYLON.Vector3(
        (Math.round((segment.position.x + 10) / 20) * 20) - 10,
        segment.position.y,
        (Math.round((segment.position.z + 10) / 20) * 20) - 10
      )
    });
  }
  const getGroundPosition = () => {
    const pickInfo = scene.pick(scene.pointerX, scene.pointerY, (mesh) => {
      return mesh == game.player.board;
    });
    if (pickInfo.hit) {
      return pickInfo.pickedPoint;
    }
    return null;
  }
  const onMouseDown = (e) => {
    if (e.button !== 0) {
      return;
    }
    const pickInfo = scene.pick(scene.pointerX, scene.pointerY, (mesh) => {
      return mesh !== game.player.board && mesh !== skybox;
    });
    if (pickInfo.hit) {
      currentMesh = pickInfo.pickedMesh;
      startingPoint = getGroundPosition();
      if (startingPoint) {
        setTimeout(() => {
          camera.detachControl(canvas);
        }, 0);
      }
    }
  }
  const onMouseUp = () => {
    const pickInfo = scene.pick(scene.pointerX, scene.pointerY);
    if (startingPoint) {
      camera.attachControl(canvas, true);
      startingPoint = null;
      snapToGrid();
      return;
    }
  }
  const onMouseMove = (e) => {
    if (!startingPoint) {
      return;
    }

    const current = getGroundPosition(e);

    if (!current || currentMesh.name === "waterMesh") {
      return;
    }

    const diff = current.subtract(startingPoint);
    const currentMeshes = scene.getMeshesByTags(currentMesh.id);
    if (currentMeshes.length > 0) {
      currentMeshes.forEach( mesh => {
        if (preGame) {
          mesh.position.addInPlace(diff);
        }
      });
    } else {
      currentMesh.position.addInPlace(diff);
    }

    startingPoint = current;

  }
  const onKeyPress = (e) => {
    if (e.key === " ") {
      if (currentMesh && preGame) {
        const currentMeshes = scene.getMeshesByTags(currentMesh.id);
        const oldPosition = currentMesh.position;
        currentMeshes.forEach( mesh => {
          mesh.position = new BABYLON.Vector3(
            mesh.position.z,
            mesh.position.y,
            mesh.position.x
          );
        });
        const newPosition = currentMesh.position;
        const positionOffset = new BABYLON.Vector3(
          (oldPosition.x - newPosition.x),
          (oldPosition.y - newPosition.y),
          (oldPosition.z - newPosition.z)
        );
        currentMeshes.forEach( mesh => {
          mesh.position.addInPlace(positionOffset);
        });
      }
    } else if (e.key === "v") {
      if (camera.state === "" || camera.state === "initial") {
        transitionCamera1();
        camera.state = "transitioned"
      } else if (camera.state === "transitioned") {
        transitionCamera2();
        camera.state = "initial"
      }
    } else if (e.key === "Enter") {
      if (preGame) {
        // there shouldn't need to be 34 spaces
        if (game.player.boardObject.grid.filter( space => space.materialIndex === 2).length === 34) {
          lockPlayerBoard();
          game.play();
        }
      }
    }
  }

  canvas.addEventListener("mousedown", onMouseDown, false);
  canvas.addEventListener("mouseup", onMouseUp, false);
  canvas.addEventListener("mousemove", onMouseMove, false);
  window.addEventListener("keypress", onKeyPress, false);

  scene.onDispose = () => {
    canvas.removeEventListener("mousedown", onMouseDown);
    canvas.removeEventListener("mouseup", onMouseUp);
    canvas.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("keypress", onKeyPress);
  }
}
