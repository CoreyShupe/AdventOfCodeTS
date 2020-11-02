export enum State {
    RUNNING,
    HALTED,
    AWAITING_INPUT,
}

enum Mode {
    POSITION,
    IMMEDIATE,
    RELATIVE,
}

class Instruction {
    opCode: number;
    modes: Array<Mode>;

    constructor(value: string) {
        this.opCode = this.parseOpCode(value);
        this.modes = [];
        for (let index = 0, i = value.length - 3; i >= 0; i--, index++) {
            if (value[i] === '1') {
                this.modes[index] = Mode.IMMEDIATE;
            } else if (value[i] === '2') {
                this.modes[index] = Mode.RELATIVE;
            } else {
                this.modes[index] = Mode.POSITION;
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

// the state machine, main abstract controller over the ram
export class Machine {
    ram: Ram;

    constructor(input: Array<number>, outputAcceptor: (value: number) => void) {
        this.ram = new Ram(input, outputAcceptor);
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

// an abstraction of the machine which outputs ascii characters
export class AsciiMachine extends Machine {
    constructor(input: Array<number>, outputAcceptor: (value: string) => void) {
        super(input, (value: number) => outputAcceptor(String.fromCharCode(value)))
    }
}

export class Ram {
    state: State;
    private instructionSet: Array<number>;
    private pointer: number;
    private inputAcceptorFunction: (input: number) => void;
    private relativeOffset: number;
    private stdout: (value: number) => void;

    constructor(instructionSet: Array<number>, stdout: (value: number) => void) {
        this.state = State.RUNNING;
        this.instructionSet = Object.assign([], instructionSet);
        this.pointer = 0;
        this.inputAcceptorFunction = _ => {};
        this.relativeOffset = 0;
        this.stdout = stdout;
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

    getRamValue(index: number): number {
        return index >= this.instructionSet.length ? 0 : this.instructionSet[index];
    }

    private getPositionalArgument(index: number, modes: Array<Mode>): number {
        return modes[index - 1] === Mode.RELATIVE ? (this.getRamValue(this.pointer + index) + this.relativeOffset) : this.getRamValue(this.pointer + index);
    }

    private indexOf(index: number, modes: Array<Mode>): number {
        return this.getValue(modes[index - 1], this.getRamValue(this.pointer + index));
    }

    private getValue(mode: any, value: number): number {
        switch (mode) {
            case Mode.POSITION: {
                return this.getRamValue(value);
            }

            case Mode.IMMEDIATE: {
                return value;
            }

            case Mode.RELATIVE: {
                return this.getRamValue(this.relativeOffset + value);
            }

            default: {
                return this.getRamValue(value);
            }
        }
    }

    private incrementInstructionPointer(count: number) {
        this.pointer += count;
    }

    private OP_CODES = {
        1: (modes: Array<Mode>) => {
            const left = this.indexOf(1, modes);
            const right = this.indexOf(2, modes);
            const position = this.getPositionalArgument(3, modes);
            this.instructionSet[position] = left + right;
            this.incrementInstructionPointer(4);
        },
        2: (modes: Array<Mode>) => {
            const left = this.indexOf(1, modes);
            const right = this.indexOf(2, modes);
            const position = this.getPositionalArgument(3, modes);
            this.instructionSet[position] = left * right;
            this.incrementInstructionPointer(4);
        },
        3: (modes: Array<Mode>) => {
            const position = this.getPositionalArgument(1, modes);
            this.inputAcceptorFunction = (input: number) => {
                this.instructionSet[position] = input;
                this.incrementInstructionPointer(2);
                this.state = State.RUNNING;
            };
            this.state = State.AWAITING_INPUT;
        },
        4: (modes: Array<Mode>) => {
            const output = this.indexOf(1, modes);
            this.stdout(output);
            this.incrementInstructionPointer(2);
        },
        5: (modes: Array<Mode>) => {
            const val1 = this.indexOf(1, modes);
            const val2 = this.indexOf(2, modes);
            if (val1 !== 0) {
                this.pointer = val2;
            } else {
                this.incrementInstructionPointer(3);
            }
        },
        6: (modes: Array<Mode>) => {
            const val1 = this.indexOf(1, modes);
            const val2 = this.indexOf(2, modes);
            if (val1 === 0) {
                this.pointer = val2;
            } else {
                this.incrementInstructionPointer(3);
            }
        },
        7: (modes: Array<Mode>) => {
            const val1 = this.indexOf(1, modes);
            const val2 = this.indexOf(2, modes);
            const position = this.getPositionalArgument(3, modes);
            if (val1 < val2) {
                this.instructionSet[position] = 1;
            } else {
                this.instructionSet[position] = 0;
            }
            this.incrementInstructionPointer(4);
        },
        8: (modes: Array<Mode>) => {
            const val1 = this.indexOf(1, modes);
            const val2 = this.indexOf(2, modes);
            const position = this.getPositionalArgument(3, modes);
            if (val1 === val2) {
                this.instructionSet[position] = 1;
            } else {
                this.instructionSet[position] = 0;
            }
            this.incrementInstructionPointer(4);
        },
        9: (modes: Array<Mode>) => {
            const value = this.indexOf(1, modes);
            this.relativeOffset += value;
            this.incrementInstructionPointer(2);
        },
        99: (_) => {
            this.state = State.HALTED;
        },
    };
}