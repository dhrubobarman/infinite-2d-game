type Options<T extends keyof HTMLElementTagNameMap> = {
  style?: Partial<CSSStyleDeclaration>;
} & Omit<Partial<HTMLElementTagNameMap[T]>, "style">;

export const createElement = <T extends keyof HTMLElementTagNameMap>(
  tag: T,
  attributes?: Options<T>,
  parent?: HTMLElement,
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
