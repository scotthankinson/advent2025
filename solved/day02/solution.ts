import * as fs from 'fs';

// Allow passing input filename as command line argument for testing
const inputFile = process.argv[2] || 'input.txt';
const input = fs.readFileSync(`solved/day02/${inputFile}`, 'utf-8').trim();

// Parse ranges from input (format: "11-22,95-115,...")
function parseRanges(input: string): Array<[number, number]> {
  return input.split(',').map(range => {
    const [start, end] = range.split('-').map(Number);
    return [start, end] as [number, number];
  });
}

// Check if a number is "invalid" for Part 1 (digit sequence repeated exactly twice)
// e.g., 55 = "5" + "5", 1010 = "10" + "10", 123123 = "123" + "123"
function isInvalidIdPart1(n: number): boolean {
  const str = n.toString();
  // Must have even length to be a repeated sequence
  if (str.length % 2 !== 0) return false;

  const half = str.length / 2;
  const firstHalf = str.substring(0, half);
  const secondHalf = str.substring(half);

  return firstHalf === secondHalf;
}

// Check if a number is "invalid" for Part 2 (digit sequence repeated at least twice)
// e.g., 111 = "1" x 3, 1212121212 = "12" x 5, 123123123 = "123" x 3
function isInvalidIdPart2(n: number): boolean {
  const str = n.toString();
  const len = str.length;

  // Try all possible pattern lengths (1 to len/2)
  for (let patternLen = 1; patternLen <= len / 2; patternLen++) {
    // Pattern length must evenly divide the string length
    if (len % patternLen !== 0) continue;

    const pattern = str.substring(0, patternLen);
    const repetitions = len / patternLen;

    // Must repeat at least twice
    if (repetitions < 2) continue;

    // Check if the entire string is this pattern repeated
    if (pattern.repeat(repetitions) === str) {
      return true;
    }
  }

  return false;
}

// Part 1: Sum all invalid IDs in the ranges (exactly twice)
function part1(): number {
  const ranges = parseRanges(input);
  let sum = 0;

  for (const [start, end] of ranges) {
    for (let id = start; id <= end; id++) {
      if (isInvalidIdPart1(id)) {
        sum += id;
      }
    }
  }

  return sum;
}

// Part 2: Sum all invalid IDs in the ranges (at least twice)
function part2(): number {
  const ranges = parseRanges(input);
  let sum = 0;

  for (const [start, end] of ranges) {
    for (let id = start; id <= end; id++) {
      if (isInvalidIdPart2(id)) {
        sum += id;
      }
    }
  }

  return sum;
}

console.log('Part 1:', part1());
console.log('Part 2:', part2());
