const example = '2333133121414131402';

const file = Bun.file('./d9/input.txt');
const input = await file.text();

const parse = raw => raw.split('').map(Number).reduce((prev, curr, i) => {
	if (i % 2) prev[prev.length - 1].freeSpace = curr;
	else prev.push({ fileSize: curr, freeSpace: 0 });
	return prev;
}, []);

function part1(diskMap) {
	const diskLength = diskMap.reduce((prev, curr) => prev + curr.fileSize + curr.freeSpace, 0);
	const disk = new Array(diskLength);

	let diskIndex = 0;
	for (const [i, file] of diskMap.entries()) {
		for (let j = 0; j < file.fileSize; j++) disk[j + diskIndex] = i;
		diskIndex += file.fileSize;
		for (let j = 0; j < file.freeSpace; j++) disk[j + diskIndex] = '.';
		diskIndex += file.freeSpace;
	}

	while (true) {
		const last = disk.splice(disk.length - 1)[0];
		if (last === '.') continue;
		const firstGap = disk.indexOf('.');
		if (firstGap < 0) {
			disk.push(last);
			break;
		}
		disk[firstGap] = last
	}
	console.log(disk.reduce((prev, curr, i) => prev + curr * i, 0));
}

function part2(diskMap) {
	const diskLength = diskMap.reduce((prev, curr) => prev + curr.fileSize + curr.freeSpace, 0);
	const disk = new Array(diskLength);

	let diskIndex = 0;
	for (const [i, file] of diskMap.entries()) {
		for (let j = 0; j < file.fileSize; j++) disk[j + diskIndex] = i;
		diskIndex += file.fileSize;
		for (let j = 0; j < file.freeSpace; j++) disk[j + diskIndex] = '.';
		diskIndex += file.freeSpace;
	}

	for (let i = diskMap.length - 1; i >= 0; i--) {
		const filePos = disk.reduce((prev, curr, j) => {
			if (curr === i) prev.push(j);
			return prev;
		}, []);

		const gapLength = filePos[filePos.length - 1] - filePos[0] + 1;
		const gapPos = disk.findIndex((x, j) => disk.slice(j, j + gapLength).join('') === '.'.repeat(gapLength));

		if (gapPos > -1 && gapPos < filePos[0]) {
			for (let j = 0; j < filePos.length; j++) {
				disk[gapPos + j] = disk[filePos[j]];
				disk[filePos[j]] = '.';
			}
		}
	}

	const result = disk.reduce((prev, curr, i) => {
		if (curr === '.') return prev;
		else return prev + curr * i;
	}, 0);

	console.log(result);
	
}

part1(parse(example));
part1(parse(input));

part2(parse(example));
part2(parse(input));
