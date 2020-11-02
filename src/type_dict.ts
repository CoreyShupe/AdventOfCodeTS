export class TypeDict<K, V> {
    map: Record<string, V>;

    constructor() {
        this.map = {};
    }

    set(key: K, value: V) {
        this.map[key.toString()] = value;
    }

    get(key: K): V {
        return this.map[key.toString()];
    }
}

export class Grid<V> {
    internalDict: TypeDict<GridLocation, V>;

    set(x: number, y: number, value: V) {
        this.internalDict.set(new GridLocation(x, y), value);
    }

    get(x: number, y: number): V {
        return this.internalDict.get(new GridLocation(x, y));
    }
}

export class GridLocation {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    mutate(x: number, y: number) {
        this.x += x;
        this.y += y;
    }

    toString(): string {
        return `${this.x},${this.y}`
    }
}