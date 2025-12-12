import * as fs from 'fs';

const inputFile = process.argv[2] || 'input.txt';
const input = fs.readFileSync(`src/${inputFile}`, 'utf-8').trim();

type Shape = [number, number][]; // List of (row, col) offsets

// Parse shapes and regions from input
function parseInput(): { shapes: Shape[][], regions: { w: number, h: number, counts: number[] }[] } {
  const sections = input.split('\n\n');
  const shapes: Shape[][] = []; // shapes[i] = all rotations/flips of shape i
  const regions: { w: number, h: number, counts: number[] }[] = [];

  for (const section of sections) {
    const lines = section.split('\n');

    // Check if this section is a shape definition (starts with "N:")
    if (/^\d+:$/.test(lines[0])) {
      const cells: [number, number][] = [];
      for (let r = 1; r < lines.length; r++) {
        for (let c = 0; c < lines[r].length; c++) {
          if (lines[r][c] === '#') {
            cells.push([r - 1, c]);
          }
        }
      }
      shapes.push(getAllOrientations(cells));
    } else {
      // Parse regions - each line is "WxH: count0 count1 ..."
      for (const line of lines) {
        if (line.includes('x')) {
          const [dims, countsStr] = line.split(': ');
          const [w, h] = dims.split('x').map(Number);
          regions.push({ w, h, counts: countsStr.split(' ').map(Number) });
        }
      }
    }
  }

  return { shapes, regions };
}

// Generate all 8 orientations (4 rotations x 2 flips) and normalize
function getAllOrientations(cells: [number, number][]): Shape[] {
  const orientations: Shape[] = [];
  const seen = new Set<string>();

  for (let flip = 0; flip < 2; flip++) {
    let cur: [number, number][] = cells.map(([r, c]) => flip === 0 ? [r, c] : [r, -c]);
    for (let rot = 0; rot < 4; rot++) {
      const normalized = normalize(cur);
      const key = JSON.stringify(normalized);
      if (!seen.has(key)) {
        seen.add(key);
        orientations.push(normalized);
      }
      // Rotate 90 degrees: (r, c) -> (c, -r)
      cur = cur.map(([r, c]): [number, number] => [c, -r]);
    }
  }

  return orientations;
}

// Normalize shape to start at (0, 0)
function normalize(cells: [number, number][]): Shape {
  const minR = Math.min(...cells.map(c => c[0]));
  const minC = Math.min(...cells.map(c => c[1]));
  const normalized = cells.map(([r, c]) => [r - minR, c - minC] as [number, number]);
  normalized.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  return normalized;
}

// Check if we can place a shape at position (r, c) on grid
function canPlace(grid: boolean[][], shape: Shape, r: number, c: number, w: number, h: number): boolean {
  for (const [dr, dc] of shape) {
    const nr = r + dr, nc = c + dc;
    if (nr < 0 || nr >= h || nc < 0 || nc >= w || grid[nr][nc]) return false;
  }
  return true;
}

// Place/remove shape on grid
function place(grid: boolean[][], shape: Shape, r: number, c: number, val: boolean): void {
  for (const [dr, dc] of shape) {
    grid[r + dr][c + dc] = val;
  }
}

// Find first empty cell (row-major order)
function findFirstEmpty(grid: boolean[][], w: number, h: number): [number, number] | null {
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (!grid[r][c]) return [r, c];
    }
  }
  return null;
}

// Solve: try to fit all pieces
function canFit(shapes: Shape[][], w: number, h: number, counts: number[]): boolean {
  // Build list of all pieces to place (with their orientations)
  const pieces: Shape[][] = [];
  for (let i = 0; i < counts.length; i++) {
    for (let j = 0; j < counts[i]; j++) {
      pieces.push(shapes[i]);
    }
  }

  if (pieces.length === 0) return true;

  // Check total area
  const totalArea = pieces.reduce((sum, p) => sum + p[0].length, 0);
  if (totalArea > w * h) {
    return false;
  }

  const grid = Array.from({ length: h }, () => Array(w).fill(false));

  // Optimization: place pieces in order, restrict first piece to a quadrant to avoid symmetry
  // For each piece, try positions in row-major order
  function solve(pieceIdx: number, minPos: number): boolean {
    if (pieceIdx >= pieces.length) return true;

    const piece = pieces[pieceIdx];

    // Try positions starting from minPos to avoid duplicates
    for (let pos = minPos; pos < w * h; pos++) {
      const r = Math.floor(pos / w);
      const c = pos % w;

      for (const orientation of piece) {
        if (canPlace(grid, orientation, r, c, w, h)) {
          place(grid, orientation, r, c, true);
          // Next piece can start from position 0 since pieces are distinguishable by type
          if (solve(pieceIdx + 1, 0)) {
            place(grid, orientation, r, c, false);
            return true;
          }
          place(grid, orientation, r, c, false);
        }
      }
    }

    return false;
  }

  return solve(0, 0);
}

function part1(): number {
  const { shapes, regions } = parseInput();
  let count = 0;
  for (let i = 0; i < regions.length; i++) {
    const { w, h, counts } = regions[i];
    const result = canFit(shapes, w, h, counts);
    if (result) {
      count++;
    }
  }
  return count;
}

function part2(): number {
  return 0;
}

console.log('Part 1:', part1());
console.log('Part 2:', part2());
