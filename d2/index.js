const example =	'7 6 4 2 1\n1 2 7 8 9\n9 7 6 2 1\n1 3 2 4 5\n8 6 4 4 1\n1 3 6 7 9';

const file = Bun.file('./d2/input.txt');
const input = await file.text();

const parse = raw => raw.split('\n').map(x => x.split(/\s/).map(Number));

const checkReport = report => {
	const firstDiff = report[0] - report[1];
	let increasing = true;

	if (firstDiff === 0) return false;
	else if (firstDiff < 0) increasing = true;
	else increasing = false;

	for (let i = 0; i < report.length - 1; i++) {
		const diff = Math.abs(report[i] - report[i + 1]);
		if (diff < 1 || diff > 3) return false;

		if (increasing && report[i + 1] <= report[i]) return false;
		else if (!increasing && report[i + 1] >= report[i]) return false;
	}

	return true;
}

function part1(input) {
	let safeReports = 0;
	input.forEach(report => {
		if (checkReport(report)) safeReports++;
	});
	console.log(safeReports);

}

function part2(input) {
	let safeReports = 0;
	input.forEach(report => {
		for (let i = 0; i < report.length; i++) {
			const reportCopy = [...report];
			reportCopy.splice(i, 1);
			if (checkReport(reportCopy)) {
				safeReports++;
				return;
			}
		}
	});
	console.log(safeReports);
}

part1(parse(example));
part1(parse(input));

part2(parse(example));
part2(parse(input));
