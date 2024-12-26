const example =
  `#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####`;

const input = await Bun.file('./d25/input.txt').text();

const parse = raw => raw.split('\n\n').reduce((res, b) => {
  const grid = b.split('\n').map(row => row.split(''));
  const isLock = grid[0].join('') === '#####';
  const heights = [];
  if (isLock) {
    for (let x = 0; x < grid[0].length; x++) {
      for (let y = 1; y < grid.length; y++) {
        if (grid[y][x] === '.') {
          heights.push(y - 1);
          break;
        }
      }
    }
    res[0].push(heights);
  } else {
    for (let x = 0; x < grid[0].length; x++) {
      for (let y = grid.length - 2; y >= 0; y--) {
        if (grid[y][x] === '.') {
          heights.push(grid.length - y - 2);
          break;
        }
      }
    }
    res[1].push(heights);
  }
  return res;
}, [[], []]);

function part1([locks, keys]) {
  let total = 0;
  for (const lock of locks) {
    keyloop: for (const key of keys) {
      for(let i = 0; i < 5; i++) {
        if (lock[i] + key[i] > 5) {
          continue keyloop;
        }
      }
      total++;
    }
  }
  console.log(total);
  
}

part1(parse(example));
part1(parse(input));