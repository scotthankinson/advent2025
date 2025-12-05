import * as fs from 'fs';

// Allow passing input filename as command line argument for testing
const inputFile = process.argv[2] || 'input.txt';
const input = fs.readFileSync(`src/${inputFile}`, 'utf-8').trim();
const lines = input.split('\n');

// Count adjacent rolls (@) in the 8 neighboring positions
function countAdjacentRolls(grid: string[], row: number, col: number): number {
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],          [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];

  let count = 0;
  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;
    if (newRow >= 0 && newRow < grid.length &&
        newCol >= 0 && newCol < grid[newRow].length &&
        grid[newRow][newCol] === '@') {
      count++;
    }
  }
  return count;
}

// Part 1: Count rolls accessible by forklift (fewer than 4 adjacent rolls)
function part1(): number {
  let accessible = 0;

  for (let row = 0; row < lines.length; row++) {
    for (let col = 0; col < lines[row].length; col++) {
      if (lines[row][col] === '@') {
        const adjacent = countAdjacentRolls(lines, row, col);
        if (adjacent < 4) {
          accessible++;
        }
      }
    }
  }

  return accessible;
}

// Part 2: Simulate removing accessible rolls until none remain accessible
function part2(): number {
  // Create mutable grid
  const grid: string[][] = lines.map(line => line.split(''));
  let totalRemoved = 0;

  while (true) {
    // Find all currently accessible rolls
    const toRemove: [number, number][] = [];

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col] === '@') {
          const adjacent = countAdjacentRolls2D(grid, row, col);
          if (adjacent < 4) {
            toRemove.push([row, col]);
          }
        }
      }
    }

    // If nothing to remove, we're done
    if (toRemove.length === 0) break;

    // Remove all accessible rolls
    for (const [row, col] of toRemove) {
      grid[row][col] = '.';
    }
    totalRemoved += toRemove.length;
  }

  return totalRemoved;
}

// Helper for 2D grid (string[][])
function countAdjacentRolls2D(grid: string[][], row: number, col: number): number {
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],          [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];

  let count = 0;
  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;
    if (newRow >= 0 && newRow < grid.length &&
        newCol >= 0 && newCol < grid[newRow].length &&
        grid[newRow][newCol] === '@') {
      count++;
    }
  }
  return count;
}

console.log('Part 1:', part1());
console.log('Part 2:', part2());
