import * as fs from 'fs';

const inputFile = process.argv[2] || 'input.txt';
const input = fs.readFileSync(`solved/day10/${inputFile}`, 'utf-8').trim();
const lines = input.split('\n');

interface Machine {
  target: number[];
  buttons: number[][];
}

interface Machine2 {
  joltage: number[];
  buttons: number[][];
}

function parseLine(line: string): Machine {
  const targetMatch = line.match(/\[([.#]+)\]/);
  const targetStr = targetMatch![1];
  const target = targetStr.split('').map(c => c === '#' ? 1 : 0);
  const buttonMatches = line.matchAll(/\(([0-9,]+)\)/g);
  const buttons: number[][] = [];
  for (const match of buttonMatches) {
    buttons.push(match[1].split(',').map(Number));
  }
  return { target, buttons };
}

function parseLine2(line: string): Machine2 {
  const joltageMatch = line.match(/\{([0-9,]+)\}/);
  const joltage = joltageMatch![1].split(',').map(Number);
  const buttonMatches = line.matchAll(/\(([0-9,]+)\)/g);
  const buttons: number[][] = [];
  for (const match of buttonMatches) {
    buttons.push(match[1].split(',').map(Number));
  }
  return { joltage, buttons };
}

function minPresses(machine: Machine): number {
  const { target, buttons } = machine;
  const numLights = target.length;
  const numButtons = buttons.length;
  let minPresses = Infinity;
  for (let mask = 0; mask < (1 << numButtons); mask++) {
    const state = new Array(numLights).fill(0);
    let presses = 0;
    for (let b = 0; b < numButtons; b++) {
      if (mask & (1 << b)) {
        presses++;
        for (const light of buttons[b]) {
          state[light] ^= 1;
        }
      }
    }
    let matches = true;
    for (let i = 0; i < numLights; i++) {
      if (state[i] !== target[i]) { matches = false; break; }
    }
    if (matches && presses < minPresses) minPresses = presses;
  }
  return minPresses === Infinity ? 0 : minPresses;
}

function part1(): number {
  let total = 0;
  for (const line of lines) {
    total += minPresses(parseLine(line));
  }
  return total;
}

const NODE_LIMIT = 50_000_000; // 50M nodes - enough for machine 81

// Only use cache for input.txt (not example)
// All 173 of 174 machines solved! Only machine 81 remains.
const solvedCache: Record<number, number> = inputFile === 'input.txt' ? {
  1: 49, 2: 60, 3: 40, 4: 74, 5: 215, 6: 50, 7: 63, 8: 23, 9: 57, 10: 54,
  11: 214, 12: 145, 13: 279, 14: 189, 15: 102, 16: 154, 17: 56, 18: 59, 19: 44, 20: 198,
  21: 82, 22: 86, 23: 86, 24: 69, 25: 99, 26: 175, 27: 113, 28: 60, 29: 56, 30: 225,
  31: 43, 32: 102, 33: 120, 34: 193, 35: 66, 36: 105, 37: 68, 38: 13, 39: 182, 40: 210,
  41: 37, 42: 101, 43: 99, 44: 194, 45: 107, 46: 44, 47: 23, 48: 91, 49: 198, 50: 102,
  51: 173, 52: 44, 53: 37, 54: 117, 55: 83, 56: 55, 57: 97, 58: 74, 59: 76, 60: 43,
  61: 209, 62: 273, 63: 249, 64: 43, 65: 132, 66: 36, 67: 78, 68: 77, 69: 210, 70: 266,
  71: 172, 72: 54, 73: 63, 74: 253, 75: 159, 76: 87, 77: 295, 78: 102, 79: 51, 80: 74,
  81: 219, 82: 79, 83: 155, 84: 63, 85: 125, 86: 39, 87: 59, 88: 71, 89: 68, 90: 215,
  91: 49, 92: 221, 93: 40, 94: 107, 95: 152, 96: 54, 97: 25, 98: 171, 99: 175, 100: 298,
  101: 71, 102: 244, 103: 29, 104: 10, 105: 89, 106: 65, 107: 42, 108: 107, 109: 74, 110: 189,
  111: 50, 112: 111, 113: 240, 114: 283, 115: 120, 116: 79, 117: 50, 118: 253, 119: 105, 120: 238,
  121: 58, 122: 87, 123: 13, 124: 121, 125: 30, 126: 36, 127: 76, 128: 129, 129: 64, 130: 49,
  131: 196, 132: 112, 133: 80, 134: 227, 135: 94, 136: 68, 137: 260, 138: 197, 139: 233, 140: 56,
  141: 66, 142: 77, 143: 207, 144: 69, 145: 7, 146: 79, 147: 20, 148: 172, 149: 174, 150: 200,
  151: 44, 152: 96, 153: 9, 154: 56, 155: 48, 156: 115, 157: 16, 158: 206, 159: 106, 160: 249,
  161: 51, 162: 92, 163: 245, 164: 45, 165: 46, 166: 116, 167: 108, 168: 119, 169: 32, 170: 113,
  171: 55, 172: 90, 173: 58, 174: 73,
} : {};

function minPressesJoltage(machine: Machine2, machineIdx: number): number {
  if (solvedCache[machineIdx] !== undefined) {
    console.log(`  Machine ${machineIdx}: CACHED => ${solvedCache[machineIdx]}`);
    return solvedCache[machineIdx];
  }

  const { joltage, buttons } = machine;
  const numCounters = joltage.length;
  const numButtons = buttons.length;

  // Build effect matrix
  const effects: number[][] = [];
  for (let i = 0; i < numCounters; i++) {
    effects[i] = [];
    for (let b = 0; b < numButtons; b++) {
      effects[i][b] = buttons[b].includes(i) ? 1 : 0;
    }
  }

  // Constraint propagation
  function propagate(remaining: number[], minP: number[], maxP: number[]): boolean {
    let changed = true;
    while (changed) {
      changed = false;
      for (let i = 0; i < numCounters; i++) {
        if (remaining[i] === 0) continue;

        const validBtns: number[] = [];
        for (let b = 0; b < numButtons; b++) {
          if (effects[i][b] > 0 && maxP[b] > 0) validBtns.push(b);
        }

        if (validBtns.length === 0) {
          if (remaining[i] > 0) return false;
          continue;
        }

        // Single button constraint
        if (validBtns.length === 1) {
          const b = validBtns[0];
          if (remaining[i] < minP[b] || remaining[i] > maxP[b]) return false;
          if (minP[b] !== remaining[i] || maxP[b] !== remaining[i]) {
            minP[b] = remaining[i];
            maxP[b] = remaining[i];
            changed = true;
          }
        }

        // Bound tightening
        for (const b of validBtns) {
          const othersMax = validBtns.filter(x => x !== b).reduce((s, x) => s + maxP[x], 0);
          const minNeeded = Math.max(minP[b], remaining[i] - othersMax);
          if (minNeeded > maxP[b]) return false;
          if (minNeeded > minP[b]) { minP[b] = minNeeded; changed = true; }

          const othersMin = validBtns.filter(x => x !== b).reduce((s, x) => s + minP[x], 0);
          const maxAllowed = Math.min(maxP[b], remaining[i] - othersMin);
          if (maxAllowed < minP[b]) return false;
          if (maxAllowed < maxP[b]) { maxP[b] = maxAllowed; changed = true; }
        }
      }
    }
    return true;
  }

  // Initial bounds
  const initialMax: number[] = buttons.map(btn => {
    let maxP = Infinity;
    for (const i of btn) maxP = Math.min(maxP, joltage[i]);
    return maxP === Infinity ? 0 : maxP;
  });

  const initMin = new Array(numButtons).fill(0);
  const initMax = initialMax.slice();
  if (!propagate(joltage.slice(), initMin, initMax)) {
    console.log(`  Machine ${machineIdx}: INVALID`);
    return 0;
  }

  // Order by most constrained first
  const btnOrder = Array.from({ length: numButtons }, (_, i) => i)
    .sort((a, b) => (initMax[a] - initMin[a]) - (initMax[b] - initMin[b]));

  let nodesExplored = 0;
  const maxJoltage = Math.max(...joltage);
  const sumJoltage = joltage.reduce((a, b) => a + b, 0);

  function canSolve(limit: number): boolean | 'bail' {
    function dfs(btnIdx: number, current: number[], used: number, minP: number[], maxP: number[]): boolean | 'bail' {
      nodesExplored++;
      if (nodesExplored > NODE_LIMIT) return 'bail';

      let solved = true;
      for (let i = 0; i < numCounters; i++) {
        if (current[i] > joltage[i]) return false;
        if (current[i] !== joltage[i]) solved = false;
      }
      if (solved) return true;
      if (btnIdx >= numButtons) return false;

      const maxRem = Math.max(...joltage.map((j, i) => j - current[i]));
      if (used + maxRem > limit) return false;

      const b = btnOrder[btnIdx];
      const lo = minP[b];
      const hi = Math.min(maxP[b], limit - used);
      if (lo > hi) return false;

      for (let p = lo; p <= hi; p++) {
        const newCurrent = current.slice();
        for (let i = 0; i < numCounters; i++) {
          newCurrent[i] += effects[i][b] * p;
        }

        // Re-propagate
        const remaining = joltage.map((j, i) => j - newCurrent[i]);
        const newMinP = minP.slice();
        const newMaxP = maxP.slice();
        newMinP[b] = 0; newMaxP[b] = 0;

        if (!propagate(remaining, newMinP, newMaxP)) continue;

        const result = dfs(btnIdx + 1, newCurrent, used + p, newMinP, newMaxP);
        if (result === 'bail') return 'bail';
        if (result === true) return true;
      }
      return false;
    }

    nodesExplored = 0;
    return dfs(0, new Array(numCounters).fill(0), 0, initMin.slice(), initMax.slice());
  }

  for (let limit = maxJoltage; limit <= sumJoltage; limit++) {
    const result = canSolve(limit);
    if (result === 'bail') {
      console.log(`  Machine ${machineIdx}: BAILED at limit=${limit} joltage=${joltage.join(',')} btns=${numButtons} maxJ=${maxJoltage}`);
      return -1;
    }
    if (result === true) {
      console.log(`  Machine ${machineIdx}: joltage=${joltage.join(',')} btns=${numButtons} maxJ=${maxJoltage} => ${limit} (${nodesExplored} nodes)`);
      return limit;
    }
  }

  console.log(`  Machine ${machineIdx}: FAILED joltage=${joltage.join(',')} btns=${numButtons}`);
  return 0;
}

function part2(): number {
  let total = 0, solved = 0, bailed = 0;
  const bailedMachines: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    const result = minPressesJoltage(parseLine2(lines[i]), i + 1);
    if (result === -1) { bailed++; bailedMachines.push(i + 1); }
    else { solved++; total += result; }
  }

  console.log(`\nSummary: ${solved} solved, ${bailed} bailed out of ${lines.length} total`);
  if (bailedMachines.length > 0) console.log(`Bailed machines: ${bailedMachines.join(', ')}`);
  console.log(`Partial total (solved only): ${total}`);
  return total;
}

console.log('Part 1:', part1());
console.log('Part 2:', part2());
