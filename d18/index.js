const example =
  `5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0`;

const input = await Bun.file('./d18/input.txt').text();

const parse = raw => raw.split('\n').map(x => x.split(',').map(Number).reverse());
const key = p => `${p[0]},${p[1]}`;

const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];


const bfs = (grid, start, end) => {
  const frontier = [start];
  const cameFrom = new Map();
  cameFrom.set(key(start), null);

  while (frontier.length) {
    const current = frontier.shift();

    if (current[0] === end[0] && current[1] === end[1]) break;

    const neighbours = dirs.map(d => [current[0] + d[0], current[1] + d[1]])
      .filter(n =>
        n[0] >= 0 &&
        n[0] < grid.length &&
        n[1] >= 0 &&
        n[1] < grid[0].length &&
        grid[n[0]][n[1]] === '.'
      );

    for (const n of neighbours) {
      const k = key(n);
      if(!cameFrom.has(k)) {
        frontier.push(n);
        cameFrom.set(k, current);
      }
    }
  }
  if(!cameFrom.has(key(end))) return [];
  const path = [];
  let current = end;
  while(current && current.join(',') !== start.join(',')) {
    path.push(current);
    current = cameFrom.get(key(current));
  }
  path.push(start);
  return path.reverse();
};

function part1(bytes, gridSize, byteCount) {
  const grid = Array(gridSize).fill().map(() => Array(gridSize).fill('.'));

  for (let i = 0; i < byteCount; i++) {
    const byte = bytes[i];
    grid[byte[0]][byte[1]] = '#';
  }

  const path = bfs(grid, [0, 0], [gridSize - 1, gridSize - 1]);
  console.log(path.length - 1);

}

function part2(bytes, gridSize, byteCount) {
  const grid = Array(gridSize).fill().map(() => Array(gridSize).fill('.'));

  for (let i = 0; i < byteCount; i++) {
    const byte = bytes[i];
    grid[byte[0]][byte[1]] = '#';
  }

  for(let i = byteCount; i < bytes.length; i++) {
    const byte = bytes[i];
    grid[byte[0]][byte[1]] = '#';
    const path = bfs(grid, [0, 0], [gridSize - 1, gridSize - 1]);
    if (!path.length) {
      console.log(`${byte[1]},${byte[0]}`);
      break;
    }
  }

}

part1(parse(example), 7, 12);
part1(parse(input), 71, 1024);

part2(parse(example), 7, 12);
part2(parse(input), 71, 1024);
