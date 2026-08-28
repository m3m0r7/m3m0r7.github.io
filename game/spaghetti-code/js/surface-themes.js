import * as THREE from "three";

export const SURFACE_THEMES = Object.freeze({
  easy: {
    name: "畳",
    background: 0xc9c29e,
    fog: 0xc9c29e,
    roughness: 0.95,
    metalness: 0,
    exposure: 1.06,
  },
  normal: {
    name: "カーペット",
    background: 0xaeb5b0,
    fog: 0xaeb5b0,
    roughness: 1,
    metalness: 0,
    exposure: 1.04,
  },
  hard: {
    name: "フローリング",
    background: 0xb8875e,
    fog: 0xb8875e,
    roughness: 0.76,
    metalness: 0,
    exposure: 1.02,
  },
  extream: {
    name: "大理石",
    background: 0xd9dde1,
    fog: 0xd9dde1,
    roughness: 0.4,
    metalness: 0.02,
    exposure: 1.08,
  },
  ultimate: {
    name: "サーバールーム床",
    background: 0x15212a,
    fog: 0x15212a,
    roughness: 0.68,
    metalness: 0.48,
    exposure: 0.96,
  },
  unknown: {
    name: "サイバー宇宙空間の白い床",
    background: 0x050814,
    fog: 0x050814,
    fogNear: 48,
    fogFar: 135,
    roughness: 0.32,
    metalness: 0.06,
    exposure: 1.08,
    gravityY: 0,
  },
});

function createRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function createSurface(width = 768, height = 480) {
  const surface = document.createElement("canvas");
  surface.width = width;
  surface.height = height;
  return { surface, context: surface.getContext("2d") };
}

function drawTatami() {
  const { surface, context } = createSurface();
  const random = createRandom(0x74617461);
  const roomX = surface.width * 0.1;
  const roomY = surface.height * 0.5 / 19;
  const roomWidth = surface.width * 0.8;
  const roomHeight = surface.height * 18 / 19;
  const unitWidth = roomWidth / 4;
  const unitHeight = roomHeight / 3;
  const layout = [
    [0, 0, 2, 1],
    [2, 0, 2, 1],
    [0, 1, 1, 2],
    [1, 1, 1, 2],
    [2, 1, 1, 2],
    [3, 1, 1, 2],
  ];
  context.fillStyle = "#4d4932";
  context.fillRect(0, 0, surface.width, surface.height);

  for (const [column, row, columnSpan, rowSpan] of layout) {
    const x = roomX + column * unitWidth + 5;
    const y = roomY + row * unitHeight + 5;
    const width = unitWidth * columnSpan - 10;
    const height = unitHeight * rowSpan - 10;
    const verticalWeave = height > width;
    const gradient = context.createLinearGradient(x, y, x + width, y + height);
    gradient.addColorStop(0, "#aaa16b");
    gradient.addColorStop(0.52, "#b9ae73");
    gradient.addColorStop(1, "#958e60");
    context.fillStyle = gradient;
    context.fillRect(x, y, width, height);
    context.strokeStyle = "rgb(239 229 159 / 34%)";
    context.lineWidth = 1;
    const limit = verticalWeave ? width : height;
    for (let offset = 2; offset < limit; offset += 3) {
      context.beginPath();
      if (verticalWeave) {
        context.moveTo(x + offset, y);
        context.lineTo(x + offset, y + height);
      } else {
        context.moveTo(x, y + offset);
        context.lineTo(x + width, y + offset);
      }
      context.stroke();
    }
    context.strokeStyle = "rgb(66 62 38 / 25%)";
    for (let offset = 1; offset < (verticalWeave ? height : width); offset += 7) {
      context.beginPath();
      if (verticalWeave) {
        context.moveTo(x, y + offset);
        context.lineTo(x + width, y + offset);
      } else {
        context.moveTo(x + offset, y);
        context.lineTo(x + offset, y + height);
      }
      context.stroke();
    }
    context.fillStyle = "rgb(69 65 38 / 22%)";
    for (let fleck = 0; fleck < 180; fleck += 1) {
      context.fillRect(x + random() * width, y + random() * height, 1 + random() * 3, 1);
    }
    context.strokeStyle = "#6b633e";
    context.lineWidth = 3;
    context.strokeRect(x + 1.5, y + 1.5, width - 3, height - 3);
  }
  return surface;
}

