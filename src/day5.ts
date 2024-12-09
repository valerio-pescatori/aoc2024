import { file } from "bun";

function day5(input: string) {
	const [r, u] = input.split("\r\n\r\n");
	const rules = r.split("\r\n");
	const updates = u.split("\r\n");

	const ruleMap: Record<number, number[] | undefined> = {};

	rules.forEach((rule) => {
		const [left, right] = rule.split("|").map(Number);
		if (!ruleMap[right]) {
			ruleMap[right] = [left];
			return;
		}
		ruleMap[right].push(left);
	});

	const validUpdates = updates.filter((_update) => {
		const update = _update.split(",").map(Number);

		/** this set contains all the numbers to check while iterating over `update`,
		 *  if a match is found it means that the update is not valid */
		const numbersToCheck = new Set<number>([]);

		// returns true if the update is not valid, hence we negate the result to filter out invalid updates
		return !update.some((page) => {
			if (numbersToCheck.has(page)) {
				return true;
			}
			const invalidNumbers = ruleMap[page];
			if (!invalidNumbers) return false;
			invalidNumbers.forEach((n) => numbersToCheck.add(n));
		});
	});

	const mappedValidUpdates = validUpdates.map((u) => u.split(",").map(Number));

	return mappedValidUpdates.reduce(
		(acc, update) => acc + update[(update.length - 1) / 2],
		0
	);
}

const input = await file("./src/day5.txt").text();

console.log(day5(input));
