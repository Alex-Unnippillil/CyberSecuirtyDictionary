const ical = require("node-ical");
const generateReviewICS = require("./assets/js/review-ics.js");

const ics = generateReviewICS(["Test Term"]);
try {
  const events = ical.sync.parseICS(ics);
  const vevents = Object.values(events).filter((e) => e.type === "VEVENT");
  if (vevents.length !== 3) {
    throw new Error(`Expected 3 events, got ${vevents.length}`);
  }
  console.log("ICS validation passed");
} catch (err) {
  console.error("ICS validation failed", err);
  process.exit(1);
}
