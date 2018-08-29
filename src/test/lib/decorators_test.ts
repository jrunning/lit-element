/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

import { customElement, query, queryAll } from '../../lib/decorators.js';
import { LitElement, html } from '../../lit-element.js';

const assert = chai.assert;

suite('decorators', () => {
  let container: HTMLElement;

  setup(() => {
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);
  });

  teardown(() => {
    if (container !== undefined) {
      container.parentElement!.removeChild(container);
      (container as any) = undefined;
    }
  });

  suite('@customElement', () => {
    test('defines an element', () => {
      @customElement('designer-element-test-2' as
                     (keyof HTMLElementTagNameMap))
      class C extends HTMLElement {
      }
      const DefinedC = customElements.get('designer-element-test-2');
      assert.strictEqual(DefinedC, C);
    });
  });

  suite('@query', () => {
    @customElement('designer-element-test-7' as (keyof HTMLElementTagNameMap))
    class C extends LitElement {

      @query('#blah') blah?: HTMLDivElement;

      @query('span') nope?: HTMLSpanElement;

      render() {
        return html`
          <div>Not this one</div>
          <div id="blah">This one</div>
        `;
      }
    }

    test('returns an element when it exists', async () => {
      const c = new C();
      container.appendChild(c);
      await Promise.resolve();
      const div = c.blah;
      assert.instanceOf(div, HTMLDivElement);
      assert.equal(div!.innerText, 'This one');
    });

    test('returns null when no match', async () => {
      const c = new C();
      container.appendChild(c);
      await Promise.resolve();
      const span = c.nope;
      assert.isNull(span);
    });
  });

  suite('@queryAll', () => {
    @customElement('designer-element-test-8' as (keyof HTMLElementTagNameMap))
    class C extends LitElement {

      @queryAll('div') divs?: NodeList;

      @query('span') spans?: NodeList;

      render() {
        return html`
          <div>Not this one</div>
          <div id="blah">This one</div>
        `;
      }
    }

    test('returns elements when they exists', async () => {
      const c = new C();
      container.appendChild(c);
      await Promise.resolve();
      const divs = c.divs!;
      // This is not true in ShadyDOM:
      // assert.instanceOf(divs, NodeList);
      assert.lengthOf(divs, 2);
    });

    test('returns null when no match', async () => {
      const c = new C();
      container.appendChild(c);
      await Promise.resolve();
      const spans = c.spans;
      assert.isNull(spans);
    });

  });

});
