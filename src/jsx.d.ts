// jsx.d.ts

declare module '@/utils/domFns/jsx-runtime' {
  export { jsx, jsxs, Fragment } from '@/utils/domFns';
}

declare module '@/utils/domFns/jsx-dev-runtime' {
  export { jsxDEV, Fragment } from '@/utils/domFns';
}

declare namespace JSX {
  type Element = globalThis.Element;

  /**
   * Children can still include any Node, including DocumentFragment.
   */
  type Child = globalThis.Node | string | number | boolean | null | undefined;

  interface ElementChildrenAttribute {
    children: {};
  }

  interface DOMAttributes<T extends EventTarget = EventTarget> {
    id?: string;
    class?: string;
    className?: string;
    style?: string | Partial<CSSStyleDeclaration>;
    title?: string;
    hidden?: boolean;
    tabIndex?: number;
    role?: string;

    children?: Child | Child[];
    textContent?: string;
    innerText?: string;
    innerHTML?: string;

    // Use broad index signatures for compatibility with older TypeScript versions
    [key: `data-${string}`]: string | number | boolean | undefined;
    [key: `aria-${string}`]: string | number | boolean | 'true' | 'false' | undefined;

    onClick?: (event: MouseEvent & { currentTarget: T }) => void;
    onDblClick?: (event: MouseEvent & { currentTarget: T }) => void;
    onMouseDown?: (event: MouseEvent & { currentTarget: T }) => void;
    onMouseUp?: (event: MouseEvent & { currentTarget: T }) => void;
    onMouseMove?: (event: MouseEvent & { currentTarget: T }) => void;
    onMouseEnter?: (event: MouseEvent & { currentTarget: T }) => void;
    onMouseLeave?: (event: MouseEvent & { currentTarget: T }) => void;

    onInput?: (event: InputEvent & { currentTarget: T }) => void;
    onChange?: (event: Event & { currentTarget: T }) => void;
    onSubmit?: (event: SubmitEvent & { currentTarget: T }) => void;

    onKeyDown?: (event: KeyboardEvent & { currentTarget: T }) => void;
    onKeyUp?: (event: KeyboardEvent & { currentTarget: T }) => void;
    onFocus?: (event: FocusEvent & { currentTarget: T }) => void;
    onBlur?: (event: FocusEvent & { currentTarget: T }) => void;
  }

  type PropsOf<K extends keyof HTMLElementTagNameMap> = Omit<
    Partial<HTMLElementTagNameMap[K]>,
    keyof globalThis.Node | keyof JSX.DOMAttributes<any> | 'children'
  > &
    DOMAttributes<HTMLElementTagNameMap[K]>;

  type SvgProps<K extends keyof SVGElementTagNameMap> = Omit<
    Partial<SVGElementTagNameMap[K]>,
    keyof globalThis.Node | keyof JSX.DOMAttributes<any> | 'children'
  > &
    DOMAttributes<SVGElementTagNameMap[K]>;

  // Mapped types cannot be used directly inside interfaces in some TS versions,
  // so define them as type aliases first.
  type HTMLIntrinsicElements = {
    [K in keyof HTMLElementTagNameMap]: PropsOf<K>;
  };

  type SVGIntrinsicElements = {
    [K in keyof SVGElementTagNameMap]: SvgProps<K>;
  };

  interface IntrinsicElements extends HTMLIntrinsicElements, SVGIntrinsicElements {}
}
