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
    expectedPart1: 0, // TODO: Update after solving
    expectedPart2: 0, // TODO: Update after solving
  },
  {
    name: 'Actual puzzle input',
    inputFile: 'input.txt',
    expectedPart1: 0, // TODO: Update after solving
    expectedPart2: 0, // TODO: Update after solving
  },
];

console.log('🧪 Running Tests\n');

let allPassed = true;

for (const testCase of testCases) {
  console.log(`Testing: ${testCase.name}`);
  console.log(`Input: ${testCase.inputFile}`);

  try {
    const output = execSync(
      `npx ts-node src/solution.ts ${testCase.inputFile}`,
      { encoding: 'utf-8' }
    );

    const part1Match = output.match(/Part 1: (\d+)/);
    const part2Match = output.match(/Part 2: (\d+)/);

    if (!part1Match || !part2Match) {
      console.log(`❌ FAILED: Could not parse output`);
      console.log(`Output: ${output}`);
      allPassed = false;
      continue;
    }

    const actualPart1 = parseInt(part1Match[1]);
    const actualPart2 = parseInt(part2Match[1]);

    const part1Pass = actualPart1 === testCase.expectedPart1;
    const part2Pass = actualPart2 === testCase.expectedPart2;

    console.log(
      `  Part 1: ${actualPart1} ${part1Pass ? '✅' : `❌ (expected ${testCase.expectedPart1})`}`
    );
    console.log(
      `  Part 2: ${actualPart2} ${part2Pass ? '✅' : `❌ (expected ${testCase.expectedPart2})`}`
    );

    if (!part1Pass || !part2Pass) {
      allPassed = false;
    }
  } catch (error: any) {
    console.log(`❌ FAILED: ${error.message}`);
    allPassed = false;
  }

  console.log('');
}

if (allPassed) {
  console.log('🎉 All tests passed!');
  process.exit(0);
} else {
  console.log('💥 Some tests failed');
  process.exit(1);
}
