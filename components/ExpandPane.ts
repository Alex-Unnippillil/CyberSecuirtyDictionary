import type { PromptChip } from '@/lib/prompts';

/**
 * Basic UI component that renders prompt chips and displays the expanded
 * response returned from `/api/expand`.
 */
export class ExpandPane {
  private topic: string;
  private container: HTMLElement;
  private resultEl: HTMLElement;
  private chipsEl: HTMLElement;

  constructor(container: HTMLElement, topic: string) {
    this.topic = topic;
    this.container = container;
    this.chipsEl = document.createElement('div');
    this.chipsEl.className = 'prompt-chips';
    this.resultEl = document.createElement('div');
    this.resultEl.className = 'expand-result';
    container.appendChild(this.chipsEl);
    container.appendChild(this.resultEl);
  }

  /** Fetch prompt suggestions based on the provided tags. */
  async load(tags: string[]): Promise<void> {
    const qs = encodeURIComponent(tags.join(','));
    const res = await fetch(`/api/suggest?tags=${qs}`);
    if (!res.ok) return;
    const { suggestions } = await res.json();
    this.renderChips(suggestions || []);
  }

  private renderChips(chips: PromptChip[]): void {
    this.chipsEl.innerHTML = '';
    for (const chip of chips) {
      const btn = document.createElement('button');
      btn.textContent = chip.label;
      btn.addEventListener('click', () => {
        this.expand(chip.prompt);
      });
      this.chipsEl.appendChild(btn);
    }
  }

  /** Call the server to expand the topic using the provided prompt. */
  async expand(prompt: string): Promise<void> {
    this.resultEl.textContent = 'Loading...';
    try {
      const res = await fetch('/api/expand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: this.topic, prompt })
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      this.resultEl.textContent = data.expansion || '';
    } catch (err: any) {
      this.resultEl.textContent = err.message || 'Failed to expand topic';
    }
  }
}
