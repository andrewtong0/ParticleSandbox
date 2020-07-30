const PARTICLE_SIZE = 6;

const CONSTANTS = {
    PARTICLE_SIZE: PARTICLE_SIZE,                   // Particle size (full length/height of pixel is PARTICLE_SIZE * 2)
    PARTICLE_FALL_SPEED: 1,                         // Vertical falling speed
    PARTICLE_LIQUID_SPEED: PARTICLE_SIZE,           // How far liquid moves each tick
    PARTICLE_LIQUID_MOVETICK: 40,                   // How many ticks to wait before moving a liquid once
    PARTICLE_LIQUID_STIMULATION: 12,                // Timer until a liquid settles and stops moving
    PARTICLE_COLOUR: "white",
    PARTICLE_COOLDOWN: 10,
    WORLD_SPEED: 3,
    WORLD_GRID_SNAP_STATUS: true,
    WORLD_GRID_SNAP_VALUE: PARTICLE_SIZE,
    CANVAS_WIDTH: 500,
    CANVAS_HEIGHT: 500,
    CANVAS_BORDER_OFFEST: 6 + PARTICLE_SIZE,
    // Directions ordered by clockwise rotation
    DIRECTIONS: {
        UP: 0,
        RIGHT: 1,
        DOWN: 2,
        LEFT: 3
    }
}

module.exports = CONSTANTS;