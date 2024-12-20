const example =
  `###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`;

const input = await Bun.file('./d20/input.txt').text();

const parse = raw => raw.split('\n').map(x => x.split(''));

const manhattanDist = (p1, p2) => Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);

const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];

const key = p => `${p[0]},${p[1]}`;

const getEnds = grid => {
  const ends = [null, null];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === 'S') {
        ends[0] = [y, x];
        grid[y][x] = '.';
        if(ends[1]) return ends;
      } else if (grid[y][x] === 'E') {
        ends[1] = [y, x];
        grid[y][x] = '.';
        if(ends[0]) return ends;
      }
    }
  }
};

const bfs = (grid, start, end) => {
  const frontier = [start];
  const cameFrom = new Map();
  cameFrom.set(key(start), null);
  while (frontier.length) {
    const current = frontier.shift();
    if (current[0] === end[0] && current[1] === end[1]) break;
    const neighbours = dirs.map(d => [current[0] + d[0], current[1] + d[1]])
      .filter(n => grid[n[0]][n[1]] === '.' || grid[n[0]][n[1]] === 'E');
    for (const n of neighbours) {
      const k = key(n);
      if (!cameFrom.has(k)) {
        frontier.push(n);
        cameFrom.set(k, current);
      }
    }
  }
  if (!cameFrom.has(key(end))) return [];
  const path = [];
  let current = end;
  while (current && current.join(',') !== start.join(',')) {
    path.push(current);
    current = cameFrom.get(key(current));
  }
  path.push(start);
  return path.reverse();
};

function part1(grid) {
  const [start, end] = getEnds(grid);
  const normalPath = bfs(grid, start, end);
  const savingsCount = new Map();
  for (const [i, step] of Object.entries(normalPath)) {
    let potentialShortcuts = dirs.map(d =>
      [
        [step[0] + d[0], step[1] + d[1]],
        [step[0] + 2 * d[0], step[1] + 2 * d[1]]
      ]
    ).filter(n =>
      n[1][0] >= 0 &&
      n[1][0] < grid.length &&
      n[1][1] >= 0 &&
      n[1][1] < grid[0].length &&
      grid[n[0][0]][n[0][1]] === '#' &&
      grid[n[1][0]][n[1][1]] === '.'
    );

    for (const ps of potentialShortcuts) {
      const pathIndex = normalPath.findIndex(p => p[0] === ps[1][0] && p[1] === ps[1][1]);
      if (pathIndex >= 0 && pathIndex > i) {
        const savings = pathIndex - +i - 2;
        if (savingsCount.has(savings)) savingsCount.set(savings, savingsCount.get(savings) + 1);
        else savingsCount.set(savings, 1);
      }
    }
  }
  let cheats = 0;
  for (const [savings, count] of savingsCount) {
    if (savings >= 100) cheats += count;
  }
  console.log(cheats);
}

function part2(grid, threshold) {
  const [start, end] = getEnds(grid);
  const normalPath = bfs(grid, start, end);
  let total = 0;

  for (let i = 0; i < normalPath.length - 1; i++) {
    for (let j = i; j < normalPath.length; j++) {
      const shortcutLength = manhattanDist(normalPath[i], normalPath[j]);
      const pathLength = j - i;
      if (shortcutLength <= 20 && shortcutLength < pathLength) {
        const savings = j - i - manhattanDist(normalPath[i], normalPath[j]);
        if (savings < threshold) continue;
        total++;
      }
    }
  }
  console.log(total);
}

part1(parse(example));
part1(parse(input));

part2(parse(example), 50);
part2(parse(input), 100);
