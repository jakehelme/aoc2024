const example =	'MMMSXXMASM\nMSAMXMSMSA\nAMXSXMAAMM\nMSAMASMSMX\nXMASAMXAMM\nXXAMMXXAMA\nSMSMSASXSS\nSAXAMASAAA\nMAMMMXMMMM\nMXMXAXMASX';

const file = Bun.file('./d4/input.txt');
const input = await file.text();

const parse = input => input.split('\n').map(x => x.split(''));

const directions = [
	[0, 1], //right
	[1, 1], //downright
	[1, 0], //down
	[1, -1], //downleft
	[0, -1], //left
	[-1, -1], //upleft
	[-1, 0], //up
	[-1, 1] //upright
];

function part1(input) {
	let total = 0;
	for (let y = 0; y < input.length; y++) {
		for (let x = 0; x < input[0].length; x++) {
			if (input[y][x] === 'X') {
				for (const dir of directions) {
					const endIndex = [y + 3 * dir[0], x + 3 * dir[1]];
					if (
						endIndex[0] >= 0 &&
						endIndex[0] < input.length &&
						endIndex[1] >= 0 &&
						endIndex[1] < input[0].length &&
						input[y + dir[0]][x + dir[1]] === 'M' &&
						input[y + 2 * dir[0]][x + 2 * dir[1]] === 'A' &&
						input[y + 3 * dir[0]][x + 3 * dir[1]] === 'S'
					) {
						total++;
					}
				}
			}
		}
	}
	console.log(total);
}

function part2(input) {
	let total = 0;
	for (let y = 1; y < input.length - 1; y++) {
		for (let x = 1; x < input[0].length - 1; x++) {
			if (input[y][x] === 'A') {
				if (
					(input[y - 1][x - 1] === 'M' && input[y + 1][x + 1] === 'S' || input[y - 1][x - 1] === 'S' && input[y + 1][x + 1] === 'M') &&
					(input[y - 1][x + 1] === 'M' && input[y + 1][x - 1] === 'S' || input[y - 1][x + 1] === 'S' && input[y + 1][x - 1] === 'M')
				)
					total++;
			}
		}
	}
	console.log(total);
}

part1(parse(example));
part1(parse(input));

part2(parse(example));
part2(parse(input));