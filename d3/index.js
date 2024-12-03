const example = ['xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))'];
const example2 = ['xmul(2,4)&mul[3,7]!^don\'t()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))'];

const file = Bun.file('./d3/input.txt');
const input = await file.text();

function part1(input) {
	const pattern = /mul\(\d{1,3},\d{1,3}\)/gm;
	let tot = 0;
	for (const line of input) {
		const matches = line.match(pattern);
		if (matches) {
			for (const match of matches) {
				tot+= match.replace(/[^0-9,]/g, '').split(',').map(Number).reduce((prev, curr) => prev * curr, 1);
			}
		}
	}

	return tot;
}

function part2(input) {
	let total = 0;
	let nextState = true;
	for (const line of input) {
		const doMatches = line.matchAll(/do\(\)/g);
		const dosAndDonts = [[0, 0, nextState]];
		for (const match of doMatches) {
			const end = match.index + match[0].length;
			dosAndDonts.push([match.index, end, true]);
		}

		const dontMatches = line.matchAll(/don't\(\)/g);
		for (const match of dontMatches) {
			const end = match.index + match[0].length;
			dosAndDonts.push([match.index, end, false]);
		}

		dosAndDonts.sort((a, b) => a[0] - b[0]);

		for (let i = 0; i < dosAndDonts.length; i++) {
			const segment = dosAndDonts[i];
			if (segment[2]) {
				const slice = i === dosAndDonts.length - 1 ? line.substring(segment[1]) : line.substring(segment[1], dosAndDonts[i + 1][0]);
				const subtotal = part1([slice]);
				total += subtotal;
			}
		}
		nextState = dosAndDonts[dosAndDonts.length - 1][2];
	}
	console.log(total);
}

console.log(part1(example));
console.log(part1(input.split('\n')));

part2(example2);
part2(input.split('\n'));