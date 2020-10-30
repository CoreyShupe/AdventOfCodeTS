import * as fs from 'fs';
import * as path from "path";

function part1(input: string): number {
    let grid: Set<string> = new Set();
    let intersections: Array<string> = [];
    let inputSplit = input.split("\n");
    let wire1 = inputSplit[0].split(",");
    let wire2 = inputSplit[1].split(",");

    // simulation
    let pointerX = 0;
    let pointerY = 0;

    function up() {
        pointerY++;
    }

    function down() {
        pointerY--;
    }

    function left() {
        pointerX--;
    }

    function right() {
        pointerX++;
    }

    wire1.forEach((x) => {
        let op = x[0];
        let calc = parseInt(x.substring(1));

        let formula;

        if (op === "D") {
            formula = down;
        } else if (op === "U") {
            formula = up;
        } else if (op === "R") {
            formula = right;
        } else if (op === "L") {
            formula = left;
        }

        for (let i = 0; i < calc; i++) {
            formula();
            grid.add(`${pointerX},${pointerY}`);
        }
    });

    pointerX = 0;
    pointerY = 0;

    wire2.forEach((x) => {
        let op = x[0];
        let calc = parseInt(x.substring(1));

        let formula;

        if (op === "D") {
            formula = down;
        } else if (op === "U") {
            formula = up;
        } else if (op === "R") {
            formula = right;
        } else if (op === "L") {
            formula = left;
        }

        for (let i = 0; i < calc; i++) {
            formula();
            let result = `${pointerX},${pointerY}`;
            if (grid.has(result)) {
                grid.delete(result);
                intersections.push(result);
            }
        }
    });

    let shortestDistance: number = 0;
    
    intersections.map((string) => {
        let split = string.split(",");
        let x = parseInt(split[0]);
        let y = parseInt(split[1]);
        return {x: x, y: y};
    }).forEach((set) => {
        let distance = Math.abs(set.x) + Math.abs(set.y);

        if (shortestDistance === 0) {
            shortestDistance = distance;
        } else {
            shortestDistance = Math.min(shortestDistance, distance);
        }
    });
    return shortestDistance;
}

function part2(input: string) {
    let grid = {};
    let intersections: Array<string> = [];
    let inputSplit = input.split("\n");
    let wire1 = inputSplit[0].split(",");
    let wire2 = inputSplit[1].split(",");

    // simulation
    let pointerX = 0;
    let pointerY = 0;
    let steps = 0;

    function up() {
        pointerY++;
        steps++;
    }

    function down() {
        pointerY--;
        steps++;
    }

    function left() {
        pointerX--;
        steps++;
    }

    function right() {
        pointerX++;
        steps++;
    }

    wire1.forEach((x) => {
        let op = x[0];
        let calc = parseInt(x.substring(1));

        let formula;

        if (op === "D") {
            formula = down;
        } else if (op === "U") {
            formula = up;
        } else if (op === "R") {
            formula = right;
        } else if (op === "L") {
            formula = left;
        }

        for (let i = 0; i < calc; i++) {
            formula();
            let result = `${pointerX},${pointerY}`;
            if (grid[result] === undefined) {
                grid[result] = steps;
            }
        }
    });

    pointerX = 0;
    pointerY = 0;
    steps = 0;

    wire2.forEach((x) => {
        let op = x[0];
        let calc = parseInt(x.substring(1));

        let formula;

        if (op === "D") {
            formula = down;
        } else if (op === "U") {
            formula = up;
        } else if (op === "R") {
            formula = right;
        } else if (op === "L") {
            formula = left;
        }

        for (let i = 0; i < calc; i++) {
            formula();
            let result = `${pointerX},${pointerY}`;
            if (grid[result] !== undefined) {
                intersections.push(`${steps},${grid[result]}`);
                grid[result] = undefined;
            }
        }
    });

    let shortestDistance: number = 0;
    
    intersections.map((string) => {
        let split = string.split(",");
        let x = parseInt(split[0]);
        let y = parseInt(split[1]);
        return {x: x, y: y};
    }).forEach((set) => {
        let distance = set.x + set.y;

        if (shortestDistance === 0) {
            shortestDistance = distance;
        } else {
            shortestDistance = Math.min(shortestDistance, distance);
        }
    });
    return shortestDistance;
}

export function solution() {
    let input = fs.readFileSync(path.join(__dirname, "../../resources/2019/day3.resource"), "utf-8");
    return [
        `Part1: ${part1(input)} `, 
        ` Part2: ${part2(input)}`
    ];
}