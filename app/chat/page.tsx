import Script from "next/script";

export const metadata = {
  title: "Chat",
};

export default function ChatPage() {
  return (
    <>
      <main className="container">
        <h1>Chat</h1>
        <ul id="chat-messages"></ul>
        <input id="chat-input" type="text" placeholder="Type a message" />
        <button id="send" type="button">Send</button>
        <button id="stop" type="button">Stop</button>
        <button id="regen" type="button">Regenerate</button>
      </main>
      <Script type="module" src="/chat-app.js" />
    </>
  );
}
