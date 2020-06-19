import React from 'react';
import constants from '../constants.js';
import './Particle.css';

export default class Particle extends React.Component {
  constructor(props) {
    super(props);

    this.getParticlePosition = this.getParticlePosition.bind(this);
    this.canFall = this.canFall.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    this.tick = this.tick.bind(this);

    this.state = {
      x: this.props.xpos,
      y: this.props.ypos,
      worldRef: this.props.worldRefFn()
    }
  }

  getParticlePosition() {
    return {
      x: this.state.x,
      y: this.state.y
    }
  }

  canFall() {
    // TODO: Also ensure it is within world bounds
    return (
      this.state.worldRef.current.hasGravity &&
      this.props.hasGravity &&
      this.state.worldRef.current.getIsParticleAtPosition(this.state.x, this.state.y + 1) &&
      this.state.worldRef.current.areCoordinatesWithinWorldBounds(this.state.x, this.state.y)
    );
  }

  updatePosition(newX, newY) {
    this.setState({x: newX});
    this.setState({y: newY});
  }

  tick() {
    if (this.canFall()) {
      this.updatePosition(this.state.x, this.state.y + 1);
    }
  }

  render() {
    return (
      <div className="particle" style={{
        position: "absolute",
        left: this.state.x,
        top: this.state.y,
        width: constants.PARTICLE_SIZE,
        height: constants.PARTICLE_SIZE
      }}></div>
    );
  }
}