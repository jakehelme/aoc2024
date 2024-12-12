const example1 =
	`AAAA
BBCD
BBCC
EEEC`;

const example2 =
	`OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`;

const example3 =
	`RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`;

const example4 =
	`EEEEE
EXXXX
EEEEE
EXXXX
EEEEE`;

const example5 =
	`AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA`;

const file = Bun.file('./d12/input.txt');
const input = await file.text();

const dir = [[0, 1], [1, 0], [0, -1], [-1, 0]];
const dirMap = { '0,1': 'R', '1,0': 'D', '0,-1': 'L', '-1,0': 'U' };

const parse = raw => raw.split('\n').map(x => x.split(''));

const getCropTypes = grid => grid.reduce((set, row) => {
	row.forEach(x => set.add(x));
	return set;
}, new Set());

const key = pos => `${pos[0]},${pos[1]}`;

const determinePlot = (grid, cropType, pos) => {
	const frontier = [pos];
	const plot = { [key(pos)]: null };

	while (frontier.length) {
		const current = frontier.shift();

		const neighbours = dir.reduce((n, dir) => {
			const y = current[0] + dir[0];
			const x = current[1] + dir[1];
			if (
				y >= 0 &&
				y < grid.length &&
				x >= 0 &&
				x < grid[0].length &&
				grid[y][x] === cropType
			) {
				n.push([y, x]);
			}
			return n;
		}, []);
		plot[key(current)] = 4 - neighbours.length;
		for (const neighbour of neighbours) {
			if (!Object.hasOwn(plot, key(neighbour))) {
				frontier.push(neighbour);
				plot[key(neighbour)] = null;
			}
		}
	}
	return plot;
}

const determinePlotAndBorders = (grid, cropType, pos) => {
	const frontier = [pos];
	const borders = { [key(pos)]: null };

	while (frontier.length) {
		const current = frontier.shift();
		const neighbours = dir.map(d => [current[0] + d[0], current[1] + d[1]])
		const validNeighbours = [];
		const borderSides = [];
		neighbours.forEach((n, i) => {
			if (
				n[0] >= 0 &&
				n[0] < grid.length &&
				n[1] >= 0 &&
				n[1] < grid[0].length &&
				grid[n[0]][n[1]] === cropType
			) validNeighbours.push(n);
			else borderSides.push(dirMap[key(dir[i])]);
		});

		borders[key(current)] = borderSides;
		for (const neighbour of validNeighbours) {
			if (!Object.hasOwn(borders, key(neighbour))) {
				frontier.push(neighbour);
				borders[key(neighbour)] = null;
			}
		}
	}
	return borders;
}

function part1(grid) {
	let total = 0;
	const cropTypes = getCropTypes(grid);

	for (const cropType of cropTypes) {
		const plots = [];
		const inPlots = [];
		for (let y = 0; y < grid.length; y++) {
			for (let x = 0; x < grid[0].length; x++) {
				if (grid[y][x] === cropType && inPlots.indexOf(key([y, x])) < 0) {
					const plot = determinePlot(grid, cropType, [y, x]);
					plots.push(plot);
					inPlots.push(...Object.keys(plot));
				}
			}
		}
		for (const plot of plots) {
			total += Object.keys(plot).length * Object.values(plot).reduce((tot, curr) => tot + curr, 0);
		}
	}
	console.log(total);

}

function part2(grid) {
	let total = 0;
	const cropTypes = getCropTypes(grid);

	for (const cropType of cropTypes) {
		const plots = [];
		const inPlots = [];
		for (let y = 0; y < grid.length; y++) {
			for (let x = 0; x < grid[0].length; x++) {
				if (grid[y][x] === cropType && inPlots.indexOf(key([y, x])) < 0) {
					const plot = determinePlotAndBorders(grid, cropType, [y, x]);
					plots.push(plot);
					inPlots.push(...Object.keys(plot));
				}
			}
		}
		for (const plot of plots) {
			let subtotal = 0;
			const yRange = Object.keys(plot).map(x => x.split(',')[0]).map(Number).reduce((range, curr) => [Math.min(range[0], curr), Math.max(range[1], curr)], [Infinity, 0]);
			const xRange = Object.keys(plot).map(x => x.split(',')[1]).map(Number).reduce((range, curr) => [Math.min(range[0], curr), Math.max(range[1], curr)], [Infinity, 0]);
			for (const side of 'UD') {
				for (let y = yRange[0]; y <= yRange[1]; y++) {
					let contiguous = false;
					let borders = 0;
					for (let x = xRange[0]; x <= xRange[1]; x++) {
						const k = key([y, x]);
						if (!Object.hasOwn(plot, k) || plot[k].indexOf(side) === -1) contiguous = false;
						else {
							if (!contiguous) borders++;
							contiguous = true;
						}
					}
					subtotal += borders;
				}
			}
			for (const side of 'RL') {
				for (let x = xRange[0]; x <= xRange[1]; x++) {
					let contiguous = false;
					let borders = 0;
					for (let y = yRange[0]; y <= yRange[1]; y++) {
						const k = key([y, x]);
						if (!Object.hasOwn(plot, k) || plot[k].indexOf(side) === -1) contiguous = false;
						else {
							if (!contiguous) borders++;
							contiguous = true;
						}
					}
					subtotal += borders;
				}
			}
			total += subtotal * Object.keys(plot).length;
		}
	}
	console.log(total);
}

part1(parse(example1));
part1(parse(example2));
part1(parse(example3));
part1(parse(input));

part2(parse(example1));
part2(parse(example2));
part2(parse(example4));
part2(parse(example5));
part2(parse(example3));
part2(parse(input));