const example =
	`029A
980A
179A
456A
379A`;

const input =
	`149A
582A
540A
246A
805A`;

const keypadPos = {
	1: [2, 0],
	2: [2, 1],
	3: [2, 2],
	4: [1, 0],
	5: [1, 1],
	6: [1, 2],
	7: [0, 0],
	8: [0, 1],
	9: [0, 2],
	0: [3, 1],
	'A': [3, 2]
};

const dpadPos = {
	'>': [1, 2],
	'v': [1, 1],
	'<': [1, 0],
	'^': [0, 1],
	'A': [0, 2]
};

const parse = raw => raw.split('\n').map(x => x.split(''));

const repeatPushes = (key, pushes) => Array(Math.abs(pushes)).fill(key).join('');

const combinations = arr => arr.flatMap((a, i) => arr.slice(i + 1).map(b => a + b));

const getNumpadMoves = (to, from) => {
	let moves = '';
	const toPos = keypadPos[to];
	const fromPos = keypadPos[from];
	const yDiff = fromPos[0] - toPos[0];
	const xDiff = fromPos[1] - toPos[1];
	if (!(yDiff === 0 && xDiff === 0)) {
		xDiff > 0 ? moves += repeatPushes('<', xDiff) : moves += repeatPushes('>', xDiff);
		yDiff > 0 ? moves += repeatPushes('^', yDiff) : moves += repeatPushes('v', yDiff);
	}
	const moveSet = [moves];
	if (yDiff && xDiff) moveSet.push(moves.split('').reverse().join(''));
	return moveSet.filter(m => doesNotGoOverDeadZone(m, fromPos, [3, 0]));
};

const getDpadMoves = (to, from) => {
	let moves = '';
	const toPos = dpadPos[to];
	const fromPos = dpadPos[from];
	const yDiff = fromPos[0] - toPos[0];
	const xDiff = fromPos[1] - toPos[1];
	if (!(yDiff === 0 && xDiff === 0)) {
		xDiff > 0 ? moves += repeatPushes('<', xDiff) : moves += repeatPushes('>', xDiff);
		yDiff > 0 ? moves += repeatPushes('^', yDiff) : moves += repeatPushes('v', yDiff);
	}
	const moveSet = [moves];
	if (yDiff && xDiff) moveSet.push(moves.split('').reverse().join(''));
	return moveSet.filter(m => doesNotGoOverDeadZone(m, fromPos, [0, 0]));
};

const doesNotGoOverDeadZone = (m, start, deadZone) => {
	const currP = [...start];
	for (const d of m) {
		switch (d) {
			case '>':
				currP[1] += 1;
				break;
			case 'v':
				currP[0] += 1;
				break;
			case '<':
				currP[1] -= 1;
				break;
			case '^':
				currP[0] -= 1;
				break;
		}
		if (currP[0] === deadZone[0] && currP[1] === deadZone[1]) return false;
	}
	return true;
}

const numpadMap = () => {
	const keys = '0123456789A';
	const map = {};
	for (const from of keys) {
		map[from] = {};
		for (const to of keys) {
			map[from][to] = getNumpadMoves(to, from);
		}
	}
	return map;
};

const dpadMap = () => {
	const keys = '<v>^A';
	const map = {};
	for (const from of keys) {
		map[from] = {};
		for (const to of keys) {
			map[from][to] = getDpadMoves(to, from);
		}
	}
	return map;
};

const buildDpadSequence = (keys, index, prevKey, currPath, result) => {
	if (index === keys.length) {
		result.push(currPath);
		return;
	}
	for (const path of dMap[prevKey][keys[index]]) {
		buildDpadSequence(keys, index + 1, keys[index], currPath + path + 'A', result);
	}
};

const buildKeypadSequence = (keys, index, prevKey, currPath, result) => {
	if (index === keys.length) {
		result.push(currPath);
		return;
	}
	for (const path of numMap[prevKey][keys[index]]) {
		buildKeypadSequence(keys, index + 1, keys[index], currPath + path + 'A', result);
	}
};

const shortestSequence = (keys, depth, cache) => {
	let total = 0;
	if (depth === 0) return keys.length;
	const cacheKey = `${keys},${depth}`;
	if (cache[cacheKey]) return cache[cacheKey];
	const subKeys = keys.match(/.*?A/g);
	for (const subKey of subKeys) {
		const sequences = [];
		buildDpadSequence(subKey, 0, 'A', '', sequences);
		let min = Infinity;
		for (const seq of sequences) {
			min = Math.min(min, shortestSequence(seq, depth - 1, cache));
		}
		total += min;
	}
	cache[cacheKey] = total;
	return total;
};

function solve(codes, maxDepth) {
	let total = 0;
	for (const code of codes) {
		const cache = {};
		const numpadSequences = [];
		buildKeypadSequence(code, 0, 'A', '', numpadSequences);
		let min = Infinity;
		for (const seq of numpadSequences) {
			min = Math.min(min, shortestSequence(seq, maxDepth, cache));
		}
		total += min * +(code.join('').match(/\d+/));
	}
	console.log(total);
}

const numMap = numpadMap();
const dMap = dpadMap();

solve(parse(example), 2);
solve(parse(input), 2);

solve(parse(input), 25);



