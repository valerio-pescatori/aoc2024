import { file } from "bun";

function day3(input: string) {
  const mulRe = /(?:mul\((\d{1,3}),(\d{1,3})\)|(do(?:n't)?\(\)))/g;
  const matches = input.matchAll(mulRe);
  let sum = 0;
  let shouldSum = true;
  matches?.forEach((m, i) => {
    const [match] = m;
    if (match.includes("mul") && shouldSum) {
      const [_, op1, op2] = m;
      sum += +op1 * +op2;
    } else if (match === "don't()") {
      shouldSum = false;
    } else if (match === "do()") {
      shouldSum = true;
    }
  });
  return sum;
}

const input = await file("./src/day3.txt").text();

console.log(day3(input));
