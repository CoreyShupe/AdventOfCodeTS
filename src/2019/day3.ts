import * as fs from 'fs';
import * as path from "path";

type NumberPair = {x: number, y: number};
type WireOperation = {op: string, count: number};

function stringToWireOp(value: String): WireOperation {
    return {op: value[0], count: parseInt(value.substring(1))};
}

class Grid {
    private grid: {};
    private valueGenerator: (numberPair: NumberPair, stepsPair: NumberPair) => NumberPair;
    private pointerX: number;
    private pointerY: number;
    private steps: number;
    private state: boolean;
    minDistance: number;

    constructor(valueGenerator: (numberPair: NumberPair, stepsPair: NumberPair) => NumberPair) {
        this.grid = {};
        this.valueGenerator = valueGenerator;
        this.minDistance = 0;
        this.pointerX = 0;
        this.pointerY = 0;
        this.steps = 0;
        this.state = false;
    }

    execute(wires: Array<WireOperation>) {
        this.pointerX = 0;
        this.pointerY = 0;
        this.steps = 0;
        if(!this.state) {
            this.executeWithCallback(wires, () => this.grid[`${this.pointerX};${this.pointerY}`] = this.steps);
            this.state = true;
        } else {
            this.executeWithCallback(wires, () => {
                let result = `${this.pointerX};${this.pointerY}`;
                if (this.grid[result] !== undefined) {
                    let numberPair = this.valueGenerator({x: this.pointerX, y: this.pointerY}, {x: this.grid[result], y: this.steps});
                    let value = Math.abs(numberPair.x) + Math.abs(numberPair.y);
                    if (this.minDistance === 0) {
                        this.minDistance = value;
                    } else {
                        this.minDistance = Math.min(this.minDistance, value);
                    }
                    this.grid[result] = undefined;
                }
            });
        }
    }

    private executeWithCallback(wires: Array<WireOperation>, callback: () => void) {
        wires.forEach((wireOp) => {
            this.OPERATION[wireOp.op](wireOp.count, callback);
        });
    }

    private OPERATION = {
        D: (count: number, callback: () => void) => {
            for (let x = 0; x < count; x++) {
                this.steps++;
                this.pointerY--;
                callback();
            }
        },
        U: (count: number, callback: () => void) => {
            for (let x = 0; x < count; x++) {
                this.steps++;
                this.pointerY++;
                callback();
            }
        },
        L: (count: number, callback: () => void) => {
            for (let x = 0; x < count; x++) {
                this.steps++;
                this.pointerX--;
                callback();
            }
        },
        R: (count: number, callback: () => void) => {
            for (let x = 0; x < count; x++) {
                this.steps++;
                this.pointerX++;
                callback();
            }
        },
    }
}

function part1(input: string): number {
    let inputSplit = input.split("\n");
    let wires1 = inputSplit[0].split(",").map(stringToWireOp);
    let wires2 = inputSplit[1].split(",").map(stringToWireOp);
    let grid = new Grid((val, _) => val);
    grid.execute(wires1);
    grid.execute(wires2);
    return grid.minDistance;
}

function part2(input: string) {
    let inputSplit = input.split("\n");
    let wires1 = inputSplit[0].split(",").map(stringToWireOp);
    let wires2 = inputSplit[1].split(",").map(stringToWireOp);
    let grid = new Grid((_, val) => val);
    grid.execute(wires1);
    grid.execute(wires2);
    return grid.minDistance;
}

export function solution() {
    let input = fs.readFileSync(path.join(__dirname, "../../resources/2019/day3.resource"), "utf-8");
    return [
        `Part1: ${part1(input)} `, 
        ` Part2: ${part2(input)}`
    ];
}