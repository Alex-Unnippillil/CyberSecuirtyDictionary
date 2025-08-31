const { setupKonamiCode } = require("../assets/js/konami.js");

const sequence = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

let toggled = false;
const handler = setupKonamiCode(() => {
  toggled = !toggled;
  console.log("toggled", toggled);
});

sequence.forEach((key) => handler({ key }));
console.log("Activated:", toggled);

sequence.forEach((key) => handler({ key }));
console.log("Deactivated:", toggled);
