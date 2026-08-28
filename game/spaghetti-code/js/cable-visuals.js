import * as THREE from "three";

function material(color, roughness = 0.62, metalness = 0.04) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function addMesh(group, meshes, geometry, meshMaterial, position = [0, 0, 0], rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(geometry, meshMaterial);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  meshes.push(mesh);
  return mesh;
}

function disposeVisual(visual) {
  const geometries = new Set();
  const materials = new Set();
  visual.group.traverse((object) => {
    if (object.geometry) geometries.add(object.geometry);
    if (object.material) materials.add(object.material);
  });
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((meshMaterial) => meshMaterial.dispose());
}

export function createConnectorVisual(kind, radius, cableColor) {
  if (kind === "none") return null;
  const group = new THREE.Group();
  const meshes = [];
  const body = material(kind === "earbud" || kind === "splitter" ? cableColor : 0x0b0c0a, 0.72, 0.05);
  const dark = material(0x020302, 0.86, 0.02);
  const metal = material(0x777a76, 0.28, 0.78);
  const accent = material(0x262924, 0.5, 0.18);

  if (kind === "power-plug") {
    addMesh(group, meshes, new THREE.BoxGeometry(radius * 5.4, radius * 6.2, radius * 4.2), body, [0, radius * 3.1, 0]);
    for (const side of [-1, 1]) {
      addMesh(group, meshes, new THREE.BoxGeometry(radius * 0.62, radius * 3.4, radius * 0.78), metal, [side * radius * 1.05, radius * 7.8, 0]);
    }
  } else if (kind === "figure8-female") {
    addMesh(group, meshes, new THREE.CapsuleGeometry(radius * 2.25, radius * 3.3, 4, 10), body, [0, radius * 3.1, 0]);
    for (const side of [-1, 1]) {
      addMesh(group, meshes, new THREE.CylinderGeometry(radius * 0.58, radius * 0.58, radius * 0.28, 10), dark, [side * radius * 0.95, radius * 5.65, 0]);
    }
  } else if (kind === "power-strip") {
    addMesh(group, meshes, new THREE.BoxGeometry(radius * 7.2, radius * 9, radius * 18), body, [0, radius * 5.3, 0]);
    addMesh(group, meshes, new THREE.BoxGeometry(radius * 5.8, radius * 0.6, radius * 16.2), accent, [0, radius * 9.95, 0]);
    for (let socket = -1; socket <= 1; socket += 1) {
      for (const side of [-1, 1]) {
        addMesh(
          group,
          meshes,
          new THREE.CylinderGeometry(radius * 0.56, radius * 0.56, radius * 0.35, 10),
          dark,
          [side * radius * 1.35, radius * 10.35, socket * radius * 4.6],
        );
      }
    }
  } else if (kind === "hdmi-male") {
    addMesh(group, meshes, new THREE.BoxGeometry(radius * 5.8, radius * 4.2, radius * 2.8), body, [0, radius * 2.1, 0]);
    addMesh(group, meshes, new THREE.BoxGeometry(radius * 5.1, radius * 2.8, radius * 2.35), metal, [0, radius * 5.55, 0]);
    addMesh(group, meshes, new THREE.BoxGeometry(radius * 3.9, radius * 0.45, radius * 1.15), dark, [0, radius * 7.05, 0]);
  } else if (kind === "hdmi-female") {
    addMesh(group, meshes, new THREE.BoxGeometry(radius * 6.4, radius * 5.4, radius * 3.4), body, [0, radius * 2.7, 0]);
    addMesh(group, meshes, new THREE.BoxGeometry(radius * 4.7, radius * 0.55, radius * 1.7), dark, [0, radius * 5.5, 0]);
  } else if (kind === "usb-c-male") {
    addMesh(group, meshes, new THREE.CapsuleGeometry(radius * 1.75, radius * 2.4, 4, 10), body, [0, radius * 2.15, 0]);
    addMesh(group, meshes, new THREE.CapsuleGeometry(radius * 1.25, radius * 1.1, 3, 10), metal, [0, radius * 5, 0]);
  } else if (kind === "usb-c-female") {
    addMesh(group, meshes, new THREE.CapsuleGeometry(radius * 2, radius * 3, 4, 10), body, [0, radius * 2.3, 0]);
    addMesh(group, meshes, new THREE.BoxGeometry(radius * 2.35, radius * 0.5, radius * 0.95), dark, [0, radius * 4.75, 0]);
  } else if (kind === "usb-a-male") {
    addMesh(group, meshes, new THREE.BoxGeometry(radius * 4.4, radius * 4, radius * 2.5), body, [0, radius * 2, 0]);
    addMesh(group, meshes, new THREE.BoxGeometry(radius * 3.75, radius * 2.7, radius * 2.05), metal, [0, radius * 5.35, 0]);
    addMesh(group, meshes, new THREE.BoxGeometry(radius * 2.7, radius * 1.8, radius * 1.25), dark, [0, radius * 5.55, 0]);
  } else if (kind === "usb-a-female") {
    addMesh(group, meshes, new THREE.BoxGeometry(radius * 4.9, radius * 5.2, radius * 3), body, [0, radius * 2.6, 0]);
    addMesh(group, meshes, new THREE.BoxGeometry(radius * 3.35, radius * 0.5, radius * 1.7), dark, [0, radius * 5.35, 0]);
  } else if (kind === "audio-jack") {
    addMesh(group, meshes, new THREE.CylinderGeometry(radius * 1.9, radius * 1.9, radius * 3.1, 10), body, [0, radius * 1.55, 0]);
    addMesh(group, meshes, new THREE.CylinderGeometry(radius * 0.82, radius * 0.82, radius * 5.2, 10), metal, [0, radius * 5.7, 0]);
    for (const offset of [4.25, 5.45, 6.65]) {
      addMesh(group, meshes, new THREE.CylinderGeometry(radius * 0.9, radius * 0.9, radius * 0.32, 10), dark, [0, radius * offset, 0]);
    }
  } else if (kind === "earbud") {
    addMesh(group, meshes, new THREE.CapsuleGeometry(radius * 2.3, radius * 2.8, 4, 10), body, [0, radius * 2.3, 0]);
    addMesh(group, meshes, new THREE.SphereGeometry(radius * 1.8, 10, 8), accent, [radius * 1.8, radius * 4.6, 0]);
  } else if (kind === "splitter") {
    addMesh(group, meshes, new THREE.CapsuleGeometry(radius * 1.8, radius * 2.4, 4, 9), body, [0, radius * 1.8, 0]);
  }

  group.userData.kind = kind;
  return {
    kind,
    group,
    meshes,
    dispose() {
      disposeVisual(this);
    },
  };
}

export function createAccessoryVisual(kind, radius) {
  const group = new THREE.Group();
  const meshes = [];
  const body = material(0x11120f, 0.78, 0.03);
  const seam = material(0x2b2c27, 0.55, 0.08);

  if (kind === "power-brick") {
    addMesh(group, meshes, new THREE.BoxGeometry(radius * 8.5, radius * 15, radius * 5.8), body);
    addMesh(group, meshes, new THREE.BoxGeometry(radius * 7.8, radius * 0.55, radius * 5.15), seam, [0, radius * 2.4, 0]);
  }

  group.userData.kind = kind;
  return {
    kind,
    group,
    meshes,
    dispose() {
      disposeVisual(this);
    },
  };
}
