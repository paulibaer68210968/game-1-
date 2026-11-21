
if (typeof gdjs.evtsExt__Terrain3D__DefineGrassHelperClasses !== "undefined") {
  gdjs.evtsExt__Terrain3D__DefineGrassHelperClasses.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__Terrain3D__DefineGrassHelperClasses = {};
gdjs.evtsExt__Terrain3D__DefineGrassHelperClasses.idToCallbackMap = new Map();


gdjs.evtsExt__Terrain3D__DefineGrassHelperClasses.userFunc0x96dbb8 = function GDJSInlineCode(runtimeScene, eventsFunctionContext) {
"use strict";
if (gdjs.__terrainGrassExtension) {
    return;
}
// Blades grow on the grounds of the scene: the 3D terrains (see `getGrounds`
// in the terrain helper).

// Size of the object inner area: instances are scaled from it.
const AREA_SIZE = 1000;
const AREA_DEPTH = 40;
const CHUNK_SIZE = 500;
// Blades are placed around the camera as it moves: at most this number by frame, to avoid slowing down the game.
const MAX_BLADES_PLACED_BY_FRAME = 36000;
const MAX_BENDING_OBJECTS = 8;

/**
 * A blade: a thin, tapered strip. Its width and height are 1: blades are
 * scaled by the shader.
 */
const createBladeGeometry = () => {
    const halfWidths = [0.5, 0.42, 0.28, 0];
    const heights = [0, 0.35, 0.7, 1];
    const positions = [];
    halfWidths.forEach((halfWidth, level) => {
        positions.push(-halfWidth, 0, heights[level]);
        if (halfWidth > 0) positions.push(halfWidth, 0, heights[level]);
    });
    const indices = [0, 1, 2, 1, 3, 2, 2, 3, 4, 3, 5, 4, 4, 5, 6];
    const geometry = new THREE.InstancedBufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(new Array(positions.length).fill(0), 3));
    geometry.setIndex(indices);
    return geometry;
};

const vertexShaderDeclarations = `
attribute vec4 grassRoot;
attribute vec2 grassShape;
// The tint of the ground at the root (linear, from 0 to 1).
attribute vec3 grassGroundTint;
uniform mat3 grassWorldToLocal;
uniform float grassWorldScale;
uniform float grassBladeWidth;
uniform float grassTime;
uniform float grassWindStrength;
uniform float grassWindSpeed;
uniform vec4 grassBenders[${MAX_BENDING_OBJECTS}];
uniform vec3 grassBaseColor;
uniform vec3 grassTipColor;
varying vec3 vGrassColor;
`;
const vertexShaderPosition = `
// Blades are shaped in scene units (with Y flipped like the 3D world), then
// moved back in the (scaled) object space.
float bladeHeight = position.z;
float grassAngle = grassRoot.w;
float bladeWidth = position.x * grassBladeWidth;
vec3 blade = vec3(
  bladeWidth * cos(grassAngle),
  bladeWidth * sin(grassAngle),
  bladeHeight * grassShape.x
);
vec3 rootWorld = (modelMatrix * vec4(grassRoot.xyz, 1.0)).xyz * grassWorldScale;
// Tips bend more than the base.
float bendFactor = bladeHeight * bladeHeight * grassShape.x;
float gust = sin(grassTime * grassWindSpeed + rootWorld.x * 0.013 + rootWorld.y * 0.011);
float flutter = sin(grassTime * grassWindSpeed * 2.7 + grassShape.y * 40.0) * 0.3;
blade.xy += vec2(0.8, 0.5) * (gust + flutter + 0.6) * grassWindStrength * 0.35 * bendFactor;
for (int i = 0; i < ${MAX_BENDING_OBJECTS}; i++) {
  vec4 bender = grassBenders[i];
  if (bender.z <= 0.0) continue;
  vec2 away = rootWorld.xy - bender.xy;
  float distanceToBender = length(away);
  float push = 1.0 - smoothstep(bender.z * 0.3, bender.z, distanceToBender);
  if (push > 0.0) {
    blade.xy += normalize(away + vec2(0.001)) * push * bendFactor * 0.9;
    blade.z *= 1.0 - push * 0.5;
  }
}
vec3 transformed = grassRoot.xyz + grassWorldToLocal * (blade / grassWorldScale);
vGrassColor = mix(grassBaseColor, grassTipColor, bladeHeight) * (0.85 + 0.3 * grassShape.y) * grassGroundTint;
`;
const vertexShaderNormal = `
// Blades are lit like the ground below them.
transformedNormal = normalize((viewMatrix * vec4(0.0, 0.0, 1.0, 0.0)).xyz);
`;
const fragmentShaderDeclarations = `
varying vec3 vGrassColor;
`;
const fragmentShaderColor = `
diffuseColor.rgb *= vGrassColor;
`;
// Both faces of blades are lit like the ground (not flipped for back faces).
const fragmentShaderNormal = `
#include <normal_fragment_begin>
normal = normalize(vNormal);
nonPerturbedNormal = normal;
`;

const { getWorldScale, patchShaderCode, createRandom, findHighestGround, GroundPlacement } = gdjs.__terrain3DExtension;

/** @typedef {{mesh: THREE.Mesh, blades: number, center: THREE.Vector3}} GrassChunk */

/**
 * The grass of a terrain grass object: blades drawn with GPU instancing, in chunks
 * that are hidden when off-screen and thinned out with the distance. They grow
 * on the grounds below, like 3D terrains (only where a given layer is painted).
 */
class Grass {
    /** @param {gdjs.CustomRuntimeObject3D} object */
    constructor(object) {
        this.object = object;
        this.group = new THREE.Group();
        object.get3DRendererObject().add(this.group);
        this.bladeGeometry = createBladeGeometry();
        /**
         * The chunks with blades placed, by index in the grid of chunks (null when no blade grows in a chunk).
         * @type {Map<number, GrassChunk | null>}
         */
        this.chunks = new Map();
        /** @type {Array<{chunkX: number, chunkY: number, distance: number}>} */
        this._missingChunks = [];
        this._placeWithoutLimit = true;
        this.placement = new GroundPlacement(object.getRuntimeScene());
        this._groundAtBlade = { ground: null, z: 0 };
        this.uniforms = {
            grassWorldToLocal: { value: new THREE.Matrix3() },
            // Scene units by 3D world unit.
            grassWorldScale: { value: 1 },
            grassBladeWidth: { value: 1 },
            grassTime: { value: 0 },
            grassWindStrength: { value: 1 },
            grassWindSpeed: { value: 1 },
            grassBenders: { value: Array.from({ length: MAX_BENDING_OBJECTS }, () => new THREE.Vector4()) },
            grassBaseColor: { value: new THREE.Color() },
            grassTipColor: { value: new THREE.Color() },
        };
        this.material = new THREE.MeshStandardMaterial({ roughness: 1, metalness: 0, side: THREE.DoubleSide });
        this.material.onBeforeCompile = (shader) => {
            Object.assign(shader.uniforms, this.uniforms);
            shader.vertexShader = patchShaderCode(shader.vertexShader, [
                ['#include <common>', '#include <common>\n' + vertexShaderDeclarations],
                ['#include <begin_vertex>', vertexShaderPosition],
                ['#include <defaultnormal_vertex>', '#include <defaultnormal_vertex>\n' + vertexShaderNormal],
            ], 'TerrainGrass');
            shader.fragmentShader = patchShaderCode(shader.fragmentShader, [
                ['#include <common>', '#include <common>\n' + fragmentShaderDeclarations],
                ['#include <color_fragment>', '#include <color_fragment>\n' + fragmentShaderColor],
                ['#include <normal_fragment_begin>', fragmentShaderNormal],
            ], 'TerrainGrass');
        };
        this.material.customProgramCacheKey = () => 'TerrainGrass';

        this._matrix = new THREE.Matrix4();
        this._cameraPosition = new THREE.Vector3();
        this._chunkPosition = new THREE.Vector3();
        this._scale = new THREE.Vector3();
        this.updateFromProperties();
    }

    updateFromProperties() {
        const { object } = this;
        this.uniforms.grassBaseColor.value.set(gdjs.rgbOrHexStringToNumber(object._getBaseColor()));
        this.uniforms.grassTipColor.value.set(gdjs.rgbOrHexStringToNumber(object._getTipColor()));
        this.uniforms.grassWindStrength.value = object._getWindStrength();
        this.uniforms.grassWindSpeed.value = object._getWindSpeed();
        this.uniforms.grassBladeWidth.value = Math.max(object._getBladeWidth(), 0);
        this.material.needsUpdate = true;
        this.placement.placeAgain();
    }

    _getPlacementKey() {
        const { object } = this;
        return [
            object.getX(), object.getY(), object.getZ(), object.getWidth(), object.getHeight(), object.getDepth(),
            object._getDensity(), object._getBladeHeight(), object._getGroundLayer(), object._getMaxSlope(),
            object._getSeed(),
        ].join('|');
    }

    _getBladesPerChunk() {
        return Math.round((Math.max(this.object._getDensity(), 0) * CHUNK_SIZE * CHUNK_SIZE) / 10000);
    }

    _removeChunks() {
        for (const chunk of this.chunks.values()) {
            if (!chunk) continue;
            chunk.mesh.removeFromParent();
            chunk.mesh.geometry.dispose();
        }
        this.chunks.clear();
    }

    /** Place the blades again, for example after the ground or the object changed. */
    rebuild() {
        this._removeChunks();
        this._placeWithoutLimit = true;
    }

    /**
     * Place the blades of a chunk. Each chunk has its own random numbers: its blades are the same every time.
     * @returns {GrassChunk | null} null when no blade grows in the chunk.
     */
    _placeChunk(chunkX, chunkY) {
        const grounds = Array.from(this.placement.grounds);
        const { object } = this;
        const width = object.getWidth();
        const height = object.getHeight();
        const scaleX = width / AREA_SIZE;
        const scaleY = height / AREA_SIZE;
        const scaleZ = Math.max(object.getDepth() / AREA_DEPTH, 0.0001);
        const groundLayer = parseInt(object._getGroundLayer(), 10) || 0;
        const maxSlope = object._getMaxSlope();
        const bladeHeight = Math.max(object._getBladeHeight(), 0);
        const bladesPerChunk = this._getBladesPerChunk();
        const nextRandom = createRandom(
            ((object._getSeed() * 7919 + 1) ^ Math.imul(chunkX + 1, 73856093) ^ Math.imul(chunkY + 1, 19349663)) >>> 0
        );

        const roots = new Float32Array(bladesPerChunk * 4);
        const shapes = new Float32Array(bladesPerChunk * 2);
        const groundTints = new Uint8Array(bladesPerChunk * 3).fill(255);
        let blades = 0;
        let minZ = Infinity;
        let maxZ = -Infinity;
        for (let attempt = 0; attempt < bladesPerChunk; attempt++) {
            // In scene units, relative to the object.
            const x = (chunkX + nextRandom()) * CHUNK_SIZE;
            const y = (chunkY + nextRandom()) * CHUNK_SIZE;
            const angle = nextRandom() * Math.PI * 2;
            const heightFactor = 0.6 + 0.8 * nextRandom();
            const tint = nextRandom();
            const growth = nextRandom();
            if (x > width || y > height) continue;
            const sceneX = object.getX() + x;
            const sceneY = object.getY() + y;
            const { ground, z } = findHighestGround(grounds, sceneX, sceneY, this._groundAtBlade);
            const groundZ = ground ? z : object.getZ();
            if (ground) {
                if (groundLayer > 0 && growth > ground.getLayerWeightAt(sceneX, sceneY, groundLayer)) continue;
                if (ground.getSlopeAt(sceneX, sceneY) > maxSlope) continue;
                if (typeof ground.getTintAt === 'function') {
                    const tint = ground.getTintAt(sceneX, sceneY);
                    for (let channel = 0; channel < 3; channel++) {
                        groundTints[blades * 3 + channel] = Math.round(255 * Math.pow(tint[channel] / 255, 2.2));
                    }
                }
            }
            const localZ = (groundZ - object.getZ()) / scaleZ;
            roots[blades * 4] = x / scaleX;
            roots[blades * 4 + 1] = y / scaleY;
            roots[blades * 4 + 2] = localZ;
            roots[blades * 4 + 3] = angle;
            shapes[blades * 2] = heightFactor * bladeHeight;
            shapes[blades * 2 + 1] = tint;
            minZ = Math.min(minZ, localZ);
            maxZ = Math.max(maxZ, localZ);
            blades++;
        }
        if (blades === 0) return null;

        const geometry = new THREE.InstancedBufferGeometry();
        geometry.index = this.bladeGeometry.index;
        geometry.setAttribute('position', this.bladeGeometry.attributes.position);
        geometry.setAttribute('normal', this.bladeGeometry.attributes.normal);
        geometry.setAttribute('grassRoot', new THREE.InstancedBufferAttribute(roots.subarray(0, blades * 4), 4));
        geometry.setAttribute('grassShape', new THREE.InstancedBufferAttribute(shapes.subarray(0, blades * 2), 2));
        geometry.setAttribute('grassGroundTint', new THREE.InstancedBufferAttribute(groundTints.subarray(0, blades * 3), 3, true));
        geometry.instanceCount = blades;
        // The furthest tips can go with the wind and the bending objects (see the shader).
        const maxBladeHeight = bladeHeight * 1.4;
        const lean =
            (0.35 * 1.9 * 0.943 * Math.max(object._getWindStrength(), 0) + 0.9) * maxBladeHeight +
            Math.max(object._getBladeWidth(), 0) / 2;
        const leanX = lean / scaleX;
        const leanY = lean / scaleY;
        geometry.boundingBox = new THREE.Box3(
            new THREE.Vector3((chunkX * CHUNK_SIZE) / scaleX - leanX, (chunkY * CHUNK_SIZE) / scaleY - leanY, minZ),
            new THREE.Vector3(
                Math.min((chunkX + 1) * CHUNK_SIZE, width) / scaleX + leanX,
                Math.min((chunkY + 1) * CHUNK_SIZE, height) / scaleY + leanY,
                maxZ + (bladeHeight * 1.4) / scaleZ
            )
        );
        geometry.boundingSphere = geometry.boundingBox.getBoundingSphere(new THREE.Sphere());
        const mesh = new THREE.Mesh(geometry, this.material);
        mesh.receiveShadow = true;
        // Raycasts would only test one blade: the selection plane is used instead.
        mesh.raycast = () => {};
        this.group.add(mesh);
        return { mesh, blades, center: geometry.boundingSphere.center.clone() };
    }

    /**
     * Place the blades of the chunks near the camera (the nearest first) and remove the ones of the chunks
     * far from it: a large field would otherwise be slow to place and use a lot of memory for blades never drawn.
     */
    _updateChunksAroundCamera() {
        const { object } = this;
        // The camera in scene units, relative to the object (`_matrix` is the inverse of the group one).
        const camera = this._chunkPosition.copy(this._cameraPosition).applyMatrix4(this._matrix);
        const cameraX = (camera.x * object.getWidth()) / AREA_SIZE;
        const cameraY = (camera.y * object.getHeight()) / AREA_SIZE;
        const chunksX = Math.max(Math.ceil(object.getWidth() / CHUNK_SIZE), 1);
        const chunksY = Math.max(Math.ceil(object.getHeight() / CHUNK_SIZE), 1);
        const getDistance = (chunkX, chunkY) =>
            Math.hypot((chunkX + 0.5) * CHUNK_SIZE - cameraX, (chunkY + 0.5) * CHUNK_SIZE - cameraY);

        // Chunks are placed a bit before blades are shown.
        const placementDistance = Math.max(object._getFadeDistance(), 1) + CHUNK_SIZE;
        const missingChunks = this._missingChunks;
        missingChunks.length = 0;
        const firstChunkX = Math.max(Math.floor((cameraX - placementDistance) / CHUNK_SIZE), 0);
        const lastChunkX = Math.min(Math.floor((cameraX + placementDistance) / CHUNK_SIZE), chunksX - 1);
        const firstChunkY = Math.max(Math.floor((cameraY - placementDistance) / CHUNK_SIZE), 0);
        const lastChunkY = Math.min(Math.floor((cameraY + placementDistance) / CHUNK_SIZE), chunksY - 1);
        for (let chunkY = firstChunkY; chunkY <= lastChunkY; chunkY++) {
            for (let chunkX = firstChunkX; chunkX <= lastChunkX; chunkX++) {
                if (this.chunks.has(chunkY * chunksX + chunkX)) continue;
                const distance = getDistance(chunkX, chunkY);
                if (distance <= placementDistance) missingChunks.push({ chunkX, chunkY, distance });
            }
        }
        // Everything is placed at once after a change, so that blades don't disappear for a few frames.
        const maxPlacedChunks = this._placeWithoutLimit
            ? Infinity
            : Math.max(Math.floor(MAX_BLADES_PLACED_BY_FRAME / Math.max(this._getBladesPerChunk(), 1)), 1);
        this._placeWithoutLimit = false;
        if (missingChunks.length > maxPlacedChunks) {
            missingChunks.sort((chunk, otherChunk) => chunk.distance - otherChunk.distance);
            missingChunks.length = maxPlacedChunks;
        }
        for (const { chunkX, chunkY } of missingChunks) {
            this.chunks.set(chunkY * chunksX + chunkX, this._placeChunk(chunkX, chunkY));
        }

        for (const [key, chunk] of this.chunks) {
            if (getDistance(key % chunksX, Math.floor(key / chunksX)) < 2 * placementDistance) continue;
            this.chunks.delete(key);
            if (!chunk) continue;
            chunk.mesh.removeFromParent();
            chunk.mesh.geometry.dispose();
        }
    }

    _updateBendingObjects() {
        const benders = this.uniforms.grassBenders.value;
        const objectName = this.object._getBendingObject();
        const bendingObjects = objectName ? this.object.getInstanceContainer().getObjects(objectName) || [] : [];
        for (let index = 0; index < MAX_BENDING_OBJECTS; index++) {
            const bendingObject = bendingObjects[index];
            if (!bendingObject) {
                benders[index].set(0, 0, 0, 0);
                continue;
            }
            // Blades are pushed in the 3D scene, which is flipped on Y.
            const radius = Math.max(bendingObject.getWidth(), bendingObject.getHeight()) * 1.2;
            benders[index].set(bendingObject.getCenterXInScene(), -bendingObject.getCenterYInScene(), radius, 0);
        }
    }

    /**
     * @param {number} elapsedSeconds
     * @param {number} time In seconds, the same for all grass objects.
     */
    update(elapsedSeconds, time, camera) {
        if (this.placement.shouldPlaceAgain(elapsedSeconds, this._getPlacementKey())) {
            this.rebuild();
        }

        this.uniforms.grassTime.value = time;
        this.uniforms.grassWorldScale.value = getWorldScale(this.object);
        // The object transformation is applied just before rendering, it's needed now.
        this.object.getRenderer().ensureUpToDate();
        this.group.updateWorldMatrix(true, false);
        this.uniforms.grassWorldToLocal.value.setFromMatrix4(this._matrix.copy(this.group.matrixWorld).invert());
        this._updateBendingObjects();
        if (!camera) return;

        // Far chunks are hidden, and thinned out before (in 3D world units).
        const fadeDistance = Math.max(this.object._getFadeDistance(), 1) / getWorldScale(this.object);
        this._cameraPosition.setFromMatrixPosition(camera.matrixWorld);
        this._updateChunksAroundCamera();
        for (const chunk of this.chunks.values()) {
            if (!chunk) continue;
            const distance = this._chunkPosition
                .copy(chunk.center)
                .applyMatrix4(this.group.matrixWorld)
                .distanceTo(this._cameraPosition);
            const density = gdjs.evtTools.common.clamp((fadeDistance - distance) / (fadeDistance * 0.5), 0, 1);
            chunk.mesh.visible = density > 0;
            chunk.mesh.geometry.instanceCount = Math.ceil(chunk.blades * density);
        }
    }

    dispose() {
        this._removeChunks();
        this.bladeGeometry.dispose();
        this.material.dispose();
        this.group.removeFromParent();
    }
}

gdjs.__terrainGrassExtension = { Grass };
};
gdjs.evtsExt__Terrain3D__DefineGrassHelperClasses.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__Terrain3D__DefineGrassHelperClasses.userFunc0x96dbb8(runtimeScene, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__DefineGrassHelperClasses.func = function(runtimeScene, parentEventsFunctionContext) {
let scopeInstanceContainer = null;
var eventsFunctionContext = {
  _objectsMap: {
},
  _objectArraysMap: {
},
  _behaviorNamesMap: {
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("Terrain3D"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("Terrain3D"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        if (!(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName))) {
          eventsFunctionContext._objectArraysMap[objectName].push(object);
        }
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};


gdjs.evtsExt__Terrain3D__DefineGrassHelperClasses.eventsList0(runtimeScene, eventsFunctionContext);


return;
}

gdjs.evtsExt__Terrain3D__DefineGrassHelperClasses.registeredGdjsCallbacks = [];