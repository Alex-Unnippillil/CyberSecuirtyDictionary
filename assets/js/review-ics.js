(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.generateReviewICS = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  function formatICSDate(date) {
    return date
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");
  }

  function generateReviewICS(terms) {
    const intervals = [1, 7, 30];
    const dtstamp = formatICSDate(new Date());
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Cybersecurity Dictionary//Review Planner//EN",
    ];

    terms.forEach((term, idx) => {
      intervals.forEach((days, j) => {
        const start = new Date();
        start.setHours(9, 0, 0, 0);
        start.setDate(start.getDate() + days);
        lines.push("BEGIN:VEVENT");
        lines.push(
          `UID:${idx}-${j}-${term.replace(/[^a-zA-Z0-9]/g, "")}@cyberdict`,
        );
        lines.push(`DTSTAMP:${dtstamp}`);
        lines.push(`DTSTART:${formatICSDate(start)}`);
        lines.push(`SUMMARY:Review: ${term}`);
        lines.push(
          `DESCRIPTION:Review the term ${term} from Cybersecurity Dictionary`,
        );
        lines.push("END:VEVENT");
      });
    });

    lines.push("END:VCALENDAR");
    return lines.join("\r\n");
  }

  return generateReviewICS;
});
