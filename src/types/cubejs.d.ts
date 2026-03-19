declare module "cubejs" {
  class Cube {
    static initSolver(): void;
    static random(): Cube;
    constructor();
    move(algorithm: string): void;
    solve(): string;
    asString(): string;
  }
  export = Cube;
}
