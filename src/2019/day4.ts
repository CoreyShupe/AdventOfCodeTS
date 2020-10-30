import * as fs from 'fs';
import * as path from "path";

function part1(input: string): number {
    let split = input.split("-");
    let range = {x: parseInt(split[0]), y: parseInt(split[1])};
    let count = 0;
    for (let x = range.x; x < range.y + 1; x++) {
        if (check(x)) {
            count++;
        }
    }
    return count;
}

function check(password: number): boolean {
    let flag = false;
    let past_value = undefined;
    for (let x of password.toString()) {
        if (past_value === undefined) {
            past_value = x;
            continue;
        }
        if (past_value > x) {
            return false;
        }
        if (past_value === x) {
            flag = true;
        }
        past_value = x;
    }
    return flag;
}

function part2(input: string): number {
    let split = input.split("-");
    let range = {x: parseInt(split[0]), y: parseInt(split[1])};
    let count = 0;
    for (let x = range.x; x < range.y + 1; x++) {
        if (check2(x)) {
            count++;
        }
    }
    return count;
}

function check2(password: number): boolean {
    let passString = password.toString();
    let flag2 = false;
    let flag = false;
    let past_value = undefined;

    for (let i = 0; i < passString.length; i++) {
        let x = passString[i];
        if (past_value === undefined) {
            past_value = x;
            continue;
        }
        if (past_value > x) {
            return false;
        }
        if (past_value === x) {
            if (!flag2) {
                if (i !== passString.length - 1 && passString[i + 1] === x) {
                    flag2 = true;
                } else {
                    flag = true;
                }
            }
        } else {
            flag2 = false;
        }
        past_value = x;
    }
    return flag;
}

export function solution() {
    let input = fs.readFileSync(path.join(__dirname, "../../resources/2019/day4.resource"), "utf-8");
    return [
        `Part1: ${part1(input)} `, 
        ` Part2: ${part2(input)}`
    ];
}
