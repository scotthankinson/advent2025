import * as fs from 'fs';

// Allow passing input filename as command line argument for testing
// Usage: npx ts-node solved/day08/solution.ts [input-file]
// Default: npx ts-node solved/day08/solution.ts (uses input.txt)
// Example: npx ts-node solved/day08/solution.ts example.txt
const inputFile = process.argv[2] || 'input.txt';
const input = fs.readFileSync(`solved/day08/${inputFile}`, 'utf-8').trim();
const lines = input.split('\n');

// Parse junction box coordinates
type Point = [number, number, number];
const points: Point[] = lines.map(line => {
  const [x, y, z] = line.split(',').map(Number);
  return [x, y, z];
});

// Calculate squared distance (avoid sqrt for comparison)
function distSq(a: Point, b: Point): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return dx * dx + dy * dy + dz * dz;
}

// Union-Find data structure
class UnionFind {
  parent: number[];
  rank: number[];
  size: number[];

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
    this.size = new Array(n).fill(1);
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // path compression
    }
    return this.parent[x];
  }

  union(x: number, y: number): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX === rootY) return false; // already in same circuit

    // union by rank
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
      this.size[rootY] += this.size[rootX];
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
      this.size[rootX] += this.size[rootY];
    } else {
      this.parent[rootY] = rootX;
      this.size[rootX] += this.size[rootY];
      this.rank[rootX]++;
    }
    return true;
  }

  getCircuitSizes(): number[] {
    const sizes: number[] = [];
    for (let i = 0; i < this.parent.length; i++) {
      if (this.find(i) === i) {
        sizes.push(this.size[i]);
      }
    }
    return sizes.sort((a, b) => b - a); // descending
  }
}

// Part 1
function part1(numConnections: number = 1000): number {
  const n = points.length;

  // Generate all pairs with their distances
  const pairs: { i: number; j: number; dist: number }[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      pairs.push({ i, j, dist: distSq(points[i], points[j]) });
    }
  }

  // Sort by distance
  pairs.sort((a, b) => a.dist - b.dist);

  // Connect the closest pairs
  const uf = new UnionFind(n);
  const connectionsToMake = Math.min(numConnections, pairs.length);
  for (let k = 0; k < connectionsToMake; k++) {
    uf.union(pairs[k].i, pairs[k].j);
  }

  // Get the 3 largest circuit sizes and multiply
  const sizes = uf.getCircuitSizes();
  return sizes[0] * sizes[1] * sizes[2];
}

// Part 2: Find the last connection that unifies all circuits
function part2(): number {
  const n = points.length;

  // Generate all pairs with their distances
  const pairs: { i: number; j: number; dist: number }[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      pairs.push({ i, j, dist: distSq(points[i], points[j]) });
    }
  }

  // Sort by distance
  pairs.sort((a, b) => a.dist - b.dist);

  // Connect pairs until all are in one circuit
  const uf = new UnionFind(n);
  let numCircuits = n;

  for (const pair of pairs) {
    if (uf.union(pair.i, pair.j)) {
      numCircuits--;
      if (numCircuits === 1) {
        // This was the last connection - return product of X coordinates
        return points[pair.i][0] * points[pair.j][0];
      }
    }
  }

  return 0;
}

// For example: 10 connections, for actual: 1000 connections
const numConnections = points.length === 20 ? 10 : 1000;
console.log('Part 1:', part1(numConnections));
console.log('Part 2:', part2());
