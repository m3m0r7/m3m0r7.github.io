import * as THREE from "three";

const TAU = Math.PI * 2;

function canvasTexture(width, height, draw) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  draw(context, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function roundedRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

function drawSecretStamp(context, width, height, definition) {
  if (!definition.isSecret) return;
  context.save();
  context.translate(width * 0.5, height * 0.59);
  context.rotate(-0.12);
  context.globalAlpha = 0.82;
  context.fillStyle = "#d93645";
  context.font = "800 82px 'Noto Sans JP', sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("㊙", 0, 0);
  context.font = "800 18px sans-serif";
  context.letterSpacing = "4px";
  context.fillText("CONFIDENTIAL", 0, 58);
  context.restore();
}

function makeDocumentTexture(definition) {
  return canvasTexture(320, 400, (context, width, height) => {
    context.fillStyle = definition.color;
    context.fillRect(0, 0, width, height);

    context.fillStyle = definition.accent;
    context.fillRect(0, 0, width, 28);
    context.globalAlpha = 0.13;
    context.fillRect(36, 66, width - 72, 2);
    context.globalAlpha = 1;

    context.fillStyle = definition.accent;
    context.font = "700 24px sans-serif";
    context.letterSpacing = "2px";
    context.fillText(definition.shortLabel, 36, 110);

    if (definition.typeKey === "envelope") {
      context.globalAlpha = 0.4;
      context.strokeStyle = definition.accent;
      context.lineWidth = 5;
      context.beginPath();
      context.moveTo(16, 32);
      context.lineTo(width / 2, height * 0.58);
      context.lineTo(width - 16, 32);
      context.stroke();
      context.globalAlpha = 1;
      roundedRect(context, width * 0.56, height * 0.58, width * 0.31, height * 0.2, 8);
      context.strokeStyle = definition.accent;
      context.lineWidth = 2;
      context.stroke();
      context.font = "800 26px sans-serif";
      context.fillText("KRAFT", 36, height - 48);
      return;
    }

    if (definition.typeKey === "credit-card") {
      const gradient = context.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, definition.accent);
      gradient.addColorStop(1, definition.color);
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);
      context.fillStyle = "rgba(255,255,255,.82)";
      roundedRect(context, 38, 118, 72, 58, 8);
      context.fill();
      context.fillStyle = "rgba(13,43,69,.72)";
      context.font = "700 24px monospace";
      context.fillText("5412  8080  2026", 38, 245);
      context.font = "700 19px sans-serif";
      context.fillText("OFFICE CARD", 38, 300);
      return;
    }

    if (["book", "dictionary"].includes(definition.typeKey)) {
      context.fillStyle = definition.color;
      context.fillRect(0, 0, width, height);
      context.fillStyle = definition.accent;
      context.fillRect(0, 0, 22, height);
      context.globalAlpha = 0.18;
      context.fillRect(48, 52, width - 86, height - 104);
      context.globalAlpha = 1;
      context.fillStyle = definition.accent;
      context.font = "800 23px sans-serif";
      context.fillText(definition.typeKey === "dictionary" ? "OFFICE" : "DESK", 64, 130);
      context.font = "800 39px sans-serif";
      context.fillText(definition.typeKey === "dictionary" ? "DICTIONARY" : "HANDBOOK", 62, 190);
      context.font = "600 18px monospace";
      context.fillText(definition.typeKey === "dictionary" ? "2,480 PAGES" : "REFERENCE / 2026", 64, 235);
      context.strokeStyle = definition.accent;
      context.lineWidth = 4;
      context.strokeRect(48, 52, width - 86, height - 104);
      return;
    }

    if (definition.typeKey === "photo") {
      const gradient = context.createLinearGradient(0, 150, width, height - 40);
      gradient.addColorStop(0, "#8fb4ad");
      gradient.addColorStop(0.52, "#436d69");
      gradient.addColorStop(1, "#d9a86c");
      context.fillStyle = gradient;
      context.fillRect(34, 150, width - 68, height - 198);
      context.fillStyle = "rgba(250,245,225,.65)";
      context.beginPath();
      context.arc(width * 0.68, height * 0.33, 42, 0, TAU);
      context.fill();
      context.fillStyle = "rgba(22,54,51,.6)";
      context.beginPath();
      context.moveTo(34, height - 48);
      context.lineTo(width * 0.38, height * 0.48);
      context.lineTo(width * 0.6, height * 0.7);
      context.lineTo(width * 0.78, height * 0.52);
      context.lineTo(width - 34, height - 48);
      context.fill();
      return;
    }

    if (definition.typeKey === "business-card") {
      context.font = "800 34px sans-serif";
      context.fillText("M. MEMORY", 36, 235);
      context.globalAlpha = 0.52;
      context.font = "500 19px monospace";
      context.fillText("WEB ENGINEER", 36, 278);
      context.fillText("hello@example.test", 36, 322);
      context.globalAlpha = 1;
      return;
    }

    if (definition.typeKey === "receipt") {
      context.font = "600 18px monospace";
      context.fillText("HOME MARKET", 36, 150);
      context.globalAlpha = 0.55;
      for (let line = 0; line < 12; line += 1) {
        const y = 190 + line * 28;
        context.fillRect(36, y, 230 + (line % 3) * 62, 5);
        context.fillRect(width - 105, y, 68, 5);
      }
      context.globalAlpha = 1;
      return;
    }

    context.globalAlpha = 0.42;
    for (let line = 0; line < 12; line += 1) {
      const y = 160 + line * 32;
      const lineWidth = width - 72 - ((line * 47) % 118);
      context.fillRect(36, y, lineWidth, line % 4 === 0 ? 6 : 4);
    }
    context.globalAlpha = 1;

    if (definition.typeKey === "letter") {
      context.font = "italic 22px serif";
      context.fillText("Dear you,", 36, 148);
      context.font = "italic 28px serif";
      context.fillText("Sincerely", width - 190, height - 54);
    }

    if (definition.typeKey === "folded") {
      context.globalAlpha = 0.24;
      context.fillStyle = definition.accent;
      context.fillRect(0, height / 2 - 4, width, 8);
      context.globalAlpha = 1;
    }

    if (definition.typeKey === "stapled") {
      context.fillStyle = definition.accent;
      context.font = "800 18px monospace";
      context.fillText("3 SHEETS / STAPLED", 36, height - 38);
    }

    drawSecretStamp(context, width, height, definition);
  });
}

