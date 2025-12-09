import * as fs from 'fs';

// Allow passing input filename as command line argument for testing
// Usage: npx ts-node solved/day09/solution.ts [input-file]
// Default: npx ts-node solved/day09/solution.ts (uses input.txt)
// Example: npx ts-node solved/day09/solution.ts example.txt
const inputFile = process.argv[2] || 'input.txt';
const input = fs.readFileSync(`solved/day09/${inputFile}`, 'utf-8').trim();
const lines = input.split('\n');

// Parse red tile coordinates
type Point = [number, number];
const tiles: Point[] = lines.map(line => {
  const [x, y] = line.split(',').map(Number);
  return [x, y];
});

// Part 1: Find largest rectangle using any two red tiles as opposite corners
function part1(): number {
  let maxArea = 0;

  // Check all pairs of tiles
  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      const [x1, y1] = tiles[i];
      const [x2, y2] = tiles[j];

      // Rectangle area is inclusive of corner tiles: (|x2-x1|+1) * (|y2-y1|+1)
      const width = Math.abs(x2 - x1) + 1;
      const height = Math.abs(y2 - y1) + 1;
      const area = width * height;

      if (area > maxArea) {
        maxArea = area;
      }
    }
  }

  return maxArea;
}

// Build polygon edges from red tiles
type Edge = { x1: number; y1: number; x2: number; y2: number; vertical: boolean };

function getEdges(): Edge[] {
  const edges: Edge[] = [];
  for (let i = 0; i < tiles.length; i++) {
    const [x1, y1] = tiles[i];
    const [x2, y2] = tiles[(i + 1) % tiles.length];
    edges.push({
      x1: Math.min(x1, x2),
      y1: Math.min(y1, y2),
      x2: Math.max(x1, x2),
      y2: Math.max(y1, y2),
      vertical: x1 === x2
    });
  }
  return edges;
}

// Check if a point is inside or on the polygon boundary
function isInsideOrOnBoundary(x: number, y: number, edges: Edge[]): boolean {
  // First check if on boundary
  for (const e of edges) {
    if (e.vertical) {
      if (x === e.x1 && y >= e.y1 && y <= e.y2) return true;
    } else {
      if (y === e.y1 && x >= e.x1 && x <= e.x2) return true;
    }
  }

  // Ray casting for interior
  let crossings = 0;
  for (const e of edges) {
    if (e.vertical && e.x1 > x) {
      if (y >= e.y1 && y < e.y2) {
        crossings++;
      }
    }
  }
  return crossings % 2 === 1;
}

// Check if entire rectangle is inside polygon
function isRectangleValid(left: number, top: number, right: number, bottom: number, edges: Edge[]): boolean {
  // For a rectangle to be entirely inside a rectilinear polygon,
  // we need to check that no polygon edge crosses through the interior of the rectangle

  // Check all 4 corners are inside
  if (!isInsideOrOnBoundary(left, top, edges)) return false;
  if (!isInsideOrOnBoundary(right, top, edges)) return false;
  if (!isInsideOrOnBoundary(left, bottom, edges)) return false;
  if (!isInsideOrOnBoundary(right, bottom, edges)) return false;

  // Check no edge cuts through the rectangle's interior
  for (const e of edges) {
    if (e.vertical) {
      // Vertical edge at x = e.x1 from y1 to y2
      // It cuts through if x is strictly inside and y range overlaps
      if (e.x1 > left && e.x1 < right) {
        // Check if this vertical edge enters the rectangle
        if (e.y1 < bottom && e.y2 > top) {
          return false;
        }
      }
    } else {
      // Horizontal edge at y = e.y1 from x1 to x2
      if (e.y1 > top && e.y1 < bottom) {
        if (e.x1 < right && e.x2 > left) {
          return false;
        }
      }
    }
  }

  return true;
}

// Part 2: Rectangle must only contain red or green tiles
function part2(): number {
  const edges = getEdges();
  let maxArea = 0;

  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      const [x1, y1] = tiles[i];
      const [x2, y2] = tiles[j];

      const left = Math.min(x1, x2);
      const right = Math.max(x1, x2);
      const top = Math.min(y1, y2);
      const bottom = Math.max(y1, y2);

      if (isRectangleValid(left, top, right, bottom, edges)) {
        const area = (right - left + 1) * (bottom - top + 1);
        if (area > maxArea) {
          maxArea = area;
        }
      }
    }
  }

  return maxArea;
}

console.log('Part 1:', part1());
console.log('Part 2:', part2());
