const createAnimations = () => {
  const transitionCamera1 = () => {
    const xAnim = () => {
      const animationCameraX = new BABYLON.Animation(
        "myAnimation1",
        "position.x",
        30,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );

      const keys = [];
      keys.push({frame: 0, value: 230});
      keys.push({frame: 75, value: -250});

      animationCameraX.setKeys(keys);

      const easingFunction = new BABYLON.QuadraticEase();
      easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);

      animationCameraX.setEasingFunction(easingFunction);

      return animationCameraX
    }
    const yAnim = () => {
      const animationCameraY = new BABYLON.Animation(
        "myAnimation1",
        "position.y",
        30,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );

      const keys = [];
      keys.push({frame: 0, value: 240});
      keys.push({frame: 75, value: 200});

      animationCameraY.setKeys(keys);

      const easingFunction = new BABYLON.QuadraticEase();
      easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);

      animationCameraY.setEasingFunction(easingFunction);

      return animationCameraY;
    }
    const zAnim = () => {
      const animationCameraX = new BABYLON.Animation(
        "myAnimation1",
        "position.z",
        30,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );

      const keys = [];
      keys.push({frame: 0, value: camera.position.z});
      keys.push({frame: 75, value: -200});

      animationCameraX.setKeys(keys);

      const easingFunction = new BABYLON.QuadraticEase();
      easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);

      animationCameraX.setEasingFunction(easingFunction);

      return animationCameraX
    }

    camera.animations.push(xAnim());
    camera.animations.push(yAnim());
    camera.animations.push(zAnim());

    scene.beginAnimation(camera, 0, 75, false);
  }
  const transitionCamera2 = () => {
    const xAnim = () => {
      const animationCameraX = new BABYLON.Animation(
        "myAnimation1",
        "position.x",
        30,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );

      const keys = [];
      keys.push({frame: 0, value: -250});
      keys.push({frame: 75, value: 230});

      animationCameraX.setKeys(keys);

      const easingFunction = new BABYLON.QuadraticEase();
      easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);

      animationCameraX.setEasingFunction(easingFunction);

      return animationCameraX
    }
    const yAnim = () => {
      const animationCameraY = new BABYLON.Animation(
        "myAnimation1",
        "position.y",
        30,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );

      const keys = [];
      keys.push({frame: 0, value: 200});
      keys.push({frame: 75, value: 240});

      animationCameraY.setKeys(keys);

      const easingFunction = new BABYLON.QuadraticEase();
      easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);

      animationCameraY.setEasingFunction(easingFunction);

      return animationCameraY;
    }
    const zAnim = () => {
      const animationCameraX = new BABYLON.Animation(
        "myAnimation1",
        "position.z",
        30,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );

      const keys = [];
      keys.push({frame: 0, value: -200});
      keys.push({frame: 75, value: 0});

      animationCameraX.setKeys(keys);

      const easingFunction = new BABYLON.QuadraticEase();
      easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);

      animationCameraX.setEasingFunction(easingFunction);

      return animationCameraX
    }

    camera.animations.push(xAnim());
    camera.animations.push(yAnim());
    camera.animations.push(zAnim());

    scene.beginAnimation(camera, 0, 75, false);
  }
}