function drawCarpet() {
  const { surface, context } = createSurface(384, 240);
  const pixels = context.createImageData(surface.width, surface.height);
  const random = createRandom(0x63617270);
  for (let index = 0; index < pixels.data.length; index += 4) {
    const noise = Math.floor(random() * 28) - 14;
    pixels.data[index] = 125 + noise;
    pixels.data[index + 1] = 134 + noise;
    pixels.data[index + 2] = 128 + noise;
    pixels.data[index + 3] = 255;
  }
  context.putImageData(pixels, 0, 0);
  context.lineWidth = 1;
  for (let y = 1; y < surface.height; y += 4) {
    context.strokeStyle = y % 8 ? "rgb(235 239 235 / 16%)" : "rgb(35 42 37 / 13%)";
    context.beginPath();
    context.moveTo(0, y + 0.5);
    context.lineTo(surface.width, y + 0.5);
    context.stroke();
  }
  for (let x = 1; x < surface.width; x += 6) {
    context.strokeStyle = "rgb(245 247 244 / 10%)";
    context.beginPath();
    context.moveTo(x + 0.5, 0);
    context.lineTo(x + 0.5, surface.height);
    context.stroke();
  }
  return surface;
}

function drawWood() {
  const { surface, context } = createSurface();
  const random = createRandom(0x776f6f64);
  const plankHeight = 60;
  for (let row = 0; row < surface.height / plankHeight; row += 1) {
    const y = row * plankHeight;
    const gradient = context.createLinearGradient(0, y, 0, y + plankHeight);
    const lightness = 44 + Math.floor(random() * 9);
    gradient.addColorStop(0, `hsl(28 39% ${lightness + 5}%)`);
    gradient.addColorStop(0.5, `hsl(29 43% ${lightness}%)`);
    gradient.addColorStop(1, `hsl(27 36% ${lightness - 4}%)`);
    context.fillStyle = gradient;
    context.fillRect(0, y, surface.width, plankHeight);
    context.strokeStyle = "rgb(47 25 14 / 42%)";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(0, y + 1.5);
    context.lineTo(surface.width, y + 1.5);
    context.stroke();
    const stagger = row % 2 ? 150 : 390;
    context.beginPath();
    context.moveTo(stagger, y);
    context.lineTo(stagger, y + plankHeight);
    context.stroke();
    for (let grain = 0; grain < 16; grain += 1) {
      const grainY = y + 8 + random() * (plankHeight - 16);
      context.strokeStyle = `rgb(72 37 19 / ${0.08 + random() * 0.12})`;
      context.lineWidth = 0.8 + random();
      context.beginPath();
      context.moveTo(-20, grainY);
      context.bezierCurveTo(180, grainY - 8 + random() * 16, 470, grainY - 8 + random() * 16, 790, grainY);
      context.stroke();
    }
  }
  return surface;
}

function drawMarble() {
  const { surface, context } = createSurface();
  const random = createRandom(0x6d617262);
  const gradient = context.createLinearGradient(0, 0, surface.width, surface.height);
  gradient.addColorStop(0, "#f2f2ef");
  gradient.addColorStop(0.48, "#cfd4d7");
  gradient.addColorStop(1, "#eef0f1");
  context.fillStyle = gradient;
  context.fillRect(0, 0, surface.width, surface.height);
  for (let vein = 0; vein < 42; vein += 1) {
    const y = random() * surface.height;
    context.strokeStyle = `rgb(${70 + random() * 55} ${83 + random() * 50} ${94 + random() * 55} / ${0.06 + random() * 0.16})`;
    context.lineWidth = 0.8 + random() * 5;
    context.beginPath();
    context.moveTo(-40, y);
    context.bezierCurveTo(
      surface.width * 0.23,
      y - 150 + random() * 260,
      surface.width * 0.7,
      y - 130 + random() * 300,
      surface.width + 40,
      y - 60 + random() * 120,
    );
    context.stroke();
  }
  context.strokeStyle = "rgb(45 58 69 / 28%)";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(-30, 410);
  context.bezierCurveTo(210, 120, 390, 430, 790, 90);
  context.stroke();
  return surface;
}

