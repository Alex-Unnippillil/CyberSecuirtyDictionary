import { initAvatar } from "./avatar-morph.js";

(async () => {
  let current = "analyst";
  const morph = await initAvatar("avatar", current);
  const btn = document.getElementById("toggle-avatar");
  if (btn) {
    btn.addEventListener("click", () => {
      current = current === "analyst" ? "hacker" : "analyst";
      morph(current);
    });
  }
})();
