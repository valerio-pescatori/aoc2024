import { file } from "bun";
import { disposeEmitNodes } from "typescript";

function day6(input: string) {
	const map = input.split("\r\n").map((l) => l.split(""));

	const positions: [number, number][] = [];
	let startPos: [number, number] = [0, 0];
	// find the guard, then start pathfinding
	outer: {
		for (let r = 0; r < map.length; r++) {
			for (let c = 0; c < map[r].length; c++) {
				const char = map[r][c];
				if (char === "^") {
					startPos = [r, c];
					break outer;
				}
			}
		}
	}

	// up, right, down, left
	const directions: [number, number][] = [
		[-1, 0],
		[0, 1],
		[1, 0],
		[0, -1],
	];
	let currentDirectionIdx = 0;
	let currentDirection = directions[currentDirectionIdx];

	let exited = false;
	let [r, c] = startPos;
	while (!exited) {
		// valid position - add it to the array
		addPosition([r, c], positions);
		// calculate next step
		const [nr, nc] = sum([r, c], currentDirection);
		// check exited
		if (nr >= map.length || nr < 0 || nc >= map[0].length || nc < 0) {
			exited = true;
			break;
		}
		const char = map[nr][nc];
		// check block found
		if (char === "#") {
			// change direction
			currentDirectionIdx++;
			currentDirectionIdx %= directions.length;
			currentDirection = directions[currentDirectionIdx];
			// continue so we don't actually move a step
			continue;
		}
		// make the move
		[r, c] = [nr, nc];
	}

	return positions.length;
}

const sum = (
	op1: [number, number],
	op2: [number, number]
): [number, number] => [op1[0] + op2[0], op1[1] + op2[1]];

const addPosition = (
	[x, y]: [number, number],
	positions: [number, number][]
) => {
	if (positions.some(([x1, y1]) => x === x1 && y === y1)) return;
	positions.push([x, y]);
};

const input = await file("./src/day6.txt").text();
console.log(day6(input));
