type EventMap = Record<string, readonly unknown[]>;
type Listener<Args extends readonly unknown[]> = (...args: Args) => void;

export class EventEmitter<TEvents extends EventMap> {
  private listeners: {
    [K in keyof TEvents]?: Set<Listener<TEvents[K]>>;
  } = {};

  on<K extends keyof TEvents>(event: K, fn: Listener<TEvents[K]>): () => void {
    (this.listeners[event] ??= new Set()).add(fn);
    return () => this.off(event, fn);
  }

  off<K extends keyof TEvents>(event: K, fn: Listener<TEvents[K]>): void {
    const set = this.listeners[event];
    if (!set) return;

    set.delete(fn);

    if (set.size === 0) {
      delete this.listeners[event];
    }
  }

  once<K extends keyof TEvents>(event: K, fn: Listener<TEvents[K]>): () => void {
    const wrapped: Listener<TEvents[K]> = (...args) => {
      this.off(event, wrapped);
      fn(...args);
    };

    return this.on(event, wrapped);
  }

  emit<K extends keyof TEvents>(event: K, ...args: TEvents[K]): void {
    this.listeners[event]?.forEach((fn) => {
      fn(...args);
    });
  }

  clear<K extends keyof TEvents>(event?: K): void {
    if (event) {
      delete this.listeners[event];
    } else {
      this.listeners = {};
    }
  }

  listenerCount<K extends keyof TEvents>(event: K): number {
    return this.listeners[event]?.size ?? 0;
  }
}
