export class Program {
    ram: Array<number>;
    input: number;
    output: number;
    private pointer: number;

    constructor(input: Array<number>) {
        this.ram = input;
        this.input = 0;
        this.output = 0;
        this.pointer = 0;
    }

    alter(callback: (arr: Array<number>) => void): void {
        callback(this.ram);
    }

    runCode(inputValue: number): void {
        this.input = inputValue;
        this.execute();
    }

    private execute(): void {
        let opCode;
        while (!(opCode = this.ram[this.pointer].toString()).endsWith('99')) {
            let exactOp = parseInt(opCode[opCode.length - 1]);
            let modes: Array<boolean> = [];
            for (let index = 0, i = opCode.length - 3; i >= 0; i--, index++) {
                if (opCode[i] === '1') {
                    modes[index] = true;
                }
            }
            this.executeOpCode(exactOp, modes);
        }
    }

    private executeOpCode(opCode: number, modes: Array<boolean>): void {
        this.OP_CODES[opCode](modes);
    }

    private indexOf(index: number, modes: Array<boolean>): number {
        return this.getValue(modes[index - 1], this.ram[this.pointer + index]);
    }

    private getValue(mode, value: number): number {
        return mode ? value : this.ram[value];
    }

    private incrementPointer(count: number): void {
        this.pointer += count;
    }

    private OP_CODES = {
        1: (modes: Array<boolean>) => {
            let left = this.indexOf(1, modes);
            let right = this.indexOf(2, modes);
            let position = this.ram[this.pointer + 3];
            this.ram[position] = left + right;
            this.incrementPointer(4);
        },
        2: (modes: Array<boolean>) => {
            let left = this.indexOf(1, modes);
            let right = this.indexOf(2, modes);
            let position = this.ram[this.pointer + 3];
            this.ram[position] = left * right;
            this.incrementPointer(4);
        },
        3: (_: Array<boolean>) => {
            let position = this.ram[this.pointer + 1];
            this.ram[position] = this.input;
            this.incrementPointer(2);
        },
        4: (modes: Array<boolean>) => {
            let testOutput = this.indexOf(1, modes);
            if (testOutput != 0) {
                this.output = testOutput;
            }
            this.incrementPointer(2);
        },
        5: (modes: Array<boolean>) => {
            let val1 = this.indexOf(1, modes);
            let val2 = this.indexOf(2, modes);
            if (val1 !== 0) {
                this.pointer = val2;
            } else {
                this.incrementPointer(3);
            }
        },
        6: (modes: Array<boolean>) => {
            let val1 = this.indexOf(1, modes);
            let val2 = this.indexOf(2, modes);
            if (val1 === 0) {
                this.pointer = val2;
            } else {
                this.incrementPointer(3);
            }
        },
        7: (modes: Array<boolean>) => {
            let val1 = this.indexOf(1, modes);
            let val2 = this.indexOf(2, modes);
            let position = this.ram[this.pointer + 3];
            if (val1 < val2) {
                this.ram[position] = 1;
            } else {
                this.ram[position] = 0;
            }
            this.incrementPointer(4);
        },
        8: (modes: Array<boolean>) => {
            let val1 = this.indexOf(1, modes);
            let val2 = this.indexOf(2, modes);
            let position = this.ram[this.pointer + 3];
            if (val1 === val2) {
                this.ram[position] = 1;
            } else {
                this.ram[position] = 0;
            }
            this.incrementPointer(4);
        },
    };
}

export function runElfCode(input: Array<number>, inputValue: number = 0, alterCallback: (arr: Array<number>) => void = () => {}): Program {
    let program = new Program(input);
    program.alter(alterCallback);
    program.runCode(inputValue);
    return program;
}