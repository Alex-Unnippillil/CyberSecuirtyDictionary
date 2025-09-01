// Centralized spring presets shared across the application.
// Each preset defines the physical parameters for a spring animation.

const SPRING_PRESETS = {
  gentle: { stiffness: 120, damping: 20, mass: 1 },
  wobbly: { stiffness: 180, damping: 24, mass: 1 },
  stiff: { stiffness: 300, damping: 40, mass: 1 },
};

module.exports = SPRING_PRESETS;
