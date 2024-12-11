const example =
  `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;

const file = Bun.file('./d10/input.txt');
const input = await file.text();

const dir = [[0, 1], [1, 0], [0, -1], [-1, 0]];

const parse = raw => raw.split('\n').map(x => x.split('').map(Number));

const getTrailHeads = grid => {
  return grid.reduce((outer, row, i) => {
    const rowHeads = row.reduce((inner, cell, j) => {
      if (!cell) inner.push([i, j]);
      return inner;
    }, []);
    rowHeads.forEach(x => outer.push(x));
    return outer;
  }, []);
};

const key = p => `${p[0]},${p[1]}`;

const dfs = (grid, start, trackVisited) => {
  const frontier = [];
  frontier.push(start);
  const visited = {};
  visited[key(start)] = null;
  const ends = [];
  // let distinctPaths = 0;

  while (frontier.length) {
    const current = frontier.pop();

    if (grid[current[0]][current[1]] === 9) {
      ends.push(current);
      continue;
    }

    const paths = dir
      .map(d => [current[0] + d[0], current[1] + d[1]])
      .filter(x =>
        x[0] >= 0 &&
        x[0] < grid.length &&
        x[1] >= 0 &&
        x[1] < grid[0].length &&
        grid[x[0]][x[1]] === grid[current[0]][current[1]] + 1
      );

    // if (paths.length > 1) distinctPaths += paths.length - 1;
    // else if (!paths.length) distinctPaths -= 1;

    for (const next of paths) {
      if (trackVisited) {
        if (!Object.hasOwn(visited, key(next))) {
          frontier.push(next);
          visited[key(next)] = current;
        }
      } else frontier.push(next);
    }
  }
  return ends.length;

};

function part1(grid) {
  const trailHeads = getTrailHeads(grid);
  let total = 0;
  for (const head of trailHeads) {
    total += dfs(grid, head, true);
  }
  console.log(total);
}

function part2(grid) {
  const trailHeads = getTrailHeads(grid);
  let total = 0;
  for (const head of trailHeads) {
    total += dfs(grid, head, false);
  }
  console.log(total);
}

part1(parse(example));
part1(parse(input));

part2(parse(example));
part2(parse(input));