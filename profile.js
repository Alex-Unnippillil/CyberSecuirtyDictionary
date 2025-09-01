function renderProfile() {
  let activity;
  try {
    activity = JSON.parse(localStorage.getItem("activity")) || {};
  } catch (e) {
    activity = {};
  }

  document.getElementById("streak-count").textContent = activity.streak || 0;
  const badgesEl = document.getElementById("badges");
  if (activity.badges && activity.badges.length) {
    activity.badges.forEach((b) => {
      const li = document.createElement("li");
      li.textContent = b;
      badgesEl.appendChild(li);
    });
  } else {
    badgesEl.textContent = "No badges earned yet.";
  }
}

window.addEventListener("DOMContentLoaded", renderProfile);
