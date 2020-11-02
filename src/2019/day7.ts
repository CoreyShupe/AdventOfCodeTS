import * as fs from 'fs';
import * as path from "path";
import { Machine, State } from './elf/machine';

function part1(input: string) {
    let elfInput = input.split(",").map((string) => parseInt(string));
    let x = permute([0, 1, 2, 3, 4]);
    let highestOutput = 0;
    for(let y = 0; y < x.length; y++) {
        highestOutput = Math.max(highestOutput, runPermutation(elfInput, x[y]));
    }
    return highestOutput;
}

function part2(input: string) {
    let elfInput = input.split(",").map((string) => parseInt(string));
    let x = permute([5, 6, 7, 8, 9]);
    let highestOutput = 0;
    for(let y = 0; y < x.length; y++) {
        let output = runPermutation(elfInput, x[y]);
        highestOutput = Math.max(highestOutput, output);
    }
    return highestOutput;
}

function permute(vals: Array<number>): Array<Array<number>> {
    if (vals.length == 1) {
        return [vals];
    }

    let permutations = [];

    for (let i = 0; i < vals.length; i++) {
        let clone = Object.assign([], vals);
        clone.splice(i, 1);
        let innerPermutes = permute(clone);
        for (let y = 0; y < innerPermutes.length; y++) {
            let permutation = innerPermutes[y];
            permutation.unshift(vals[i]);
            permutations.push(permutation);
        }
    }

    return permutations;
}

function runPermutation(input: Array<number>, vals: Array<number>): number {
    let machines = [new Machine(input), new Machine(input), new Machine(input), new Machine(input), new Machine(input)];
    
    let currentInput = 0;

    for (let i = 0; i < 5; i++) {
        machines[i].run();
        machines[i].pushInputThenRun(vals[i]);
        machines[i].pushInputThenRun(currentInput);
        currentInput = machines[i].ram.currentOutput;
        if (i == 4 && machines[i].ram.state === State.HALTED) {
            return currentInput;
        }
    }

    while (true) {
        for (let i = 0; i < 5; i++) {
            machines[i].pushInputThenRun(currentInput);
            currentInput = machines[i].ram.currentOutput;
            if (i == 4 && machines[i].ram.state === State.HALTED) {
                return currentInput;
            }
        }
    }
}

export function solution() {
    let input = fs.readFileSync(path.join(__dirname, "../../resources/2019/day7.resource"), "utf-8");
    return [
        `Part1: ${part1(input)} `, 
        ` Part2: ${part2(input)}`
    ];
}