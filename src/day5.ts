import { file } from "bun";

type RuleMap = Record<number, number[] | undefined>;

function day5(input: string) {
	const [r, u] = input.split("\r\n\r\n");
	const rules = r.split("\r\n");
	const updates = u.split("\r\n");

	/**
	 * Contains a list of numbers that should never appear before the key.
	 *
	 * In the following example, `17` should never appear before any of the numbers in the array.
	 * @example { 17: [12, 23, 45, 79, 91]}
	 */
	const ruleMap: RuleMap = {};

	rules.forEach((rule) => {
		const [left, right] = rule.split("|").map(Number);
		if (!ruleMap[right]) {
			ruleMap[right] = [left];
			return;
		}
		ruleMap[right].push(left);
	});

	const invalidUpdates: number[][] = [];

	updates.forEach((u) => {
		let update = u.split(",").map(Number);
		// check validity
		const numbersToCheck: RuleMap = {};
		let wasInvalid = update.some((page) => {
			const brokenRule = Object.values(numbersToCheck).find((value) =>
				value?.includes(page)
			);
			numbersToCheck[page] = ruleMap[page];
			return !!brokenRule;
		});
		if (!wasInvalid) return;

		while (wasInvalid) {
			const [w, u] = performAdjustment(update, ruleMap);
			wasInvalid = w;
			update = u;
		}

		invalidUpdates.push(update);
	});

	return invalidUpdates.reduce(
		(acc, update) => acc + update[(update.length - 1) / 2],
		0
	);
}

function performAdjustment(
	update: number[],
	ruleMap: RuleMap
): [boolean, number[]] {
	/**  This object only contains the actual rules to check while iterating over the current update */
	const numbersToCheck: Record<number, number[] | undefined> = {};

	let wasInvalid = false;

	update.forEach((page, pageIdx, ref) => {
		// if the current page is not valid we should be able to find it inside the values of `numbersToCheck`
		const brokenRule = Object.entries(numbersToCheck).find(([_, value]) =>
			value?.includes(page)
		);
		if (brokenRule) {
			wasInvalid = true;
			// is invalid -> reorder the page, then return true

			/** pageRule is the page that should be after page */
			const [pageRule] = brokenRule;

			const pageRuleIdx = update.indexOf(+pageRule);
			// we move pageRule back
			ref[pageIdx] = +pageRule;
			// and page forward
			ref[pageRuleIdx] = page;
		}
		// since page has been met, we add its rules to numbersToCheck
		numbersToCheck[page] = ruleMap[page];
	});
	return [wasInvalid, update];
}

const input = await file("./src/day5.txt").text();

console.log(day5(input));
