export enum State {
    RUNNING,
    HALTED,
    AWAITING_INPUT,
}

class Instruction {
    opCode: number;
    modes: Array<boolean>;

    constructor(value: string) {
        this.opCode = this.parseOpCode(value);
        this.modes = [];
        for (let index = 0, i = value.length - 3; i >= 0; i--, index++) {
            if (value[i] === '1') {
                this.modes[index] = true;
            }
        }
    }

    private parseOpCode(value: string): number {
        if (value.length > 1) {
            return parseInt(value[value.length - 2] + value[value.length - 1])
        } else {
            return parseInt(value[value.length - 1])
        }
    }
}

export class Machine {
    ram: Ram;

    constructor(input: Array<number>) {
        this.ram = new Ram(input);
    }

    pushInputThenRun(input: number) {
        this.pushInput(input);
        this.run();
    }

    run(): State {
        if (this.ram.state !== State.RUNNING) {
            return;
        }
        while (this.ram.executeInstruction(new Instruction(this.ram.getCurrentInstruction())) === State.RUNNING) {};
        return this.ram.state;
    }

    pushInput(input: number) {
        if (this.ram.state === State.AWAITING_INPUT) {
            this.ram.acceptInput(input);
        }
    }
}

export class Ram {
    state: State;
    instructionSet: Array<number>;
    private pointer: number;
    private inputAcceptorFunction: (input: number) => void;
    currentOutput: number;

    constructor(instructionSet: Array<number>) {
        this.state = State.RUNNING;
        this.instructionSet = Object.assign([], instructionSet);
        this.pointer = 0;
        this.inputAcceptorFunction = _ => {};
    }

    getCurrentInstruction(): string {
        return this.instructionSet[this.pointer].toString();
    }

    executeInstruction(instruction: Instruction): State {
        this.OP_CODES[instruction.opCode](instruction.modes);
        return this.state;
    }

    acceptInput(input: number) {
        this.inputAcceptorFunction(input);
        this.inputAcceptorFunction = _ => {};
    }

    private indexOf(index: number, modes: Array<boolean>): number {
        return this.getValue(modes[index - 1], this.instructionSet[this.pointer + index]);
    }

    private getValue(mode: any, value: number): number {
        return mode ? value : this.instructionSet[value];
    }

    private incrementInstructionPointer(count: number) {
        this.pointer += count;
    }

    private OP_CODES = {
        1: (modes: Array<boolean>) => {
            const left = this.indexOf(1, modes);
            const right = this.indexOf(2, modes);
            const position = this.instructionSet[this.pointer + 3];
            this.instructionSet[position] = left + right;
            this.incrementInstructionPointer(4);
        },
        2: (modes: Array<boolean>) => {
            const left = this.indexOf(1, modes);
            const right = this.indexOf(2, modes);
            const position = this.instructionSet[this.pointer + 3];
            this.instructionSet[position] = left * right;
            this.incrementInstructionPointer(4);
        },
        3: (_: Array<boolean>) => {
            const position = this.instructionSet[this.pointer + 1];
            this.inputAcceptorFunction = (input: number) => {
                this.instructionSet[position] = input;
                this.incrementInstructionPointer(2);
                this.state = State.RUNNING;
            };
            this.state = State.AWAITING_INPUT;
        },
        4: (modes: Array<boolean>) => {
            const testOutput = this.indexOf(1, modes);
            this.currentOutput = testOutput;
            this.incrementInstructionPointer(2);
        },
        5: (modes: Array<boolean>) => {
            const val1 = this.indexOf(1, modes);
            const val2 = this.indexOf(2, modes);
            if (val1 !== 0) {
                this.pointer = val2;
            } else {
                this.incrementInstructionPointer(3);
            }
        },
        6: (modes: Array<boolean>) => {
            const val1 = this.indexOf(1, modes);
            const val2 = this.indexOf(2, modes);
            if (val1 === 0) {
                this.pointer = val2;
            } else {
                this.incrementInstructionPointer(3);
            }
        },
        7: (modes: Array<boolean>) => {
            const val1 = this.indexOf(1, modes);
            const val2 = this.indexOf(2, modes);
            const position = this.instructionSet[this.pointer + 3];
            if (val1 < val2) {
                this.instructionSet[position] = 1;
            } else {
                this.instructionSet[position] = 0;
            }
            this.incrementInstructionPointer(4);
        },
        8: (modes: Array<boolean>) => {
            const val1 = this.indexOf(1, modes);
            const val2 = this.indexOf(2, modes);
            const position = this.instructionSet[this.pointer + 3];
            if (val1 === val2) {
                this.instructionSet[position] = 1;
            } else {
                this.instructionSet[position] = 0;
            }
            this.incrementInstructionPointer(4);
        },
        99: (_) => {
            this.state = State.HALTED;
        },
    };
}