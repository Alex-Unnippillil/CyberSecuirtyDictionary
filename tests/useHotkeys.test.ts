import { JSDOM } from "jsdom";
import assert from "assert";
import { __hotkeysTest } from "../src/hooks/useHotkeys";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost",
});

(global as any).window = dom.window as unknown as Window & typeof globalThis;
(global as any).document = dom.window.document;
(global as any).HTMLElement = dom.window.HTMLElement;

let triggered = 0;
__hotkeysTest.registry.set("test", {
  "ctrl+k": () => {
    triggered++;
  },
});

const input = dom.window.document.createElement("input");
dom.window.document.body.appendChild(input);

const inputEvent = new dom.window.KeyboardEvent("keydown", {
  key: "k",
  ctrlKey: true,
  bubbles: true,
});
Object.defineProperty(inputEvent, "target", { value: input });
__hotkeysTest.handleKeydown(inputEvent);
assert.strictEqual(triggered, 0, "hotkey should not trigger while typing");

const bodyEvent = new dom.window.KeyboardEvent("keydown", {
  key: "k",
  ctrlKey: true,
  bubbles: true,
});
Object.defineProperty(bodyEvent, "target", { value: dom.window.document.body });
__hotkeysTest.handleKeydown(bodyEvent);
assert.strictEqual(triggered, 1, "hotkey should trigger when not typing");

console.log("useHotkeys tests passed");
