type Poolable = {
  active: boolean;
  update: (dt: number, ...args: any[]) => void;
  reset(): void;
  // We add an internal tracking property
  _poolIdx?: number;
};

type UpdateArgs<T extends Poolable> = T['update'] extends (dt: number, ...args: infer A) => void
  ? A
  : never;

export class ObjectPooler<T extends Poolable> {
  private pool: T[] = [];
  public activeList: T[] = [];
  private factoryFn: () => T;

  constructor(factoryFn: () => T, poolSize: number) {
    this.factoryFn = factoryFn;
    for (let i = 0; i < poolSize; i++) {
      this.pool.push(this.factoryFn());
    }
  }

  get(): T {
    if (this.pool.length === 0) {
      console.log('[DEV] Pool expanded, created new object');
    }
    const obj = this.pool.pop() ?? this.factoryFn();

    // Track index for O(1) removal later
    obj._poolIdx = this.activeList.length;
    this.activeList.push(obj);

    return obj;
  }

  release(obj: T): void {
    const idx = obj._poolIdx;

    // Validation: check if object is actually active
    if (idx === undefined || this.activeList[idx] !== obj) return;

    // Swap-remove logic (O(1))
    const lastIdx = this.activeList.length - 1;
    const lastObj = this.activeList[lastIdx];

    this.activeList[idx] = lastObj; // Move last item to deleted spot
    lastObj._poolIdx = idx; // Update moved item's index

    this.activeList.pop(); // Remove duplicate last item
    obj._poolIdx = undefined; // Clean up released object

    obj.reset();
    this.pool.push(obj);
  }

  releaseAll(): void {
    for (let i = 0; i < this.activeList.length; i++) {
      const obj = this.activeList[i];
      obj._poolIdx = undefined;
      obj.reset();
      this.pool.push(obj);
    }
    this.activeList.length = 0;
  }

  updateAll(dt: number, ...args: UpdateArgs<T>): void {
    // Iterate backwards so swap-removal doesn't skip items
    for (let i = this.activeList.length - 1; i >= 0; i--) {
      const obj = this.activeList[i];
      obj.update(dt, ...args);

      if (!obj.active) {
        this.release(obj);
      }
    }
  }
}
