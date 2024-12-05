const example =
	`47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`;

const file = Bun.file('./d5/input.txt');
const input = await file.text();

const parse = input => {
	const sections = input.split('\n\n');
	const rules = sections[0].split('\n').map(x => x.split('|').map(Number));
	const pageSets = sections[1].split('\n').map(x => x.split(',').map(Number));
	return [rules, pageSets];
}

function moveElement(arr, fromIndex, toIndex) {
	var element = arr[fromIndex];
	arr.splice(fromIndex, 1);
	arr.splice(toIndex, 0, element);
}

function checkValidity(rules, pages) {
	for (let i = 0; i < pages.length; i++) {
		const afterRules = rules.filter(x => x[0] === pages[i]).map(x => x[1]);
		const beforeRules = rules.filter(x => x[1] === pages[i]).map(x => x[0]);

		for (const rule of afterRules) {
			const location = pages.indexOf(rule);
			if (location < 0) continue;
			else if (location > i) continue;
			else return false;
		}

		for (const rule of beforeRules) {
			const location = pages.indexOf(rule);
			if (location < 0) continue;
			else if (location < i) continue;
			else return false;
		}
	}
	return true;
}

function part1([rules, pageSets]) {
	let total = 0;

	for (const pages of pageSets) {
		if (checkValidity(rules, pages)) total += pages[Math.floor(pages.length / 2)];
	}
	console.log(total);
}

function part2([rules, pageSets]) {
	let total = 0;
	const incorrectSets = [];

	pageSets: for (const [setIndex, pages] of pageSets.entries()) {
		for (let i = 0; i < pages.length; i++) {
			const afterRules = rules.filter(x => x[0] === pages[i]).map(x => x[1]);
			const beforeRules = rules.filter(x => x[1] === pages[i]).map(x => x[0]);

			for (const rule of afterRules) {
				const location = pages.indexOf(rule);
				if (location < 0) continue;
				else if (location > i) continue;
				else {
					incorrectSets.push(setIndex)
					continue pageSets;
				}
			}

			for (const rule of beforeRules) {
				const location = pages.indexOf(rule);
				if (location < 0) continue;
				else if (location < i) continue;
				else {
					incorrectSets.push(setIndex)
					continue pageSets;
				}
			}
		}
	}

	for (const index of incorrectSets) {
		const pages = [...pageSets[index]];
		const applicableRules = rules.filter(x => pages.indexOf(x[0]) > -1 && pages.indexOf(x[1]) > - 1);
		let invalid = true;
		inner: while (invalid) {
			for (const rule of applicableRules) {
				const a = pages.indexOf(rule[0]);
				const b = pages.indexOf(rule[1]);
				if (a > b) {
					moveElement(pages, a, b);
					continue inner;
				}
			}
			invalid = false
		}
		total += pages[Math.floor(pages.length / 2)];
	}
	console.log(total);
}

part1(parse(example));
part1(parse(input));

part2(parse(example));
part2(parse(input));