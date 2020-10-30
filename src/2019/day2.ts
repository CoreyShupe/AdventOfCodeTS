import * as fs from 'fs';
import * as path from "path";
import {runElfCode} from "./elf_code";

function part1(input: string): number {
    return runProgram(input, 12, 2);
}

function part2(input: string): number {
    for(let noun = 0; noun < 100; noun++) {
        for(let verb = 0; verb < 100; verb++) {
            let output = runProgram(input, noun, verb);
            if (output === 19690720) {
                return (100 * noun) + verb;
            }
        }
    }
    return -1;
}

function runProgram(input: string, noun: number, verb: number): number {
    let opArr = input.split(",").map((string) => parseInt(string));
    return runElfCode(opArr, 0, (ram) => {
        ram[1] = noun;
        ram[2] = verb;
    }).ram[0];
}

export function solution() {
    let input = fs.readFileSync(path.join(__dirname, "../../resources/2019/day2.resource"), "utf-8");
    return [
        `Part1: ${part1(input)} `, 
        ` Part2: ${part2(input)}`
    ];
}