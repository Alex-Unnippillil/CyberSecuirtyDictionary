const {
  PRESETS,
  getSpringPreset,
  validateSpring,
  calculateOvershoot,
} = require("./assets/js/spring");

// Ensure each preset stays within overshoot limits
Object.keys(PRESETS).forEach((name) => {
  const cfg = getSpringPreset(name);
  const overshoot = calculateOvershoot(cfg);
  if (overshoot > 2) {
    console.error(
      `Preset ${name} overshoot ${overshoot.toFixed(2)}% exceeds limit`,
    );
    process.exit(1);
  }
});

// Validate that clamping keeps custom springs within range and overshoot limit
const invalid = validateSpring({ stiffness: 2000, damping: 1, mass: 0.01 });
const overshoot = calculateOvershoot(invalid);
if (overshoot > 2) {
  console.error(
    `Clamped spring overshoot ${overshoot.toFixed(2)}% exceeds limit`,
  );
  process.exit(1);
}

console.log("Spring tests passed");
