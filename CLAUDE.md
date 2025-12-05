# Advent of Code 2025

## Project Structure

```
advent2025/
├── src/              # Current working problem
│   ├── input.txt     # Actual puzzle input
│   ├── example.txt   # Example input for testing
│   ├── pt1.txt       # Part 1 puzzle description
│   ├── pt2.txt       # Part 2 puzzle description
│   ├── solution.ts   # Solution code
│   └── test.ts       # Test harness
├── solved/           # Completed solutions
│   └── day01/
│       ├── input.txt     # Puzzle input data
│       ├── example.txt   # Example test case
│       ├── pt1.txt       # Part 1 description
│       ├── pt2.txt       # Part 2 description
│       ├── solution.ts   # Working solution
│       └── test.ts       # Automated tests
├── template/         # Clean templates for new days
│   ├── solution.ts
│   ├── example.txt
│   ├── input.txt
│   ├── pt1.txt
│   ├── pt2.txt
│   ├── test.ts
│   └── README.md
├── .gitignore
├── package.json
└── tsconfig.json
```

## Conventions

- **Language**: TypeScript
- **Working directory**: `src/` contains the current day's problem
- **Testing**: Use `example.txt` for puzzle examples to verify logic before running on full input
- **Completed solutions**: Move to `solved/dayXX/` when both parts are complete
- **File naming**:
  - `input.txt` - Actual puzzle input
  - `example.txt` - Example test case from puzzle
  - `pt1.txt` - Part 1 puzzle description
  - `pt2.txt` - Part 2 puzzle description
  - `solution.ts` - Solution code
  - `test.ts` - Automated test harness

## Running Solutions

```bash
# Run with actual puzzle input
npx ts-node src/solution.ts

# Run with example input for testing
npx ts-node src/solution.ts example.txt

# Run with any custom input file
npx ts-node src/solution.ts mytest.txt
```

## Solution Template

```typescript
import * as fs from 'fs';

// Allow passing input filename as command line argument for testing
const inputFile = process.argv[2] || 'input.txt';
const input = fs.readFileSync(`src/${inputFile}`, 'utf-8').trim();
const lines = input.split('\n');

// Part 1
function part1(): number {
  // Solution here
  return 0;
}

// Part 2
function part2(): number {
  // Solution here
  return 0;
}

console.log('Part 1:', part1());
console.log('Part 2:', part2());
```

## Testing Workflow

1. Copy example input from puzzle description into `src/example.txt`
2. Implement solution logic in `src/solution.ts`
3. Test with example: `npx ts-node src/solution.ts example.txt`
4. Verify output matches expected results from puzzle
5. Run on actual input: `npx ts-node src/solution.ts`
6. Submit answer and iterate if needed

## Test Harness (Optional)

For completed days, you can create a `test.ts` file to automatically validate both example and actual inputs:

```typescript
import { execSync } from 'child_process';

interface TestCase {
  name: string;
  inputFile: string;
  expectedPart1: number;
  expectedPart2: number;
}

const testCases: TestCase[] = [
  {
    name: 'Example from puzzle',
    inputFile: 'example.txt',
    expectedPart1: 3,
    expectedPart2: 6,
  },
  {
    name: 'Actual puzzle input',
    inputFile: 'input.txt',
    expectedPart1: 1158,
    expectedPart2: 6860,
  },
];

// Run tests and verify outputs match expectations
// See solved/day01/test.ts for full implementation
```

Run tests: `npx ts-node solved/dayXX/test.ts`

## Template System

The `template/` folder contains clean starting files for each new day:

**Starting a new day:**
1. Copy files from `template/` to `src/` (or manually copy the structure)
2. Paste puzzle input into `src/input.txt`
3. Paste example from puzzle into `src/example.txt`
4. Paste puzzle descriptions into `src/pt1.txt` and `src/pt2.txt`
5. Implement solution in `src/solution.ts`
6. Update `src/test.ts` with expected values after solving

**Template files:**
- `solution.ts` - Clean template with command-line arg support
- `example.txt`, `input.txt`, `pt1.txt`, `pt2.txt` - Placeholder comments
- `test.ts` - Test harness with placeholder expected values (0)
- `README.md` - Quick reference guide
