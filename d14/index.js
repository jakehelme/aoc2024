const example =
	`p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`;

const file = Bun.file('./d14/input.txt');
const input = await file.text();

const parse = raw => raw.split('\n').map(x => x.match(/-?\d+,-?\d+/g).map(y => y.split(',').map(Number))).map(z => ({ p: z[0].reverse(), v: z[1].reverse() }));
const print = (robots, size, s) => {
	const grid = [];
	for (let i = 0; i < size[0]; i++) {
		grid[i] = [];
		for (let j = 0; j < size[1]; j++) {
			grid[i][j] = ' ';
		}
	}
	for (const robot of robots) {
		grid[robot.p[0]][robot.p[1]] = '*';
	}
	console.clear();
	grid.forEach(row => console.log(row.join('')));
	// prompt(`${s + 1} seconds`);
	console.log(`${s + 1} seconds`);
};

function run(robots, size, maxSeconds) {
	const seconds = maxSeconds || Infinity;
	for (let s = 0; s < seconds; s++) {
		for (const robot of robots) {
			robot.p[0] = (robot.p[0] + robot.v[0]) % size[0];
			if (robot.p[0] < 0) robot.p[0] += size[0];
			robot.p[1] = (robot.p[1] + robot.v[1]) % size[1];
			if (robot.p[1] < 0) robot.p[1] += size[1];
		}
		// after grid width and length amount of seconds (with offset) weird pattern shows up. 
		//if((s - 13) % size[1] === 0 || (s - 75) % size[0] === 0) print(robots, size, s);
		// gives seconds as 7286 🎄
		if (s === 7285) {
			print(robots, size, s);
			return;
		}
	}
	const ySplit = Math.floor(size[0] / 2);
	const xSplit = Math.floor(size[1] / 2);
	let quads = new Array(4).fill(0);
	const inTopHalf = r => r.p[0] < ySplit;
	const inLeftHalf = r => r.p[1] < xSplit;
	for (const robot of robots) {
		if (robot.p[0] === ySplit || robot.p[1] === xSplit) continue;
		if (inTopHalf(robot)) {
			if (inLeftHalf(robot)) quads[0]++;
			else quads[1]++;
		} else {
			if (inLeftHalf(robot)) quads[2]++;
			else quads[3]++;
		}
	}
	const total = quads.reduce((tot, q) => tot * q, 1);
	console.log(total);
}

run(parse(example), [7, 11], 100);
run(parse(input), [103, 101], 100);

run(parse(input), [103, 101], null);
