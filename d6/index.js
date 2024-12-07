const example =
	`....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;

const file = Bun.file('./d6/input.txt');
const input = await file.text();

const rightMap = {
	'0,1': [1, 0],
	'1,0': [0, -1],
	'0,-1': [-1, 0],
	'-1,0': [0, 1]
}

const parse = raw => raw.split('\n').map(x => x.split(''));

const serialize = (pos, dir) => `${pos[0]},${pos[1]},${dir[0]},${dir[1]}`;

const getStartAndRemove = grid => {
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[0].length; j++) {
			if (grid[i][j] === '^') {
				grid[i][j] = '.';
				return [i, j];
			}
		}
	}
}

const printProgress = (grid, visited) => {
	console.clear();
	const p = grid.map(x => x.slice());
	visited.forEach(x => {
		const pos = x.split(',').map(Number);
		p[pos[0]][pos[1]] = '█';
	});
	p.forEach(x => console.log(x.join('')));
	prompt('Press enter to continue');
}

function part1(grid) {
	let pos = getStartAndRemove(grid);
	let dir = [-1, 0];
	const visited = new Set();
	visited.add(`${pos[0]},${pos[1]}`);

	while (true) {

		const nextPos = [pos[0] + dir[0], pos[1] + dir[1]];
		if (
			nextPos[0] < 0 ||
			nextPos[0] >= grid.length ||
			nextPos[1] < 0 ||
			nextPos[1] >= grid[0].length
		) break;

		let nextSpace = grid[nextPos[0]][nextPos[1]];
		if (nextSpace !== '.') {
			dir = rightMap[`${dir[0]},${dir[1]}`];
			// printProgress(grid, visited);
		} else {
			pos = nextPos;
			visited.add(`${pos[0]},${pos[1]}`);
		}
	}
	console.log(visited.size);
}

function part2(grid) {

	let loopers = 0;

	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[0].length; x++) {
			// if (y === 6 && x === 3) {
			// 	console.log();
			// }
			
			if (grid[y][x] === '.') {
				const testGrid = grid.map(x => x.slice());
				testGrid[y][x] = '#';
				let pos = getStartAndRemove(testGrid);
				let dir = [-1, 0];
				const visited = new Set();
				visited.add(serialize(pos, dir));

				while (true) {
					const nextPos = [pos[0] + dir[0], pos[1] + dir[1]];
					if (
						nextPos[0] < 0 ||
						nextPos[0] >= testGrid.length ||
						nextPos[1] < 0 ||
						nextPos[1] >= testGrid[0].length
					) break;

					let nextSpace = testGrid[nextPos[0]][nextPos[1]];
					if (nextSpace !== '.') {
						dir = rightMap[`${dir[0]},${dir[1]}`];
						// printProgress(grid, visited);
					} else {
						pos = nextPos;
						const key = serialize(pos, dir);
						if (visited.has(key)) {
							loopers++;
							break;
						}
						visited.add(key);
					}
				}
			}
		}
	}


	console.log(loopers);
}

part1(parse(example));
part1(parse(input));

part2(parse(example));
part2(parse(input));