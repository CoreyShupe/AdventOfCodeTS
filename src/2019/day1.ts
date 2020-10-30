import { assert } from 'console';
import * as fs from 'fs';
import * as path from "path";

function sum(a: number, b: number): number {
    return a + b;
}

function part1(input: string): number {
    return input.split("\n").map((string) => translateFuelRequirement(parseInt(string))).reduce(sum);
}

function part2(input: string) {
    return input.split("\n").map((string) => findFuelRequired(translateFuelRequirement(parseInt(string)), []).reduce(sum)).reduce(sum);
}

function findFuelRequired(input: number, arr: Array<number>): Array<number> {
    if(input <= 0) {
        return arr;
    }
    arr.push(input);
    return findFuelRequired(translateFuelRequirement(input), arr);
}

function translateFuelRequirement(input: number): number {
    return Math.floor(input / 3) - 2;
}

export function solution() {
    let input = fs.readFileSync(path.join(__dirname, "../../resources/2019/day1.resource"), "utf-8");
    return [
        `Part1: ${part1(input)} `, 
        ` Part2: ${part2(input)}`
    ];
}
