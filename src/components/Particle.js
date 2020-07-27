import constants from '../constants.js';

export default function createParticle(pId, p_width, p_height, color, x, y, canvas_width, canvas_height, worldRef) {
  this.particleId = pId;
  this.width = p_width;
  this.height = p_height;
  this.x = x;
  this.y = y;
  this.canvas_width = canvas_width;
  this.canvas_height = canvas_height;
  this.canvasContext = worldRef.canvasElement.getContext("2d");
  this.hasGravity = true;
  this.isLiquid = false;

  this.tick = () => {
    this.canvasContext.fillStyle = color;
    if (this.canFall()) {
      this.y += constants.PARTICLE_FALL_SPEED;
    }
    this.canvasContext.fillRect(this.x, this.y, this.width, this.height);
  }

  this.canFall = () => {
    return (
      this.hasGravity &&
      this.x > 0 &&
      this.x < this.canvas_width - constants.CANVAS_BORDER_OFFEST,
      this.y > 0 &&
      this.y < this.canvas_height - constants.CANVAS_BORDER_OFFEST &&
      !worldRef.isAnotherParticleAtCoordinates(this.x, this.y + constants.PARTICLE_FALL_SPEED, this.particleId)
    );
  }

  this.updateCanvasDimensions = (new_width, new_height) => {
    this.canvas_width = new_width;
    this.canvas_height = new_height;
  }
}