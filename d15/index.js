const smallExample =
	`########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<`;

const largeExample =
	`##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`;

const smallExample2 =
	`#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######

<vv<<^^<<^^`;

const dir = {
	'>': [0, 1],
	'v': [1, 0],
	'<': [0, -1],
	'^': [-1, 0]
}

const wall = '#', box = 'O', robot = '@', freeSpace = '.', bigBox = ['[', ']'];

const input = await Bun.file('./d15/input.txt').text();

const parse = raw => raw.split('\n\n').map((section, i) => {
	if (!i) return section.split('\n').map(row => row.split(''));
	else return section.replaceAll('\n', '').split('');
});

const key = p => `${p[0]},${p[1]}`;

function part1([grid, moves]) {
	let pos = [];
	outer: for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[0].length; x++) {
			if (grid[y][x] === robot) {
				pos = [y, x];
				break outer;
			}
		}
	}

	for (const move of moves) {
		const next = [pos[0] + dir[move][0], pos[1] + dir[move][1]];
		if (
			next[0] < 0 ||
			next[0] >= grid.length ||
			next[1] < 0 ||
			next[1] >= grid.length ||
			grid[next[0]][next[1]] === wall
		) continue;
		else if (grid[next[0]][next[1]] === freeSpace) {
			grid[next[0]][next[1]] = robot;
			grid[pos[0]][pos[1]] = freeSpace;
			pos = next;
			continue;
		} else {
			for (let i = 1; true; i++) {
				const test = [next[0] + i * dir[move][0], next[1] + i * dir[move][1]];
				if (
					test[0] < 0 ||
					test[0] >= grid.length ||
					test[1] < 0 ||
					test[1] >= grid.length ||
					grid[test[0]][test[1]] === wall
				) break;
				else if (grid[test[0]][test[1]] === freeSpace) {
					grid[test[0]][test[1]] = box;
					grid[next[0]][next[1]] = robot;
					grid[pos[0]][pos[1]] = freeSpace;
					pos = next;
					break;
				}
			}
		}
	}

	const total = grid.reduce((tot, row, y) =>
		tot + row.reduce((sub, cell, x) =>
			cell === box ? sub + 100 * y + x : sub, 0), 0);
	console.log(total);

}

function part2([oldGrid, moves]) {
	const grid = [];
	for (let y = 0; y < oldGrid.length; y++) {
		grid.push([]);
		for (let x = 0; x < oldGrid[0].length; x++) {
			if (oldGrid[y][x] === robot) grid[y].push(robot, freeSpace);
			else if (oldGrid[y][x] === box) grid[y].push(...bigBox);
			else grid[y].push(oldGrid[y][x], oldGrid[y][x]);
		}
	}
	let pos = [];
	outer: for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[0].length; x++) {
			if (grid[y][x] === robot) {
				pos = [y, x];
				break outer;
			}
		}
	}

	for (const move of moves) {
		const next = [pos[0] + dir[move][0], pos[1] + dir[move][1]];
		if (
			next[0] < 0 ||
			next[0] >= grid.length ||
			next[1] < 0 ||
			next[1] >= grid[0].length ||
			grid[next[0]][next[1]] === wall
		) continue;
		else if (grid[next[0]][next[1]] === freeSpace) {
			grid[next[0]][next[1]] = robot;
			grid[pos[0]][pos[1]] = freeSpace;
			pos = next;
			continue;
		} else {
			if ('<>'.includes(move)) {
				for (let i = 1; true; i++) {
					const test = [next[0] + i * dir[move][0], next[1] + i * dir[move][1]];
					if (
						test[0] < 0 ||
						test[0] >= grid.length ||
						test[1] < 0 ||
						test[1] >= grid[0].length ||
						grid[test[0]][test[1]] === wall
					) break;
					else if (grid[test[0]][test[1]] === freeSpace) {
						for (let j = 0; j < i; j++) {
							if (j % 2) grid[test[0]][test[1] - j * dir[move][1]] = move === '>' ? '[' : ']';
							else grid[test[0]][test[1] - j * dir[move][1]] = move === '>' ? ']' : '[';
						}
						grid[next[0]][next[1]] = robot;
						grid[pos[0]][pos[1]] = freeSpace;
						pos = next;
						break;
					}
				}
			} else {
				const frontier = [next];
				const visited = new Set();
				visited.add(key(next));
				while (frontier.length) {
					const current = frontier.shift();
					const neighbours = [];
					if (grid[current[0]][current[1]] === bigBox[0]) {
						neighbours.push([current[0], current[1] + 1]);
					} else {
						neighbours.push([current[0], current[1] - 1]);
					}
					const nextRowPos = [current[0] + dir[move][0], current[1]];
					const nextChar = grid[nextRowPos[0]][nextRowPos[1]];
					if (nextChar === bigBox[0] || nextChar === bigBox[1]) {
						neighbours.push(nextRowPos);
					} else if (nextChar === wall) {
						visited.clear();
						break;
					}
					for (const n of neighbours) {
						if (!visited.has(key(n))) {
							frontier.push(n);
							visited.add(key(n));
						}
					}
				}
				if (visited.size) {
					if (move === '^') {
						const boxes = [...visited].map(x => x.split(',').map(Number)).sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]);
						for (const b of boxes) {
							grid[b[0] - 1][b[1]] = grid[b[0]][b[1]];
							grid[b[0]][b[1]] = freeSpace;
						}
						grid[next[0]][next[1]] = robot;
						grid[pos[0]][pos[1]] = freeSpace;
						pos = next;
					} else {
						const boxes = [...visited].map(x => x.split(',').map(Number)).sort((a, b) => a[0] === b[0] ? a[1] - b[1] : b[0] - a[0]);
						for (const b of boxes) {
							grid[b[0] + 1][b[1]] = grid[b[0]][b[1]];
							grid[b[0]][b[1]] = freeSpace;
						}
						grid[next[0]][next[1]] = robot;
						grid[pos[0]][pos[1]] = freeSpace;
						pos = next;
					}
				}
			}
		}
	}

	const total = grid.reduce((tot, row, y) =>
		tot + row.reduce((sub, cell, x) =>
			cell === bigBox[0] ? sub + 100 * y + x : sub, 0), 0);
	console.log(total);

}

part1(parse(smallExample));
part1(parse(largeExample));
part1(parse(input));

part2(parse(largeExample));
part2(parse(input));