const example = '125 17';
const input = '0 7 6618216 26481 885 42 202642 8791';

const parse = raw => raw.split(/\s/).map(Number);

function blink(startStones, blinks) {
	let stones = [...startStones];
	for (let i = 0; i < blinks; i++) {
		const next = [];
		for (const stone of stones) {
			const str = stone.toString();
			if (stone === 0) {
				next.push(1);
			} else if (str.length % 2 === 0) {
				next.push(+str.substring(0, str.length / 2));
				next.push(+str.substring(str.length / 2));
			} else {
				next.push(stone * 2024);
			}
		}
		stones = next;
	}
	console.log(stones.length);
}

const insertOrIncrement = (obj, num, count) => {
	if (obj[num]) obj[num] += count;
	else obj[num] = count;
};

function blinkAlot(startStones, blinks) {
	let stones = {};
	startStones.forEach(x => stones[x] = 1);
	for (let i = 0; i < blinks; i++) {
		const newStones = {};
		for (const [numString, count] of Object.entries(stones)) {
			const num = +numString;
			if (num === 0) {
				insertOrIncrement(newStones, 1, count);
			} else if (numString.length % 2 === 0) {
				insertOrIncrement(newStones, +numString.substring(0, numString.length / 2), count);
				insertOrIncrement(newStones, +numString.substring(numString.length / 2), count);
			} else {
				insertOrIncrement(newStones, num * 2024, count);
			}
		}
		stones = newStones;
	}
	console.log(Object.values(stones).reduce((tot, x) => x + tot, 0));
}

blink(parse(example), 25);
blink(parse(input), 25);

blinkAlot(parse(input), 75);