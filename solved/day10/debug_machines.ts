import * as fs from 'fs';

const input = fs.readFileSync('src/input.txt', 'utf-8').trim();
const lines = input.split('\n');

interface Machine2 {
  joltage: number[];
  buttons: number[][];
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

function tryMachine(machine: Machine2): number {
  const { joltage, buttons } = machine;
  const numCounters = joltage.length;
  const numButtons = buttons.length;

  const buttonSets: Set<number>[] = buttons.map(btn => new Set(btn));
  const effects: number[][] = [];
  for (let i = 0; i < numCounters; i++) {
    effects[i] = [];
    for (let b = 0; b < numButtons; b++) {
      effects[i][b] = buttonSets[b].has(i) ? 1 : 0;
    }
  }

  function tryGreedy(): number {
    const current = new Array(numCounters).fill(0);
    let presses = 0;
    const maxPresses = joltage.reduce((a, b) => a + b, 0);

    while (presses < maxPresses) {
      const remaining = joltage.map((j, i) => j - current[i]);
      if (remaining.every(r => r === 0)) return presses;
      if (remaining.some(r => r < 0)) return Infinity;

      const validBtns: number[] = [];
      for (let b = 0; b < numButtons; b++) {
        let canPress = true;
        for (let i = 0; i < numCounters; i++) {
          if (effects[i][b] > 0 && remaining[i] <= 0) {
            canPress = false;
            break;
          }
        }
        if (canPress) validBtns.push(b);
      }

      if (validBtns.length === 0) return Infinity;

      // Pick button that helps most
      let best = -1, bestScore = -1;
      for (const b of validBtns) {
        let score = 0;
        for (let i = 0; i < numCounters; i++) {
          if (effects[i][b] > 0 && remaining[i] > 0) score++;
        }
        if (score > bestScore) { bestScore = score; best = b; }
      }

      if (best < 0) return Infinity;

      for (let i = 0; i < numCounters; i++) {
        current[i] += effects[i][best];
      }
      presses++;
    }
    return Infinity;
  }

  return tryGreedy();
}

let failCount = 0;
for (let i = 0; i < lines.length; i++) {
  const machine = parseLine2(lines[i]);
  const result = tryMachine(machine);
  if (result === Infinity) {
    failCount++;
    if (failCount <= 3) {
      console.log('Line ' + (i+1) + ' FAILED');
      console.log('  Joltage: ' + machine.joltage.join(','));
      console.log('  Buttons: ' + machine.buttons.length);
    }
  }
}
console.log('Total failing machines: ' + failCount + ' out of ' + lines.length);
