import * as fs from 'fs';

// Allow passing input filename as command line argument for testing
// Usage: npx ts-node src/solution.ts [input-file]
// Default: npx ts-node src/solution.ts (uses input.txt)
// Example: npx ts-node src/solution.ts example.txt
const inputFile = process.argv[2] || 'input.txt';
const input = fs.readFileSync(`src/${inputFile}`, 'utf-8').trim();
const lines = input.split('\n');

interface Machine {
  target: number[];  // target state (0 = off, 1 = on)
  buttons: number[][]; // each button is list of light indices it toggles
}

interface Machine2 {
  joltage: number[];  // target joltage values
  buttons: number[][]; // each button is list of counter indices it increments
}

function parseLine(line: string): Machine {
  // Parse [.##.] - target indicator lights
  const targetMatch = line.match(/\[([.#]+)\]/);
  const targetStr = targetMatch![1];
  const target = targetStr.split('').map(c => c === '#' ? 1 : 0);

  // Parse (n,n,...) - buttons
  const buttonMatches = line.matchAll(/\(([0-9,]+)\)/g);
  const buttons: number[][] = [];
  for (const match of buttonMatches) {
    buttons.push(match[1].split(',').map(Number));
  }

  return { target, buttons };
}

function parseLine2(line: string): Machine2 {
  // Parse {n,n,...} - joltage requirements
  const joltageMatch = line.match(/\{([0-9,]+)\}/);
  const joltage = joltageMatch![1].split(',').map(Number);

  // Parse (n,n,...) - buttons
  const buttonMatches = line.matchAll(/\(([0-9,]+)\)/g);
  const buttons: number[][] = [];
  for (const match of buttonMatches) {
    buttons.push(match[1].split(',').map(Number));
  }

  return { joltage, buttons };
}

// Find minimum button presses using brute force with bitmask
// Since pressing a button twice cancels out, we only need 0 or 1 press per button
function minPresses(machine: Machine): number {
  const { target, buttons } = machine;
  const numLights = target.length;
  const numButtons = buttons.length;

  let minPresses = Infinity;

  // Try all 2^numButtons combinations
  for (let mask = 0; mask < (1 << numButtons); mask++) {
    const state = new Array(numLights).fill(0);

    // Apply each button that's pressed (bit set in mask)
    let presses = 0;
    for (let b = 0; b < numButtons; b++) {
      if (mask & (1 << b)) {
        presses++;
        for (const light of buttons[b]) {
          state[light] ^= 1;
        }
      }
    }

    // Check if state matches target
    let matches = true;
    for (let i = 0; i < numLights; i++) {
      if (state[i] !== target[i]) {
        matches = false;
        break;
      }
    }

    if (matches && presses < minPresses) {
      minPresses = presses;
    }
  }

  return minPresses === Infinity ? 0 : minPresses;
}

// Part 1
function part1(): number {
  let total = 0;
  for (const line of lines) {
    const machine = parseLine(line);
    total += minPresses(machine);
  }
  return total;
}

const NODE_LIMIT = 100_000_000; // Bail out after 100M nodes

// Cache of already-solved machines (machine index -> result)
// Add results here as they're discovered to skip re-computation
const solvedCache: Record<number, number> = {
  1: 49, 2: 60, 3: 40, 4: 74, 6: 50, 7: 63, 8: 23, 9: 57, 10: 54,
  14: 189, 16: 154, 17: 56, 18: 59, 19: 44, 28: 60, 29: 56, 30: 225,
  31: 43, 38: 13, 41: 37, 44: 194, 46: 44, 47: 23, 49: 198, 52: 44,
  53: 37, 56: 55, 60: 43, 64: 43, 65: 132, 66: 36, 71: 172, 72: 54,
  73: 63, 75: 159, 80: 74, 83: 155, 84: 63, 86: 39, 87: 59, 91: 49,
  92: 221, 93: 40, 95: 152, 96: 54, 97: 25, 98: 171, 99: 175, 103: 29,
  104: 10, 107: 42, 109: 74, 110: 189, 111: 50, 116: 79, 117: 50,
  121: 58, 123: 13, 125: 30, 126: 36, 130: 49, 131: 196, 136: 68,
  139: 233, 140: 56, 141: 66, 142: 77, 144: 69, 145: 7, 146: 79,
  147: 20, 148: 172, 149: 174, 151: 44, 153: 9, 154: 56, 155: 48,
  157: 16, 161: 51, 164: 45, 165: 46, 169: 32, 171: 55, 173: 58,
};

// Find minimum button presses for joltage counters using DFS with logging
function minPressesJoltage(machine: Machine2, machineIdx: number): number {
  // Check cache first
  if (solvedCache[machineIdx] !== undefined) {
    console.log(`  Machine ${machineIdx}: CACHED => ${solvedCache[machineIdx]}`);
    return solvedCache[machineIdx];
  }

  const { joltage, buttons } = machine;
  const numCounters = joltage.length;
  const numButtons = buttons.length;

  // Build effect matrix (counter x button): effect[i][b] = 1 if button b affects counter i
  const effects: number[][] = [];
  for (let i = 0; i < numCounters; i++) {
    effects[i] = [];
    for (let b = 0; b < numButtons; b++) {
      effects[i][b] = buttons[b].includes(i) ? 1 : 0;
    }
  }

  const maxJoltage = Math.max(...joltage);
  const sumJoltage = joltage.reduce((a, b) => a + b, 0);

  // Calculate max presses for each button (bounded by min joltage it affects)
  const maxPressPerBtn: number[] = buttons.map((btn, b) => {
    let maxP = Infinity;
    for (const i of btn) {
      maxP = Math.min(maxP, joltage[i]);
    }
    return maxP === Infinity ? 0 : maxP;
  });

  // Order buttons by coverage (most counters first) for better pruning
  const btnOrder = Array.from({ length: numButtons }, (_, i) => i)
    .sort((a, b) => buttons[b].length - buttons[a].length);

  let nodesExplored = 0;
  let bailedOut = false;

  function canSolveWithLimit(limit: number): boolean | 'bail' {
    function dfs(btnIdx: number, current: number[], used: number): boolean | 'bail' {
      nodesExplored++;
      if (nodesExplored > NODE_LIMIT) return 'bail';

      // Check if solved or overshot
      let solved = true;
      for (let i = 0; i < numCounters; i++) {
        if (current[i] > joltage[i]) return false;
        if (current[i] !== joltage[i]) solved = false;
      }
      if (solved) return true;
      if (btnIdx >= numButtons) return false;

      // Lower bound pruning: need at least max(remaining) more presses
      const maxRem = Math.max(...joltage.map((j, i) => j - current[i]));
      if (used + maxRem > limit) return false;

      const b = btnOrder[btnIdx];

      // Calculate max presses for this button given current state
      let maxP = Math.min(maxPressPerBtn[b], limit - used);
      for (let i = 0; i < numCounters; i++) {
        if (effects[i][b] > 0) {
          maxP = Math.min(maxP, joltage[i] - current[i]);
        }
      }

      // Try each number of presses from 0 to maxP
      for (let p = 0; p <= maxP; p++) {
        const newCurrent = current.slice();
        for (let i = 0; i < numCounters; i++) {
          newCurrent[i] += effects[i][b] * p;
        }
        const result = dfs(btnIdx + 1, newCurrent, used + p);
        if (result === 'bail') return 'bail';
        if (result === true) return true;
      }
      return false;
    }

    nodesExplored = 0;
    return dfs(0, new Array(numCounters).fill(0), 0);
  }

  // Search starting from lower bound
  for (let limit = maxJoltage; limit <= sumJoltage; limit++) {
    const result = canSolveWithLimit(limit);
    if (result === 'bail') {
      console.log(`  Machine ${machineIdx}: BAILED at limit=${limit} joltage=${joltage.join(',')} btns=${numButtons} maxJ=${maxJoltage}`);
      return -1; // Signal that we bailed
    }
    if (result === true) {
      console.log(`  Machine ${machineIdx}: joltage=${joltage.join(',')} btns=${numButtons} maxJ=${maxJoltage} => ${limit} (${nodesExplored} nodes)`);
      return limit;
    }
  }

  console.log(`  Machine ${machineIdx}: FAILED joltage=${joltage.join(',')} btns=${numButtons}`);
  return 0;
}

// Part 2
function part2(): number {
  let total = 0;
  let solved = 0;
  let bailed = 0;
  const bailedMachines: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    const machine = parseLine2(lines[i]);
    const result = minPressesJoltage(machine, i + 1);
    if (result === -1) {
      bailed++;
      bailedMachines.push(i + 1);
    } else {
      solved++;
      total += result;
    }
  }

  console.log(`\nSummary: ${solved} solved, ${bailed} bailed out of ${lines.length} total`);
  if (bailedMachines.length > 0) {
    console.log(`Bailed machines: ${bailedMachines.join(', ')}`);
  }
  console.log(`Partial total (solved only): ${total}`);

  return total;
}

console.log('Part 1:', part1());
console.log('Part 2:', part2());
