const example =
	`Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`;

const file = Bun.file('./d13/input.txt');
const input = await file.text();

const parse = raw => raw.split('\n\n').map(x => x.split('\n').map(y => y.match(/\d+/g).map(Number))).map(x => ({ A: [x[0][1], x[0][0]], B: [x[1][1], x[1][0]], P: [x[2][1], x[2][0]] }));

const maxPresses = 100;

const offset = 10000000000000;

function part1(machines) {
	let tokens = 0;
	for (const machine of machines) {
		const workingRatios = [];
		const grad = machine.P[0] / machine.P[1];
		for (let a = 0; a <= maxPresses; a++) {
			for (let b = 0; b <= maxPresses; b++) {
				const testGrad = (a * machine.A[0] + b * machine.B[0]) / (a * machine.A[1] + b * machine.B[1]);
				if (grad === testGrad) {
					workingRatios.push([a, b])
				}
			}
		}
		for (const ratio of workingRatios) {
			if (
				ratio[0] * machine.A[0] + ratio[1] * machine.B[0] === machine.P[0] &&
				ratio[0] * machine.A[1] + ratio[1] * machine.B[1] === machine.P[1]
			) {
				tokens += 3 * ratio[0] + ratio[1];
				break;
			}
		}
	}
	console.log(tokens);
}

function part2(machines) {
	let total = 0;
	for (const m of machines) {
		m.P[0] += offset;
		m.P[1] += offset;

		const aPresses = (m.P[1] * m.B[0] - m.P[0] * m.B[1]) / (m.A[1] * m.B[0] - m.A[0] * m.B[1]);
		const bPresses = (m.P[0] * m.A[1] - m.P[1] * m.A[0]) / (m.A[1] * m.B[0] - m.A[0] * m.B[1]);

		if (
			Number.isInteger(aPresses) &&
			Number.isInteger(bPresses) &&
			aPresses * m.A[0] + bPresses * m.B[0] === m.P[0] && 
			aPresses * m.A[1] + bPresses * m.B[1] === m.P[1]
		){
			total += aPresses * 3 + bPresses;
		}
	}
	console.log(total);
}

part1(parse(example));
part1(parse(input));

part2(parse(example));
part2(parse(input));
