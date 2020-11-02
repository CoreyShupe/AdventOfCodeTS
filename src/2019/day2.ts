import * as fs from 'fs';
import * as path from "path";
import {Machine} from "./elf/machine";

function part1(input: string): number {
    return runProgram(input, 12, 2);
}

function part2(input: string): number {
    for(let noun = 0; noun < 100; noun++) {
        for(let verb = 0; verb < 100; verb++) {
            const output = runProgram(input, noun, verb);
            if (output === 19690720) {
                return (100 * noun) + verb;
            }
        }
    }
    return -1;
}

function runProgram(input: string, noun: number, verb: number): number {
    const opArr = input.split(",").map((string) => parseInt(string));
    opArr[1] = noun;
    opArr[2] = verb;
    const machine = new Machine(opArr);
    machine.run();
    return machine.ram.getRamValue(0);
}

export function solution() {
    let input = fs.readFileSync(path.join(__dirname, "../../resources/2019/day2.resource"), "utf-8");
    return [
        `Part1: ${part1(input)} `, 
        ` Part2: ${part2(input)}`
    ];
}