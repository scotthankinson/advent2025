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

const bailed = [5, 11, 12, 13, 15, 20, 21, 22, 23, 24, 25, 26, 27, 32, 33, 34, 35, 36, 37, 39, 40, 42, 43, 45, 48, 50, 51, 54, 55, 57, 58, 59, 61, 62, 63, 67, 68, 69, 70, 74, 76, 77, 78, 79, 81, 82, 85, 88, 89, 90, 94, 100, 101, 102, 105, 106, 108, 112, 113, 114, 115, 118, 119, 120, 122, 124, 127, 128, 129, 132, 133, 134, 135, 137, 138, 143, 150, 152, 156, 158, 159, 160, 162, 163, 166, 167, 168, 170, 172, 174];

console.log("=== ANALYSIS OF BAILED MACHINES ===\n");

// Analyze each bailed machine
for (const idx of bailed) {
  const machine = parseLine2(lines[idx - 1]);
  const { joltage, buttons } = machine;
  const numCounters = joltage.length;
  const numButtons = buttons.length;

  // Build coverage matrix
  const buttonCovers: Set<number>[] = buttons.map(b => new Set(b));

  // Find counters with few covering buttons
  const counterOptions: number[] = [];
  for (let i = 0; i < numCounters; i++) {
    let count = 0;
    for (let b = 0; b < numButtons; b++) {
      if (buttonCovers[b].has(i)) count++;
    }
    counterOptions.push(count);
  }

  // Find if any counter has only 1 button covering it
  const singleCoverCounters = counterOptions.map((c, i) => c === 1 ? i : -1).filter(x => x >= 0);

  // Find if any button covers all counters
  const fullCoverButtons = buttons.map((b, i) => b.length === numCounters ? i : -1).filter(x => x >= 0);

  // Find "independent" counters (only one button affects them)
  const independentCounters: {counter: number, button: number, joltage: number}[] = [];
  for (let i = 0; i < numCounters; i++) {
    const coveringButtons = buttons.map((b, bi) => b.includes(i) ? bi : -1).filter(x => x >= 0);
    if (coveringButtons.length === 1) {
      independentCounters.push({
        counter: i,
        button: coveringButtons[0],
        joltage: joltage[i]
      });
    }
  }

  // Check if buttons are "disjoint" (no overlap)
  let disjoint = true;
  const allCovered = new Set<number>();
  for (const btn of buttons) {
    for (const c of btn) {
      if (allCovered.has(c)) {
        disjoint = false;
        break;
      }
      allCovered.add(c);
    }
    if (!disjoint) break;
  }

  console.log(`Machine ${idx}:`);
  console.log(`  Joltage: [${joltage.join(', ')}]`);
  console.log(`  Counters: ${numCounters}, Buttons: ${numButtons}`);
  console.log(`  Counter coverage: [${counterOptions.join(', ')}] (how many buttons cover each)`);
  if (independentCounters.length > 0) {
    console.log(`  INDEPENDENT counters: ${independentCounters.map(ic => `c${ic.counter}(j=${ic.joltage},btn=${ic.button})`).join(', ')}`);
  }
  if (fullCoverButtons.length > 0) {
    console.log(`  Full-cover buttons: ${fullCoverButtons.join(', ')}`);
  }

  // Check for "decomposable" structure - groups of counters that share buttons
  const counterGroups: Set<number>[] = [];
  const counterToGroup = new Map<number, number>();

  for (let i = 0; i < numCounters; i++) {
    if (counterToGroup.has(i)) continue;

    // BFS to find all connected counters
    const group = new Set<number>([i]);
    const queue = [i];
    while (queue.length > 0) {
      const cur = queue.shift()!;
      // Find all buttons covering cur
      for (let b = 0; b < numButtons; b++) {
        if (buttonCovers[b].has(cur)) {
          // Add all counters this button covers
          for (const c of buttons[b]) {
            if (!group.has(c)) {
              group.add(c);
              queue.push(c);
            }
          }
        }
      }
    }

    for (const c of group) {
      counterToGroup.set(c, counterGroups.length);
    }
    counterGroups.push(group);
  }

  if (counterGroups.length > 1) {
    console.log(`  DECOMPOSABLE into ${counterGroups.length} independent sub-problems!`);
    for (let g = 0; g < counterGroups.length; g++) {
      const counters = Array.from(counterGroups[g]).sort((a, b) => a - b);
      const subJoltage = counters.map(c => joltage[c]);
      console.log(`    Group ${g}: counters ${counters.join(',')} with joltage [${subJoltage.join(', ')}]`);
    }
  }

  console.log();
}

// Summary stats
console.log("=== SUMMARY STATS ===");
const bailedMachines = bailed.map(idx => parseLine2(lines[idx - 1]));

const avgCounters = bailedMachines.reduce((s, m) => s + m.joltage.length, 0) / bailed.length;
const avgButtons = bailedMachines.reduce((s, m) => s + m.buttons.length, 0) / bailed.length;
const avgMaxJ = bailedMachines.reduce((s, m) => s + Math.max(...m.joltage), 0) / bailed.length;

console.log(`Average counters: ${avgCounters.toFixed(1)}`);
console.log(`Average buttons: ${avgButtons.toFixed(1)}`);
console.log(`Average max joltage: ${avgMaxJ.toFixed(1)}`);
