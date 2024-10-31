interface Array<T> {
  chunk(size: number): T[][]
  includesWithMatrix(items: T[]): boolean
  sum(): number
}

Array.prototype.chunk = function (size: number) {
  return Array.from({ length: Math.ceil(this.length / size) }, (_, i) =>
    this.slice(i * size, (i + 1) * size),
  );
};

Array.prototype.includesWithMatrix = function (items) {
  return items.some(item => this.includes(item))
};

Array.prototype.sum = function (): number {
  return this.reduce<number>((carry, item) => {
    return carry + item
  }, 0)
}
