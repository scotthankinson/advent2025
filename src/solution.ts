import * as fs from 'fs';

// Allow passing input filename as command line argument for testing
// Usage: npx ts-node src/solution.ts [input-file]
// Default: npx ts-node src/solution.ts (uses input.txt)
// Example: npx ts-node src/solution.ts example.txt
const inputFile = process.argv[2] || 'input.txt';
const input = fs.readFileSync(`src/${inputFile}`, 'utf-8').trim();
const lines = input.split('\n');

// Part 1
function part1(): number {
  // TODO: Implement Part 1
  return 0;
}

// Part 2
function part2(): number {
  // TODO: Implement Part 2
  return 0;
}

console.log('Part 1:', part1());
console.log('Part 2:', part2());