function makeLabelTexture() {
  return canvasTexture(1024, 256, (context, width, height) => {
    context.fillStyle = "#f6fbfe";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "#56b9e8";
    context.fillRect(0, 0, 25, height);
    context.fillStyle = "#183c59";
    context.font = "800 72px sans-serif";
    context.fillText("PAPER SHREDDER", 66, 100);
    context.fillStyle = "#56758d";
    context.font = "600 32px monospace";
    context.fillText("MAX 4 SHEETS  /  CARD OK", 68, 165);
    context.fillText("CAUTION: KEEP HANDS AWAY", 68, 216);
  });
}

function makeReverseLabelTexture() {
  return canvasTexture(512, 180, (context, width, height) => {
    context.fillStyle = "#cf3541";
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "#fff";
    context.lineWidth = 10;
    context.strokeRect(5, 5, width - 10, height - 10);
    context.fillStyle = "#fff";
    context.font = "900 62px sans-serif";
    context.textAlign = "center";
    context.fillText("↶ REVERSE", width / 2, 76);
    context.font = "800 34px sans-serif";
    context.fillText("HOLD / 長押し", width / 2, 132);
  });
}

function createBox(width, height, depth, material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function createCrosscutPaperGeometry(width, height) {
  return new THREE.PlaneGeometry(width, height);
}

export function createRoom(scene) {
  const deskTexture = canvasTexture(512, 512, (context, width, height) => {
    context.fillStyle = "#e7dcc8";
    context.fillRect(0, 0, width, height);
    context.globalAlpha = 0.16;
    for (let line = 0; line < 52; line += 1) {
      const y = (line * 83) % height;
      context.strokeStyle = line % 3 ? "#fff" : "#9a7d5e";
      context.beginPath();
      context.moveTo(0, y);
      context.bezierCurveTo(width * 0.25, y + 8, width * 0.7, y - 7, width, y + 2);
      context.stroke();
    }
  });
  deskTexture.wrapS = THREE.RepeatWrapping;
  deskTexture.wrapT = THREE.RepeatWrapping;
  deskTexture.repeat.set(4, 3);

  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(24, 0.62, 16),
    new THREE.MeshStandardMaterial({ map: deskTexture, color: 0xffffff, roughness: 0.7 }),
  );
  floor.position.y = -0.32;
  floor.castShadow = true;
  floor.receiveShadow = true;
  scene.add(floor);

  const rug = new THREE.Mesh(
    new THREE.PlaneGeometry(12.6, 8.8),
    new THREE.MeshStandardMaterial({ color: 0xd9edf6, roughness: 0.86 }),
  );
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(0, 0.014, 0.7);
  rug.receiveShadow = true;
  scene.add(rug);

  const rugBorder = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.PlaneGeometry(12.6, 8.8)),
    new THREE.LineBasicMaterial({ color: 0x7ab7d4, transparent: true, opacity: 0.78 }),
  );
  rugBorder.rotation.x = -Math.PI / 2;
  rugBorder.position.copy(rug.position).add(new THREE.Vector3(0, 0.01, 0));
  scene.add(rugBorder);

  const frontEdge = createBox(24.15, 0.18, 0.22, new THREE.MeshStandardMaterial({ color: 0x8ab6cc, roughness: 0.58 }), 0, -0.08, 7.94);
  scene.add(frontEdge);

  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xe8f0f4, roughness: 0.94 });
  const backWall = createBox(24, 9, 0.25, wallMaterial, 0, 4.5, -7.8);
  backWall.receiveShadow = true;
  scene.add(backWall);

  const baseboard = createBox(24, 0.24, 0.17, new THREE.MeshStandardMaterial({ color: 0xb8d3e1, roughness: 0.72 }), 0, 0.12, -7.57);
  scene.add(baseboard);

  const trayMaterial = new THREE.MeshStandardMaterial({ color: 0x628ba4, roughness: 0.7 });
  [0, 0.52].forEach((height, index) => {
    const tray = createBox(4.2, 0.13, 1.8, trayMaterial, 5.8, 0.18 + height, -5.95);
    scene.add(tray);
    const trayBack = createBox(4.2, 0.68, 0.12, trayMaterial, 5.8, 0.46 + height, -6.78);
    scene.add(trayBack);
    if (index === 0) {
      [-1, 1].forEach((side) => scene.add(createBox(0.12, 0.65, 1.8, trayMaterial, 5.8 + side * 2.04, 0.44, -5.95)));
    }
  });
  [0x5ca8cf, 0x315f82, 0xe4b85d, 0x8ba6b5, 0x45799d].forEach((color, index) => {
    const book = createBox(0.33 + (index % 2) * 0.08, 1.08 - (index % 3) * 0.07, 0.7, new THREE.MeshStandardMaterial({ color, roughness: 0.8 }), 4.9 + index * 0.42, 1.28, -6.12);
    book.rotation.z = (index - 2) * 0.018;
    scene.add(book);
  });

  const plantPot = new THREE.Group();
  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.43, 0.33, 0.72, 18),
    new THREE.MeshStandardMaterial({ color: 0x7eabc1, roughness: 0.82 }),
  );
  pot.position.y = 0.36;
  pot.castShadow = true;
  plantPot.add(pot);
  for (let index = 0; index < 7; index += 1) {
    const leaf = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 12, 8),
      new THREE.MeshStandardMaterial({ color: index % 2 ? 0x4f8b70 : 0x65a082, roughness: 0.8 }),
    );
    const angle = index / 7 * TAU;
    leaf.scale.set(0.65, 1.9, 0.45);
    leaf.position.set(Math.cos(angle) * 0.34, 0.95 + (index % 3) * 0.2, Math.sin(angle) * 0.3);
    leaf.rotation.z = Math.cos(angle) * 0.6;
    plantPot.add(leaf);
  }
  plantPot.position.set(-7.7, 0, -5.95);
  scene.add(plantPot);

  const penCup = new THREE.Mesh(
    new THREE.CylinderGeometry(0.48, 0.4, 0.92, 20, 1, true),
    new THREE.MeshStandardMaterial({ color: 0xeff7fa, roughness: 0.5, metalness: 0.08, side: THREE.DoubleSide }),
  );
  penCup.position.set(-6.25, 0.46, -6.1);
  scene.add(penCup);
  [0x2e78a5, 0x4fa7d1, 0xe05b64, 0x263f56].forEach((color, index) => {
    const pen = createBox(0.08, 1.35, 0.08, new THREE.MeshStandardMaterial({ color, roughness: 0.45 }), -6.43 + index * 0.13, 1.14 + (index % 2) * 0.08, -6.1 + (index % 2) * 0.08);
    pen.rotation.z = (index - 1.5) * 0.055;
    scene.add(pen);
  });

  return { floor, rug };
}

