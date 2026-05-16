import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Child = HTMLElement | Text | string | number | null | undefined | false;

type Children = Child | Child[];

type Options<T extends keyof HTMLElementTagNameMap> = {
  style?: Partial<CSSStyleDeclaration>;
  children?: Children;
} & Omit<Partial<HTMLElementTagNameMap[T]>, 'style' | 'children'>;

function appendChildren(parent: HTMLElement, children: Children) {
  const items = Array.isArray(children) ? children : [children];

  for (const child of items) {
    // Ignore nullish and false values (useful for conditional rendering)
    if (child == null || child === false) continue;

    // Convert primitive values to text nodes
    if (typeof child === 'string' || typeof child === 'number') {
      parent.appendChild(document.createTextNode(String(child)));
      continue;
    }

    // Append DOM nodes directly
    parent.appendChild(child);
  }
}

export const createElement = <T extends keyof HTMLElementTagNameMap>(
  tag: T,
  attributes?: Options<T>,
  parent?: HTMLElement
): HTMLElementTagNameMap[T] => {
  const element = document.createElement(tag) as HTMLElementTagNameMap[T];

  if (attributes) {
    const { style, children, ...rest } = attributes;

    Object.assign(element, rest);

    if (style) {
      Object.assign(element.style, style);
    }

    if (children !== undefined) {
      appendChildren(element, children);
    }
  }

  if (parent) {
    parent.appendChild(element);
  }

  return element;
};

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;
export const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;
export const randomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
export const distance = (x1: number, y1: number, x2: number, y2: number) =>
  Math.hypot(x2 - x1, y2 - y1);
