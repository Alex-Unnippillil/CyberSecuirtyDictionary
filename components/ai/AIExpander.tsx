import React, { useEffect, useRef, useState } from "react";

/**
 * A simple right-side drawer that displays chat messages.
 * The component is intentionally framework-agnostic and does not rely on
 * any styling libraries. Consumers can override the generated class names if
 * desired. Messages can be passed in via the `messages` prop and a stream of
 * new message chunks can be provided through the `stream` prop. Any streamed
 * content will be appended in real time.
 */
export interface ChatMessage {
  /** The actor of the message (e.g. `user`, `assistant`). */
  role: string;
  /** Textual content of the message. */
  content: string;
}

export interface AIExpanderProps {
  /** Whether the drawer is currently open. */
  open: boolean;
  /** Callback fired when the user clicks the backdrop. */
  onClose: () => void;
  /** List of existing chat messages to render. */
  messages: ChatMessage[];
  /**
   * Optional async iterable that yields pieces of the current assistant
   * response. These pieces will be appended to the final assistant message
   * as they arrive, simulating a streaming AI response.
   */
  stream?: AsyncIterable<string> | null;
}

/**
 * A lightweight drawer for displaying a chat-like interface. It purposely does
 * not depend on a specific design framework so that it can be dropped into a
 * variety of projects. Styling is provided via basic inline styles but may be
 * overridden using the class names.
 */
export default function AIExpander({
  open,
  onClose,
  messages,
  stream,
}: AIExpanderProps) {
  const [streamText, setStreamText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Read from the provided stream and append chunks to the current assistant
  // message.
  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!stream) return;
      try {
        for await (const chunk of stream) {
          if (cancelled) break;
          setStreamText((prev) => prev + chunk);
          // Keep the scroll anchored to the bottom as new tokens arrive.
          containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
        }
      } catch (err) {
        // Swallow errors from the stream. Consumers may handle separately.
        console.error(err);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [stream]);

  // When the drawer opens, reset the streamed text.
  useEffect(() => {
    if (!open) {
      setStreamText("");
    }
  }, [open]);

  // Ensure the view is scrolled to the bottom whenever messages change.
  useEffect(() => {
    if (!open) return;
    containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
  }, [messages, open, streamText]);

  if (!open) return null;

  return (
    <div
      className="ai-expander"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 1000,
        display: "flex",
      }}
    >
      {/* Backdrop */}
      <div
        className="ai-expander__backdrop"
        onClick={onClose}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      />

      {/* Drawer */}
      <aside
        className="ai-expander__drawer"
        style={{
          marginLeft: "auto",
          width: "400px",
          maxWidth: "80%",
          height: "100%",
          backgroundColor: "#fff",
          boxShadow: "-2px 0 6px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          transform: open ? "translateX(0%)" : "translateX(100%)",
          transition: "transform 0.3s ease",
        }}
      >
        <div
          ref={containerRef}
          className="ai-expander__messages"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1rem",
          }}
        >
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`ai-expander__message ai-expander__message--${m.role}`}
              style={{ marginBottom: "0.5rem" }}
            >
              {m.content}
            </div>
          ))}
          {streamText && (
            <div
              className="ai-expander__message ai-expander__message--assistant"
              style={{ marginBottom: "0.5rem" }}
            >
              {streamText}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

