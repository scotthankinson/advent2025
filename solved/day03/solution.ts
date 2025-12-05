import * as fs from 'fs';

// Allow passing input filename as command line argument for testing
const inputFile = process.argv[2] || 'input.txt';
const input = fs.readFileSync(`src/${inputFile}`, 'utf-8').trim();
const lines = input.split('\n');

// Find the maximum 2-digit number by picking two digits (first digit at position i, second at position j > i)
function maxJoltage(bank: string): number {
  let max = 0;

  for (let i = 0; i < bank.length - 1; i++) {
    for (let j = i + 1; j < bank.length; j++) {
      const joltage = parseInt(bank[i] + bank[j]);
      if (joltage > max) {
        max = joltage;
      }
    }
  }

  return max;
}

// Part 1: Sum of maximum joltages from each bank
function part1(): number {
  return lines.reduce((sum, bank) => sum + maxJoltage(bank), 0);
}

// Find the maximum N-digit number by picking N digits in order from the bank
function maxJoltageN(bank: string, n: number): bigint {
  const result: string[] = [];
  let startIdx = 0;

  for (let i = 0; i < n; i++) {
    // How many digits do we still need after this one?
    const digitsNeeded = n - i - 1;
    // We can pick from startIdx up to (length - digitsNeeded - 1)
    const endIdx = bank.length - digitsNeeded;

    // Find the largest digit in the valid range
    let maxDigit = '0';
    let maxPos = startIdx;

    for (let j = startIdx; j < endIdx; j++) {
      if (bank[j] > maxDigit) {
        maxDigit = bank[j];
        maxPos = j;
      }
    }

    result.push(maxDigit);
    startIdx = maxPos + 1; // Next digit must come after this one
  }

  return BigInt(result.join(''));
}

// Part 2: Sum of maximum 12-digit joltages from each bank
function part2(): bigint {
  return lines.reduce((sum, bank) => sum + maxJoltageN(bank, 12), BigInt(0));
}

console.log('Part 1:', part1());
console.log('Part 2:', part2().toString());
