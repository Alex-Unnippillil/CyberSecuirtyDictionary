const assert = require("assert");
const { TokenScheduler } = require("./assets/js/tokenScheduler");

const baseDelay = 40;
const variance = 10;
const maxStep = 5;
const scheduler = new TokenScheduler({ baseDelay, variance, maxStep });

let previous = baseDelay;
for (let i = 0; i < 100; i++) {
  const delay = scheduler.nextDelay();
  assert(
    delay >= baseDelay - variance && delay <= baseDelay + variance,
    `delay ${delay} out of bounds`,
  );
  assert(
    Math.abs(delay - previous) <= maxStep,
    `step too large between ${previous} and ${delay}`,
  );
  previous = delay;
}

console.log("TokenScheduler variance test passed");
