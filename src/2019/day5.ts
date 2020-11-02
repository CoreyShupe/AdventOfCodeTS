import * as fs from 'fs';
import * as path from "path";
import {Machine, State} from "./elf/machine";

function part1(input: string) {
    let inputArr = input.split(",").map((string) => parseInt(string));
    const machine = new Machine(inputArr);
    machine.run();
    while (machine.ram.state === State.AWAITING_INPUT) {
        machine.pushInputThenRun(1);
    }
    return machine.ram.currentOutput;
}

function part2(input: string): number {
    let inputArr = input.split(",").map((string) => parseInt(string));
    const machine = new Machine(inputArr);
    machine.run();
    while (machine.ram.state === State.AWAITING_INPUT) {
        machine.pushInputThenRun(5);
    }
    return machine.ram.currentOutput;
}

export function solution() {
    let input = fs.readFileSync(path.join(__dirname, "../../resources/2019/day5.resource"), "utf-8");
    return [
        `Part1: ${part1(input)} `, 
        ` Part2: ${part2(input)}`
    ];
}