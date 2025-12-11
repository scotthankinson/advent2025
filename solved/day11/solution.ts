import * as fs from 'fs';

const inputFile = process.argv[2] || 'input.txt';
const input = fs.readFileSync(`src/${inputFile}`, 'utf-8').trim();
const lines = input.split('\n');

// Build graph: device -> outputs
const graph: Map<string, string[]> = new Map();

for (const line of lines) {
  const [device, outputs] = line.split(': ');
  graph.set(device, outputs.split(' '));
}

// Part 1: Count all paths from 'you' to 'out'
function part1(): number {
  const memo: Map<string, number> = new Map();

  function countPaths(node: string): number {
    if (node === 'out') return 1;
    if (memo.has(node)) return memo.get(node)!;

    const outputs = graph.get(node);
    if (!outputs) return 0;

    let total = 0;
    for (const next of outputs) {
      total += countPaths(next);
    }

    memo.set(node, total);
    return total;
  }

  return countPaths('you');
}

// Part 2: Count paths from 'svr' to 'out' that visit both 'dac' and 'fft'
function part2(): number {
  // State: bitmask for which required nodes visited (0=none, 1=dac, 2=fft, 3=both)
  const memo: Map<string, number> = new Map();

  function countPaths(node: string, visited: number): number {
    // Update visited state based on current node
    if (node === 'dac') visited |= 1;
    if (node === 'fft') visited |= 2;

    if (node === 'out') {
      return visited === 3 ? 1 : 0;  // Only count if visited both
    }

    const key = `${node}:${visited}`;
    if (memo.has(key)) return memo.get(key)!;

    const outputs = graph.get(node);
    if (!outputs) {
      memo.set(key, 0);
      return 0;
    }

    let total = 0;
    for (const next of outputs) {
      total += countPaths(next, visited);
    }

    memo.set(key, total);
    return total;
  }

  return countPaths('svr', 0);
}

console.log('Part 1:', part1());
console.log('Part 2:', part2());