export class DeskWasteVisual {
  constructor(definition, scene) {
    this.definition = definition;
    this.scene = scene;
    this.root = new THREE.Group();
    this.root.position.set(definition.position.x, definition.position.y, definition.position.z);
    this.root.rotation.y = definition.rotation;
    this.root.scale.setScalar(definition.scale);
    this.root.userData.deskWaste = this;
    this.baseScale = definition.scale;
    this.homeRotationY = definition.rotation;
    this.restHeight = ["pen", "ruler"].includes(definition.kind) ? 0.08 : 0.1;
    this.status = "table";
    this.held = false;
    this.meshes = [];
    this.materials = new Set();
    this.geometries = new Set();
    this.discardAnimation = null;
    this.buildModel();
    scene.add(this.root);
  }

  material(color, options = {}) {
    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.48, metalness: 0.06, ...options });
    this.materials.add(material);
    return material;
  }

  addMesh(geometry, material, position, rotation = null) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    if (rotation) mesh.rotation.set(...rotation);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.deskWaste = this;
    this.root.add(mesh);
    this.meshes.push(mesh);
    this.geometries.add(geometry);
    return mesh;
  }

  buildModel() {
    if (this.definition.kind === "pen") this.buildPen();
    if (this.definition.kind === "ruler") this.buildRuler();
    if (this.definition.kind === "stamp") this.buildStamp();
    if (this.definition.kind === "stapler") this.buildStapler();
    if (this.definition.kind === "hole-punch") this.buildHolePunch();
  }

  buildPen() {
    const bodyColor = this.definition.variant === "multi" ? 0xe8edf0 : this.definition.color;
    const bodyMaterial = this.material(bodyColor, { roughness: 0.32, metalness: 0.12 });
    const metalMaterial = this.material(0xb9c6cc, { roughness: 0.24, metalness: 0.78 });
    this.addMesh(new THREE.CylinderGeometry(0.07, 0.07, 1.72, 14), bodyMaterial, [0, 0.11, 0], [0, 0, Math.PI / 2]);
    this.addMesh(new THREE.ConeGeometry(0.082, 0.24, 14), metalMaterial, [0.98, 0.11, 0], [0, 0, -Math.PI / 2]);
    this.addMesh(new THREE.CylinderGeometry(0.045, 0.045, 0.15, 10), metalMaterial, [1.1, 0.11, 0], [0, 0, Math.PI / 2]);

    if (this.definition.variant === "cap") {
      const capMaterial = this.material(this.definition.color, { roughness: 0.3 });
      this.addMesh(new THREE.CylinderGeometry(0.1, 0.1, 0.44, 14), capMaterial, [-0.72, 0.11, 0], [0, 0, Math.PI / 2]);
      this.addMesh(new THREE.BoxGeometry(0.48, 0.035, 0.045), capMaterial, [-0.5, 0.2, 0.07], [0, 0, -0.08]);
      return;
    }

    if (this.definition.variant === "grip") {
      const gripMaterial = this.material(0x17394f, { roughness: 0.86 });
      this.addMesh(new THREE.CylinderGeometry(0.092, 0.092, 0.48, 14), gripMaterial, [0.48, 0.11, 0], [0, 0, Math.PI / 2]);
    }

    if (this.definition.variant === "multi") {
      [0x2d78a4, 0xd64b56, 0x263746].forEach((color, index) => {
        this.addMesh(
          new THREE.BoxGeometry(0.2, 0.055, 0.055),
          this.material(color, { roughness: 0.42 }),
          [-0.91, 0.15 + index * 0.045, (index - 1) * 0.065],
        );
      });
    } else {
      this.addMesh(new THREE.CylinderGeometry(0.06, 0.06, 0.18, 12), bodyMaterial, [-0.95, 0.11, 0], [0, 0, Math.PI / 2]);
      this.addMesh(new THREE.BoxGeometry(0.54, 0.035, 0.045), bodyMaterial, [-0.52, 0.2, 0.075], [0, 0, -0.08]);
    }
  }

  buildRuler() {
    const rulerMaterial = this.material(this.definition.color, {
      roughness: 0.42,
      transparent: true,
      opacity: 0.82,
    });
    const markMaterial = this.material(this.definition.accent, { roughness: 0.7 });
    this.addMesh(new THREE.BoxGeometry(2.35, 0.055, 0.3), rulerMaterial, [0, 0.055, 0]);
    for (let index = 0; index <= 20; index += 1) {
      const height = index % 5 === 0 ? 0.13 : index % 2 === 0 ? 0.09 : 0.065;
      this.addMesh(
        new THREE.BoxGeometry(0.012, 0.012, height),
        markMaterial,
        [-1.08 + index * 0.108, 0.09, -0.15 + height * 0.5],
      );
    }
  }

  buildStamp() {
    const baseMaterial = this.material(this.definition.color, { roughness: 0.44 });
    const woodMaterial = this.material(0xb9814d, { roughness: 0.68 });
    const rubberMaterial = this.material(0x55312e, { roughness: 0.92 });
    this.addMesh(new THREE.BoxGeometry(0.7, 0.18, 0.54), baseMaterial, [0, 0.09, 0]);
    this.addMesh(new THREE.BoxGeometry(0.62, 0.06, 0.46), rubberMaterial, [0, 0.025, 0]);
    this.addMesh(new THREE.CylinderGeometry(0.17, 0.25, 0.46, 16), woodMaterial, [0, 0.4, 0]);
    this.addMesh(new THREE.SphereGeometry(0.19, 16, 10), woodMaterial, [0, 0.66, 0]);
  }

  buildStapler() {
    const bodyMaterial = this.material(this.definition.color, { roughness: 0.38, metalness: 0.12 });
    const metalMaterial = this.material(0xbcc9cf, { roughness: 0.24, metalness: 0.82 });
    const darkMaterial = this.material(0x23323a, { roughness: 0.78 });
    this.addMesh(new THREE.BoxGeometry(1.38, 0.1, 0.42), darkMaterial, [0, 0.05, 0]);
    this.addMesh(new THREE.BoxGeometry(1.2, 0.22, 0.36), bodyMaterial, [-0.04, 0.24, 0], [0, 0, -0.045]);
    this.addMesh(new THREE.BoxGeometry(0.82, 0.035, 0.14), metalMaterial, [0.2, 0.13, 0]);
    this.addMesh(new THREE.CylinderGeometry(0.08, 0.08, 0.42, 12), metalMaterial, [-0.58, 0.18, 0], [Math.PI / 2, 0, 0]);
  }

  buildHolePunch() {
    const bodyMaterial = this.material(this.definition.color, { roughness: 0.5, metalness: 0.16 });
    const metalMaterial = this.material(0xb9c6cc, { roughness: 0.24, metalness: 0.82 });
    const darkMaterial = this.material(0x24343c, { roughness: 0.78 });
    this.addMesh(new THREE.BoxGeometry(1.18, 0.12, 0.76), darkMaterial, [0, 0.06, 0]);
    this.addMesh(new THREE.BoxGeometry(0.92, 0.22, 0.44), bodyMaterial, [0, 0.3, -0.08], [0, 0, -0.08]);
    [-0.28, 0.28].forEach((x) => {
      this.addMesh(new THREE.CylinderGeometry(0.09, 0.09, 0.26, 12), metalMaterial, [x, 0.2, 0.14]);
      this.addMesh(new THREE.RingGeometry(0.07, 0.11, 16), metalMaterial, [x, 0.125, 0.22], [-Math.PI / 2, 0, 0]);
    });
    this.addMesh(new THREE.BoxGeometry(0.72, 0.055, 0.12), metalMaterial, [0, 0.14, 0.16]);
  }

  setHeld(held) {
    this.held = held;
    this.root.scale.setScalar(this.baseScale * (held ? 1.08 : 1));
    this.materials.forEach((material) => {
      material.emissive?.setHex(held ? 0x17435a : 0x000000);
      material.emissiveIntensity = held ? 0.34 : 0;
    });
  }

  returnToDesk(position = null) {
    this.status = "table";
    this.discardAnimation = null;
    this.root.visible = true;
    this.root.scale.setScalar(this.baseScale);
    this.root.rotation.set(0, this.homeRotationY, 0);
    if (position) this.root.position.set(position.x, this.restHeight, position.z);
    else this.root.position.y = this.restHeight;
    this.setHeld(false);
  }

  startDiscard(targetPosition, now) {
    this.status = "discarding";
    this.setHeld(false);
    this.discardAnimation = {
      startAt: now,
      startPosition: this.root.position.clone(),
      targetPosition: targetPosition.clone(),
      startRotation: this.root.rotation.clone(),
    };
  }

  update(now) {
    if (!this.discardAnimation) return false;
    const progress = Math.min(1, Math.max(0, (now - this.discardAnimation.startAt) / 720));
    const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    this.root.position.lerpVectors(this.discardAnimation.startPosition, this.discardAnimation.targetPosition, eased);
    this.root.position.y += Math.sin(progress * Math.PI) * 0.72;
    this.root.rotation.x = this.discardAnimation.startRotation.x + progress * Math.PI * 1.35;
    this.root.rotation.y = this.discardAnimation.startRotation.y + progress * Math.PI * 0.72;
    this.root.rotation.z = this.discardAnimation.startRotation.z + progress * Math.PI * 0.9;
    this.root.scale.setScalar(this.baseScale * (1 - progress * 0.28));
    if (progress < 1) return false;
    this.status = "discarded";
    this.discardAnimation = null;
    return true;
  }

  dispose() {
    this.geometries.forEach((geometry) => geometry.dispose());
    this.materials.forEach((material) => material.dispose());
    this.root.removeFromParent();
  }
}

