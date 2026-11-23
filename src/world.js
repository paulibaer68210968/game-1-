const TAU = Math.PI * 2;

function smooth01(value) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

function pointSegmentDistance(point, start, end) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const lengthSq = dx * dx + dy * dy;
  const t = lengthSq > 0 ? Math.max(0, Math.min(1, ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / lengthSq)) : 0;
  return Math.hypot(point[0] - (start[0] + dx * t), point[1] - (start[1] + dy * t));
}

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export async function createWorld(THREE, { scene, data, scatterData, loader, assetUrl, saved = {}, onStatus = () => {} }) {
  const scale = data.worldScale;
  const terrain = data.terrain;
  const minX = terrain.position.x * scale;
  const minY = terrain.position.y * scale;
  const width = terrain.size.width * scale;
  const depth = terrain.size.height * scale;
  const maxX = minX + width;
  const maxY = minY + depth;
  const gltfCache = new Map();
  const textureLoader = new THREE.TextureLoader();
  const props = {};
  const colliders = [];
  const coins = [];
  const placedItems = [];

  function toWorld(position) {
    return new THREE.Vector3(position.x * scale, position.y * scale, position.z * scale);
  }

  function toUV(x, y) {
    return [(x - minX) / width, (y - minY) / depth];
  }

  function editDistance(edit, point) {
    if (edit.path?.length > 1) {
      let best = Infinity;
      for (let i = 1; i < edit.path.length; i += 1) {
        best = Math.min(best, pointSegmentDistance(point, edit.path[i - 1], edit.path[i]));
      }
      return best;
    }
    if (edit.center) return Math.hypot(point[0] - edit.center[0], point[1] - edit.center[1]);
    return Infinity;
  }

  function heightNormalized(u, v) {
    let value = 0.1;
    const point = [u, v];
    for (const edit of terrain.edits) {
      if (edit.operation !== 'raise' && edit.operation !== 'flatten') continue;
      const radius = Number(edit.radius) || 0;
      if (radius <= 0) continue;
      const distance = editDistance(edit, point);
      if (distance >= radius) continue;
      const weight = 1 - smooth01(distance / radius);
      if (edit.operation === 'raise') value += (Number(edit.height) || 0) * weight;
      else if (Number.isFinite(edit.targetHeight)) value += (edit.targetHeight - value) * weight;
    }
    return Math.max(0, Math.min(1, value));
  }

  function heightAt(x, y) {
    const [u, v] = toUV(x, y);
    return terrain.position.z * scale + heightNormalized(u, v) * terrain.size.depth * scale;
  }

  function assetTexture(file, repeat = 1, color = true) {
    const texture = textureLoader.load(assetUrl(file), undefined, undefined, () => {});
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeat, repeat);
    if (color) texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  }

  function getTemplate(file) {
    if (!gltfCache.has(file)) {
      gltfCache.set(file, loader.loadAsync(assetUrl(file)).then(({ scene: source }) => {
        source.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) child.material.side = THREE.FrontSide;
          }
        });
        return source;
      }));
    }
    return gltfCache.get(file);
  }

  async function makeModel(file, targetSize, rotationDegrees = 0, templateOverride = null) {
    const template = templateOverride || await getTemplate(file);
    const modelRoot = new THREE.Group();
    const upright = new THREE.Group();
    upright.rotation.x = Math.PI / 2;
    upright.add(template.clone(true));
    modelRoot.add(upright);
    modelRoot.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(modelRoot);
    const modelSize = bounds.getSize(new THREE.Vector3());
    const maxDimension = Math.max(modelSize.x, modelSize.y, modelSize.z, 0.0001);
    const factor = Math.max(0.001, targetSize / maxDimension);
    upright.scale.setScalar(factor);
    modelRoot.updateMatrixWorld(true);
    const scaledBounds = new THREE.Box3().setFromObject(modelRoot);
    upright.position.z -= scaledBounds.min.z;
    modelRoot.rotation.z = THREE.MathUtils.degToRad(rotationDegrees);
    modelRoot.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return modelRoot;
  }

  function buildTerrain() {
    const segments = 160;
    const positions = [];
    const uvs = [];
    const indices = [];
    for (let row = 0; row <= segments; row += 1) {
      const v = row / segments;
      for (let col = 0; col <= segments; col += 1) {
        const u = col / segments;
        const x = minX + u * width;
        const y = minY + v * depth;
        positions.push(x, y, heightAt(x, y));
        uvs.push(u * 28, v * 28);
      }
    }
    for (let row = 0; row < segments; row += 1) {
      for (let col = 0; col < segments; col += 1) {
        const a = row * (segments + 1) + col;
        const b = a + 1;
        const c = a + segments + 1;
        const d = c + 1;
        indices.push(a, b, c, b, d, c);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    const grass = assetTexture(terrain.layers[0].texture, 28, true);
    const grassNormal = assetTexture(terrain.layers[0].normalMap, 28, false);
    const material = new THREE.MeshStandardMaterial({ map: grass, normalMap: grassNormal, color: 0xd9e9c5, roughness: 0.95 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    scene.add(mesh);
    return mesh;
  }

  function addPaintedPaths() {
    const vertices = [];
    const uvs = [];
    const indices = [];
    let vertexIndex = 0;
    for (const edit of terrain.edits) {
      if (edit.operation !== 'paint' || edit.paintLayer !== 2 || !edit.path?.length) continue;
      const halfWidth = Math.max(0.42, edit.radius * width * 0.54);
      for (let i = 1; i < edit.path.length; i += 1) {
        const aUv = edit.path[i - 1];
        const bUv = edit.path[i];
        const ax = minX + aUv[0] * width;
        const ay = minY + aUv[1] * depth;
        const bx = minX + bUv[0] * width;
        const by = minY + bUv[1] * depth;
        const dx = bx - ax;
        const dy = by - ay;
        const length = Math.hypot(dx, dy) || 1;
        const nx = -dy / length * halfWidth;
        const ny = dx / length * halfWidth;
        const points = [[ax + nx, ay + ny], [ax - nx, ay - ny], [bx + nx, by + ny], [bx - nx, by - ny]];
        for (const [x, y] of points) {
          vertices.push(x, y, heightAt(x, y) + 0.035);
          uvs.push(x * 0.42, y * 0.42);
        }
        indices.push(vertexIndex, vertexIndex + 1, vertexIndex + 2, vertexIndex + 1, vertexIndex + 3, vertexIndex + 2);
        vertexIndex += 4;
      }
    }
    if (!vertices.length) return;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    const dirt = assetTexture(terrain.layers[1].texture, 6, true);
    const normal = assetTexture(terrain.layers[1].normalMap, 6, false);
    const path = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ map: dirt, normalMap: normal, color: 0xe0caa4, roughness: 1, polygonOffset: true, polygonOffsetFactor: -1 }));
    path.receiveShadow = true;
    scene.add(path);
  }

  function addPathPavers() {
    const tiles = [];
    const random = seededRandom(811);
    const palette = [0xb9aa8b, 0xcbbb9c, 0xa99d82, 0xd4c5a5, 0xc3b391];
    for (const edit of terrain.edits) {
      if (edit.operation !== 'paint' || edit.paintLayer !== 2 || !edit.path?.length) continue;
      const halfWidth = Math.max(0.42, edit.radius * width * 0.54);
      const laneCount = Math.max(1, Math.floor((halfWidth * 2) / 0.55));
      for (let i = 1; i < edit.path.length; i += 1) {
        const a = edit.path[i - 1];
        const b = edit.path[i];
        const ax = minX + a[0] * width;
        const ay = minY + a[1] * depth;
        const bx = minX + b[0] * width;
        const by = minY + b[1] * depth;
        const dx = bx - ax;
        const dy = by - ay;
        const length = Math.hypot(dx, dy);
        if (length < 0.04) continue;
        const steps = Math.max(1, Math.ceil(length / 0.62));
        const nx = -dy / length;
        const ny = dx / length;
        for (let lane = 0; lane < laneCount; lane += 1) {
          const side = (lane - (laneCount - 1) / 2) * 0.53;
          for (let step = 0; step < steps; step += 1) {
            const t = (step + 0.5 + (random() - 0.5) * 0.12) / steps;
            const x = ax + dx * t + nx * (side + (random() - 0.5) * 0.09);
            const y = ay + dy * t + ny * (side + (random() - 0.5) * 0.09);
            tiles.push({ x, y, angle: Math.atan2(dy, dx) + (random() - 0.5) * 0.15, color: palette[Math.floor(random() * palette.length)], scale: 0.88 + random() * 0.2 });
          }
        }
      }
    }
    if (!tiles.length) return;
    const geometry = new THREE.CylinderGeometry(0.31, 0.31, 0.075, 6, 1);
    geometry.rotateX(Math.PI / 2);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.94, flatShading: true });
    const stones = new THREE.InstancedMesh(geometry, material, tiles.length);
    const dummy = new THREE.Object3D();
    tiles.forEach((tile, index) => {
      dummy.position.set(tile.x, tile.y, heightAt(tile.x, tile.y) + 0.07);
      dummy.rotation.set(0, 0, tile.angle);
      dummy.scale.set(tile.scale, tile.scale * (0.91 + random() * 0.1), 1);
      dummy.updateMatrix();
      stones.setMatrixAt(index, dummy.matrix);
      stones.setColorAt(index, new THREE.Color(tile.color));
    });
    stones.instanceMatrix.needsUpdate = true;
    if (stones.instanceColor) stones.instanceColor.needsUpdate = true;
    stones.receiveShadow = true;
    scene.add(stones);
  }

  function addSkyAndLights() {
    scene.background = new THREE.Color(0xb8d0ad);
    scene.fog = new THREE.Fog(0xd2dfb6, 58, 150);
    const hemi = new THREE.HemisphereLight(0xfff5e2, 0x66714a, 1.85);
    hemi.position.set(0, 0, 50);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xffe8bf, 2.35);
    sun.position.set(-28, -22, 46);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -38;
    sun.shadow.camera.right = 38;
    sun.shadow.camera.top = 38;
    sun.shadow.camera.bottom = -38;
    sun.shadow.bias = -0.0003;
    scene.add(sun);
    scene.add(sun.target);
  }

  function addWater() {
    const waterData = data.water;
    const center = toWorld(waterData.position);
    const waterGeometry = new THREE.CircleGeometry(1, 72);
    const water = new THREE.Mesh(waterGeometry, new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x286a78),
      transparent: true,
      opacity: 0.84,
      roughness: 0.22,
      metalness: 0.08,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
      side: THREE.DoubleSide,
    }));
    water.scale.set(waterData.size.width * scale * 0.5, waterData.size.height * scale * 0.5, 1);
    water.position.set(center.x, center.y, heightAt(center.x, center.y) + 0.045);
    water.userData.waveSpeed = waterData.waveSpeed;
    water.userData.baseZ = center.z;
    water.receiveShadow = true;
    scene.add(water);
    return water;
  }

  function addWallColliders() {
    for (const item of data.obstacles.items) {
      const center = toWorld(item.position);
      const sizeX = item.size.width * scale;
      const sizeY = item.size.height * scale;
      const sizeZ = item.size.depth * scale;
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(sizeX, sizeY, sizeZ), new THREE.MeshStandardMaterial({ color: 0x736a56, roughness: 0.93 }));
      mesh.position.copy(center);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      colliders.push({ x: center.x, y: center.y, halfX: sizeX * 0.5, halfY: sizeY * 0.5, top: center.z + sizeZ * 0.5, mesh, kind: 'wall' });
    }
  }

  function addPushableBox() {
    const item = data.pushableBox;
    const center = toWorld(item.position);
    const sizeX = item.size.width * scale;
    const sizeY = item.size.height * scale;
    const sizeZ = item.size.depth * scale;
    const texture = assetTexture(item.texture, 1, true);
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(sizeX, sizeY, sizeZ), new THREE.MeshStandardMaterial({ map: texture, color: 0xf3e5c5, roughness: 0.82 }));
    mesh.position.set(center.x, center.y, heightAt(center.x, center.y) + sizeZ * 0.5);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    const collider = { x: center.x, y: center.y, halfX: sizeX * 0.5, halfY: sizeY * 0.5, top: mesh.position.z + sizeZ * 0.5, mesh, kind: 'pushable' };
    colliders.push(collider);
    return collider;
  }

  function addCoinInstances(template) {
    const targetSize = data.coins.modelSize.width * scale;
    for (const [index, position] of data.coins.positions.entries()) {
      const coin = new THREE.Group();
      const upright = new THREE.Group();
      upright.rotation.x = Math.PI / 2;
      upright.add(template.clone(true));
      coin.add(upright);
      coin.scale.setScalar(Math.max(0.001, targetSize));
      coin.position.copy(toWorld(position));
      coin.position.z += 0.16;
      coin.userData.baseZ = coin.position.z;
      coin.userData.baseScale = targetSize;
      coin.userData.phase = index * 0.77;
      coin.userData.collected = false;
      coin.traverse((child) => { if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; } });
      scene.add(coin);
      coins.push(coin);
    }
  }

  async function addDecoration(key, item, visible = true) {
    const size = Math.max(item.modelSize.width, item.modelSize.height, item.modelSize.depth) * scale;
    const mesh = await makeModel(item.asset, size, item.rotationDegrees || 0);
    const p = toWorld(item.position);
    p.z = heightAt(p.x, p.y) + 0.01;
    mesh.position.copy(p);
    mesh.visible = visible;
    scene.add(mesh);
    props[key] = { key, root: mesh, template: await getTemplate(item.asset), asset: item.asset, size, position: p.clone(), modelSize: item.modelSize };
    return props[key];
  }

  function addSceneryStones() {
    const center = toWorld(data.water.position);
    const random = seededRandom(1205);
    const stoneMaterial = new THREE.MeshStandardMaterial({ color: 0x8c9682, roughness: 0.96 });
    const geometry = new THREE.DodecahedronGeometry(0.25, 0);
    for (let i = 0; i < 38; i += 1) {
      const angle = (i / 38) * TAU;
      const wobble = 0.94 + random() * 0.12;
      const x = center.x + Math.cos(angle) * (data.water.size.width * scale * 0.52) * wobble;
      const y = center.y + Math.sin(angle) * (data.water.size.height * scale * 0.53) * wobble;
      const stone = new THREE.Mesh(geometry, stoneMaterial);
      stone.position.set(x, y, heightAt(x, y) + 0.05);
      stone.scale.set(0.55 + random() * 0.85, 0.55 + random() * 0.75, 0.3 + random() * 0.5);
      stone.rotation.z = random() * Math.PI;
      stone.castShadow = true;
      stone.receiveShadow = true;
      scene.add(stone);
    }
  }

  function addGardenBeds() {
    const center = toWorld(data.playerStart.position);
    const random = seededRandom(9341);
    const soil = new THREE.MeshStandardMaterial({ color: 0x806a48, roughness: 1 });
    const border = new THREE.MeshStandardMaterial({ color: 0xb7a687, roughness: 0.94, flatShading: true });
    const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x557a46, roughness: 0.9 });
    const petalMaterials = [0xe8868f, 0xd8a6d6, 0xf1d36e, 0xfff0cc, 0xb58bd2].map((color) => new THREE.MeshStandardMaterial({ color, roughness: 0.82 }));
    const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x83a65e, roughness: 0.9 });
    const soilGeometry = new THREE.CircleGeometry(1, 20);
    const stoneGeometry = new THREE.DodecahedronGeometry(0.15, 0);
    const stemGeometry = new THREE.CylinderGeometry(0.022, 0.03, 0.34, 5);
    stemGeometry.rotateX(Math.PI / 2);
    const leafGeometry = new THREE.SphereGeometry(0.11, 6, 4);
    const petalGeometry = new THREE.SphereGeometry(0.105, 7, 5);
    const centerGeometry = new THREE.SphereGeometry(0.06, 7, 5);
    const spots = [[-4.3, 2.4], [4.6, 2.8], [-5.1, -1.8], [4.8, -2.6], [-2.1, -5.7], [1.2, 5.8], [6.4, 0.4], [-6.1, 1.0]];
    const pathEdits = terrain.edits.filter((edit) => edit.operation === 'paint' && edit.paintLayer === 2 && edit.path?.length > 1);
    for (const [offsetX, offsetY] of spots) {
      const x = center.x + offsetX;
      const y = center.y + offsetY;
      const uv = toUV(x, y);
      const nearPath = pathEdits.some((edit) => edit.path.slice(1).some((point, index) => pointSegmentDistance(uv, edit.path[index], point) < 0.014));
      if (nearPath) continue;
      const z = heightAt(x, y);
      const rx = 0.8 + random() * 0.22;
      const ry = 0.54 + random() * 0.16;
      const bed = new THREE.Mesh(soilGeometry, soil);
      bed.position.set(x, y, z + 0.045);
      bed.scale.set(rx, ry, 1);
      scene.add(bed);
      for (let i = 0; i < 9; i += 1) {
        const angle = (i / 9) * TAU;
        const stone = new THREE.Mesh(stoneGeometry, border);
        stone.position.set(x + Math.cos(angle) * rx * 0.96, y + Math.sin(angle) * ry * 0.96, z + 0.105);
        stone.scale.set(0.8 + random() * 0.55, 0.8 + random() * 0.55, 0.42 + random() * 0.28);
        stone.rotation.z = random() * TAU;
        scene.add(stone);
      }
      for (let i = 0, count = 5 + Math.floor(random() * 3); i < count; i += 1) {
        const fx = x + (random() * 2 - 1) * rx * 0.68;
        const fy = y + (random() * 2 - 1) * ry * 0.64;
        const fz = heightAt(fx, fy);
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.set(fx, fy, fz + 0.2);
        scene.add(stem);
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        leaf.position.set(fx + (random() - 0.5) * 0.2, fy + (random() - 0.5) * 0.22, fz + 0.18);
        leaf.scale.set(1.2, 0.55, 0.42);
        scene.add(leaf);
        const petals = petalMaterials[Math.floor(random() * petalMaterials.length)];
        for (let petal = 0; petal < 5; petal += 1) {
          const angle = (petal / 5) * TAU;
          const bloom = new THREE.Mesh(petalGeometry, petals);
          bloom.position.set(fx + Math.cos(angle) * 0.085, fy + Math.sin(angle) * 0.085, fz + 0.39);
          bloom.scale.set(0.82, 0.68, 0.62);
          scene.add(bloom);
        }
        const heart = new THREE.Mesh(centerGeometry, petalMaterials[2]);
        heart.position.set(fx, fy, fz + 0.41);
        scene.add(heart);
      }
    }
  }

  function insideScatterEdits(config, u, v) {
    if (config.coverage !== 'Painted') return true;
    let active = false;
    for (const edit of config.edits) {
      if (!edit.center) continue;
      const distance = Math.hypot(u - edit.center[0], v - edit.center[1]);
      if (distance <= edit.radius) active = edit.operation === 'add';
    }
    return active;
  }

  async function addScatter() {
    const area = width * depth;
    const playerStartX = data.playerStart.position.x * scale;
    const playerStartY = data.playerStart.position.y * scale;
    for (const [kind, config] of Object.entries(scatterData)) {
      const isTree = kind === 'oaks' || kind === 'pines';
      onStatus(`Der Garten bekommt ${kind === 'oaks' || kind === 'pines' ? 'Bäume' : 'kleine Details'} …`);
      let template;
      try { template = await getTemplate(config.model); }
      catch (error) { console.warn(`Could not load scatter model ${config.model}`, error); continue; }
      const random = seededRandom(config.seed || 1);
      const desired = Math.round(Math.min(120, area * config.density * (kind === 'oaks' || kind === 'pines' ? 0.19 : 0.105)));
      const targetSize = config.size * scale * (isTree ? 0.92 : 0.95);
      const scatterScale = Math.max(0.001, targetSize / 4);
      let placed = 0;
      let attempts = 0;
      while (placed < desired && attempts < desired * 20 + 50) {
        attempts += 1;
        const u = 0.015 + random() * 0.97;
        const v = 0.015 + random() * 0.97;
        if (!insideScatterEdits(config, u, v)) continue;
        const x = minX + u * width;
        const y = minY + v * depth;
        if (Math.hypot(x - playerStartX, y - playerStartY) < (isTree ? 12 : 4.2)) continue;
        const root = new THREE.Group();
        const upright = new THREE.Group();
        upright.rotation.x = Math.PI / 2;
        const clone = template.clone(true);
        upright.add(clone);
        root.add(upright);
        const variation = config.scaleRange ? config.scaleRange.min + random() * (config.scaleRange.max - config.scaleRange.min) : 0.78 + random() * 0.44;
        root.scale.setScalar(scatterScale * variation);
        root.position.set(x, y, heightAt(x, y));
        root.rotation.z = random() * TAU;
        root.traverse((child) => { if (child.isMesh) { child.castShadow = kind === 'oaks' || kind === 'pines'; child.receiveShadow = true; } });
        scene.add(root);
        placed += 1;
      }
    }
  }

  addSkyAndLights();
  buildTerrain();
  addPaintedPaths();
  addPathPavers();
  const water = addWater();
  addSceneryStones();
  addGardenBeds();
  addWallColliders();
  const pushableBox = addPushableBox();

  const playerRoot = new THREE.Group();
  const heading = new THREE.Group();
  playerRoot.add(heading);
  const playerModel = await makeModel(data.playerStart.asset, data.playerStart.modelSize.depth * scale, data.playerStart.rotationDegrees);
  heading.add(playerModel);
  const start = toWorld(data.playerStart.position);
  playerRoot.position.set(start.x, start.y, heightAt(start.x, start.y));
  scene.add(playerRoot);

  onStatus('Münzen werden verteilt …');
  const coinTemplate = await getTemplate(data.coins.asset);
  addCoinInstances(coinTemplate);

  onStatus('Dekoration wird aufgestellt …');
  const decor = data.decorations;
  await addDecoration('sign', decor.sign, true);
  await addDecoration('fountain', decor.fountain, Boolean(saved.restored?.fountain));
  await addDecoration('bench', decor.bench, Boolean(saved.restored?.bench));
  await addDecoration('flowerBed', decor.flowerBed, true);
  await addDecoration('statue', decor.statue, true);
  await addDecoration('lantern', decor.lantern, true);
  await addDecoration('gnome', decor.gnome, true);

  const flags = [];
  for (const position of data.flags.positions) {
    const flag = await makeModel(data.flags.asset, 1.05);
    const p = toWorld(position);
    flag.position.set(p.x, p.y, heightAt(p.x, p.y));
    scene.add(flag);
    flags.push(flag);
  }

  onStatus('Pflanzen und Steine werden gesetzt …');
  await addScatter();

  function createPlacedItem(key, x, y) {
    const source = props[key];
    if (!source) return null;
    const root = new THREE.Group();
    const upright = new THREE.Group();
    upright.rotation.x = Math.PI / 2;
    upright.add(source.template.clone(true));
    root.add(upright);
    const original = new THREE.Group();
    original.add(source.template.clone(true));
    const bounds = new THREE.Box3().setFromObject(original);
    const modelSize = bounds.getSize(new THREE.Vector3());
    const maxDimension = Math.max(modelSize.x, modelSize.y, modelSize.z, 0.0001);
    upright.scale.setScalar(source.size / maxDimension);
    const pz = heightAt(x, y);
    root.position.set(x, y, pz);
    root.rotation.z = Math.random() * TAU;
    root.traverse((child) => { if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; } });
    scene.add(root);
    const entry = { key, root, x, y };
    placedItems.push(entry);
    return entry;
  }

  for (const item of saved.placedItems || []) {
    if (item && props[item.key] && Number.isFinite(item.x) && Number.isFinite(item.y)) createPlacedItem(item.key, item.x, item.y);
  }

  return {
    playerRoot,
    heading,
    playerModel,
    start,
    heightAt,
    coins,
    flags,
    props,
    colliders,
    pushableBox,
    water,
    placedItems,
    createPlacedItem,
    worldBounds: { minX: minX + 1, maxX: maxX - 1, minY: minY + 1, maxY: maxY - 1 },
    dispose() {
      for (const entry of placedItems) scene.remove(entry.root);
    },
  };
}
