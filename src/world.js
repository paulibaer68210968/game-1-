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
    const path = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ map: dirt, normalMap: normal, color: 0xd8c3a0, roughness: 1, polygonOffset: true, polygonOffsetFactor: -1 }));
    path.receiveShadow = true;
    scene.add(path);
  }

  function addSkyAndLights() {
    scene.background = new THREE.Color(0xa7d2bc);
    scene.fog = new THREE.Fog(0xc4d9b5, 58, 150);
    const skyFiles = ['Skybox_Right.png', 'Skybox_Left.png', 'Skybox_Top.png', 'Skybox_Bottom.png', 'Skybox_Front.png', 'Skybox_Back.png'];
    new THREE.CubeTextureLoader().load(skyFiles.map(assetUrl), (cube) => {
      cube.colorSpace = THREE.SRGBColorSpace;
      scene.background = cube;
    }, undefined, () => {});
    const hemi = new THREE.HemisphereLight(0xe8f7ff, 0x566447, 1.75);
    hemi.position.set(0, 0, 50);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xffe4b4, 2.2);
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
    for (const [kind, config] of Object.entries(scatterData)) {
      onStatus(`Der Garten bekommt ${kind === 'oaks' || kind === 'pines' ? 'Bäume' : 'kleine Details'} …`);
      let template;
      try { template = await getTemplate(config.model); }
      catch (error) { console.warn(`Could not load scatter model ${config.model}`, error); continue; }
      const random = seededRandom(config.seed || 1);
      const desired = Math.round(Math.min(120, area * config.density * (kind === 'oaks' || kind === 'pines' ? 0.19 : 0.105)));
      const targetSize = config.size * scale * ((kind === 'oaks' || kind === 'pines') ? 1.65 : 0.95);
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
        if (Math.hypot(x, y - 18) < 4.2) continue;
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
  const water = addWater();
  addSceneryStones();
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
