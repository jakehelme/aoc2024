const example = '3   4\n4   3\n2   5\n1   3\n3   9\n3   3';

const file = Bun.file('./d1/input.txt');
const input = await file.text();

function parse(raw) {
	const left = [];
	const right = [];
	raw.split('\n').forEach(x => {
		const [l, r] = x.split(/\s+/).map(Number);
		left.push(l);
		right.push(r);
	});
	return [left, right];
}

function part1(input) {
	const [left, right] = parse(input);
	left.sort();
	right.sort();
	const totalDiff = left.reduce((tot, curr, i) => Math.abs(curr - right[i]) + tot, 0);
	console.log(totalDiff);
};

function part2(input) {
	const [left, right] = parse(input);
	let total = left.reduce((tot, curr) => right.filter(x => x === curr).length * curr + tot, 0);
	console.log(total);
}

part1(example);
part1(input);

part2(example);
part2(input);