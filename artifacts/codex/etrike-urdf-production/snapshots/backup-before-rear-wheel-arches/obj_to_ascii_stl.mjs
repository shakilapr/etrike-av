#!/usr/bin/env node

// Convert the repository-owned low-poly OBJ body to a preview-friendly ASCII STL.
// Faces with more than three vertices are triangulated as a fan.

import fs from "node:fs";
import path from "node:path";

const [inputPath, outputPath] = process.argv.slice(2);
if (!inputPath || !outputPath) {
  console.error("Usage: node obj_to_ascii_stl.mjs <input.obj> <output.stl>");
  process.exit(2);
}

const source = fs.readFileSync(inputPath, "utf8");
const vertices = [];
const triangles = [];

for (const rawLine of source.split(/\r?\n/)) {
  const line = rawLine.trim();
  if (line.startsWith("v ")) {
    const values = line.split(/\s+/).slice(1).map(Number);
    if (values.length >= 3 && values.slice(0, 3).every(Number.isFinite)) {
      vertices.push(values.slice(0, 3));
    }
  } else if (line.startsWith("f ")) {
    const indices = line
      .split(/\s+/)
      .slice(1)
      .map((token) => Number(token.split("/")[0]))
      .map((index) => (index < 0 ? vertices.length + index : index - 1));

    for (let index = 1; index < indices.length - 1; index += 1) {
      triangles.push([indices[0], indices[index], indices[index + 1]]);
    }
  }
}

function normal(a, b, c) {
  const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  const value = [
    ab[1] * ac[2] - ab[2] * ac[1],
    ab[2] * ac[0] - ab[0] * ac[2],
    ab[0] * ac[1] - ab[1] * ac[0],
  ];
  const magnitude = Math.hypot(...value);
  return magnitude === 0 ? [0, 0, 0] : value.map((component) => component / magnitude);
}

const lines = ["solid etrike_body"];
for (const triangle of triangles) {
  const points = triangle.map((index) => vertices[index]);
  if (points.some((point) => !point)) {
    throw new Error(`Face references a missing vertex: ${triangle.join(", ")}`);
  }

  const faceNormal = normal(...points);
  lines.push(`  facet normal ${faceNormal.join(" ")}`);
  lines.push("    outer loop");
  for (const point of points) {
    lines.push(`      vertex ${point.join(" ")}`);
  }
  lines.push("    endloop");
  lines.push("  endfacet");
}
lines.push("endsolid etrike_body", "");

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, lines.join("\n"), "utf8");
console.log(`Converted ${vertices.length} vertices and ${triangles.length} triangles to ${outputPath}`);
