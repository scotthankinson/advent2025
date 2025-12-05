import * as fs from 'fs';

// Allow passing input filename as command line argument for testing
// Usage: npx ts-node solved/day05/solution.ts [input-file]
// Default: npx ts-node solved/day05/solution.ts (uses input.txt)
// Example: npx ts-node solved/day05/solution.ts example.txt
const inputFile = process.argv[2] || 'input.txt';
const input = fs.readFileSync(`solved/day05/${inputFile}`, 'utf-8').trim();
const lines = input.split('\n');

// Parse the input: ranges before blank line, ingredient IDs after
function parseInput(): { ranges: [number, number][]; ingredientIds: number[] } {
  const blankIndex = lines.findIndex(line => line === '');

  const ranges: [number, number][] = lines.slice(0, blankIndex).map(line => {
    const [start, end] = line.split('-').map(Number);
    return [start, end];
  });

  const ingredientIds = lines.slice(blankIndex + 1).map(Number);

  return { ranges, ingredientIds };
}

// Check if an ID falls within any range
function isFresh(id: number, ranges: [number, number][]): boolean {
  return ranges.some(([start, end]) => id >= start && id <= end);
}

// Part 1
function part1(): number {
  const { ranges, ingredientIds } = parseInput();
  return ingredientIds.filter(id => isFresh(id, ranges)).length;
}

// Part 2
function part2(): number {
  const { ranges } = parseInput();

  // Sort ranges by start value
  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);

  // Merge overlapping ranges
  const merged: [number, number][] = [];
  for (const [start, end] of sorted) {
    if (merged.length === 0 || start > merged[merged.length - 1][1] + 1) {
      // No overlap, add new range
      merged.push([start, end]);
    } else {
      // Overlapping or adjacent, extend the last range
      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], end);
    }
  }

  // Count total unique IDs across all merged ranges
  return merged.reduce((sum, [start, end]) => sum + (end - start + 1), 0);
}

console.log('Part 1:', part1());
console.log('Part 2:', part2());
