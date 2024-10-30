interface Array<T> {
  chunk(size: number): T[][]
  includesWithMatrix(items: T[]): boolean
}

Array.prototype.chunk = function (size: number) {
  return Array.from({ length: Math.ceil(this.length / size) }, (_, i) =>
    this.slice(i * size, (i + 1) * size),
  );
};

Array.prototype.includesWithMatrix = function (items) {
  return items.some(item => this.includes(item))
};
