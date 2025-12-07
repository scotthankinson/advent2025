# Advent of Code 2025 🎄

My solutions for [Advent of Code 2025](https://adventofcode.com/2025) written in TypeScript.

## About Advent of Code

Advent of Code is an annual programming challenge created by [Eric Wastl](http://was.tl/). Each day from December 1st through December 25th, a new two-part puzzle is released. These puzzles cover a wide range of computer science concepts and problem-solving techniques.

## Project Structure

```
advent2025/
├── src/              # Current working problem
│   ├── input.txt     # Actual puzzle input
│   ├── example.txt   # Example input for testing
│   └── solution.ts   # Solution code
├── solved/           # Completed solutions
│   └── day01/
│       ├── input.txt       # Puzzle input
│       ├── pt1.txt         # Part 1 description
│       ├── pt2.txt         # Part 2 description
│       ├── example.txt     # Test input
│       ├── solution.ts     # Working solution
│       └── test.ts         # Automated tests
└── CLAUDE.md         # Development conventions
```

## Solutions

| Day | Part 1 | Part 2 | Notes |
|-----|--------|--------|-------|
| [01](solved/day01/) | ⭐ | ⭐ | Secret entrance dial combination |
| [02](solved/day02/) | ⭐ | ⭐ | Invalid product ID sequences |
| [03](solved/day03/) | ⭐ | ⭐ | Battery bank digit optimization |
| [04](solved/day04/) | ⭐ | ⭐ | Paper roll accessibility grid |
| [05](solved/day05/) | ⭐ | ⭐ | Fresh ingredient ID ranges |
| [06](solved/day06/) | ⭐ | ⭐ | Cephalopod vertical math problems |
| [07](solved/day07/) | ⭐ | ⭐ | Tachyon beam splitter simulation |

## Running Solutions

### Prerequisites
```bash
npm install
```

### Run a Solution
```bash
# Run current day's solution
npx ts-node src/solution.ts

# Run with example input for testing
npx ts-node src/solution.ts example.txt

# Run a completed day
npx ts-node solved/day01/solution.ts
```

### Run Tests
```bash
# Run automated tests for a completed day
npx ts-node solved/day01/test.ts
```

## Development Workflow

1. Copy puzzle input into `src/input.txt`
2. Copy example from puzzle description into `src/example.txt`
3. Implement solution in `src/solution.ts`
4. Test with example: `npx ts-node src/solution.ts example.txt`
5. Verify example output matches expected results
6. Run on actual input: `npx ts-node src/solution.ts`
7. Submit answer
8. Move completed solution to `solved/dayXX/`

## Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js with ts-node
- **Testing**: Custom test harness using execSync

## Notes

Solutions prioritize:
- ✅ Correctness
- ✅ Readability
- ✅ Clean separation of parsing and logic

Not necessarily optimized for:
- ❌ Speed
- ❌ Memory efficiency
- ❌ Code golf

## License

This is personal challenge code. Feel free to reference, but please solve the puzzles yourself first! 🎅
