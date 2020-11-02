import * as fs from 'fs';
import * as path from "path";
import {Machine} from "./elf/machine";

function part1(input: string): number {
    let elfInput = input.split(",").map((string) => parseInt(string));
    let machine = new Machine(elfInput);
    machine.run();
    machine.pushInputThenRun(1);
    return machine.ram.currentOutput;
}

function part2(input: string) {
    let elfInput = input.split(",").map((string) => parseInt(string));
    let machine = new Machine(elfInput);
    machine.run();
    machine.pushInputThenRun(2);
    return machine.ram.currentOutput;
}

export function solution() {
    let input = fs.readFileSync(path.join(__dirname, "../../resources/2019/day9.resource"), "utf-8");
    return [
        `Part1: ${part1(input)} `, 
        ` Part2: ${part2(input)}`
    ];
}