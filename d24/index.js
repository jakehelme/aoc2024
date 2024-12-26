const example =
  `x00: 1
x01: 0
x02: 1
x03: 1
x04: 0
y00: 1
y01: 1
y02: 1
y03: 1
y04: 1

ntg XOR fgs -> mjb
y02 OR x01 -> tnw
kwq OR kpj -> z05
x00 OR x03 -> fst
tgd XOR rvg -> z01
vdt OR tnw -> bfw
bfw AND frj -> z10
ffh OR nrd -> bqk
y00 AND y03 -> djm
y03 OR y00 -> psh
bqk OR frj -> z08
tnw OR fst -> frj
gnj AND tgd -> z11
bfw XOR mjb -> z00
x03 OR x00 -> vdt
gnj AND wpb -> z02
x04 AND y00 -> kjc
djm OR pbm -> qhw
nrd AND vdt -> hwm
kjc AND fst -> rvg
y04 OR y02 -> fgs
y01 AND x02 -> pbm
ntg OR kjc -> kwq
psh XOR fgs -> tgd
qhw XOR tgd -> z09
pbm OR djm -> kpj
x03 XOR y03 -> ffh
x00 XOR y04 -> ntg
bfw OR bqk -> z06
nrd XOR fgs -> wpb
frj XOR qhw -> z04
bqk OR frj -> z07
y03 OR x01 -> nrd
hwm AND bqk -> z03
tgd XOR rvg -> z12
tnw OR pbm -> gnj`;

const input = await Bun.file('./d24/input.txt').text();

const parse = raw => raw.split('\n\n').map((b, i) => {
  if (!i) return b.split('\n').reduce((map, c) => {
    const [wire, value] = c.split(': ');
    map.set(wire, +value);
    return map;
  }, new Map());
  else return b.split('\n').map(c => {
    const words = c.match(/\w+/g);
    return { a: words[0], b: words[2], out: words[3], op: words[1] }
  });
});

const process = (gate, wires) => {
  switch (gate.op) {
    case 'AND':
      return wires.get(gate.a) & wires.get(gate.b);
    case 'OR':
      return wires.get(gate.a) | wires.get(gate.b);
    case 'XOR':
      return wires.get(gate.a) ^ wires.get(gate.b);
    default:
      throw new Error('noit');
  }
};

function run(wires, gates) {
  let settled = false;
  while (!settled) {
    settled = true;
    for (const gate of gates) {
      if (!wires.has(gate.out) && wires.has(gate.a) && wires.has(gate.b)) {
        wires.set(gate.out, process(gate, wires));
        settled = false;
      }
    }
  }

  const zs = [...wires.keys()].filter(k => /^z/.test(k)).sort().reverse();
  const bin = zs.reduce((str, z) => str + wires.get(z), '');
  return bin;
}

function part1([wires, gates]) {
  const result = run(wires, gates);
  console.log(parseInt(result, 2));
}

const numToString = num => num < 10 ? `0${num}` : `${num}`;
const findAdderInputGate = (gate, bitNum, op) =>
  (gate.a === `x${numToString(bitNum)}` || gate.b === `x${numToString(bitNum)}`) &&
  (gate.a === `y${numToString(bitNum)}` || gate.b === `y${numToString(bitNum)}`) &&
  gate.op === op;

const findGateByInputs = (gate, in1, in2, op) =>
  (gate.a === in1 || gate.b === in1) &&
  (gate.a === in2 || gate.b === in2) &&
  gate.op === op;

const findGateBySingleInput = (gate, input, op) => (gate.a === input || gate.b === input) && gate.op === op;

const findGateByOutputAndType = (gate, out, op) => gate.out === out && gate.op === op;
const findGateByOutput = (gate, out) => gate.out === out;

const getInput = wires => {
  const x = [];
  const y = [];
  for (const [wire, val] of wires) {
    if (/x/.test(wire)) x.push(val);
    else y.push(val);
  }
  x.reverse();
  y.reverse();
  return [parseInt(x.join(''), 2), parseInt(y.join(''), 2)]
}

function part2([wires, gates]) {
  const wrong = new Set();
  const bitWidth = wires.size / 2;
  let COut = gates[gates.findIndex(g => findAdderInputGate(g, 0, 'AND'))].out;
  for (let i = 1; i < bitWidth; i++) {
    //thie will always be found, but could still be incorrect
    const inputXorGateIndex = gates.findIndex(g => findAdderInputGate(g, i, 'XOR'));
    
    let outputGateIndex = gates.findIndex(g => findGateByOutputAndType(g, `z${numToString(i)}`, 'XOR'));
    if (outputGateIndex < 0) {
      wrong.add(`z${numToString(i)}`);
      outputGateIndex = gates.findIndex(g => findGateByInputs(g, gates[inputXorGateIndex].out, COut, 'XOR'));
      if (outputGateIndex < 0) {
        console.log('shit');
      } else {
        wrong.add(gates[outputGateIndex].out);
      }
    }

    if (!(
      (
        gates[outputGateIndex].a === gates[inputXorGateIndex].out ||
        gates[outputGateIndex].b === gates[inputXorGateIndex].out
      ) && (
        gates[outputGateIndex].a === COut ||
        gates[outputGateIndex].b === COut
      )
    )) {
      if (
        gates[outputGateIndex].a === gates[inputXorGateIndex].out ||
        gates[outputGateIndex].b === gates[inputXorGateIndex].out
      ) {
        wrong.add(COut);
      } else if (
        gates[outputGateIndex].a === COut ||
        gates[outputGateIndex].b === COut
      ) {
        wrong.add(gates[inputXorGateIndex].out);
      } else {
        wrong.add(gates[outputGateIndex].out);
      }
    }

    let intraAndGateIndex = gates.findIndex(g => findGateByInputs(g, gates[inputXorGateIndex].out, COut, 'AND'));
    if (intraAndGateIndex < 0) {
      intraAndGateIndex = gates.findIndex(g => findGateBySingleInput(g, gates[inputXorGateIndex].out, 'AND'));
      if (intraAndGateIndex >= 0) {
        wrong.add(COut);
      } else {
        intraAndGateIndex = gates.findIndex(g => findGateBySingleInput(g, COut, 'AND'));
        wrong.add(gates[inputXorGateIndex].out);
      }
    }

    const inputAndGateIndex = gates.findIndex(g => findAdderInputGate(g, i, 'AND'));
    let carryOutGateIndex = gates.findIndex(g => findGateByInputs(g, gates[intraAndGateIndex].out, gates[inputAndGateIndex].out, 'OR'));
    if (carryOutGateIndex < 0) {
      carryOutGateIndex = gates.findIndex(g => findGateBySingleInput(g, gates[intraAndGateIndex].out, 'OR'));
      if (carryOutGateIndex >= 0) {
        wrong.add(gates[inputAndGateIndex].out);
      } else {
        carryOutGateIndex = gates.findIndex(g => findGateBySingleInput(g, gates[inputAndGateIndex].out, 'OR'));
        wrong.add(gates[intraAndGateIndex].out);
      }
    }

    COut = gates[carryOutGateIndex].out;
  }
  console.log([...wrong].sort().join(','));

}


part1(parse(example));
part1(parse(input));

part2(parse(input));