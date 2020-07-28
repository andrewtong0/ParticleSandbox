const PARTICLE_SIZE = 4;

const CONSTANTS = {
    PARTICLE_SIZE: PARTICLE_SIZE,
    PARTICLE_FALL_SPEED: 1,
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