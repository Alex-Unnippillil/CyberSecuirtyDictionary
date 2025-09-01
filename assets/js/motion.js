import { duration, easing } from "../../tokens/motion.js";

const root = document.documentElement;

root.style.setProperty("--motion-duration-fast", `${duration.fast}s`);
root.style.setProperty("--motion-duration-base", `${duration.base}s`);
root.style.setProperty("--motion-duration-slow", `${duration.slow}s`);
root.style.setProperty("--motion-easing-linear", easing.linear);
root.style.setProperty("--motion-easing-in", easing.in);
root.style.setProperty("--motion-easing-out", easing.out);
root.style.setProperty("--motion-easing-in-out", easing.inOut);
