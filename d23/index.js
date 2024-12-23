const example =
  `kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`;

const input = await Bun.file('./d23/input.txt').text();

const parse = raw => raw.split('\n').reduce((map, curr) => {
  const [left, right] = curr.split('-');
  if (map.has(left)) map.set(left, [...map.get(left), right]);
  else map.set(left, [right]);
  if (map.has(right)) map.set(right, [...map.get(right), left]);
  else map.set(right, [left]);
  return map;
}, new Map());

const simpleParse = raw => raw.split('\n').map(x => x.split('-'));

function part1(nodes) {
  const trios = new Set();
  for (const [node, neighbours] of nodes) {
    for (const neighbour of neighbours) {
      for (const nextNeighbour of nodes.get(neighbour)) {
        if (nextNeighbour === node) continue;
        for (const nextNextNeighbour of nodes.get(nextNeighbour)) {
          if (nextNextNeighbour === node) trios.add([node, neighbour, nextNeighbour].sort().join(','));
        }
      }
    }
  }
  console.log([...trios].filter(t => /^t|,t/.test(t)).length);
}

function part2(knownNetworks, nodes) {
  for (const node of nodes) {
    nodes.set(node[0], new Set(node[1]));
  }
  const networks = new Set();
  for (const [l, r] of knownNetworks) {
    const network = new Set([l, r]);
    for (const neighbour of nodes.get(l)) {
      if (neighbour === r) continue;
      if (nodes.get(neighbour).has(r)) network.add(neighbour);
    }
    const netArray = [...network];
    let valid = true;
    for (let i = 0; i < netArray.length - 1; i++) {
      for (let j = i + 1; j < netArray.length; j++) {
        if (!nodes.get(netArray[i]).has(netArray[j])) valid = false;
      }
    }
    if (valid) networks.add([...network].sort().join(','));
  }
  console.log([...networks.values()].reduce((longest, curr) => curr.length > longest.length ? curr : longest, ''));

}

part1(parse(example));
part1(parse(input));

part2(simpleParse(example), parse(example));
part2(simpleParse(input), parse(input));