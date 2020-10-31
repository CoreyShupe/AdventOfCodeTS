import * as fs from 'fs';
import * as path from "path";

class Orbit {
    private orbitDict = {};
    private countedOrbitals;
    orbitCountDict: Record<string, Array<string>> = {};

    constructor(input: string) {
        this.generateOrbitDict(input.split("\n"));
        this.generateOrbit();
    }

    generateOrbitDict(stringArr: Array<string>) {
        stringArr.forEach((string) => {
            let split = string.split(")");
            if (this.orbitDict[split[0]] === undefined) {
                this.orbitDict[split[0]] = [];
            }
            this.orbitDict[split[0]].push(split[1]);
        });
    }

    generateOrbit() {
        this.countedOrbitals = [];
        let counter = 0;
        this.countedOrbitals.push("COM");
        this.orbitCountDict["COM"] = [];
    
        let added = true;
        while (added) {
            added = false;
            let length = this.countedOrbitals.length;
            for(; counter < length; counter++) {
                let v = this.countedOrbitals[counter];
                let orbits = this.orbitDict[v];
                let nextArr = Object.assign([], this.orbitCountDict[v]);
                nextArr.push(v);
                for (let index in orbits) {
                    let z = orbits[index];
                    this.orbitCountDict[z] = nextArr;
                    this.countedOrbitals.push(z);
                    added = true;
                }
            }
        }
    }
}

function part1(input: string): number {
    let orbit = new Orbit(input);
    let sum = 0;
    for (let k in orbit.orbitCountDict) {
        sum += orbit.orbitCountDict[k].length;
    }
    return sum;
}

function part2(input: string) {
    let orbit = new Orbit(input);
    let arr1: Array<string> = orbit.orbitCountDict["YOU"];
    let arr2: Array<string> = orbit.orbitCountDict["SAN"];

    let steps = 1;
    let sanIndex;

    for (let index = arr1.length - 1; index >= 0; index--, steps++) {
        let value = arr1[index];
        if (arr2.indexOf(value) != -1) {
            sanIndex = arr2.length - arr2.indexOf(value);
            break;
        }
    }

    return steps + sanIndex - 2;
}

export function solution() {
    let input = fs.readFileSync(path.join(__dirname, "../../resources/2019/day6.resource"), "utf-8");
    return [
        `Part1: ${part1(input)} `, 
        ` Part2: ${part2(input)}`
    ];
}