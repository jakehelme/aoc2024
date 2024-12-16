import { Heap } from 'heap-js';

const example =
	`###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`;

const example2 =
	`#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`;

const input = await Bun.file('./d16/input.txt').text();

const parse = raw => raw.split('\n').map(x => x.split(''));

const print = grid => {
	console.clear();
	grid.forEach(x => console.log(x.join('')))
};

const key = p => `${p[0]},${p[1]}`;

const dir = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // E,S,W,N

const dijkstra = (grid, start, end) => {
	const customPriorityComparator = (a, b) => a.score - b.score;
	const frontier = new Heap(customPriorityComparator);
	frontier.push({ p: start, score: 0 });
	const cameFrom = new Map();
	const costSoFar = new Map();
	cameFrom.set(key(start), { from: null, dir: 0 });
	costSoFar.set(key(start), 0);

	while (frontier.size()) {
		const current = frontier.pop();
		let direction = cameFrom.get(key(current.p)).dir;
		if (current.p[0] === end[0] && current.p[1] === end[1]) {
			break;
		}

		const neighbours = [];
		// straight
		if (grid[current.p[0] + dir[direction][0]][current.p[1] + dir[direction][1]] === '.')
			neighbours.push({ p: [current.p[0] + dir[direction][0], current.p[1] + dir[direction][1]], s: 1, dir: direction });
		// right
		let nextDir = (direction + 1) % 4;
		if (grid[current.p[0] + dir[nextDir][0]][current.p[1] + dir[nextDir][1]] === '.')
			neighbours.push({ p: [current.p[0] + dir[nextDir][0], current.p[1] + dir[nextDir][1]], s: 1001, dir: nextDir });
		// left
		nextDir = direction - 1 < 0 ? 3 : direction - 1;
		if (grid[current.p[0] + dir[nextDir][0]][current.p[1] + dir[nextDir][1]] === '.')
			neighbours.push({ p: [current.p[0] + dir[nextDir][0], current.p[1] + dir[nextDir][1]], s: 1001, dir: nextDir });
		// reverse
		// nextDir = (direction + 2) % 4;
		// if (grid[current.p[0] + dir[nextDir][0]][current.p[1] + dir[nextDir][1]] === '.')
		// 	neighbours.push({ p: [current.p[0] + dir[nextDir][0], current.p[1] + dir[nextDir][1]], s: 2001, dir: nextDir });

		for (const next of neighbours) {
			const newCost = costSoFar.get(key(current.p)) + next.s;
			if (!costSoFar.has(key(next.p)) || newCost < costSoFar.get(key(next.p))) {
				costSoFar.set(key(next.p), newCost);
				frontier.add({ p: next.p, score: newCost });
				cameFrom.set(key(next.p), { from: key(current.p), dir: next.dir });
			}
		}
	}
	if (cameFrom.has(key(end))) {
		const path = [key(end)];
		let current = cameFrom.get(key(end));
		while (current.from) {
			path.push(current.from);
			current = cameFrom.get(current.from);
		}
		return [path, costSoFar.get(key(end))];
	}
	return [[], Infinity];

}

const findAndRemoveChar = (grid, char) => {
	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[0].length; x++) {
			if (grid[y][x] === char) {
				grid[y][x] = '.';
				return [y, x];
			}
		}
	}
};

function part1(grid) {
	// print(grid);
	const start = findAndRemoveChar(grid, 'S');
	const end = findAndRemoveChar(grid, 'E');
	// print(grid);
	console.log(dijkstra(grid, start, end)[1]);

}

function part2(grid) {
	const start = findAndRemoveChar(grid, 'S');
	const end = findAndRemoveChar(grid, 'E');
	const nodes = [];
	for (let y = 1; y < grid.length - 1; y++) {
		for (let x = 1; x < grid[0].length - 1; x++) {
			const neighbours = dir.map(d => [y + d[0], x + d[1]]).filter(n => grid[n[0]][n[1]] === '.');
			if (neighbours.length > 2) {
				nodes.push([y, x]);
			}
		}
	}

	const edgeEntrances = new Set();
	for (const node of nodes) {
		const neighbours = dir.map(d => [node[0] + d[0], node[1] + d[1]]).filter(n => grid[n[0]][n[1]] === '.').map(key);
		neighbours.forEach(n => edgeEntrances.add(n));
	}

	const [shortestPath, lowestScore] = dijkstra(grid, start, end);
	const pointsOnShortestPaths = new Set(shortestPath);
	let v = 0
	for (const entrance of edgeEntrances) {
		console.log(++v, edgeEntrances.size);
		
		const [y, x] = entrance.split(',').map(Number);
		grid[y][x] = '#';
		const [newPath, score] = dijkstra(grid, start, end);
		if (score === lowestScore) newPath.forEach(p => pointsOnShortestPaths.add(p));
		grid[y][x] = '.';
	}
	console.log(pointsOnShortestPaths.size);

}

// part1(parse(example));
// part1(parse(example2));
// part1(parse(input));

part2(parse(example));
// part2(parse(example2));
// part2(parse(input));