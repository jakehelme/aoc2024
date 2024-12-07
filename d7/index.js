const example =
  `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`;

const file = Bun.file('./d7/input.txt');
const input = await file.text();

const parse = raw => raw.split('\n').map(x => x.split(/:?\s/g).map(Number));

function part1(input) {
  let total = 0;
  for (const equation of input) {
    const answer = equation[0];
    const operands = equation.slice(1);
    const permutations = Math.pow(2, operands.length - 1);

    for (let i = 0; i < permutations; i++) {
      const bin = i.toString(2).padStart(operands.length - 1, '0');
      let subtotal = bin[0] === '0' ? operands[0] + operands[1] : operands[0] * operands[1];
      for (let i = 1; i < operands.length - 1; i++) {
        if (bin[i] === '0') subtotal += operands[i + 1];
        else subtotal *= operands[i + 1];
      }
      if (subtotal === answer) {
        total += answer;
        break;
      }
    }
  }
  console.log(total);
}

function part2(input) {
  let total = 0;
  for (const equation of input) {
    const answer = equation[0];
    const operands = equation.slice(1);
    const permutations = Math.pow(3, operands.length - 1);

    for (let i = 0; i < permutations; i++) {
      const bin = i.toString(3).padStart(operands.length - 1, '0');
      let subtotal = bin[0] === '0' ?
        operands[0] + operands[1] :
        bin[0] === '1' ? operands[0] * operands[1] :
          Number(`${operands[0]}${operands[1]}`);
      for (let i = 1; i < operands.length - 1; i++) {
        if (bin[i] === '0') subtotal += operands[i + 1];
        else if(bin[i] === '1') subtotal *= operands[i + 1];
        else subtotal = Number(`${subtotal}${operands[i + 1]}`);
      }
      if (subtotal === answer) {
        total += answer;
        break;
      }
    }
  }
  console.log(total);
}

part1(parse(example));
part1(parse(input));

part2(parse(example));
part2(parse(input));