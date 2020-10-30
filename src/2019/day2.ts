import * as fs from 'fs';
import * as path from "path";

function part1(input: string): number {
    return runProgram(input, 12, 2);
}

function runProgram(input: string, noun: number, verb: number): number {
    let opArr = input.split(",").map((string) => parseInt(string));
    opArr[1] = noun;
    opArr[2] = verb;
    let pointer = 0;
    let opCode;
    while ((opCode = opArr[pointer]) != 99) {
        let left = opArr[pointer + 1];
        let right = opArr[pointer + 2];
        let position = opArr[pointer + 3];

        if (opCode == 1) {
            opArr[position] = opArr[left] + opArr[right];
        } else {
            opArr[position] = opArr[left] * opArr[right];
        }

        pointer += 4;
    }
    return opArr[0];
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

export function solution() {
    let input = fs.readFileSync(path.join(__dirname, "../../resources/2019/day2.resource"), "utf-8");
    return [
        `Part1: ${part1(input)} `, 
        ` Part2: ${part2(input)}`
    ];
}