export class WastebasketVisual {
  constructor(scene) {
    this.group = new THREE.Group();
    this.group.position.set(5.35, 0, -1.2);
    scene.add(this.group);
    this.discardedPieces = [];

    const basketMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x4f7f99,
      roughness: 0.58,
      metalness: 0.08,
      transparent: true,
      opacity: 0.82,
      side: THREE.DoubleSide,
    });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.88, 0.68, 1.52, 24, 1, true), basketMaterial);
    body.position.y = 0.76;
    body.castShadow = true;
    body.receiveShadow = true;
    this.group.add(body);

    const bottom = new THREE.Mesh(
      new THREE.CircleGeometry(0.68, 24),
      new THREE.MeshStandardMaterial({ color: 0x31566c, roughness: 0.7, side: THREE.DoubleSide }),
    );
    bottom.rotation.x = -Math.PI / 2;
    bottom.position.y = 0.02;
    this.group.add(bottom);

    this.opening = new THREE.Mesh(
      new THREE.CircleGeometry(0.76, 32),
      new THREE.MeshBasicMaterial({ color: 0x17384c, transparent: true, opacity: 0.88, side: THREE.DoubleSide }),
    );
    this.opening.rotation.x = -Math.PI / 2;
    this.opening.position.y = 1.49;
    this.opening.userData.action = "wastebasket";
    this.group.add(this.opening);

    this.rimMaterial = new THREE.MeshStandardMaterial({
      color: 0x9bc7da,
      emissive: 0x000000,
      roughness: 0.35,
      metalness: 0.22,
    });
    this.rim = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.055, 10, 32), this.rimMaterial);
    this.rim.rotation.x = Math.PI / 2;
    this.rim.position.y = 1.51;
    this.group.add(this.rim);

    const labelTexture = canvasTexture(256, 96, (context, width, height) => {
      context.fillStyle = "#f5fbfe";
      context.fillRect(0, 0, width, height);
      context.fillStyle = "#54b8e7";
      context.fillRect(0, 0, 12, height);
      context.fillStyle = "#173b56";
      context.font = "800 31px sans-serif";
      context.font = "900 32px sans-serif";
      context.fillText("ゴミ箱", 30, 41);
      context.fillStyle = "#5f7c90";
      context.font = "600 17px monospace";
      context.fillText("WASTE / EMPTY SHREDS", 30, 72);
    });
    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(1.48, 0.55),
      new THREE.MeshBasicMaterial({ map: labelTexture, toneMapped: false }),
    );
    label.position.set(0, 0.86, 0.74);
    this.group.add(label);
  }

  setHighlight(highlighted) {
    this.rimMaterial.color.setHex(highlighted ? 0x4fc3f0 : 0x9bc7da);
    this.rimMaterial.emissive.setHex(highlighted ? 0x164d68 : 0x000000);
    this.rimMaterial.emissiveIntensity = highlighted ? 0.9 : 0;
    this.rim.scale.setScalar(highlighted ? 1.08 : 1);
  }

  getDeskWasteTarget(index) {
    const angle = index * 2.399963;
    const localTarget = new THREE.Vector3(
      Math.cos(angle) * (0.18 + index % 3 * 0.08),
      0.72 + index % 4 * 0.09,
      Math.sin(angle) * (0.14 + index % 2 * 0.1),
    );
    return this.group.localToWorld(localTarget);
  }

  receiveDeskWaste(deskWaste) {
    this.group.attach(deskWaste.root);
  }

  receiveShreds(colors, count = 28) {
    for (let index = 0; index < count; index += 1) {
      const material = new THREE.MeshStandardMaterial({
        color: colors[index % colors.length] ?? 0xe4e0d6,
        roughness: 0.9,
        side: THREE.DoubleSide,
      });
      const piece = new THREE.Mesh(
        createCrosscutPaperGeometry(0.07 + Math.random() * 0.08, 0.08 + Math.random() * 0.12),
        material,
      );
      piece.position.set((Math.random() - 0.5) * 1.1, 1.53 + Math.random() * 0.06, (Math.random() - 0.5) * 0.75);
      piece.rotation.set(-Math.PI / 2, 0, Math.random() * TAU);
      piece.renderOrder = 3;
      this.group.add(piece);
      this.discardedPieces.push(piece);
    }
  }

  clear() {
    this.discardedPieces.forEach((piece) => {
      piece.geometry.dispose();
      piece.material.dispose();
      piece.removeFromParent();
    });
    this.discardedPieces = [];
  }
}

