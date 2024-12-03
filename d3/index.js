const example = 'xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))';

const file = Bun.file('./d3/input.txt');
const input = await file.text();

function part1(input) {
  const pattern = /mul\(\d{1,3},\d{1,3}\)/gm;
  let tot = 0;
  for (const line of input) {
    const matches = line.match(pattern);


    for (const match of matches) {
      const nums = match.replace(/\w+/, '').replace('(', '').replace(')', '').split(',').map(Number);
      tot += nums[0] * nums[1];
    }
  }

  console.log(tot);

}

part1([example]);
part1(input.split('\n'));