const example =
  `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`;

const file = Bun.file('./d8/input.txt');
const input = await file.text();

const parse = raw => raw.split('\n').map(x => x.split(''));

const getCombinations = arr => arr.flatMap((el, i) => arr.slice(i + 1).map(x => [el, x]));

const key = ([y, x]) => `${y},${x}`;

function part1(grid) {
  const frequencies = grid.flat().reduce((set, cur) => {
    if (cur !== '.') set.add(cur);
    return set;
  }, new Set());
  const antinodes = new Set();
  for (const freq of frequencies) {
    const locations = [];
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        if (grid[y][x] === freq) locations.push([y, x]);
      }
    }
    const combos = getCombinations(locations);
    for (const pair of combos) {
      pair.sort((a, b) => a[1] - b[1] === 0 ? a[0] - b[0] : a[1] - b[1]);
      const deltaY = pair[0][0] - pair[1][0];
      const deltaX = pair[0][1] - pair[1][1];
      const antinode1y = pair[0][0] + deltaY;
      const antinode1x = pair[0][1] + deltaX;
      if (
        antinode1y >= 0 &&
        antinode1y < grid.length &&
        antinode1x >= 0 &&
        antinode1x < grid[0].length
      ) antinodes.add(key([antinode1y, antinode1x]));
      const antinode2y = pair[1][0] - deltaY;
      const antinode2x = pair[1][1] - deltaX;
      if (
        antinode2y >= 0 &&
        antinode2y < grid.length &&
        antinode2x >= 0 &&
        antinode2x < grid[0].length
      ) antinodes.add(key([antinode2y, antinode2x]));
    }
  }
  console.log(antinodes.size);
}

function part2(grid) {
  const frequencies = grid.flat().reduce((set, cur) => {
    if (cur !== '.') set.add(cur);
    return set;
  }, new Set());
  const antinodes = new Set();
  for (const freq of frequencies) {
    const locations = [];
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        if (grid[y][x] === freq) locations.push([y, x]);
      }
    }
    const combos = getCombinations(locations);
    for (const pair of combos) {
      pair.sort((a, b) => a[1] - b[1] === 0 ? a[0] - b[0] : a[1] - b[1]);
      antinodes.add(key([pair[0][0], pair[0][1]]));
      antinodes.add(key([pair[1][0], pair[1][1]]));
      const deltaY = pair[0][0] - pair[1][0];
      const deltaX = pair[0][1] - pair[1][1];
      let i = 0;
      while (true) {
        i++;
        const antinode1y = pair[0][0] + i * deltaY;
        const antinode1x = pair[0][1] + i * deltaX;
        if (
          antinode1y >= 0 &&
          antinode1y < grid.length &&
          antinode1x >= 0 &&
          antinode1x < grid[0].length
        ) {
          antinodes.add(key([antinode1y, antinode1x]));
        } else break;
      }
      i = 0;
      while (true) {
        i++
        const antinode2y = pair[1][0] - i * deltaY;
        const antinode2x = pair[1][1] - i * deltaX;
        if (
          antinode2y >= 0 &&
          antinode2y < grid.length &&
          antinode2x >= 0 &&
          antinode2x < grid[0].length
        ) {
          antinodes.add(key([antinode2y, antinode2x]));
        } else break;
      }
    }
  }
  console.log(antinodes.size);
}

part1(parse(example));
part1(parse(input));

part2(parse(example));
part2(parse(input));