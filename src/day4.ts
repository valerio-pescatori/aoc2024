import { file } from "bun";

function day4(input: string) {
  let sum = 0;
  input.split("\n").forEach((row, r, rows) => {
    row.split("").forEach((char, c) => {
      if (char === "A") {
        // itero in 4 direzioni
        const topLeft = rows[r - 1]?.[c - 1];
        const topRight = rows[r - 1]?.[c + 1];
        const botLeft = rows[r + 1]?.[c - 1];
        const botRight = rows[r + 1]?.[c + 1];

        if (
          ((topLeft === "S" && botRight === "M") || (topLeft === "M" && botRight === "S")) &&
          ((topRight === "S" && botLeft === "M") || (topRight === "M" && botLeft === "S"))
        ) {
          sum++;
        }
      }
    });
  });
  return sum;
}

const input = await file("./src/day4.txt").text();
const inputEz = await file("./src/day4-ez.txt").text();

console.log(day4(input));