export class ShredderVisual {
  constructor(scene) {
    this.group = new THREE.Group();
    this.group.position.set(0, 0, -3.15);
    scene.add(this.group);
    this.state = "ready";
    this.heat = 0;
    this.fillRatio = 0;
    this.shredPieces = [];
    this.isBinAttached = true;

    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf2f7f9,
      roughness: 0.36,
      metalness: 0.05,
      clearcoat: 0.38,
      clearcoatRoughness: 0.48,
    });
    const edgeMaterial = new THREE.MeshStandardMaterial({ color: 0x2c5874, roughness: 0.38, metalness: 0.12 });
    const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x102d40, roughness: 0.3, metalness: 0.18 });
    const binMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x7ba5b9,
      transparent: true,
      opacity: 0.46,
      roughness: 0.34,
      metalness: 0,
      side: THREE.DoubleSide,
    });

    this.body = new THREE.Group();
    this.body.add(
      createBox(3.75, 3.05, 0.18, bodyMaterial, 0, 1.52, -1.05),
      createBox(0.32, 3.05, 2.28, bodyMaterial, -1.72, 1.52, 0),
      createBox(0.32, 3.05, 2.28, bodyMaterial, 1.72, 1.52, 0),
      createBox(3.75, 0.3, 2.28, bodyMaterial, 0, 0.15, 0),
      createBox(3.75, 0.8, 2.28, bodyMaterial, 0, 2.62, 0),
    );
    this.group.add(this.body);
    this.top = createBox(4.02, 0.53, 2.52, edgeMaterial, 0, 3.1, 0);
    this.group.add(this.top);
    const topInset = createBox(3.58, 0.08, 1.98, darkMaterial, 0, 3.405, -0.02);
    this.group.add(topInset);

    this.slot = createBox(2.76, 0.035, 0.18, new THREE.MeshBasicMaterial({ color: 0x020302 }), 0, 3.46, 0.05);
    this.slot.userData.action = "feed-slot";
    this.group.add(this.slot);

    const guideMaterial = new THREE.MeshStandardMaterial({ color: 0xb4bbb5, roughness: 0.42, metalness: 0.18 });
    [-1, 1].forEach((side) => {
      const guide = createBox(0.12, 0.08, 0.54, guideMaterial, side * 1.52, 3.48, 0.05);
      this.group.add(guide);
    });

    this.indicatorMaterial = new THREE.MeshBasicMaterial({ color: 0x78d33e });
    this.indicator = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 10), this.indicatorMaterial);
    this.indicator.position.set(1.55, 3.48, 0.55);
    this.group.add(this.indicator);

    this.reverseButtonMaterial = new THREE.MeshStandardMaterial({
      color: 0xc73a32,
      emissive: 0x280000,
      emissiveIntensity: 0.25,
      roughness: 0.32,
      metalness: 0.18,
    });
    this.reverseButtonBaseY = 3.5;
    this.reverseButton = createBox(1.1, 0.18, 0.68, this.reverseButtonMaterial, -1.25, this.reverseButtonBaseY, 0.4);
    this.reverseButton.userData.action = "reverse";
    this.group.add(this.reverseButton);

    this.reverseHaloMaterial = new THREE.MeshBasicMaterial({
      color: 0xf04b57,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    this.reverseHalo = new THREE.Mesh(new THREE.RingGeometry(0.53, 0.7, 28), this.reverseHaloMaterial);
    this.reverseHalo.rotation.x = -Math.PI / 2;
    this.reverseHalo.position.set(-1.25, 3.6, 0.4);
    this.group.add(this.reverseHalo);

    this.reverseLabel = new THREE.Mesh(
      new THREE.PlaneGeometry(0.9, 0.31),
      new THREE.MeshBasicMaterial({ map: makeReverseLabelTexture(), transparent: true, toneMapped: false }),
    );
    this.reverseLabel.rotation.x = -Math.PI / 2;
    this.reverseLabel.position.set(-1.17, 3.59, 0.86);
    this.group.add(this.reverseLabel);

    this.reverseProgressDots = Array.from({ length: 4 }, (_, index) => {
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 10, 7),
        new THREE.MeshBasicMaterial({ color: 0x3b1715 }),
      );
      dot.position.set(-1.61 + index * 0.18, 3.58, 0.74);
      this.group.add(dot);
      return dot;
    });

    this.heatVents = Array.from({ length: 5 }, (_, index) => {
      const material = new THREE.MeshStandardMaterial({
        color: 0x252b28,
        emissive: 0x000000,
        emissiveIntensity: 0,
        roughness: 0.34,
        metalness: 0.28,
      });
      const vent = createBox(0.11, 0.055, 0.46, material, -0.2 + index * 0.22, 3.48, 0.58);
      this.group.add(vent);
      return vent;
    });

    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(2.72, 0.68),
      new THREE.MeshBasicMaterial({ map: makeLabelTexture(), toneMapped: false }),
    );
    label.position.set(0, 2.38, 1.146);
    this.group.add(label);

    this.bin = new THREE.Group();
    this.bin.position.set(0, 0, 0.03);
    this.bin.userData.action = "bin-case";
    this.group.add(this.bin);
    this.binFront = new THREE.Mesh(new THREE.PlaneGeometry(3.15, 1.6), binMaterial);
    this.binFront.position.set(0, 1.03, 1.155);
    this.binFront.userData.action = "empty-bin";
    this.bin.add(this.binFront);
    this.binInterior = new THREE.Mesh(
      new THREE.PlaneGeometry(3.02, 1.48),
      new THREE.MeshStandardMaterial({ color: 0x294e61, roughness: 0.76, side: THREE.DoubleSide }),
    );
    this.binInterior.position.set(0, 1.03, 0.72);
    this.bin.add(this.binInterior);
    const binFrame = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(3.28, 1.78, 0.04)),
      new THREE.LineBasicMaterial({ color: 0x262c29, transparent: true, opacity: 0.72 }),
    );
    binFrame.position.copy(this.binFront.position);
    this.bin.add(binFrame);
    this.handle = createBox(0.92, 0.14, 0.1, darkMaterial, 0, 1.66, 1.22);
    this.handle.userData.action = "empty-bin";
    this.bin.add(this.handle);

    const binSideMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x5b6660,
      transparent: true,
      opacity: 0.56,
      roughness: 0.48,
      side: THREE.DoubleSide,
    });
    this.bin.add(
      createBox(0.12, 1.72, 1.86, binSideMaterial, -1.55, 0.92, 0.18),
      createBox(0.12, 1.72, 1.86, binSideMaterial, 1.55, 0.92, 0.18),
      createBox(3.18, 0.12, 1.86, binSideMaterial, 0, 0.08, 0.18),
      createBox(3.18, 1.72, 0.1, binSideMaterial, 0, 0.92, -0.72),
    );

    this.shredContainer = new THREE.Group();
    this.shredContainer.position.set(0, 0, 0);
    this.bin.add(this.shredContainer);

    const rollerMaterial = new THREE.MeshStandardMaterial({ color: 0x555e59, roughness: 0.28, metalness: 0.5 });
    this.rollers = [-1, 1].map((side) => {
      const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.7, 12), rollerMaterial);
      roller.rotation.z = Math.PI / 2;
      roller.position.set(0, 3.28, side * 0.11 + 0.05);
      this.group.add(roller);
      return roller;
    });
  }

  setState(state) {
    this.state = state;
    const colors = {
      ready: 0x4eb8e8,
      processing: 0x42c6dc,
      jammed: 0xff3f32,
      full: 0xff9d24,
      emptying: 0x77c8ff,
      binRemoved: 0xffad33,
      overheated: 0xff493c,
      paused: 0x8c948f,
      complete: 0x4eb8e8,
    };
    this.indicatorMaterial.color.setHex(colors[state] ?? colors.ready);
  }

  setReverseProgress(progress) {
    const safeProgress = Math.min(1, Math.max(0, progress));
    this.reverseButton.position.y = this.reverseButtonBaseY - safeProgress * 0.055;
    this.reverseButtonMaterial.emissiveIntensity = 0.25 + safeProgress * 1.5;
    this.reverseProgressDots.forEach((dot, index) => {
      dot.material.color.setHex(safeProgress >= (index + 1) / this.reverseProgressDots.length ? 0xff6a55 : 0x3b1715);
    });
  }

  setHeat(heat) {
    this.heat = Math.min(100, Math.max(0, heat));
    const ratio = this.heat / 100;
    this.heatVents.forEach((vent, index) => {
      const lit = ratio >= (index + 1) / this.heatVents.length;
      vent.material.color.setHex(lit ? (ratio >= 0.82 ? 0xff493c : 0xffad33) : 0x252b28);
      vent.material.emissive.setHex(lit ? (ratio >= 0.82 ? 0x6b0e08 : 0x4f2600) : 0x000000);
      vent.material.emissiveIntensity = lit ? 0.45 + ratio * 0.8 : 0;
    });
  }

  detachBin(scene) {
    if (!this.isBinAttached) return;
    scene.attach(this.bin);
    this.isBinAttached = false;
  }

  attachBin() {
    if (!this.isBinAttached) this.group.attach(this.bin);
    this.isBinAttached = true;
    this.bin.position.set(0, 0, 0.03);
    this.bin.rotation.set(0, 0, 0);
    this.bin.scale.set(1, 1, 1);
  }

  setFill(fill, capacity) {
    this.fillRatio = Math.min(1, Math.max(0, fill / capacity));
  }

  spawnShreds(document, count = 12) {
    const color = new THREE.Color(document.color);
    for (let index = 0; index < count; index += 1) {
      const material = new THREE.MeshStandardMaterial({
        color: color.clone().offsetHSL((Math.random() - 0.5) * 0.03, 0, -0.04 - Math.random() * 0.06),
        roughness: 0.86,
        side: THREE.DoubleSide,
      });
      const piece = new THREE.Mesh(
        createCrosscutPaperGeometry(0.055 + Math.random() * 0.09, 0.07 + Math.random() * 0.14),
        material,
      );
      piece.position.set((Math.random() - 0.5) * 2.38, 2.58 + Math.random() * 0.3, 0.84 + Math.random() * 0.14);
      piece.rotation.set(0, 0, Math.random() * TAU);
      piece.userData.velocity = new THREE.Vector3((Math.random() - 0.5) * 0.3, -1.6 - Math.random(), 0);
      piece.userData.floor = 0.33 + this.fillRatio * 0.82 + Math.random() * 0.42;
      this.shredContainer.add(piece);
      this.shredPieces.push(piece);
    }
  }

  clearShreds() {
    this.shredPieces.forEach((piece) => {
      piece.geometry.dispose();
      piece.material.dispose();
      piece.removeFromParent();
    });
    this.shredPieces = [];
  }

  update(delta, now) {
    const active = this.state === "processing" || this.state === "jammed";
    if (active) {
      const direction = this.state === "jammed" ? -0.45 : 1;
      this.rollers.forEach((roller, index) => {
        roller.rotation.x += delta * 9 * direction * (index ? -1 : 1);
      });
    }
    const indicatorPulse = this.state === "processing"
      ? 1 + Math.sin(now * 0.012) * 0.24
      : this.state === "overheated"
        ? 1 + Math.sin(now * 0.02) * 0.38
        : 1;
    this.indicator.scale.setScalar(indicatorPulse);
    const reversePulse = this.state === "jammed" ? 1 + Math.sin(now * 0.016) * 0.1 : 1;
    this.reverseHalo.scale.setScalar(reversePulse);
    this.reverseHaloMaterial.opacity = this.state === "jammed" ? 0.46 + Math.sin(now * 0.016) * 0.18 : 0.12;
    if (this.state === "overheated") {
      this.heatVents.forEach((vent, index) => {
        vent.scale.y = 1 + Math.sin(now * 0.018 + index * 0.7) * 0.32;
      });
    } else {
      this.heatVents.forEach((vent) => vent.scale.y = 1);
    }

    this.shredPieces.forEach((piece) => {
      if (piece.position.y > piece.userData.floor) {
        piece.userData.velocity.y -= delta * 3.8;
        piece.position.addScaledVector(piece.userData.velocity, delta);
        piece.position.x = THREE.MathUtils.clamp(piece.position.x, -1.34, 1.34);
        piece.position.z = THREE.MathUtils.clamp(piece.position.z, 0.82, 1);
        piece.rotation.x += delta * 4.2;
        piece.rotation.z += delta * 2.7;
        if (piece.position.y < piece.userData.floor) {
          piece.position.y = piece.userData.floor;
          piece.userData.velocity.set(0, 0, 0);
          piece.rotation.x = 0;
          piece.rotation.y = 0;
        }
      }
    });
  }
}

