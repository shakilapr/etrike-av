#!/usr/bin/env node

// Render the canonical OpenSCAD body to ASCII STL and a matching OBJ.
// The OpenSCAD WASM module path is supplied explicitly so this script does not
// assume a repository-specific node_modules location.

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [inputScad, outputStl, outputObj, openScadModule] = process.argv.slice(2);
if (!inputScad || !outputStl || !outputObj || !openScadModule) {
  console.error(
    "Usage: node render_body_mesh.mjs <body.scad> <body.stl> <body.obj> <openscad.js>",
  );
  process.exit(2);
}

const { createOpenSCAD } = await import(pathToFileURL(path.resolve(openScadModule)));
const source = fs.readFileSync(inputScad, "utf8");
const diagnostics = [];
const openScad = await createOpenSCAD({
  noInitialRun: true,
  print: (message) => diagnostics.push(String(message)),
  printErr: (message) => diagnostics.push(String(message)),
});

const stl = await openScad.renderToStl(source);
if (typeof stl !== "string" || !stl.includes("facet normal")) {
  throw new Error(`OpenSCAD did not return ASCII STL:\n${diagnostics.join("\n")}`);
}

fs.mkdirSync(path.dirname(outputStl), { recursive: true });
fs.writeFileSync(outputStl, stl, "utf8");

const vertexMap = new Map();
const vertices = [];
const faces = [];
let triangle = [];

for (const rawLine of stl.split(/\r?\n/)) {
  const match = rawLine.match(/^\s*vertex\s+(.+)$/);
  if (!match) continue;

  const coordinates = match[1].trim().split(/\s+/).map(Number);
  const key = coordinates.map((value) => value.toPrecision(12)).join(" ");
  if (!vertexMap.has(key)) {
    vertexMap.set(key, vertices.length + 1);
    vertices.push(coordinates);
  }
  triangle.push(vertexMap.get(key));

  if (triangle.length === 3) {
    faces.push(triangle);
    triangle = [];
  }
}

const obj = [
  "# Generated from etrike_body.scad; do not edit by hand.",
  "o etrike_body",
  ...vertices.map((vertex) => `v ${vertex.join(" ")}`),
  ...faces.map((face) => `f ${face.join(" ")}`),
  "",
].join("\n");
fs.writeFileSync(outputObj, obj, "utf8");

console.log(
  `Rendered ${faces.length} triangles with ${vertices.length} unique vertices to ${outputStl} and ${outputObj}`,
);
