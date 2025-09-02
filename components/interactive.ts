import { durations, easing, distances } from '@styles/animations';

function applyHover(el: HTMLElement) {
  el.style.transform = `translateY(-${distances.hover})`;
}

function applyPress(el: HTMLElement) {
  el.style.transform = `translateY(${distances.press})`;
}

function clearTransform(el: HTMLElement) {
  el.style.transform = '';
}

function applyFocus(el: HTMLElement) {
  el.style.boxShadow = `0 0 0 ${distances.focus} currentColor`;
}

function clearFocus(el: HTMLElement) {
  el.style.boxShadow = '';
}

export function applyControlAnimation(el: HTMLElement) {
  el.style.transition = `transform ${durations.press} ${easing.standard}, box-shadow ${durations.focus} ${easing.standard}`;

  el.addEventListener('pointerenter', () => applyHover(el));
  el.addEventListener('pointerleave', () => clearTransform(el));
  el.addEventListener('pointerdown', () => applyPress(el));
  el.addEventListener('pointerup', () => applyHover(el));
  el.addEventListener('focus', () => applyFocus(el));
  el.addEventListener('blur', () => clearFocus(el));
}