export class DocumentVisual {
  constructor(definition, scene) {
    this.definition = definition;
    this.root = new THREE.Group();
    this.root.position.set(definition.position.x, 0.055 + definition.pileHeight, definition.position.z);
    this.root.rotation.set(-Math.PI / 2, 0, definition.rotation);
    this.root.userData.document = this;
    this.homePosition = this.root.position.clone();
    this.homeRotation = this.root.rotation.clone();
    this.held = false;
    this.selected = false;
    this.focused = false;
    this.phase = definition.index * 1.731;
    this.velocity = new THREE.Vector3();
    this.angularVelocity = new THREE.Vector3();
    this.falling = false;
    this.fallFloorY = this.root.position.y;
    this.geometryActive = false;
    this.prepProgress = 0;
    this.prepared = !definition.prepAction;

    const [width, height] = definition.size;
    const texture = makeDocumentTexture(definition);
    const materialOptions = {
      map: texture,
      color: 0xffffff,
      roughness: definition.rigid ? 0.44 : 0.78,
      metalness: 0,
      side: THREE.DoubleSide,
      emissive: 0x000000,
    };
    this.material = new THREE.MeshStandardMaterial(materialOptions);

    const thickness = definition.thickness ?? 0.035;
    if (definition.rigid) {
      this.mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, thickness), this.material);
    } else {
      this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height, 8, 12), this.material);
      this.basePositions = this.mesh.geometry.attributes.position.array.slice();
    }
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.userData.document = this;
    this.root.add(this.mesh);

    const border = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(width, height)),
      new THREE.LineBasicMaterial({ color: new THREE.Color(definition.accent), transparent: true, opacity: 0.28 }),
    );
    border.position.z = thickness * 0.5 + 0.012;
    border.userData.document = this;
    this.root.add(border);
    this.border = border;

    if (definition.prepAction === "unstaple") {
      this.staple = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.045, 0.055),
        new THREE.MeshStandardMaterial({ color: 0x7c858b, roughness: 0.24, metalness: 0.86 }),
      );
      this.staple.position.set(-width * 0.37, height * 0.39, thickness * 0.5 + 0.045);
      this.staple.rotation.z = -0.14;
      this.root.add(this.staple);
    }

    scene.add(this.root);
  }

  needsPreparation() {
    return Boolean(this.definition.prepAction) && !this.prepared;
  }

  getFeedUnits() {
    if (this.prepared && this.definition.preparedFeedUnits) return this.definition.preparedFeedUnits;
    return this.definition.feedUnits;
  }

  getDisplayLabel() {
    if (this.prepared && this.definition.prepAction === "tear") return `破いた${this.definition.label}`;
    if (this.prepared && this.definition.prepAction === "unstaple") return "針を外した書類";
    return this.definition.label;
  }

  getPreparationLabel() {
    if (!this.needsPreparation()) return "";
    const remaining = this.definition.prepSteps - this.prepProgress;
    if (this.definition.prepAction === "unstaple") return "ホッチキスの針を外す";
    return `${this.definition.label}のページをむしる（あと${remaining}回）`;
  }

  createReleasedPage() {
    const [width, height] = this.definition.size;
    const origin = this.root.getWorldPosition(new THREE.Vector3());
    const side = this.prepProgress % 2 === 0 ? -1 : 1;
    const landingX = THREE.MathUtils.clamp(origin.x + side * (0.78 + Math.random() * 0.34), -8.05, 8.05);
    const landingZ = THREE.MathUtils.clamp(origin.z + 1.08 + this.prepProgress * 0.12, -0.85, 5.6);
    const sourceLabel = this.definition.typeKey === "dictionary" ? "辞書" : "本";
    return {
      definition: {
        id: `${this.definition.id}-pages-${this.prepProgress}`,
        index: this.definition.index + this.prepProgress / 10,
        typeKey: "loose-pages",
        label: `${sourceLabel}から外した書類`,
        shortLabel: `${sourceLabel === "辞書" ? "DICTIONARY" : "BOOK"} PAGES`,
        size: [width * 0.82, height * 0.76],
        stiffness: 0.08,
        feedUnits: this.definition.typeKey === "dictionary" ? 0.9 : 0.78,
        duration: this.definition.typeKey === "dictionary" ? 1080 : 980,
        color: this.prepProgress % 3 === 0 ? "#e9f1f2" : "#f5f1e5",
        accent: this.definition.typeKey === "dictionary" ? "#315f82" : "#4d91bd",
        binUnits: 1,
        rotation: this.root.rotation.z + side * (0.12 + Math.random() * 0.14),
        pileHeight: 0,
        isSecret: false,
        position: { x: landingX, z: landingZ },
      },
      startPosition: new THREE.Vector3(
        origin.x + side * 0.2,
        Math.max(1.65, origin.y + 1.24),
        origin.z + 0.12,
      ),
      landingPosition: new THREE.Vector3(landingX, 0.065 + this.prepProgress * 0.004, landingZ),
    };
  }

  prepare() {
    if (!this.needsPreparation()) return { changed: false, completed: this.prepared, remaining: 0 };
    this.prepProgress = Math.min(this.definition.prepSteps, this.prepProgress + 1);
    if (this.definition.prepAction === "unstaple") this.staple.visible = false;
    const releasedPage = this.definition.prepAction === "tear" ? this.createReleasedPage() : null;
    if (this.definition.prepAction === "tear") {
      const progress = this.prepProgress / this.definition.prepSteps;
      this.mesh.scale.x = 1 - progress * 0.06;
      this.mesh.scale.y = 1 - progress * 0.04;
      this.mesh.scale.z = 1 - progress * 0.76;
    }
    this.prepared = this.prepProgress >= this.definition.prepSteps;
    return {
      changed: true,
      completed: this.prepared,
      remaining: Math.max(0, this.definition.prepSteps - this.prepProgress),
      releasedPage,
    };
  }

  setSelected(selected) {
    this.selected = selected;
    this.refreshHighlight();
  }

  setFocused(focused) {
    this.focused = focused;
    this.refreshHighlight();
  }

  refreshHighlight() {
    const highlighted = this.selected || this.focused;
    const color = this.selected ? 0x39b9ef : this.focused ? 0x79d8f5 : new THREE.Color(this.definition.accent).getHex();
    this.material.emissive.setHex(this.selected ? 0x123c55 : this.focused ? 0x15384c : 0x000000);
    this.material.emissiveIntensity = highlighted ? 0.28 : 0;
    this.border.material.color.setHex(color);
    this.border.material.opacity = highlighted ? 1 : 0.28;
  }

  setHeld(held) {
    this.held = held;
  }

  cancelFall() {
    if (!this.falling) return;
    this.falling = false;
    this.velocity.set(0, 0, 0);
    this.angularVelocity.set(0, 0, 0);
    this.status = "table";
  }

  startFall(landingPosition, motion = 0) {
    const gravity = 5.2;
    const height = Math.max(0.08, this.root.position.y - landingPosition.y);
    const flexibility = 1 - this.definition.stiffness;
    const flightTime = Math.max(0.32, Math.sqrt((height * 2) / gravity));
    this.falling = true;
    this.fallFloorY = landingPosition.y;
    this.velocity.set(
      (landingPosition.x - this.root.position.x) / flightTime,
      0.08 + Math.min(0.24, motion * 0.035) * flexibility,
      (landingPosition.z - this.root.position.z) / flightTime,
    );
    const spinDirection = Math.sin(this.phase + performance.now() * 0.001) < 0 ? -1 : 1;
    this.angularVelocity.set(
      spinDirection * (0.4 + flexibility * 1.1),
      -spinDirection * flexibility * 0.75,
      spinDirection * (0.16 + flexibility * 0.72),
    );
  }

  updateFall(now, delta) {
    const flexibility = 1 - this.definition.stiffness;
    const flutter = Math.sin(now * (0.009 + flexibility * 0.004) + this.phase);
    this.velocity.y -= delta * (5.2 - flexibility * 0.9);
    this.velocity.x += flutter * flexibility * delta * 0.48;
    this.velocity.z += Math.cos(now * 0.007 + this.phase) * flexibility * delta * 0.3;
    this.root.position.addScaledVector(this.velocity, delta);

    const height = Math.max(0, this.root.position.y - this.fallFloorY);
    const landingInfluence = 1 - Math.min(1, height / 0.72);
    const targetX = -Math.PI / 2 + flutter * flexibility * 0.16 * (1 - landingInfluence);
    const targetY = Math.cos(now * 0.01 + this.phase) * flexibility * 0.12 * (1 - landingInfluence);
    this.root.rotation.x = THREE.MathUtils.lerp(this.root.rotation.x, targetX, Math.min(1, delta * (1.7 + landingInfluence * 7)));
    this.root.rotation.y = THREE.MathUtils.lerp(this.root.rotation.y, targetY, Math.min(1, delta * (1.3 + landingInfluence * 8)));
    this.root.rotation.z += this.angularVelocity.z * delta;
    this.angularVelocity.multiplyScalar(Math.pow(0.36, delta));

    if (this.root.position.y > this.fallFloorY) return;
    this.root.position.y = this.fallFloorY;
    this.root.position.x = THREE.MathUtils.clamp(this.root.position.x, -8.2, 8.2);
    this.root.position.z = THREE.MathUtils.clamp(this.root.position.z, -1.25, 5.75);
    this.root.rotation.set(-Math.PI / 2, 0, this.root.rotation.z);
    this.root.renderOrder = 0;
    this.velocity.set(0, 0, 0);
    this.angularVelocity.set(0, 0, 0);
    this.falling = false;
    this.status = "table";
  }

  update(now, motion = 0, delta = 1 / 60) {
    if (this.falling) this.updateFall(now, delta);
    if (!this.basePositions) return;
    const position = this.mesh.geometry.attributes.position;
    const amplitude = this.held
      ? (0.035 + motion * 0.07) * (1 - this.definition.stiffness)
      : this.falling
        ? (0.025 + Math.min(0.035, Math.abs(this.velocity.y) * 0.009)) * (1 - this.definition.stiffness)
        : 0;
    if (amplitude === 0) {
      if (this.geometryActive) {
        this.resetGeometry();
        this.geometryActive = false;
      }
      return;
    }
    this.geometryActive = true;
    for (let index = 0; index < position.count; index += 1) {
      const baseIndex = index * 3;
      const x = this.basePositions[baseIndex];
      const y = this.basePositions[baseIndex + 1];
      const edge = Math.sin((y / this.definition.size[1] + 0.5) * Math.PI);
      position.array[baseIndex + 2] = this.basePositions[baseIndex + 2]
        + Math.sin(now * 0.007 + x * 4.8 + y * 3.2 + this.phase) * amplitude * (0.35 + edge * 0.65);
    }
    position.needsUpdate = true;
    this.mesh.geometry.computeVertexNormals();
  }

  resetGeometry() {
    if (!this.basePositions) return;
    this.mesh.geometry.attributes.position.array.set(this.basePositions);
    this.mesh.geometry.attributes.position.needsUpdate = true;
    this.mesh.geometry.computeVertexNormals();
  }

  dispose() {
    this.material.map?.dispose();
    this.material.dispose();
    this.mesh.geometry.dispose();
    this.border.geometry.dispose();
    this.border.material.dispose();
    this.staple?.geometry.dispose();
    this.staple?.material.dispose();
    this.root.removeFromParent();
  }
}
