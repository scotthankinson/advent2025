import * as fs from 'fs';

// Allow passing input filename as command line argument for testing
const inputFile = process.argv[2] || 'input.txt';
const input = fs.readFileSync(`solved/day01/${inputFile}`, 'utf-8').trim();
const lines = input.split('\n');

// Parse rotations from input
interface Rotation {
  direction: 'L' | 'R';
  distance: number;
}

function parseRotations(lines: string[]): Rotation[] {
  const rotations: Rotation[] = [];
  for (const line of lines) {
    const match = line.match(/([LR])(\d+)/);
    if (match) {
      rotations.push({
        direction: match[1] as 'L' | 'R',
        distance: parseInt(match[2], 10)
      });
    }
  }
  return rotations;
}

// Part 1: Count how many times dial points at 0
function part1(): number {
  const rotations = parseRotations(lines);
  let position = 50; // Starting position
  let zeroCount = 0;

  for (const rotation of rotations) {
    if (rotation.direction === 'L') {
      position = (position - rotation.distance + 1000) % 100; // Add 1000 to handle negative numbers
    } else {
      position = (position + rotation.distance) % 100;
    }

    if (position === 0) {
      zeroCount++;
    }
  }

  return zeroCount;
}

// Part 2: Count all times any click causes dial to point at 0
function part2(): number {
  const rotations = parseRotations(lines);
  let position = 50; // Starting position
  let zeroCount = 0;

  for (const rotation of rotations) {
    const distance = rotation.distance;

    // Count how many times we land on 0 during these clicks
    // For every 100 clicks, we land on 0 exactly once
    // Plus we might land on 0 in the partial rotation

    const fullCircles = Math.floor(distance / 100);
    zeroCount += fullCircles;

    const remaining = distance % 100;

    if (rotation.direction === 'L') {
      // Moving left: we land on 0 if we go from position down to or past 0
      // This happens when remaining >= position (and position != 0 to avoid double count)
      if (remaining >= position && position !== 0) {
        zeroCount++;
      }
      position = (position - distance + 10000) % 100;
    } else {
      // Moving right: we land on 0 if we wrap around
      // This happens when position + remaining >= 100
      if (position + remaining >= 100 && position !== 0) {
        zeroCount++;
      }
      position = (position + distance) % 100;
    }
  }

  return zeroCount;
}

console.log('Part 1:', part1());
console.log('Part 2:', part2());
