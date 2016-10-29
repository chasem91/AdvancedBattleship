const attatchEmitter = (mesh) => {
  // Create a particle system
  const particleSystem = new BABYLON.ParticleSystem("particles", 800, scene);

  particleSystem.renderingGroupId = 1;

  //Texture of each particle
  particleSystem.particleTexture = new BABYLON.Texture("explosion.png", scene);

  // Where the particles come from
  particleSystem.emitter = mesh; // the starting object, the emitter
  particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0); // Starting all from
  particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0); // To...

  particleSystem.minSize = 1.0;
  particleSystem.maxSize = 3.0;

  particleSystem.minLifeTime = 0.3;
  particleSystem.maxLifeTime = 1.5;

  particleSystem.emitRate = 1500;

  // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
  particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

  particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

  particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 3);
  particleSystem.direction2 = new BABYLON.Vector3(7, 8, -3);

  particleSystem.minAngularSpeed = Math.PI;
  particleSystem.maxAngularSpeed = 2 * Math.PI;

  // Speed
  particleSystem.minEmitPower = 1;
  particleSystem.maxEmitPower = 4;
  particleSystem.updateSpeed = 0.005;

	const updateFunction = function(particles) {
		for (let index = 0; index < particles.length; index++) {
			const particle = particles[index];
			particle.age += this._scaledUpdateSpeed;

			if (particle.age >= particle.lifeTime) {
				particles.splice(index, 1);
				this._stockParticles.push(particle);
				index--;
				continue;
			} else {
				particle.colorStep.scaleToRef(this._scaledUpdateSpeed, this._scaledColorStep);
				particle.color.addInPlace(this._scaledColorStep);

				if (particle.color.a < 0)
				  particle.color.a = 0;

				particle.angle += particle.angularSpeed * this._scaledUpdateSpeed;

				particle.direction.scaleToRef(this._scaledUpdateSpeed, this._scaledDirection);
				particle.position.addInPlace(this._scaledDirection);

				this.gravity.scaleToRef(this._scaledUpdateSpeed, this._scaledGravity);
				particle.direction.addInPlace(this._scaledGravity);
			}
		}
	}

	particleSystem.updateFunction = updateFunction;

  particleSystem.start();
  return particleSystem;
}
