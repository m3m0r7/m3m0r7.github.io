interface Array<T> {
  chunk(size: number): T[][];
  repeat<U extends T = T>(times: number): T[];
  includesWithMatrix<U = T>(items: U[], type?: "OR" | "AND"): boolean;
  sum(): number;
  same<T>(arr: T[]): boolean;
}

Array.prototype.chunk = function (size: number) {
  return Array.from({ length: Math.ceil(this.length / size) }, (_, i) =>
    this.slice(i * size, (i + 1) * size),
  );
};

Array.prototype.repeat = function <U>(times: number) {
  return Array<U[]>(times)
    .fill(this as U[])
    .flat();
};

Array.prototype.includesWithMatrix = function (
  items,
  type: "OR" | "AND" = "OR",
) {
  return type === "AND"
    ? items.every((item) => this.includes(item))
    : items.some((item) => this.includes(item));
};

Array.prototype.sum = function (): number {
  return this.reduce<number>((carry, item) => {
    return carry + item;
  }, 0);
};

Array.prototype.same = function <T>(arr: T[]): boolean {
  return JSON.stringify(this) === JSON.stringify(arr);
};
