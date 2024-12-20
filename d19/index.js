const example =
  `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`;

const input = await Bun.file('./d19/input.txt').text();

const parse = raw => raw.split('\n\n').map((x, i) => i ? x.split('\n') : x.match(/\w+/g));

const matchTowel = (towels, design) => {
  if (design.length === 0) return true;
  for (const towel of towels) {
    if (towel === design.slice(0, towel.length)) {
      const canMatch = matchTowel(towels, design.slice(towel.length));
      if (canMatch) return true;
    }
  }
  return false;
};

const memoize = (fn) => {
  let cache = {};
  return (...args) => {
    let n = args[0];
    if (n in cache) {
      return cache[n];
    } else {
      const result = fn(...args)
      cache[n] = result;
      return result;
    }
  }
};

const matchAllTowel = memoize(
  (design, towels) => {
    let matches = 0;
    if (design.length === 0) return true;
    for (const towel of towels) {
      if (towel === design.slice(0, towel.length)) {
        const canMatch = matchAllTowel(design.slice(towel.length), towels);
        if (canMatch === true) {
          matches++;
        } else {
          matches += canMatch;
        }
      }
    }
    return matches;
  }
);

function part1([towels, designs]) {
  let total = 0;
  for (const design of designs) {
    const canMatch = matchTowel(towels, design);
    if (canMatch) total++;
  }
  console.log(total);

}

function part2([towels, designs]) {
  let total = 0;
  for (const design of designs) {
    const result = matchAllTowel(design, towels);
    total += result;
  }
  console.log(total);
}

part1(parse(example));
part1(parse(input));

part2(parse(example));
part2(parse(input));