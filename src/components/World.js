import React from 'react';
import constants from '../constants.js';
import createParticle from './Particle.js';
import './World.css';

export default class World extends React.Component {
  constructor(props) {
    super(props);

    this.worldTick = this.worldTick.bind(this);
    this.coordinatesWithinBounds = this.coordinatesWithinBounds.bind(this);
    this.addParticleToWorld = this.addParticleToWorld.bind(this);

    this.state = {
      worldParticles: []
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.worldTick();
    }, constants.WORLD_SPEED);
  }

  worldTick() {
    for (let i = 0; i < this.state.worldParticles.length; i++) {
      let particle = this.state.worldParticles[i];
      particle.tick();
    }
  }

  coordinatesWithinBounds(xpos, ypos) {
    const worldContainerInfo = document.getElementById("worldCanvas").getBoundingClientRect();
    // Gets coordinates for upper left corner
    const worldContainer_UL_X = worldContainerInfo.left;
    const worldContainer_UL_Y = worldContainerInfo.top;
    const worldContainer_BR_X = worldContainer_UL_X + this.state.width;
    const worldContainer_BR_Y = worldContainer_UL_Y + this.state.height;
    return (
      xpos < worldContainer_BR_X - constants.PARTICLE_SIZE &&
      xpos > worldContainer_UL_X + constants.PARTICLE_SIZE &&
      ypos < worldContainer_BR_Y - constants.PARTICLE_SIZE &&
      ypos > worldContainer_UL_Y + constants.PARTICLE_SIZE
    );
  }

  addParticleToWorld(event) {
    let x = event.clientX;
    let y = event.clientY;
    const canvasRef = document.getElementById("worldCanvas");
    let particle = new createParticle(constants.PARTICLE_SIZE, constants.PARTICLE_SIZE, "yellow", x, y, canvasRef);
    this.setState({
      worldParticles: this.state.worldParticles.concat([particle])
    });
  }

  render() {
    return (
      <canvas
        id="worldCanvas"
        onClick={this.addParticleToWorld}
        style={{width: constants.CANVAS_WIDTH, height: constants.CANVAS_HEIGHT, context: "2d"}}
      />
    );
  }
}