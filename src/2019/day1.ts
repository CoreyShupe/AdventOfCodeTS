import * as fs from 'fs';
import * as path from "path";

function sum(a: number, b: number): number {
    return a + b;
}

function part1(input: string): number {
    return input.split("\n").map(translateFuelRequirement).reduce(sum);
}

function part2(input: string) {
    return input.split("\n").map(translateFuelRequirement).map(findFuelRequired).reduce(sum);
}

function findFuelRequired(input: number): number {
    return findFuelRequired0(input, []).reduce(sum);
}

function findFuelRequired0(input: number, arr: Array<number>): Array<number> {
    if(input <= 0) {
        return arr;
    }
    arr.push(input);
    return findFuelRequired0(translateFuelRequirement0(input), arr);
}

function translateFuelRequirement(value: string): number {
    return translateFuelRequirement0(parseInt(value));
}

function translateFuelRequirement0(value: number): number {
    return Math.floor(value / 3) - 2;
}

export function solution() {
    let input = fs.readFileSync(path.join(__dirname, "../../resources/2019/day1.resource"), "utf-8");
    return [
        `Part1: ${part1(input)} `, 
        ` Part2: ${part2(input)}`
    ];
}
