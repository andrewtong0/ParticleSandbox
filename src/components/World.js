import React from 'react';
import constants from '../constants.js';
import createParticle from './Particle.js';
import './World.css';

export default class World extends React.Component {
  constructor(props) {
    super(props);

    this.worldTick = this.worldTick.bind(this);
    this.worldClear = this.worldClear.bind(this);
    this.addParticleToWorld = this.addParticleToWorld.bind(this);
    this.isAnotherParticleAtCoordinates = this.isAnotherParticleAtCoordinates.bind(this);
    this.isCoordinateCollidingWithParticle = this.isCoordinateCollidingWithParticle.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.updateMouseCoords = this.updateMouseCoords.bind(this);

    this.state = {
      worldParticles: []
    }
    this.canvasElement = null;
    this.isMouseDown = false;
    this.mouseCoords = {
      x: -1,
      y: -1
    }
  }

  componentDidMount() {
    this.canvasElement = document.getElementById("worldCanvas");
    this.interval = setInterval(() => {
      this.worldTick();

      if (this.isMouseDown && !this.isAnotherParticleAtCoordinates(this.mouseCoords.x, this.mouseCoords.y, null)) {
        this.addParticleToWorld();
      }
      console.log(this.state.worldParticles.length);
    }, constants.WORLD_SPEED);
  }

  worldTick() {
    this.worldClear();
    for (let i = 0; i < this.state.worldParticles.length; i++) {
      let particle = this.state.worldParticles[i];
      particle.tick();
    }
  }

  worldClear() {
    const canvas = this.canvasElement;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  }

  addParticleToWorld() {
    const canvasElementRect = this.canvasElement.getBoundingClientRect();
    const width_scaling = this.canvasElement.width / canvasElementRect.width;
    const height_scaling = this.canvasElement.height / canvasElementRect.height;
    const x = (this.mouseCoords.x - canvasElementRect.left) * width_scaling;
    const y = (this.mouseCoords.y- canvasElementRect.top) * height_scaling;
    let particle = new createParticle(
      this.state.worldParticles.length,
      constants.PARTICLE_SIZE,
      constants.PARTICLE_SIZE,
      constants.PARTICLE_COLOUR,
      x,
      y,
      canvasElementRect.width,
      canvasElementRect.height,
      this
    );
    this.setState({
      worldParticles: this.state.worldParticles.concat([particle])
    });
  }

  isAnotherParticleAtCoordinates(x, y, particleId) {
    for (let i = 0; i < this.state.worldParticles.length; i++) {
      const particle = this.state.worldParticles[i];
      if (particleId !== particle.particleId && this.isCoordinateCollidingWithParticle(x, y, particle)) {
        return true;
      }
    }
    return false;
  }

  isCoordinateCollidingWithParticle(x, y, particle) {
    const size = constants.PARTICLE_SIZE;
    // Individually check corners and determine if either is colliding
    const xUL_collision = x >= particle.x && x <= particle.x + size;
    const xBR_collision = x + size >= particle.x && x + size <= particle.x + size;
    const xCollision = xUL_collision || xBR_collision;

    const yUL_collision = y >= particle.y && y <= particle.y + size;
    const yBR_collision = y + size >= particle.y && y + size <= particle.y + size;
    const yCollision = yUL_collision || yBR_collision;

    // If there is a collision in both the X and Y axis, a collision has occured
    return(xCollision && yCollision);
  }

  onMouseDown() {
    this.isMouseDown = true;
  }

  onMouseUp() {
    this.isMouseDown = false;
  }

  updateMouseCoords(event) {
    this.mouseCoords.x = event.clientX;
    this.mouseCoords.y = event.clientY;
  }

  render() {
    return (
      <canvas
        id="worldCanvas"
        onMouseMove={this.updateMouseCoords}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        width={constants.CANVAS_WIDTH}
        height={constants.CANVAS_HEIGHT}
      />
    );
  }
}