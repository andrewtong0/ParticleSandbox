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

    this.state = {
      worldParticles: []
    }
    this.canvasElement = null;
  }

  componentDidMount() {
    this.canvasElement = document.getElementById("worldCanvas");
    this.interval = setInterval(() => {
      this.worldTick();
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

  addParticleToWorld(event) {
    const canvasElementRect = this.canvasElement.getBoundingClientRect();
    const width_scaling = this.canvasElement.width / canvasElementRect.width;
    const height_scaling = this.canvasElement.height / canvasElementRect.height;
    const x = (event.clientX - canvasElementRect.left) * width_scaling;
    const y = (event.clientY - canvasElementRect.top) * height_scaling;
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
    const insideParticleX = x < particle.x && x > particle.x + constants.PARTICLE_SIZE;
    const insideParticleY = y < particle.y && y > particle.y + constants.PARTICLE_SIZE;
    return(insideParticleX && insideParticleY);
  }

  render() {
    return (
      <canvas
        id="worldCanvas"
        onClick={this.addParticleToWorld}
        width={constants.CANVAS_WIDTH}
        height={constants.CANVAS_HEIGHT}
      />
    );
  }
}