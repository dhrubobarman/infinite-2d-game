type Child = Node | string | number | boolean | null | undefined | Child[];

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

type Props = {
  style?: Partial<CSSStyleDeclaration>;
  children?: Child;
  [key: string]: any;
};

export function h(tag: any, props?: Props): Node {
  // Function component support
  if (typeof tag === 'function') {
    return tag(props ?? {});
  }

  const element = document.createElement(tag);
  const { style, children, ...rest } = props ?? {};

  Object.assign(element, rest);

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
