import * as fs from 'fs';
import * as path from "path";
import {Machine, State} from "./elf/machine";

function part1(input: string) {
    let inputArr = input.split(",").map((string) => parseInt(string));
    let output = 0;
    const machine = new Machine(inputArr, incoming => {
        if  (incoming !== 0) {
            output = incoming;
        }
    });
    machine.run();
    while (machine.ram.state === State.AWAITING_INPUT) {
        machine.pushInputThenRun(1);
    }
    return output;
}

function part2(input: string): number {
    let inputArr = input.split(",").map((string) => parseInt(string));
    let output = 0;
    const machine = new Machine(inputArr, incoming => {
        if  (incoming !== 0) {
            output = incoming;
        }
    });
    machine.run();
    while (machine.ram.state === State.AWAITING_INPUT) {
        machine.pushInputThenRun(5);
    }
    return output;
}

export function solution() {
    let input = fs.readFileSync(path.join(__dirname, "../../resources/2019/day5.resource"), "utf-8");
    return [
        `Part1: ${part1(input)} `, 
        ` Part2: ${part2(input)}`
    ];
}