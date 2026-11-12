import * as THREE from "three";
import { Sky } from "three/addons/objects/Sky.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const mobile = new URLSearchParams(location.search).has("mobile");
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  preserveDrawingBuffer: true,
  powerPreference: "high-performance",
});
renderer.setPixelRatio(1);
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.9;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2("#152534", 0.0052);
const camera = new THREE.PerspectiveCamera(
  mobile ? 59 : 43,
  innerWidth / innerHeight,
  0.3,
  2500,
);
let seed = 8642;
function random() {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
}
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (x) => {
  x = clamp(x);
  return x * x * (3 - 2 * x);
};
const mat = (color, roughness = 0.72, metalness = 0.08) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness });
const concrete = mat("#bdbbb1"),
  concreteDark = mat("#7c8586"),
  steel = mat("#304858", 0.4, 0.65),
  gold = mat("#c7ac6e", 0.4, 0.6),
  glass = mat("#476578", 0.2, 0.55),
  groundMat = mat("#7d827a"),
  roadMat = mat("#303d44", 0.97, 0),
  white = mat("#d9d5c5"),
  green = mat("#596951"),
  black = mat("#182931");
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.05).texture;
const hemi = new THREE.HemisphereLight("#c1d4e6", "#202c33", 0.75);
scene.add(hemi);
const sun = new THREE.DirectionalLight("#ffd5a0", 5.8);
sun.position.set(-90, 100, 25);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, {
  left: -140,
  right: 140,
  top: 140,
  bottom: -140,
  near: 1,
  far: 450,
});
sun.shadow.bias = -0.0003;
sun.shadow.normalBias = 0.08;
scene.add(sun);
const fill = new THREE.DirectionalLight("#7392b4", 0.7);
fill.position.set(80, 45, 50);
scene.add(fill);
const sky = new Sky();
sky.scale.setScalar(2200);
scene.add(sky);
sky.visible = false;
sky.material.uniforms.turbidity.value = 8;
sky.material.uniforms.rayleigh.value = 1.35;
sky.material.uniforms.mieCoefficient.value = 0.006;
sky.material.uniforms.mieDirectionalG.value = 0.86;
const sunPosition = new THREE.Vector3().setFromSphericalCoords(
  1,
  THREE.MathUtils.degToRad(85),
  THREE.MathUtils.degToRad(243),
);
sky.material.uniforms.sunPosition.value.copy(sunPosition);

