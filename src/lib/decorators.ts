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

/**
 * Class decorator that defines the decorated class a custom element.
 *
 * @param tagName The name of the custom element to define.
 */
export const customElement = (tagName: string) => (clazz: any) => {
  window.customElements.define(tagName, clazz);
  return clazz;
};

/**
 * A property decorator that converts a class property into a getter that
 * executes a querySelector on the element's shadow root.
 */
export const query = _query((target: NodeSelector, selector: string) =>
                                target.querySelector(selector));

/**
 * A property decorator that converts a class property into a getter
 * that executes a querySelectorAll on the element's shadow root.
 */
export const queryAll = _query((target: NodeSelector, selector: string) =>
                                   target.querySelectorAll(selector));

/*
 * Base-implementation of `@query` and `@queryAll`.
 *
 * @param queryFn exectute a `selector` (ie, querySelector or querySelectorAll)
 * against `target`.
 */
function _query<T>(queryFn: (target: NodeSelector, selector: string) => T) {
  return (selector: string) => (proto: any, propName: string) => {
    Object.defineProperty(proto, propName, {
      get(this: HTMLElement) { return queryFn(this.shadowRoot!, selector); },
      enumerable : true,
      configurable : true,
    });
  };
}
