// Utilities for working with spring animations.
// Provides runtime validation and helpers to compute overshoot.

const PRESETS = require("./springPresets");

const CLAMP_RANGES = {
  stiffness: [1, 1000],
  damping: [0, 100],
  mass: [0.1, 10],
};

const MIN_ZETA = 0.78; // damping ratio to keep overshoot < 2%

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function validateSpring(cfg) {
  const clamped = {};
  for (const key of Object.keys(CLAMP_RANGES)) {
    const [min, max] = CLAMP_RANGES[key];
    clamped[key] = clamp(cfg[key], min, max);
  }

  // Ensure damping high enough to keep overshoot under 2%
  const minDamping = 2 * Math.sqrt(clamped.stiffness * clamped.mass) * MIN_ZETA;
  if (clamped.damping < minDamping) {
    clamped.damping = clamp(
      minDamping,
      CLAMP_RANGES.damping[0],
      CLAMP_RANGES.damping[1],
    );
  }

  return clamped;
}

function getSpringPreset(name) {
  const preset = PRESETS[name];
  if (!preset) throw new Error(`Unknown spring preset: ${name}`);
  return validateSpring(preset);
}

function calculateOvershoot(cfg) {
  const { stiffness, damping, mass } = cfg;
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  if (zeta >= 1) return 0;
  const overshoot = Math.exp((-zeta * Math.PI) / Math.sqrt(1 - zeta * zeta));
  return overshoot * 100;
}

module.exports = {
  PRESETS,
  getSpringPreset,
  validateSpring,
  calculateOvershoot,
};
