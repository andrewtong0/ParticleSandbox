import constants from '../constants.js';

export default function createParticle(pId, p_width, p_height, color, x, y, canvas_width, canvas_height, worldRef, isLiquid) {
  this.particleId = pId;
  this.width = p_width;
  this.height = p_height;
  this.x = x;
  this.y = y;
  this.canvas_width = canvas_width;
  this.canvas_height = canvas_height;
  this.canvasContext = worldRef.canvasElement.getContext("2d");
  this.hasGravity = true;
  this.isLiquid = isLiquid;
  this.liquidPolarity = 0; // Number of spaces away to check whether a particle is there to snap to it
  this.liquidTravelDirection = null;
  this.stimulation = constants.PARTICLE_LIQUID_STIMULATION;
  this.liquidTickMovement = constants.PARTICLE_LIQUID_MOVETICK;

  this.tick = () => {
    this.canvasContext.fillStyle = color;
    const fallStatus = this.canFall();

    // If the particle should be affected by gravity
    if (this.hasGravity) {
      // If the particle can fall, it should
      if (fallStatus) {
        this.moveParticle(constants.DIRECTIONS.DOWN);

        // When a liquid falls, it regains stimulation and resets its travel direction
        this.stimulation = constants.PARTICLE_LIQUID_STIMULATION;
        this.liquidTravelDirection = null;
      }
      // If the particle is on the ground
      else {
        // Liquid
        if (this.isLiquid) {
          if (this.liquidTravelDirection === null) {
            if (this.liquidPolarity > 0) {
              const particleCloseLeft = worldRef.isAnotherParticleBetweenCoordinates(this.x - ((constants.PARTICLE_SIZE * 2) * this.liquidPolarity), this.y, this.particleId);
              const particleCloseRight = worldRef.isAnotherParticleBetweenCoordinates(this.x + ((constants.PARTICLE_SIZE * 2) * this.liquidPolarity), this.y, this.particleId);

              if (particleCloseLeft && particleCloseRight) {
                const chosenDirection = Math.floor(Math.random() * 2);

                if (chosenDirection === 0) {
                  this.liquidTravelDirection = constants.DIRECTIONS.LEFT;
                }
                else {
                  this.liquidTravelDirection = constants.DIRECTIONS.RIGHT;
                }
                this.moveParticle(this.liquidTravelDirection);
                console.log("snap");
              }
              else if (particleCloseLeft) {
                this.liquidTravelDirection = constants.DIRECTIONS.LEFT;
                this.moveParticle(this.liquidTravelDirection);
                console.log("snap");
              }
              else if (particleCloseRight) {
                this.liquidTravelDirection = constants.DIRECTIONS.RIGHT;
                this.moveParticle(this.liquidTravelDirection);
                console.log("snap");
              }
            }
            else {
              const canMoveLeft = !this.isAnotherParticleAdjacent(constants.DIRECTIONS.LEFT);
              const canMoveRight = !this.isAnotherParticleAdjacent(constants.DIRECTIONS.RIGHT);

              if (canMoveLeft && canMoveRight) {
                const horizontalDirection = Math.floor(Math.random() * 2);
                // Move left
                if (horizontalDirection === 0) {
                  this.liquidTravelDirection = constants.DIRECTIONS.LEFT;
                }
                // Move right
                else {
                  this.liquidTravelDirection = constants.DIRECTIONS.RIGHT;
                }
              }
              else if (canMoveLeft) {
                this.liquidTravelDirection = constants.DIRECTIONS.LEFT;
              }
              else if (canMoveRight) {
                this.liquidTravelDirection = constants.DIRECTIONS.RIGHT;
              }
            }
          }

          if (this.stimulation > 0 && this.liquidTickMovement / constants.PARTICLE_LIQUID_MOVETICK > 1) {
            this.moveParticle(this.liquidTravelDirection);

            this.stimulation--;
            this.liquidTickMovement = 0;
          }

          this.liquidTickMovement++;
        }
      }
    }

    this.canvasContext.fillRect(this.x, this.y, this.width, this.height);
  }

  this.canFall = () => {
    return (
      this.hasGravity &&
      this.x >= 0 &&
      this.x < this.canvas_width - constants.CANVAS_BORDER_OFFEST,
      this.y >= 0 &&
      this.y < this.canvas_height - constants.CANVAS_BORDER_OFFEST &&

      // Check for collision at next spot (particle fall speed), but make sure we're checking bottom edge by offsetting by particle's size
      !this.isAnotherParticleAdjacent(constants.DIRECTIONS.DOWN)
    );
  }

  this.moveParticle = (direction) => {
    let new_x = this.x, new_y = this.y;
    const canMoveLeft = !this.isAnotherParticleAdjacent(constants.DIRECTIONS.LEFT);
    const canMoveRight = !this.isAnotherParticleAdjacent(constants.DIRECTIONS.RIGHT);
    switch(direction) {
      case constants.DIRECTIONS.UP:
        new_y -= constants.PARTICLE_LIQUID_SPEED;
        break;
      case constants.DIRECTIONS.RIGHT:
        if (canMoveRight) new_x += constants.PARTICLE_LIQUID_SPEED;
        break;
      case constants.DIRECTIONS.DOWN:
        new_y += constants.PARTICLE_FALL_SPEED;
        break;
      case constants.DIRECTIONS.LEFT:
        if (canMoveLeft) new_x -= constants.PARTICLE_LIQUID_SPEED;
        break;
      default:
        break;
    }

    // This is a bit redundant
    if (this.isNewPositionInBounds(new_x, new_y)) {
      this.clearParticle();
      this.x = new_x;
      this.y = new_y;
      this.reinsertParticle();
    }
  }

  this.reinsertParticle = () => {
    worldRef.worldArray[this.x][this.y] = this;
  }

  this.clearParticle = () => {
    worldRef.worldArray[this.x][this.y] = null;
  }

  this.isNewPositionInBounds = (new_x, new_y) => {
    const horizontalValid = 0 <= new_x - constants.PARTICLE_SIZE && new_x + constants.PARTICLE_SIZE <= this.canvas_width;
    const verticalValid = 0 <= new_y - constants.PARTICLE_SIZE && new_y + constants.PARTICLE_SIZE <= this.canvas_height;

    return horizontalValid && verticalValid;
  }

  this.isAnotherParticleAdjacent = (direction) => {
    let horizontalOffset = 0, verticalOffset = 0;
    switch(direction) {
      case constants.DIRECTIONS.UP:
        verticalOffset = -constants.PARTICLE_SIZE;
        break;
      case constants.DIRECTIONS.RIGHT:
        horizontalOffset = constants.PARTICLE_SIZE;
        break;
      case constants.DIRECTIONS.DOWN:
        verticalOffset = constants.PARTICLE_SIZE;
        break;
      case constants.DIRECTIONS.LEFT:
        horizontalOffset = -constants.PARTICLE_SIZE;
        break;
      default:
        break;
    }

    return worldRef.isAnotherParticleAtCoordinates(this.x + horizontalOffset, this.y + verticalOffset, this.particleId);
  }

  this.updateCanvasDimensions = (new_width, new_height) => {
    this.canvas_width = new_width;
    this.canvas_height = new_height;
  }
}