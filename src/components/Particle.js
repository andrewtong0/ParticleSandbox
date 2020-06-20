export default function createParticle(p_width, p_height, color, p_x, p_y, canvasRef) {
  this.width = p_width;
  this.height = p_height;
  this.x = p_x;
  this.y = p_y;

  this.tick = () => {
    let context = canvasRef.getContext("2d");

    context.beginPath();
    context.rect(this.x, this.y, this.width, this.height);
    context.fillStyle = color;
    context.fill();
  }

  function applyGravity() {

  }

  function canFall() {

  }
}