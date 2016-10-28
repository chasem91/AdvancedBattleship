let transitionCamera1;
let transitionCamera2;
const createAnimations = () => {
  transitionCamera1 = () => {
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
      keys.push({frame: 75, value: -180});

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
      keys.push({frame: 75, value: 300});

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
      keys.push({frame: 0, value: 0});
      keys.push({frame: 75, value: 0});

      animationCameraX.setKeys(keys);

      const easingFunction = new BABYLON.QuadraticEase();
      easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);

      animationCameraX.setEasingFunction(easingFunction);

      return animationCameraX
    }
    const targetAnim = () => {
      const camTargetAnimationX = new BABYLON.Animation(
        "myAnimation1",
        "position.x",
        30,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );

      const keys = [];
      keys.push({frame: 0, value: -30});
      keys.push({frame: 75, value: -250});

      camTargetAnimationX.setKeys(keys);

      const easingFunction = new BABYLON.QuadraticEase();
      easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);

      camTargetAnimationX.setEasingFunction(easingFunction);

      return camTargetAnimationX
    }

    camera.animations.push(xAnim());
    camera.animations.push(yAnim());
    camera.animations.push(zAnim());
    cameraTarget.animations.push(targetAnim());

    scene.beginAnimation(camera, 0, 75, false);
    scene.beginAnimation(cameraTarget, 0, 75, false);
  }
  transitionCamera2 = () => {
    const xAnim = () => {
      const animationCameraX = new BABYLON.Animation(
        "myAnimation1",
        "position.x",
        30,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );

      const keys = [];
      keys.push({frame: 0, value: -180});
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
      keys.push({frame: 0, value: 300});
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
      keys.push({frame: 0, value: 0});
      keys.push({frame: 75, value: 0});

      animationCameraX.setKeys(keys);

      const easingFunction = new BABYLON.QuadraticEase();
      easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);

      animationCameraX.setEasingFunction(easingFunction);

      return animationCameraX
    }
    const targetAnim = () => {
      const camTargetAnimationX = new BABYLON.Animation(
        "myAnimation1",
        "position.x",
        30,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );

      const keys = [];
      keys.push({frame: 0, value: -250});
      keys.push({frame: 75, value: -30});

      camTargetAnimationX.setKeys(keys);

      const easingFunction = new BABYLON.QuadraticEase();
      easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);

      camTargetAnimationX.setEasingFunction(easingFunction);

      return camTargetAnimationX
    }

    camera.animations.push(xAnim());
    camera.animations.push(yAnim());
    camera.animations.push(zAnim());
    cameraTarget.animations.push(targetAnim());

    scene.beginAnimation(camera, 0, 75, false);
    scene.beginAnimation(cameraTarget, 0, 75, false);
  }
}
