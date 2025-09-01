import { strict as assert } from 'assert';
import { JSDOM } from 'jsdom';

describe('combobox a11y', () => {
  let dom: JSDOM;
  let input: HTMLInputElement;
  let list: HTMLElement;

  beforeEach(() => {
    dom = new JSDOM(`
      <div>
        <input id="cb" role="combobox" aria-haspopup="listbox" aria-controls="list" aria-expanded="false" aria-activedescendant="">
        <ul id="list" role="listbox">
          <li id="opt-1" role="option">Alpha</li>
          <li id="opt-2" role="option">Beta</li>
          <li id="opt-3" role="option">Gamma</li>
        </ul>
      </div>
    `);
    input = dom.window.document.getElementById('cb') as HTMLInputElement;
    list = dom.window.document.getElementById('list') as HTMLElement;

    let index = -1;
    const options = () => Array.from(list.querySelectorAll('[role="option"]')) as HTMLElement[];

    input.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        index = Math.min(index + 1, options().length - 1);
        update();
      } else if (e.key === 'ArrowUp') {
        index = Math.max(index - 1, 0);
        update();
      }
    });

    function update() {
      const opts = options();
      if (index >= 0 && opts[index]) {
        input.setAttribute('aria-activedescendant', opts[index].id);
      }
    }
  });

  it('assigns proper roles', () => {
    assert.equal(input.getAttribute('role'), 'combobox');
    assert.equal(list.getAttribute('role'), 'listbox');
    const options = list.querySelectorAll('[role="option"]');
    assert.equal(options.length, 3);
  });

  it('supports keyboard navigation', () => {
    const options = list.querySelectorAll('[role="option"]');
    input.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'ArrowDown' }));
    assert.equal(input.getAttribute('aria-activedescendant'), options[0].id);
    input.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'ArrowDown' }));
    assert.equal(input.getAttribute('aria-activedescendant'), options[1].id);
    input.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'ArrowUp' }));
    assert.equal(input.getAttribute('aria-activedescendant'), options[0].id);
  });
});
