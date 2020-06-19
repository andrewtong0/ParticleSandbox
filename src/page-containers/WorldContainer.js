import React from 'react';
import World from '../components/World.js';

export default class WorldContainer extends React.Component {
  constructor(props) {
    super(props);

    this.worldRef = React.createRef();

    this.getWorldRef = this.getWorldRef.bind(this);
  }

  getWorldRef() {
    return this.worldRef;
  }

  render() {
    return (
      <World ref={this.worldRef} getRefFn={this.getWorldRef}/>
    );
  }
}