function drawServerFloor() {
  const { surface, context } = createSurface();
  const columns = 6;
  const rows = 4;
  const cellWidth = surface.width / columns;
  const cellHeight = surface.height / rows;
  context.fillStyle = "#1d272e";
  context.fillRect(0, 0, surface.width, surface.height);
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const x = column * cellWidth;
      const y = row * cellHeight;
      const gradient = context.createLinearGradient(x, y, x + cellWidth, y + cellHeight);
      gradient.addColorStop(0, "#58636a");
      gradient.addColorStop(0.5, "#3d484f");
      gradient.addColorStop(1, "#27333a");
      context.fillStyle = gradient;
      context.fillRect(x + 3, y + 3, cellWidth - 6, cellHeight - 6);
      context.strokeStyle = "#11191e";
      context.lineWidth = 4;
      context.strokeRect(x + 2, y + 2, cellWidth - 4, cellHeight - 4);
      context.fillStyle = "#10171b";
      for (const [boltX, boltY] of [[10, 10], [cellWidth - 10, 10], [10, cellHeight - 10], [cellWidth - 10, cellHeight - 10]]) {
        context.beginPath();
        context.arc(x + boltX, y + boltY, 2.7, 0, Math.PI * 2);
        context.fill();
      }
      if ((row + column) % 3 === 1) {
        context.fillStyle = "rgb(11 16 19 / 30%)";
        for (let vent = 0; vent < 7; vent += 1) {
          context.fillRect(x + 20 + vent * 13, y + cellHeight / 2 - 2, 7, 4);
        }
      }
    }
  }
  context.save();
  context.translate(0, surface.height - 24);
  let stripeIndex = 0;
  for (let stripe = -30; stripe < surface.width + 30; stripe += 42) {
    context.fillStyle = stripeIndex % 2 ? "#0a0e10" : "#c5df2d";
    context.beginPath();
    context.moveTo(stripe, 24);
    context.lineTo(stripe + 22, 0);
    context.lineTo(stripe + 50, 0);
    context.lineTo(stripe + 28, 24);
    context.closePath();
    context.fill();
    stripeIndex += 1;
  }
  context.restore();
  return surface;
}

function drawUnknownFloor() {
  const { surface, context } = createSurface();
  context.fillStyle = "#fafcfc";
  context.fillRect(0, 0, surface.width, surface.height);
  context.strokeStyle = "rgb(19 31 39 / 12%)";
  context.lineWidth = 1;
  for (let x = 0; x <= surface.width; x += 48) {
    context.beginPath();
    context.moveTo(x + 0.5, 0);
    context.lineTo(x + 0.5, surface.height);
    context.stroke();
  }
  for (let y = 0; y <= surface.height; y += 48) {
    context.beginPath();
    context.moveTo(0, y + 0.5);
    context.lineTo(surface.width, y + 0.5);
    context.stroke();
  }
  const paths = [
    [0, 92, 174, 92, 174, 148, 334, 148],
    [768, 362, 610, 362, 610, 296, 470, 296],
    [102, 480, 102, 392, 268, 392, 268, 324],
  ];
  paths.forEach((points, index) => {
    context.strokeStyle = index === 1 ? "#b0ed2c" : "#78d8e8";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(points[0], points[1]);
    for (let point = 2; point < points.length; point += 2) context.lineTo(points[point], points[point + 1]);
    context.stroke();
    context.fillStyle = context.strokeStyle;
    context.beginPath();
    context.arc(points.at(-2), points.at(-1), 5, 0, Math.PI * 2);
    context.fill();
  });
  return surface;
}

const DRAWERS = {
  easy: drawTatami,
  normal: drawCarpet,
  hard: drawWood,
  extream: drawMarble,
  ultimate: drawServerFloor,
  unknown: drawUnknownFloor,
};

export function createSurfaceTexture(levelKey, renderer) {
  const surface = (DRAWERS[levelKey] ?? DRAWERS.easy)();
  const texture = new THREE.CanvasTexture(surface);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  return texture;
}
