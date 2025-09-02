import { useChat } from "./useChat.js";

const chat = useChat({ endpoint: "/api/chat" });

const listEl = document.getElementById("chat-messages");
const inputEl = document.getElementById("chat-input");
const sendBtn = document.getElementById("send");
const stopBtn = document.getElementById("stop");
const regenBtn = document.getElementById("regen");

chat.subscribe((messages) => {
  listEl.innerHTML = "";
  messages.forEach((m) => {
    const li = document.createElement("li");
    li.className = `msg-${m.role}`;
    li.textContent = `${m.role}: ${m.content}`;
    listEl.appendChild(li);
  });
  listEl.scrollTop = listEl.scrollHeight;
});

sendBtn.addEventListener("click", async () => {
  const msg = inputEl.value.trim();
  if (!msg) return;
  inputEl.value = "";
  try {
    await chat.send(msg);
  } catch (err) {
    console.error(err);
  }
});

stopBtn.addEventListener("click", () => chat.stop());
regenBtn.addEventListener("click", () => chat.regenerate());
