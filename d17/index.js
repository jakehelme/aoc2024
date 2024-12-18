const example =
  `Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`;

const example2 =
  `Register A: 117440
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`;

const input =
  `Register A: 30899381
Register B: 0
Register C: 0

Program: 2,4,1,1,7,5,4,0,0,3,1,6,5,5,3,0`;

const parse = raw => raw.split('\n\n').map((x, i) => i ? x.match(/\d+/gm).map(Number) : x.match(/\d+/g).map(Number));

const comboOperand = (operand, registers) => {
  if (operand === 7) throw new Error('7 is reserved, shouldn\'t happen');
  else if (operand < 4) return operand;
  else return registers[operand - 4];
};

const runProgram = (registers, program) => {
  const output = [];
  let pointer = 0;
  while (pointer < program.length) {
    switch (program[pointer]) {
      case 0:
        registers[0] = Math.floor(registers[0] / (Math.pow(2, comboOperand(program[pointer + 1], registers))));
        pointer += 2;
        break;
      case 1:
        registers[1] = registers[1] ^ program[pointer + 1];
        pointer += 2;
        break;
      case 2:
        registers[1] = comboOperand(program[pointer + 1], registers) % 8;
        pointer += 2;
        break;
      case 3:
        if (registers[0] === 0) {
          pointer += 2;
          break;
        } else {
          pointer = program[pointer + 1];
          break;
        }
      case 4:
        registers[1] = registers[1] ^ registers[2];
        pointer += 2;
        break;
      case 5:
        output.push(comboOperand(program[pointer + 1], registers) % 8);
        pointer += 2;
        break;
      case 6:
        registers[1] = Math.floor(registers[0] / (Math.pow(2, comboOperand(program[pointer + 1], registers))));
        pointer += 2;
        break;
      case 7:
        registers[2] = Math.floor(registers[0] / (Math.pow(2, comboOperand(program[pointer + 1], registers))));
        pointer += 2;
        break;
    }
  }
  return output;
}

function part1([registers, program]) {
  const output = runProgram(registers, program);
  console.log(output.join(','));
}

const betterProgram = (program, aStart) => {
  if (program.length === 0) return aStart;

  let a = 0n, b = 0n, c = 0n;
  for(let i = 0n; i < 8n; i++) {
    a = (aStart << 3n) + i;
    b = a % 8n;
    b = b ^ 1n;
    c = a >> b;
    b = b ^ c;
    b = b ^ 6n;
    if (b % 8n === BigInt(program[program.length - 1])) {
      const sub = betterProgram(program.slice(0, program.length - 1), a);
      if (!sub) continue;
      return sub;
    }
  }
  return null;
}

function part2([_, program]) {
 const result = betterProgram(program, 0n);
 console.log(result);
}

part1(parse(example2));
part1(parse(input));

part2(parse(input));
