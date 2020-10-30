import * as fs from 'fs';
import * as path from "path";
import {runElfCode} from "./elf_code";

function part1(input: string) {
    let inputArr = input.split(",").map((string) => parseInt(string));
    return runElfCode(inputArr, 1).output;
}

function part2(input: string): number {
    let inputArr = input.split(",").map((string) => parseInt(string));
    return runElfCode(inputArr, 5).output;
}

export function solution() {
    let input = fs.readFileSync(path.join(__dirname, "../../resources/2019/day5.resource"), "utf-8");
    return [
        `Part1: ${part1(input)} `, 
        ` Part2: ${part2(input)}`
    ];
}