const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(1900, 32, 24),
  new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {},
    vertexShader: `varying vec3 vPosition;void main(){vPosition=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `varying vec3 vPosition;void main(){vec3 dir=normalize(vPosition);float h=clamp(dir.y*2.8,0.,1.);vec3 top=vec3(.026,.065,.108);vec3 horizon=vec3(.24,.255,.25);float warm=pow(max(0.,dot(dir,normalize(vec3(-.8,.02,-.2)))),8.);vec3 color=mix(horizon,top,pow(h,.5))+vec3(.33,.21,.09)*warm*pow(1.-h,3.);gl_FragColor=vec4(color,1.);}`,
  }),
);
scene.add(atmosphere);
const distantSun = new THREE.Mesh(
  new THREE.SphereGeometry(28, 32, 24),
  new THREE.MeshBasicMaterial({
    color: "#f3ce94",
    fog: false,
    toneMapped: false,
  }),
);
distantSun.position.set(-700, 75, -700);
scene.add(distantSun);
const cube = new THREE.BoxGeometry(1, 1, 1);
const meshes = [];
function box(x, y, z, w, h, d, material = concrete, parent = scene) {
  const m = new THREE.Mesh(cube, material);
  m.position.set(x, y, z);
  m.scale.set(w, h, d);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}
function beam(a, b, width, depth, material = concrete, parent = scene) {
  const av = new THREE.Vector3(...a),
    bv = new THREE.Vector3(...b),
    m = new THREE.Mesh(cube, material);
  m.position.copy(av).add(bv).multiplyScalar(0.5);
  m.scale.set(width, av.distanceTo(bv), depth);
  m.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    bv.sub(av).normalize(),
  );
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}
function cylinder(
  x,
  y,
  z,
  r,
  h,
  material = concrete,
  parent = scene,
  segments = 20,
) {
  const m = new THREE.Mesh(
    new THREE.CylinderGeometry(r, r, h, segments),
    material,
  );
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}
function wire(points, color = "#c2ae81", opacity = 0.7, parent = scene) {
  const geometry = new THREE.BufferGeometry().setFromPoints(
    points.map((p) => new THREE.Vector3(...p)),
  );
  const line = new THREE.Line(
    geometry,
    new THREE.LineBasicMaterial({ color, transparent: true, opacity }),
  );
  parent.add(line);
  return line;
}

// Grain and joints keep the architecture grounded at closer camera distances.
const noiseCanvas = document.createElement("canvas");
noiseCanvas.width = noiseCanvas.height = 256;
const ctx = noiseCanvas.getContext("2d");
const pixels = ctx.createImageData(256, 256);
for (let i = 0; i < pixels.data.length; i += 4) {
  const n = 170 + random() * 70;
  pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = n;
  pixels.data[i + 3] = 255;
}
ctx.putImageData(pixels, 0, 0);
const grain = new THREE.CanvasTexture(noiseCanvas);
grain.wrapS = grain.wrapT = THREE.RepeatWrapping;
grain.repeat.set(4, 4);
grain.colorSpace = THREE.SRGBColorSpace;
grain.anisotropy = 4;
concrete.map = grain;
concreteDark.map = grain;
const waterGeometry = new THREE.PlaneGeometry(2000, 2000, 1, 1);
const water = new THREE.Mesh(
  waterGeometry,
  new THREE.MeshPhysicalMaterial({
    color: "#244450",
    roughness: 0.29,
    metalness: 0.7,
    clearcoat: 1,
    clearcoatRoughness: 0.35,
  }),
);
water.rotation.x = -Math.PI / 2;
water.position.y = -3;
scene.add(water);
// Fine, deterministic wave strokes. Each output frame belongs to a specific scroll sample.
const ripples = new THREE.Group();
scene.add(ripples);
for (let i = 0; i < 160; i++) {
  const x = (random() - 0.5) * 420,
    z = (random() - 0.5) * 400;
  wire(
    [
      [x, -2.98, z],
      [x + 3 + random() * 12, -2.98, z],
    ],
    i % 4 ? "#52717b" : "#a7a58a",
    0.08,
    ripples,
  );
}
const land = box(0, -1, -156, 235, 5, 188, groundMat);
land.receiveShadow = true;
box(0, 1.5, -66, 160, 1, 8, concreteDark);
for (let i = 0; i < 42; i++)
  box(-80 + i * 4, 2.25, -62.5, 3.8, 0.5, 0.6, concrete);
box(0, 1.6, -150, 13, 0.2, 182, roadMat);
box(0, 1.7, -98, 180, 0.12, 12, roadMat);
box(-52, 1.7, -156, 8, 0.12, 112, roadMat);
box(53, 1.7, -156, 8, 0.12, 112, roadMat);
for (let i = 0; i < 48; i++) {
  box(0, 1.82, -62 - i * 3.6, 0.13, 0.02, 1.8, white);
  box(-85 + i * 3.6, 1.83, -98, 1.9, 0.02, 0.13, white);
}

// A full-scale cable-stayed bridge: A-frame pylons, split deck, parapets, cable fans and piers.
const bridge = new THREE.Group();
scene.add(bridge);
box(0, 3.5, 8, 13, 0.9, 154, concreteDark, bridge);
box(0, 4.02, 8, 11.6, 0.14, 154, roadMat, bridge);
box(0, 4.18, 8, 0.48, 0.2, 154, concrete, bridge);
for (const x of [-6.5, 6.5]) {
  box(x, 4.4, 8, 0.55, 1.1, 154, concrete, bridge);
  box(x, 5.05, 8, 0.12, 0.12, 154, steel, bridge);
  box(x * 0.91, 4.32, 8, 0.4, 0.08, 154, white, bridge);
}
const blueprint = new THREE.Group();
scene.add(blueprint);
for (const z of [-34, 28]) {
  for (const side of [-1, 1]) {
    beam([side * 6, 2.5, z], [side * 1.2, 37, z], 1.8, 2, concrete, bridge);
    box(side * 6, -0.3, z, 2.5, 6, 3.2, concreteDark, bridge);
    wire(
      [
        [side * 6, 2.5, z],
        [side * 1.2, 37, z],
      ],
      "#dfbc6d",
      0,
      blueprint,
    );
    for (let i = 1; i <= 15; i++) {
      const top = [side * (1.2 + i * 0.045), 36.5 - i * 0.42, z],
        baseA = [side * 5.9, 4.65, z + i * 1.9],
        baseB = [side * 5.9, 4.65, z - i * 1.9];
      const cableMat = mat("#d3c5a1", 0.43, 0.58);
      beam(top, baseA, 0.065, 0.065, cableMat, bridge);
      beam(top, baseB, 0.065, 0.065, cableMat, bridge);
      wire([top, baseA], "#dcb86d", 0, blueprint);
      wire([top, baseB], "#dcb86d", 0, blueprint);
    }
  }
  box(0, 35.6, z, 3.5, 1.15, 2, concrete, bridge);
  box(0, 11, z, 9.4, 1, 1.5, concrete, bridge);
}
for (let i = 0; i < 48; i++) {
  const z = -67 + i * 3.2;
  box(-2.8, 4.12, z, 0.12, 0.025, 1.6, white, bridge);
  box(2.8, 4.12, z, 0.12, 0.025, 1.6, white, bridge);
  if (i % 2 === 0)
    for (const side of [-1, 1]) {
      box(side * 6.2, 6.8, z, 0.07, 4.3, 0.07, steel, bridge);
      box(side * 5.85, 8.9, z, 0.8, 0.07, 0.16, steel, bridge);
      const lamp = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 6, 6),
        new THREE.MeshBasicMaterial({ color: "#ffe2a4" }),
      );
      lamp.position.set(side * 5.5, 8.85, z);
      bridge.add(lamp);
    }
  if (i % 5 === 0) {
    box(0, 1.9, z, 11.5, 2.4, 1, concreteDark, bridge);
    box(0, -0.2, z, 3.2, 3.5, 3.6, concreteDark, bridge);
  }
}
const vehicles = [];
for (let i = 0; i < 15; i++) {
  const g = new THREE.Group();
  const lane = i % 2 ? -3.7 : 3.7;
  g.position.set(lane, 4.43, -62 + i * 9);
  box(
    0,
    0,
    0,
    1.6,
    0.65,
    i % 5 ? 3.6 : 6.2,
    mat(["#d6d2c3", "#284354", "#8b8f88", "#baac89"][i % 4]),
    g,
  );
  box(0, 0.5, -0.1, 1.4, 0.5, 1.7, glass, g);
  for (const x of [-0.8, 0.8])
    for (const z of [-1.05, 1.05]) {
      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.31, 0.31, 0.18, 10),
        black,
      );
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, -0.28, z);
      g.add(wheel);
    }
  bridge.add(g);
  vehicles.push({ g, lane, start: -60 + i * 9 });
}

// Facade modules are assembled in the scroll sequence, including the actual floor plates.
const floors = [];
const roofs = [];
function architecture(
  x,
  z,
  width,
  depth,
  height,
  floorCount,
  color = "#c4c3b8",
) {
  const base = new THREE.Group();
  base.position.set(x, 1.8, z);
  scene.add(base);
  box(0, 0.1, 0, width + 3, 0.2, depth + 3, concreteDark, base);
  const floorHeight = height / floorCount;
  for (let floor = 0; floor < floorCount; floor++) {
    const g = new THREE.Group();
    g.position.y = floor * floorHeight;
    base.add(g);
    box(0, 0.2, 0, width, 0.4, depth, mat(color), g);
    box(
      0,
      floorHeight * 0.5,
      0,
      width - 0.6,
      floorHeight - 0.45,
      depth - 0.6,
      glass,
      g,
    );
    for (let col = 0; col <= Math.floor(width / 2.4); col++) {
      const xx = -width / 2 + col * 2.4;
      box(xx, floorHeight * 0.52, depth / 2, 0.15, floorHeight, 0.2, white, g);
      box(xx, floorHeight * 0.52, -depth / 2, 0.15, floorHeight, 0.2, white, g);
    }
    for (let col = 0; col <= Math.floor(depth / 2.4); col++) {
      const zz = -depth / 2 + col * 2.4;
      box(width / 2, floorHeight * 0.52, zz, 0.2, floorHeight, 0.15, white, g);
      box(-width / 2, floorHeight * 0.52, zz, 0.2, floorHeight, 0.15, white, g);
    }
    box(0, floorHeight - 0.2, 0, width + 0.4, 0.32, depth + 0.4, white, g);
    floors.push({ g, index: floor, total: floorCount });
  }
  const roof = box(
    0,
    height + 0.8,
    0,
    width * 0.65,
    1.6,
    depth * 0.7,
    concrete,
    base,
  );
  roofs.push({ roof, height });
  return base;
}
const hospital = architecture(-24, -102, 29, 17, 26, 7);
architecture(-24, -123, 29, 12, 17, 5);
architecture(24, -103, 26, 24, 36, 10, "#b4bab8");
box(-24, 4, -89, 9, 4, 4, concrete);
box(-24, 6.2, -87, 13, 0.4, 8, white);
box(-24, 6.5, -87, 11, 0.1, 6, steel);
const cross = new THREE.Group();
cross.position.set(-24, 26, -93.35);
box(0, 0, 0, 1.7, 0.42, 0.1, mat("#b1a071"), cross);
box(0, 0, 0, 0.42, 1.7, 0.1, mat("#b1a071"), cross);
scene.add(cross);

// Water and renewable infrastructure stay part of the same landscape and camera path.
for (const x of [-61, -75])
  for (const z of [-82, -101]) {
    cylinder(x, 2.6, z, 6.5, 2, concreteDark);
    cylinder(x, 3.64, z, 6, 0.08, mat("#3f727c", 0.28, 0.4));
    beam([x - 6, 3.9, z], [x + 6, 3.9, z], 0.14, 0.15, gold);
    cylinder(x, 4.2, z, 0.3, 1, gold);
  }
box(-69, 5, -123, 27, 7, 13, concrete);
box(-69, 8.8, -123, 28, 0.5, 14, steel);
for (let i = 0; i < 6; i++) box(-80 + i * 4, 5.4, -116.4, 2, 2, 0.1, glass);
for (let r = 0; r < 4; r++)
  for (let c = 0; c < 6; c++) {
    const p = box(
      39 + c * 5.2,
      3 + r * 0.06,
      -78 - r * 4,
      4.6,
      0.15,
      3,
      mat("#183c53", 0.2, 0.6),
    );
    p.rotation.x = -0.25;
  }
box(70, 8, -119, 31, 13, 23, concrete);
box(70, 14.8, -119, 33, 0.5, 25, steel);
for (const x of [57, 67, 77]) {
  cylinder(x, 5.3, -100, 3.6, 7, mat("#7f8b7e"));
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(3.65, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    green,
  );
  dome.position.set(x, 8.8, -100);
  scene.add(dome);
}
cylinder(84, 17, -126, 1, 30, concreteDark);

// Two tower cranes. Their motion, too, belongs to the frame index rather than a clock.
const cranes = [];
for (const [x, z] of [
  [-43, -106],
  [42, -124],
]) {
  const g = new THREE.Group();
  g.position.set(x, 1.8, z);
  scene.add(g);
  const cm = mat("#b99a55", 0.5, 0.4);
  for (let h = 0; h < 45; h += 3) {
    for (const xx of [-0.7, 0.7])
      for (const zz of [-0.7, 0.7]) box(xx, h + 1.5, zz, 0.12, 3, 0.12, cm, g);
    for (const zz of [-0.7, 0.7]) {
      beam([-0.7, h, zz], [0.7, h + 3, zz], 0.08, 0.08, cm, g);
      beam([0.7, h, zz], [-0.7, h + 3, zz], 0.08, 0.08, cm, g);
    }
  }
  const arm = new THREE.Group();
  arm.position.y = 44;
  g.add(arm);
  for (const yy of [0, 0.85])
    for (const zz of [-0.55, 0.55]) box(9, yy, zz, 33, 0.11, 0.11, cm, arm);
  for (let a = -7; a < 25; a += 2) {
    beam([a, 0, -0.55], [a + 2, 0.85, -0.55], 0.08, 0.08, cm, arm);
    beam([a, 0, 0.55], [a + 2, 0.85, 0.55], 0.08, 0.08, cm, arm);
  }
  box(-7, 0, 0, 5, 2, 2, concreteDark, arm);
  beam([0, 0, 0], [0, 5, 0], 0.16, 0.16, cm, arm);
  wire(
    [
      [-6, 0.8, 0],
      [0, 5, 0],
      [24, 0.8, 0],
    ],
    "#d1bd83",
    0.75,
    arm,
  );
  wire(
    [
      [22, 0, 0],
      [22, -17, 0],
    ],
    "#b3b5a9",
    0.8,
    arm,
  );
  box(22, -18, 0, 0.7, 2, 0.5, black, arm);
  cranes.push(arm);
}

// Dense distant skyline with restrained facade detail and lit floor bands.
const cityBoxes = [];
for (let row = 0; row < 5; row++)
  for (let col = 0; col < 24; col++) {
    const x = -155 + col * 13 + random() * 4,
      z = -155 - row * 21 - random() * 6;
    if (Math.abs(x) < 9) continue;
    const h = 12 + Math.pow(random(), 1.6) * 60,
      w = 5 + random() * 6,
      d = 7 + random() * 7;
    cityBoxes.push({ x, y: 1 + h / 2, z, w, h, d });
  }
const city = new THREE.InstancedMesh(
  cube,
  mat("#798a91", 0.46, 0.24),
  cityBoxes.length,
);
city.castShadow = true;
city.receiveShadow = true;
const dummy = new THREE.Object3D();
cityBoxes.forEach((b, i) => {
  dummy.position.set(b.x, b.y, b.z);
  dummy.scale.set(b.w, b.h, b.d);
  dummy.updateMatrix();
  city.setMatrixAt(i, dummy.matrix);
  city.setColorAt(
    i,
    new THREE.Color().setHSL(0.56, 0.06, 0.32 + random() * 0.18),
  );
});
scene.add(city);
const windowBands = [];
cityBoxes.forEach((b, i) => {
  if (i % 2) return;
  for (let h = 4; h < b.h; h += 3.5)
    windowBands.push({
      x: b.x,
      y: h + 1,
      z: b.z + b.d / 2 + 0.03,
      w: b.w * 0.9,
    });
});
const bands = new THREE.InstancedMesh(
  cube,
  mat("#b4b9a7", 0.4, 0.3),
  windowBands.length,
);
windowBands.forEach((b, i) => {
  dummy.position.set(b.x, b.y, b.z);
  dummy.scale.set(b.w, 0.12, 0.05);
  dummy.updateMatrix();
  bands.setMatrixAt(i, dummy.matrix);
});
scene.add(bands);

const cityWindows = [];
cityBoxes.forEach((b, i) => {
  if (i % 3 === 0) return;
  for (let yy = 3; yy < b.h; yy += 3.3)
    for (let xx = -b.w / 2 + 0.7; xx < b.w / 2; xx += 1.8)
      cityWindows.push({
        x: b.x + xx,
        y: yy + 1,
        z: b.z + b.d / 2 + 0.04,
        lit: random() > 0.7,
      });
});
const windowMat = new THREE.MeshStandardMaterial({
  color: "#354f60",
  metalness: 0.5,
  roughness: 0.3,
  emissive: "#e7c18a",
  emissiveIntensity: 0.12,
});
const windows = new THREE.InstancedMesh(cube, windowMat, cityWindows.length);
cityWindows.forEach((b, i) => {
  dummy.position.set(b.x, b.y, b.z);
  dummy.scale.set(1.05, 1.4, 0.05);
  dummy.updateMatrix();
  windows.setMatrixAt(i, dummy.matrix);
  windows.setColorAt(i, new THREE.Color(b.lit ? "#ccba95" : "#213b4d"));
});
scene.add(windows);
// Street trees and plazas add human scale without a toy-like scattered-object composition.
const foliage = new THREE.MeshStandardMaterial({
  color: "#344c3f",
  roughness: 0.95,
});
for (let i = 0; i < 72; i++) {
  const x = (i % 2 ? -1 : 1) * (10 + random() * 75),
    z = -70 - random() * 80;
  if (
    (Math.abs(x - 24) < 17 && Math.abs(z + 103) < 16) ||
    (Math.abs(x + 24) < 19 && Math.abs(z + 109) < 25)
  )
    continue;
  cylinder(x, 3, z, 0.22, 2.6, mat("#625f4d"));
  const tree = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.8 + random(), 2),
    foliage,
  );
  tree.position.set(x, 5, z);
  tree.castShadow = true;
  scene.add(tree);
}

const path = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(77, 27, 77),
    new THREE.Vector3(25, 13, 47),
    new THREE.Vector3(13, 10, -1),
    new THREE.Vector3(-12, 19, -51),
    new THREE.Vector3(-67, 42, -106),
    new THREE.Vector3(107, 99, 44),
  ],
  false,
  "catmullrom",
  0.4,
);
const targets = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(-5, 12, -8),
    new THREE.Vector3(0, 21, -23),
    new THREE.Vector3(-3, 14, -57),
    new THREE.Vector3(-17, 12, -105),
    new THREE.Vector3(-10, 6, -107),
    new THREE.Vector3(0, 5, -75),
  ],
  false,
  "catmullrom",
  0.3,
);
window.setFrame = (index, total = 180) => {
  const p = clamp(index / (total - 1));
  camera.position.copy(path.getPoint(p));
  if (mobile) {
    camera.position.x *= 1.13;
    camera.position.y += 5;
  }
  camera.lookAt(targets.getPoint(p));
  floors.forEach(({ g, index, total }) => {
    const build = clamp(ease((p - 0.27) / 0.35) * total - index);
    g.scale.y = Math.max(0.005, build);
    g.visible = build > 0.005;
  });
  roofs.forEach(({ roof, height }) => {
    const build = ease((p - 0.27) / 0.35);
    roof.position.y = height * build + 0.8;
    roof.visible = build > 0.01;
  });
  cross.visible = p > 0.6;
  vehicles.forEach(({ g, lane, start }, i) => {
    g.position.z =
      ((start + 67 + p * (lane > 0 ? -120 : 120) + 170) % 150) - 67;
  });
  cranes.forEach((g, i) => (g.rotation.y = -0.35 + i * 0.5 + p * 0.55));
  const glow = Math.sin(clamp((p - 0.23) / 0.29) * Math.PI) * 0.65;
  blueprint.children.forEach((l) => (l.material.opacity = glow));
  ripples.position.x = Math.sin(p * 4) * 0.3;
  renderer.render(scene, camera);
  renderer.render(scene, camera);
  document.body.dataset.frame = String(index);
  return true;
};
window.setFrame(0);
window.sceneReady = true;
