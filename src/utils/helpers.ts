type Options<T extends keyof HTMLElementTagNameMap> = {
  style?: Partial<CSSStyleDeclaration>;
} & Omit<Partial<HTMLElementTagNameMap[T]>, 'style'>;

export const createElement = <T extends keyof HTMLElementTagNameMap>(
  tag: T,
  attributes?: Options<T>,
  parent?: HTMLElement
) => {
  const element = document.createElement(tag);

  if (attributes) {
    const { style, ...rest } = attributes;
    Object.assign(element, rest);
    if (style) {
      Object.assign(element.style, style);
    }
  }
  if (parent) parent.appendChild(element);
  return element;
};

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;
export const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;
export const randomInt = (min: number, max: number) => Math.floor(randomRange(min, max));
export const distance = (x1: number, y1: number, x2: number, y2: number) =>
  Math.hypot(x2 - x1, y2 - y1);
