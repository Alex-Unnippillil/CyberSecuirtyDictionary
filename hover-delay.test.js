const { addHoverDelay } = require("./assets/js/hover-delay.js");
const { JSDOM } = require("jsdom");

const dom = new JSDOM(`<div id="el"></div>`);
const el = dom.window.document.getElementById("el");
let triggered = false;
addHoverDelay(
  el,
  () => {
    triggered = true;
  },
  () => {
    triggered = false;
  },
  50,
);

el.dispatchEvent(new dom.window.MouseEvent("mouseenter", { bubbles: true }));
el.dispatchEvent(new dom.window.MouseEvent("mouseleave", { bubbles: true }));

setTimeout(() => {
  if (triggered) {
    console.error("Hover triggered despite quick pass-through");
    process.exit(1);
  } else {
    console.log("Hover delay test passed");
    process.exit(0);
  }
}, 80);
