import * as fs from 'fs';

// Allow passing input filename as command line argument for testing
// Usage: npx ts-node solved/day06/solution.ts [input-file]
// Default: npx ts-node solved/day06/solution.ts (uses input.txt)
// Example: npx ts-node solved/day06/solution.ts example.txt
const inputFile = process.argv[2] || 'input.txt';
const input = fs.readFileSync(`solved/day06/${inputFile}`, 'utf-8');
const lines = input.split('\n');

// Parse vertical problems from the grid
function parseProblems(): { numbers: number[]; operator: string }[] {
  // Filter out empty lines and find the operator line (last line with * or +)
  const nonEmptyLines = lines.filter(l => l.trim().length > 0);

  // Find max width to handle ragged lines
  const maxWidth = Math.max(...nonEmptyLines.map(l => l.length));

  // Pad all lines to same width
  const paddedLines = nonEmptyLines.map(l => l.padEnd(maxWidth));

  // The last line contains operators
  const operatorLine = paddedLines[paddedLines.length - 1];
  const numberLines = paddedLines.slice(0, -1);

  const problems: { numbers: number[]; operator: string }[] = [];
  let col = 0;

  while (col < maxWidth) {
    // Skip separator columns (all spaces in number rows)
    const isAllSpaces = numberLines.every(line => line[col] === ' ' || line[col] === undefined);
    if (isAllSpaces) {
      col++;
      continue;
    }

    // Find the extent of this problem (until we hit a full column of spaces)
    let endCol = col;
    while (endCol < maxWidth) {
      const nextIsAllSpaces = numberLines.every(line => line[endCol] === ' ' || line[endCol] === undefined);
      if (nextIsAllSpaces) break;
      endCol++;
    }

    // Extract numbers from this problem's columns
    const numbers: number[] = [];
    for (const line of numberLines) {
      const slice = line.slice(col, endCol).trim();
      if (slice.length > 0) {
        numbers.push(parseInt(slice, 10));
      }
    }

    // Get operator from the operator line (find * or + in this column range)
    let operator = '+';
    for (let c = col; c < endCol; c++) {
      if (operatorLine[c] === '*' || operatorLine[c] === '+') {
        operator = operatorLine[c];
        break;
      }
    }

    if (numbers.length > 0) {
      problems.push({ numbers, operator });
    }

    col = endCol;
  }

  return problems;
}

// Solve a single problem
function solve(problem: { numbers: number[]; operator: string }): number {
  if (problem.operator === '+') {
    return problem.numbers.reduce((a, b) => a + b, 0);
  } else {
    return problem.numbers.reduce((a, b) => a * b, 1);
  }
}

// Part 1
function part1(): number {
  const problems = parseProblems();
  return problems.reduce((sum, p) => sum + solve(p), 0);
}

// Parse problems for Part 2: each column is a digit, read vertically to form numbers
function parseProblemsP2(): { numbers: number[]; operator: string }[] {
  const nonEmptyLines = lines.filter(l => l.trim().length > 0);
  const maxWidth = Math.max(...nonEmptyLines.map(l => l.length));
  const paddedLines = nonEmptyLines.map(l => l.padEnd(maxWidth));

  const operatorLine = paddedLines[paddedLines.length - 1];
  const numberLines = paddedLines.slice(0, -1);

  const problems: { numbers: number[]; operator: string }[] = [];
  let col = 0;

  while (col < maxWidth) {
    // Skip separator columns (all spaces in number rows)
    const isAllSpaces = numberLines.every(line => line[col] === ' ');
    if (isAllSpaces) {
      col++;
      continue;
    }

    // Find the extent of this problem (until we hit a full column of spaces)
    let endCol = col;
    while (endCol < maxWidth) {
      const nextIsAllSpaces = numberLines.every(line => line[endCol] === ' ');
      if (nextIsAllSpaces) break;
      endCol++;
    }

    // Each column in the range is one number (digits read top-to-bottom)
    const numbers: number[] = [];
    for (let c = col; c < endCol; c++) {
      let digits = '';
      for (const line of numberLines) {
        const char = line[c];
        if (char >= '0' && char <= '9') {
          digits += char;
        }
      }
      if (digits.length > 0) {
        numbers.push(parseInt(digits, 10));
      }
    }

    // Get operator
    let operator = '+';
    for (let c = col; c < endCol; c++) {
      if (operatorLine[c] === '*' || operatorLine[c] === '+') {
        operator = operatorLine[c];
        break;
      }
    }

    if (numbers.length > 0) {
      problems.push({ numbers, operator });
    }

    col = endCol;
  }

  return problems;
}

// Part 2
function part2(): number {
  const problems = parseProblemsP2();
  return problems.reduce((sum, p) => sum + solve(p), 0);
}

console.log('Part 1:', part1());
console.log('Part 2:', part2());
