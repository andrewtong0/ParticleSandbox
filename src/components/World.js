import React from 'react';
import Particle from './Particle.js';
import constants from '../constants.js';
import './World.css';

export default class World extends React.Component {
  constructor(props) {
    super(props);

    this.areCoordinatesWithinWorldBounds = this.areCoordinatesWithinWorldBounds.bind(this);
    this.tickParticles = this.tickParticles.bind(this);
    this.clickInWorld = this.clickInWorld.bind(this);
    this.getArrayOfParticles = this.getArrayOfParticles.bind(this);
    this.getIsParticleAtPosition = this.getIsParticleAtPosition.bind(this);

    this.state = {
      width: 200,
      height: 200,
      gravity: true,
      worldParticles: []
    }
  }

  areCoordinatesWithinWorldBounds(xpos, ypos) {
    const worldContainerInfo = document.getElementsByClassName("worldContainer")[0].getBoundingClientRect();
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

  hasGravity() {
    return this.state.gravity;
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.tickParticles();
    }, constants.WORLD_SPEED);
  }

  tickParticles() {
    const worldParticles = this.state.worldParticles;
    for (let i = 0; i < this.state.worldParticles.length; i++) {
      const worldParticle = worldParticles[i];
      worldParticle.particleRef.current.tick();
    }
  }

  clickInWorld(event) {
    let x = event.clientX;
    let y = event.clientY;
    const particleRef = React.createRef();
    const newParticle = <Particle hasGravity={true} worldRefFn={this.props.getRefFn} ref={particleRef} xpos={x} ypos={y}/>
    this.setState({
      worldParticles: this.state.worldParticles.concat([{
        particle: newParticle,
        particleRef: particleRef
      }]),
    });
  }

  getArrayOfParticles() {
    let renderArray = [];
    const worldParticles = this.state.worldParticles;
    for (let i = 0; i < worldParticles.length; i++) {
      const worldParticle = worldParticles[i];
      renderArray.push(worldParticle.particle);
    }
    return renderArray;
  }

  getIsParticleAtPosition(xpos, ypos) {
    for (let i = 0; i < this.state.worldParticles.length; i++) {
      const worldParticle = this.state.worldParticles[i];
      const particlePos = worldParticle.particleRef.current.getParticlePosition();
      if (particlePos.x === xpos || particlePos.y === ypos) {
        return true;
      }
    }
    return false;
  }

  render() {
    const particlesToRender = this.getArrayOfParticles();

    return (
      <div className="worldContainer" onClick={this.clickInWorld} style={{width: this.state.width, height: this.state.height}}>
        {particlesToRender}
      </div>
    );
  }
}