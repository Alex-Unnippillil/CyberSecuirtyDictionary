import { useState } from 'react';
import { useChat, Message } from 'ai/react';

const CANONICAL_HOSTS = [
  'nvd.nist.gov',
  'csrc.nist.gov',
  'owasp.org',
  'en.wikipedia.org',
];

function isCanonical(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return CANONICAL_HOSTS.some((allowed) => host.endsWith(allowed));
  } catch {
    return false;
  }
}

const PROMPTS = ['expander', 'coach', 'mapper'] as const;

type Mode = (typeof PROMPTS)[number];

export default function AIExpander() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('expander');

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: { mode },
  });

  return (
    <div className="ai-expander">
      <button onClick={() => setOpen(true)}>Ask AI</button>
      {open && (
        <div className="drawer">
          <div className="drawer-header">
            <strong>AI Assistant</strong>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
          <div className="prompt-chips">
            {PROMPTS.map((p) => (
              <button
                key={p}
                className={mode === p ? 'active' : ''}
                onClick={() => setMode(p)}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="chat-messages">
            {messages.map((m) => (
              <div key={m.id} className={`msg msg-${m.role}`}>
                {renderMessage(m)}
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="chat-input">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask a question"
            />
            <button type="submit" disabled={isLoading}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function renderMessage(message: Message) {
  const content: any = (message as any).content;
  if (typeof content === 'string') {
    return content;
  }
  return content.map((part: any, idx: number) => {
    if (part.type === 'text') {
      return <span key={idx}>{part.text}</span>;
    }
    if (part.type === 'citation' && part.url && isCanonical(part.url)) {
      return (
        <sup key={idx} className="citation">
          <a href={part.url} target="_blank" rel="noreferrer">
            {part.title || part.url}
          </a>
        </sup>
      );
    }
    return null;
  });
}
