interface Array<T> {
  chunk(size: number): T[][]
  includesWithMatrix<U = T>(items: U[], type?: 'OR' | 'AND'): boolean
  sum(): number
}

Array.prototype.chunk = function (size: number) {
  return Array.from({ length: Math.ceil(this.length / size) }, (_, i) =>
    this.slice(i * size, (i + 1) * size),
  );
};

Array.prototype.includesWithMatrix = function (items, type: 'OR' | 'AND' = 'OR') {
  return type === 'AND'
    ? items.every(item => this.includes(item))
    : items.some(item => this.includes(item))
};

Array.prototype.sum = function (): number {
  return this.reduce<number>((carry, item) => {
    return carry + item
  }, 0)
}
