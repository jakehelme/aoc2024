const example =
  `1
10
100
2024`;

const example2 =
`1
2
3
2024`;

const input = await Bun.file('./d22/input.txt').text();

const parse = raw => raw.split('\n').map(Number);
const mix = (num, secret) => (num ^ secret) >>> 0;
const prune = secret => secret % 16777216;

function part1(initialSecrets) {
  let total = 0;
  for (const initialSecret of initialSecrets) {
    let currentSecret = initialSecret;
    for (let i = 0; i < 2000; i++) {
      currentSecret = prune(mix(currentSecret * 64, currentSecret));
      currentSecret = prune(mix(currentSecret >>> 5, currentSecret));
      currentSecret = prune(mix(currentSecret * 2048, currentSecret));
    }
    total += currentSecret;
  }
  console.log(total);
}

const getPrice = number => {
  const str = number.toString();
  return Number(str[str.length - 1]);
}

function part2(initialSecrets) {
  const changeMaps = [];
  for (const initialSecret of initialSecrets) {
    const priceChanges = [[getPrice(initialSecret), null]];
    let currentSecret = initialSecret;
    for (let i = 0; i < 2000; i++) {
      currentSecret = prune(mix(currentSecret * 64, currentSecret));
      currentSecret = prune(mix(currentSecret >>> 5, currentSecret));
      currentSecret = prune(mix(currentSecret * 2048, currentSecret));
      const price = getPrice(currentSecret);
      priceChanges.push([price, price - priceChanges[priceChanges.length - 1][0]]);
    }
    const changeMap = new Map();
    for (let i = 4; i < priceChanges.length; i++) {
      const key = `${priceChanges[i - 3][1]},${priceChanges[i - 2][1]},${priceChanges[i - 1][1]},${priceChanges[i][1]}`;
      if(!changeMap.has(key)) changeMap.set(key, priceChanges[i][0]);
    }
    changeMaps.push(changeMap);
  }

  const allKeys = new Set();
  for (const changeMap of changeMaps) {
    for (const key of changeMap.keys()) {
      allKeys.add(key);
    }
  }

  let max = 0;
  for (const key of allKeys) {
    let subTotal = 0;
    for (const changeMap of changeMaps) {
      if(changeMap.has(key)) subTotal += changeMap.get(key);
    }
    max = Math.max(max, subTotal);
  }

  console.log(max);
}

part1(parse(example));
part1(parse(input));

part2(parse(example2));
part2(parse(input));