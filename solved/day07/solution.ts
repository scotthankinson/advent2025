import * as fs from 'fs';

// Allow passing input filename as command line argument for testing
// Usage: npx ts-node solved/day07/solution.ts [input-file]
// Default: npx ts-node solved/day07/solution.ts (uses input.txt)
// Example: npx ts-node solved/day07/solution.ts example.txt
const inputFile = process.argv[2] || 'input.txt';
const input = fs.readFileSync(`solved/day07/${inputFile}`, 'utf-8').trim();
const lines = input.split('\n');

// Parse the grid
const grid = lines.map(l => l.split(''));
const height = grid.length;
const width = grid[0].length;

// Find starting position S
function findStart(): [number, number] {
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      if (grid[row][col] === 'S') {
        return [row, col];
      }
    }
  }
  throw new Error('No start found');
}

// Part 1: Simulate beams and count splits
function part1(): number {
  const [startRow, startCol] = findStart();

  // Track active beams as column positions at each row
  // Use a Set to handle beams merging at the same position
  let beams = new Set<number>();
  beams.add(startCol);

  let splitCount = 0;

  // Process row by row, starting from below S
  for (let row = startRow + 1; row < height; row++) {
    const newBeams = new Set<number>();

    for (const col of beams) {
      const cell = grid[row][col];

      if (cell === '^') {
        // Splitter: beam stops, emits left and right
        splitCount++;
        if (col - 1 >= 0) newBeams.add(col - 1);
        if (col + 1 < width) newBeams.add(col + 1);
      } else {
        // Empty space or other: beam continues down
        newBeams.add(col);
      }
    }

    beams = newBeams;

    // If no beams left, we're done
    if (beams.size === 0) break;
  }

  return splitCount;
}

// Part 2: Count timelines (each path through splitters is a separate timeline)
function part2(): number {
  const [startRow, startCol] = findStart();

  // Track count of timelines at each column position
  // Use a Map<column, count> instead of Set to track multiple timelines at same position
  let beams = new Map<number, number>();
  beams.set(startCol, 1);

  // Process row by row, starting from below S
  for (let row = startRow + 1; row < height; row++) {
    const newBeams = new Map<number, number>();

    for (const [col, count] of beams) {
      const cell = grid[row][col];

      if (cell === '^') {
        // Splitter: each timeline splits into two
        if (col - 1 >= 0) {
          newBeams.set(col - 1, (newBeams.get(col - 1) || 0) + count);
        }
        if (col + 1 < width) {
          newBeams.set(col + 1, (newBeams.get(col + 1) || 0) + count);
        }
      } else {
        // Empty space: timelines continue down
        newBeams.set(col, (newBeams.get(col) || 0) + count);
      }
    }

    beams = newBeams;

    if (beams.size === 0) break;
  }

  // Sum all timelines that made it to the end
  let total = 0;
  for (const count of beams.values()) {
    total += count;
  }
  return total;
}

console.log('Part 1:', part1());
console.log('Part 2:', part2());
