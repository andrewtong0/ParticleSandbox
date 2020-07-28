import React from 'react';
import constants, { WORLD_GRID_SNAP_VALUE } from '../constants.js';
import createParticle from './Particle.js';
import './World.css';

export default class World extends React.Component {
  constructor(props) {
    super(props);

    this.initializeWorldArray = this.initializeWorldArray.bind(this);
    this.worldTick = this.worldTick.bind(this);
    this.worldClear = this.worldClear.bind(this);
    this.addParticleToWorld = this.addParticleToWorld.bind(this);
    this.isAnotherParticleAtCoordinates = this.isAnotherParticleAtCoordinates.bind(this);
    this.isCoordinateCollidingWithParticle = this.isCoordinateCollidingWithParticle.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.updateMouseCoords = this.updateMouseCoords.bind(this);

    this.canvasElement = null;
    this.isMouseDown = false;
    this.mouseCoords = {
      x: -1,
      y: -1
    }
    this.cooldown = 0;
    this.worldArray = [];
    this.worldParticles = [];
  }

  componentDidMount() {
    this.canvasElement = document.getElementById("worldCanvas");
    this.initializeWorldArray();
    this.interval = setInterval(() => {
      this.worldTick();

      if (this.isMouseDown) {
        const canvasElementRect = this.canvasElement.getBoundingClientRect();
        const width_scaling = this.canvasElement.width / canvasElementRect.width;
        const height_scaling = this.canvasElement.height / canvasElementRect.height;
        const x = (this.mouseCoords.x - canvasElementRect.left) * width_scaling;
        const y = (this.mouseCoords.y- canvasElementRect.top) * height_scaling;
        this.addParticleToWorld(x, y, canvasElementRect);
      }
    }, constants.WORLD_SPEED);
  }

  // When initializing the world array, we use <= and store pixels at literal x/y (rather than zero based)
  initializeWorldArray() {
    for (let x = 0; x <= constants.CANVAS_WIDTH; x++) {
      this.worldArray[x] = [];
      for (let y = 0; y <= constants.CANVAS_HEIGHT; y++) {
        this.worldArray[x][y] = null;
      }
    }
  }

  worldTick() {
    this.worldClear();
    for (let i = 0; i < this.worldParticles.length; i++) {
      let particle = this.worldParticles[i];
      particle.tick();
    }
    if (this.cooldown > 0) {
      this.cooldown--;
    }
  }

  worldClear() {
    const canvas = this.canvasElement;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  }

  addParticleToWorld(x, y, canvasElementRect) {
    let newX = x;
    let newY = y;

    if (constants.WORLD_GRID_SNAP_STATUS) {
      let roundX = (x % WORLD_GRID_SNAP_VALUE) / WORLD_GRID_SNAP_VALUE > 0.5 ? WORLD_GRID_SNAP_VALUE : 0;
      newX = Math.floor(x / WORLD_GRID_SNAP_VALUE) * WORLD_GRID_SNAP_VALUE + roundX;

      let roundY = (y % WORLD_GRID_SNAP_VALUE) / WORLD_GRID_SNAP_VALUE > 0.5 ? WORLD_GRID_SNAP_VALUE : 0;
      newY = Math.floor(y / WORLD_GRID_SNAP_VALUE) * WORLD_GRID_SNAP_VALUE + roundY;
    }

    if (this.cooldown <= 0 && !this.isAnotherParticleAtCoordinates(newX, newY, null)) {

      let particle = new createParticle(
        this.worldParticles.length,
        constants.PARTICLE_SIZE,
        constants.PARTICLE_SIZE,
        constants.PARTICLE_COLOUR,
        newX,
        newY,
        canvasElementRect.width,
        canvasElementRect.height,
        this,
        false
      );
      this.worldArray[newX][newY] = particle;
      this.worldParticles.push(particle);
      this.cooldown = constants.PARTICLE_COOLDOWN;
      console.log('added');
    }
  }

  isAnotherParticleAtCoordinates(x, y, particleId) {
    // If coordinates are out of bounds, pretend there is another particle restricting movement
    // TODO: If the pixel is trying to move out of bounds (e.g. explosion causing it to fly outside), place it at 0. If occupied, cascade until free spot found.
    if (x < 0 || constants.CANVAS_WIDTH < x || y < 0 || constants.CANVAS_HEIGHT < y) return true;

    let particle = this.worldArray[x][y];
    if (particle !== null && particle.particleId !== particleId) {
      return true;
    }
    return false;
  }

  isCoordinateCollidingWithParticle(x, y, particle) {
    const size = constants.PARTICLE_SIZE;

    // Individually check corners and determine if either is colliding
    // Particle X falls somewhere between center of particle and right end of particle
    const xRight_collision = x >= particle.x && x < particle.x + size;
    // Particle X falls somewhere between center of particle and left end of particle
    const xLeft_collision = x <= particle.x && x > particle.x - size;
    const xCollision = xRight_collision || xLeft_collision;

    // Particle Y falls somewhere between center of particle and upper end of particle
    const yUpper_collision = y >= particle.y && y < particle.y + size;
    const yLower_collision = y <= particle.y && y > particle.y - size;
    const yCollision = yUpper_collision || yLower_collision;

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