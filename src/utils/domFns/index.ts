export type Child = Node | Element | string | number | boolean | null | undefined | Child[];

type Props = {
  style?: Partial<CSSStyleDeclaration>;
  children?: Child;
  [key: string]: any;
};

// ... appendChild, h, Fragment implementation ...

function appendChild(parent: Node, child: Child): void {
  if (child == null || child === false || child === true) return;

  if (Array.isArray(child)) {
    for (const nested of child) appendChild(parent, nested);
    return;
  }

  if (typeof child === 'string' || typeof child === 'number') {
    parent.appendChild(document.createTextNode(String(child)));
    return;
  }

  parent.appendChild(child);
}

export function h(tag: any, props?: Props): Node {
  if (typeof tag === 'function') {
    return tag(props ?? {});
  }

  const element = document.createElement(tag);
  const { style, children, ...rest } = props ?? {};

  for (const [key, value] of Object.entries(rest)) {
    if (value == null) continue;

    // Handle dataset properties specifically
    if (key.startsWith('data-')) {
      element.setAttribute(key, String(value));
    }
    // Handle inline event handlers (e.g. onClick -> element.onclick)
    else if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.substring(2).toLowerCase(), value);
    }
    // Handle standard mapped DOM properties (id, className, innerText, etc.)
    else if (key in element) {
      (element as any)[key] = value;
    }
    // Fallback for any other HTML attributes
    else {
      element.setAttribute(key, String(value));
    }
  }

  if (style) {
    Object.assign(element.style, style);
  }

  if (children !== undefined) {
    appendChild(element, children);
  }

  return element;
}

export function Fragment(props: { children?: Child }): DocumentFragment {
  const fragment = document.createDocumentFragment();

  if (props.children !== undefined) {
    appendChild(fragment, props.children);
  }

  return fragment;
}

// Required by TypeScript's react-jsx transform
export { Fragment as jsxFragment };

export function jsx(type: any, props: Props, _key?: any) {
  return h(type, props);
}

export function jsxs(type: any, props: Props, _key?: any) {
  return h(type, props);
}

export function jsxDEV(type: any, props: Props, _key?: any) {
  return h(type, props);
}
