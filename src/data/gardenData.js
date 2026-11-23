// Plain Three.js-friendly source data copied from the prior garden layout; no engine/runtime imports.
// World positions/sizes are original project units (multiply by worldScale=0.01).
// Terrain/scatter edit coordinates and radii are normalized to their 0..1 terrain bounds;
// edit heights remain the source terrain's normalized height values. Asset paths are repo-root relative.
export const gardenData = {
  "worldScale": 0.01,
  "worldSize": 6144,
  "playerStart": {
    "position": {
      "x": 0,
      "y": 1850,
      "z": 0
    },
    "rotationDegrees": -90,
    "asset": "f0321c19d2ccadfaf64a9219c07498d7a263fea71c1d1827c7a068160abc5eaa_Garden Gnome.glb",
    "modelSize": {
      "width": 30,
      "height": 30,
      "depth": 60
    }
  },
  "terrain": {
    "position": {
      "x": -3072,
      "y": -3072,
      "z": -120
    },
    "size": {
      "width": 6144,
      "height": 6144,
      "depth": 1200
    },
    "relief": "Flat",
    "seed": 1,
    "resolution": 256,
    "textureSize": 300,
    "cliffLayer": 3,
    "cliffAngleDegrees": 40,
    "normalMapStrength": 1,
    "heightBlending": 0.8,
    "textureVariation": 0.5,
    "layers": [
      {
        "index": 1,
        "color": "255;255;255",
        "texture": "TerrainGrass.jpg",
        "normalMap": "TerrainGrassNormal.jpg"
      },
      {
        "index": 2,
        "color": "255;255;255",
        "texture": "TerrainDirt.jpg",
        "normalMap": "TerrainDirtNormal.jpg"
      },
      {
        "index": 3,
        "color": "255;255;255",
        "texture": "TerrainRock.jpg",
        "normalMap": "TerrainRockNormal.jpg"
      },
      {
        "index": 4,
        "color": "255;255;255",
        "texture": "TerrainSand.jpg",
        "normalMap": "TerrainSandNormal.jpg"
      }
    ],
    "edits": [
      {
        "operation": "flatten",
        "center": [
          0.5,
          0.5
        ],
        "radius": 1.5,
        "targetHeight": 0.1
      },
      {
        "operation": "flatten",
        "center": [
          0.5,
          0.5
        ],
        "radius": 1.5,
        "targetHeight": 0.1
      },
      {
        "operation": "flatten",
        "center": [
          0.5,
          0.5
        ],
        "radius": 1.5,
        "targetHeight": 0.1
      },
      {
        "operation": "flatten",
        "center": [
          0.5,
          0.5
        ],
        "radius": 1.5,
        "targetHeight": 0.1
      },
      {
        "operation": "flatten",
        "center": [
          0.5,
          0.5
        ],
        "radius": 1.5,
        "targetHeight": 0.1
      },
      {
        "operation": "raise",
        "path": [
          [
            0,
            0
          ],
          [
            1,
            0
          ]
        ],
        "radius": 0.1139,
        "height": 0.4333
      },
      {
        "operation": "raise",
        "path": [
          [
            0,
            1
          ],
          [
            1,
            1
          ]
        ],
        "radius": 0.1139,
        "height": 0.4333
      },
      {
        "operation": "raise",
        "path": [
          [
            0,
            0
          ],
          [
            0,
            1
          ]
        ],
        "radius": 0.1139,
        "height": 0.4333
      },
      {
        "operation": "raise",
        "path": [
          [
            1,
            0
          ],
          [
            1,
            1
          ]
        ],
        "radius": 0.1139,
        "height": 0.4333
      },
      {
        "operation": "raise",
        "center": [
          0.3047,
          0
        ],
        "radius": 0.0977,
        "height": 0.3167
      },
      {
        "operation": "raise",
        "center": [
          0.7116,
          0
        ],
        "radius": 0.1139,
        "height": 0.35
      },
      {
        "operation": "raise",
        "center": [
          1,
          0.5488
        ],
        "radius": 0.0977,
        "height": 0.3167
      },
      {
        "operation": "raise",
        "center": [
          1,
          0.207
        ],
        "radius": 0.0814,
        "height": 0.25
      },
      {
        "operation": "raise",
        "center": [
          0.5651,
          1
        ],
        "radius": 0.1058,
        "height": 0.3
      },
      {
        "operation": "raise",
        "center": [
          0,
          0.4023
        ],
        "radius": 0.0977,
        "height": 0.3333
      },
      {
        "operation": "raise",
        "center": [
          0,
          0.7767
        ],
        "radius": 0.0814,
        "height": 0.25
      },
      {
        "operation": "raise",
        "center": [
          0.2559,
          0.2721
        ],
        "radius": 0.1302,
        "height": 0.25
      },
      {
        "operation": "raise",
        "center": [
          0.7279,
          0.2884
        ],
        "radius": 0.1139,
        "height": 0.2
      },
      {
        "operation": "raise",
        "center": [
          0.7767,
          0.6465
        ],
        "radius": 0.1058,
        "height": 0.1667
      },
      {
        "operation": "raise",
        "center": [
          0.2233,
          0.6465
        ],
        "radius": 0.0977,
        "height": 0.125
      },
      {
        "operation": "raise",
        "center": [
          0.5488,
          0.1745
        ],
        "radius": 0.0814,
        "height": 0.075
      },
      {
        "operation": "raise",
        "center": [
          0.4512,
          0.6465
        ],
        "radius": 0.0651,
        "height": 0.0333
      },
      {
        "operation": "raise",
        "center": [
          0.8743,
          0.4349
        ],
        "radius": 0.0732,
        "height": 0.0917
      },
      {
        "operation": "raise",
        "center": [
          0.1257,
          0.5326
        ],
        "radius": 0.0651,
        "height": 0.0667
      },
      {
        "operation": "raise",
        "center": [
          0.6465,
          0.8581
        ],
        "radius": 0.0732,
        "height": 0.05
      },
      {
        "operation": "smooth",
        "center": [
          0.5,
          0.5
        ],
        "radius": 0.4232,
        "strength": 0.25
      },
      {
        "operation": "flatten",
        "center": [
          0.2559,
          0.2721
        ],
        "radius": 0.0488,
        "targetHeight": 0.3495
      },
      {
        "operation": "flatten",
        "center": [
          0.2559,
          0.2721
        ],
        "radius": 0.0488,
        "targetHeight": 0.3495
      },
      {
        "operation": "flatten",
        "center": [
          0.2559,
          0.2721
        ],
        "radius": 0.0488,
        "targetHeight": 0.3495
      },
      {
        "operation": "flatten",
        "center": [
          0.7279,
          0.2884
        ],
        "radius": 0.0488,
        "targetHeight": 0.2994
      },
      {
        "operation": "flatten",
        "center": [
          0.7279,
          0.2884
        ],
        "radius": 0.0488,
        "targetHeight": 0.2994
      },
      {
        "operation": "flatten",
        "center": [
          0.7279,
          0.2884
        ],
        "radius": 0.0488,
        "targetHeight": 0.2994
      },
      {
        "operation": "flatten",
        "center": [
          0.7767,
          0.6465
        ],
        "radius": 0.0488,
        "targetHeight": 0.2662
      },
      {
        "operation": "flatten",
        "center": [
          0.7767,
          0.6465
        ],
        "radius": 0.0488,
        "targetHeight": 0.2662
      },
      {
        "operation": "flatten",
        "center": [
          0.7767,
          0.6465
        ],
        "radius": 0.0488,
        "targetHeight": 0.2662
      },
      {
        "operation": "flatten",
        "center": [
          0.2233,
          0.6465
        ],
        "radius": 0.0488,
        "targetHeight": 0.2245
      },
      {
        "operation": "flatten",
        "center": [
          0.2233,
          0.6465
        ],
        "radius": 0.0488,
        "targetHeight": 0.2245
      },
      {
        "operation": "flatten",
        "center": [
          0.2233,
          0.6465
        ],
        "radius": 0.0488,
        "targetHeight": 0.2245
      },
      {
        "operation": "flatten",
        "path": [
          [
            0.5488,
            0.4674
          ],
          [
            0.4674,
            0.5326
          ]
        ],
        "radius": 0.0846,
        "targetHeight": 0.0417
      },
      {
        "operation": "flatten",
        "path": [
          [
            0.5488,
            0.4674
          ],
          [
            0.4674,
            0.5326
          ]
        ],
        "radius": 0.0846,
        "targetHeight": 0.0417
      },
      {
        "operation": "flatten",
        "path": [
          [
            0.5488,
            0.4674
          ],
          [
            0.4674,
            0.5326
          ]
        ],
        "radius": 0.0846,
        "targetHeight": 0.0417
      },
      {
        "operation": "flatten",
        "path": [
          [
            0.5488,
            0.4674
          ],
          [
            0.4674,
            0.5326
          ]
        ],
        "radius": 0.0846,
        "targetHeight": 0.0417
      },
      {
        "operation": "smooth",
        "center": [
          0.5081,
          0.5
        ],
        "radius": 0.1465,
        "strength": 0.3
      },
      {
        "operation": "paint",
        "path": [
          [
            0.5488,
            0.4674
          ],
          [
            0.4674,
            0.5326
          ]
        ],
        "radius": 0.1042,
        "strength": 1,
        "paintLayer": 4
      },
      {
        "operation": "flatten",
        "center": [
          0.5,
          0.7767
        ],
        "radius": 0.0732,
        "targetHeight": 0.1
      },
      {
        "operation": "flatten",
        "center": [
          0.5,
          0.7767
        ],
        "radius": 0.0732,
        "targetHeight": 0.1
      },
      {
        "operation": "flatten",
        "center": [
          0.5,
          0.7767
        ],
        "radius": 0.0732,
        "targetHeight": 0.1
      },
      {
        "operation": "paint",
        "path": [
          [
            0.5,
            0.7767
          ],
          [
            0.4661,
            0.7371
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.4661,
            0.7371
          ],
          [
            0.4328,
            0.6971
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.4328,
            0.6971
          ],
          [
            0.4006,
            0.6563
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.4006,
            0.6563
          ],
          [
            0.3683,
            0.6154
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.3683,
            0.6154
          ],
          [
            0.3403,
            0.5715
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.3403,
            0.5715
          ],
          [
            0.3201,
            0.5234
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.3201,
            0.5234
          ],
          [
            0.307,
            0.4731
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.307,
            0.4731
          ],
          [
            0.307,
            0.4214
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.307,
            0.4214
          ],
          [
            0.3302,
            0.375
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.3302,
            0.375
          ],
          [
            0.3525,
            0.3283
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.3525,
            0.3283
          ],
          [
            0.3504,
            0.2765
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.3504,
            0.2765
          ],
          [
            0.3343,
            0.2272
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.3343,
            0.2272
          ],
          [
            0.2992,
            0.1898
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.2992,
            0.1898
          ],
          [
            0.2502,
            0.173
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.2502,
            0.173
          ],
          [
            0.2021,
            0.1875
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.2021,
            0.1875
          ],
          [
            0.1701,
            0.2282
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.1701,
            0.2282
          ],
          [
            0.159,
            0.2775
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.159,
            0.2775
          ],
          [
            0.1872,
            0.3198
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.1872,
            0.3198
          ],
          [
            0.2306,
            0.2957
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.2306,
            0.2957
          ],
          [
            0.2559,
            0.2721
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.5,
            0.7767
          ],
          [
            0.5436,
            0.7484
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.5436,
            0.7484
          ],
          [
            0.5864,
            0.7186
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.5864,
            0.7186
          ],
          [
            0.6247,
            0.6834
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.6247,
            0.6834
          ],
          [
            0.6538,
            0.6403
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.6538,
            0.6403
          ],
          [
            0.6829,
            0.5972
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.6829,
            0.5972
          ],
          [
            0.7254,
            0.5692
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.7254,
            0.5692
          ],
          [
            0.777,
            0.5716
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.777,
            0.5716
          ],
          [
            0.8262,
            0.5885
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.8262,
            0.5885
          ],
          [
            0.859,
            0.6261
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.859,
            0.6261
          ],
          [
            0.8584,
            0.6777
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.8584,
            0.6777
          ],
          [
            0.8215,
            0.7116
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.8215,
            0.7116
          ],
          [
            0.7889,
            0.6784
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.7889,
            0.6784
          ],
          [
            0.7767,
            0.6465
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.7116,
            0.5732
          ],
          [
            0.6912,
            0.5252
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.6912,
            0.5252
          ],
          [
            0.6719,
            0.4769
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.6719,
            0.4769
          ],
          [
            0.6548,
            0.4277
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.6548,
            0.4277
          ],
          [
            0.6382,
            0.3784
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.6382,
            0.3784
          ],
          [
            0.63,
            0.3271
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.63,
            0.3271
          ],
          [
            0.639,
            0.276
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.639,
            0.276
          ],
          [
            0.6598,
            0.2285
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.6598,
            0.2285
          ],
          [
            0.701,
            0.2005
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.701,
            0.2005
          ],
          [
            0.7518,
            0.2095
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.7518,
            0.2095
          ],
          [
            0.7891,
            0.2432
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.7891,
            0.2432
          ],
          [
            0.7961,
            0.2943
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.7961,
            0.2943
          ],
          [
            0.7539,
            0.2988
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.7539,
            0.2988
          ],
          [
            0.7279,
            0.2884
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.4186,
            0.679
          ],
          [
            0.3776,
            0.7111
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.3776,
            0.7111
          ],
          [
            0.3338,
            0.7391
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.3338,
            0.7391
          ],
          [
            0.2835,
            0.7518
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.2835,
            0.7518
          ],
          [
            0.2316,
            0.7515
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.2316,
            0.7515
          ],
          [
            0.187,
            0.7272
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.187,
            0.7272
          ],
          [
            0.1615,
            0.6821
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.1615,
            0.6821
          ],
          [
            0.1859,
            0.6497
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      },
      {
        "operation": "paint",
        "path": [
          [
            0.1859,
            0.6497
          ],
          [
            0.2233,
            0.6465
          ]
        ],
        "radius": 0.0146,
        "strength": 1,
        "paintLayer": 2
      }
    ]
  },
  "grass": {
    "position": {
      "x": -3072,
      "y": -3072,
      "z": 0
    },
    "size": {
      "width": 6144,
      "height": 6144,
      "depth": 40
    },
    "density": 20,
    "bladeHeight": 16,
    "bladeWidth": 2,
    "baseColor": "52;104;36",
    "tipColor": "150;196;82",
    "fadeDistance": 2500
  },
  "coins": {
    "asset": "StartingCoin.glb",
    "modelSize": {
      "width": 31,
      "height": 31,
      "depth": 31
    },
    "positions": [
      {
        "x": 0,
        "y": 1600,
        "z": 30
      },
      {
        "x": 0,
        "y": 1480,
        "z": 30
      },
      {
        "x": 0,
        "y": 1360,
        "z": 30
      },
      {
        "x": -1394.9,
        "y": -1287.1,
        "z": 569.4
      },
      {
        "x": -1334.9,
        "y": -1287.1,
        "z": 569.4
      },
      {
        "x": -1274.9,
        "y": -1287.1,
        "z": 569.4
      },
      {
        "x": 1227.1,
        "y": -1134.9,
        "z": 509.3
      },
      {
        "x": 1287.1,
        "y": -1134.9,
        "z": 509.3
      },
      {
        "x": 1347.1,
        "y": -1134.9,
        "z": 509.3
      },
      {
        "x": 1474.9,
        "y": 787.1,
        "z": 469.4
      },
      {
        "x": 1534.9,
        "y": 787.1,
        "z": 469.4
      },
      {
        "x": 1594.9,
        "y": 787.1,
        "z": 469.4
      },
      {
        "x": -1647.1,
        "y": 734.9,
        "z": 419.4
      },
      {
        "x": -1587.1,
        "y": 734.9,
        "z": 419.4
      },
      {
        "x": -1527.1,
        "y": 734.9,
        "z": 419.4
      },
      {
        "x": -311,
        "y": 1334,
        "z": 30
      },
      {
        "x": -611,
        "y": 960,
        "z": 33.9
      },
      {
        "x": -901,
        "y": 577,
        "z": 30
      },
      {
        "x": -1105,
        "y": 144,
        "z": 30
      },
      {
        "x": -1202,
        "y": -324,
        "z": 30
      },
      {
        "x": -1043,
        "y": -768,
        "z": 30.6
      },
      {
        "x": -899,
        "y": -1215,
        "z": 65.8
      },
      {
        "x": -1018,
        "y": -1676,
        "z": 99.5
      },
      {
        "x": -1379,
        "y": -1972,
        "z": 86
      },
      {
        "x": -1830,
        "y": -1920,
        "z": 70.1
      },
      {
        "x": -2093,
        "y": -1525,
        "z": 75.6
      },
      {
        "x": -1922,
        "y": -1107,
        "z": 121.3
      },
      {
        "x": 401,
        "y": 1437,
        "z": 30
      },
      {
        "x": 766,
        "y": 1127,
        "z": 30
      },
      {
        "x": 1031,
        "y": 727,
        "z": 30
      },
      {
        "x": 1385,
        "y": 425,
        "z": 36.6
      },
      {
        "x": 1856,
        "y": 483,
        "z": 77.6
      },
      {
        "x": 2206,
        "y": 775,
        "z": 49.4
      },
      {
        "x": 2113,
        "y": 1222,
        "z": 47.5
      },
      {
        "x": 1114,
        "y": 7,
        "z": 30
      },
      {
        "x": 951,
        "y": -444,
        "z": 30
      },
      {
        "x": 813,
        "y": -903,
        "z": 30.1
      },
      {
        "x": 854,
        "y": -1376,
        "z": 57.8
      },
      {
        "x": 1086,
        "y": -1790,
        "z": 45.9
      },
      {
        "x": 1547,
        "y": -1785,
        "z": 75.4
      },
      {
        "x": 1815,
        "y": -1423,
        "z": 111.5
      },
      {
        "x": -883,
        "y": 1390,
        "z": 30
      },
      {
        "x": -1330,
        "y": 1547,
        "z": 30
      },
      {
        "x": -1802,
        "y": 1499,
        "z": 30
      },
      {
        "x": -2080,
        "y": 1119,
        "z": 55.8
      }
    ]
  },
  "obstacles": {
    "asset": "StartingWall.png",
    "items": [
      {
        "position": {
          "x": -1761.1,
          "y": -1608.9,
          "z": 295.4
        },
        "size": {
          "width": 192,
          "height": 192,
          "depth": 84
        }
      },
      {
        "position": {
          "x": -1596,
          "y": -1496,
          "z": 295.4
        },
        "size": {
          "width": 192,
          "height": 192,
          "depth": 164
        }
      },
      {
        "position": {
          "x": -1462.9,
          "y": -1415.1,
          "z": 295.4
        },
        "size": {
          "width": 256,
          "height": 256,
          "depth": 244
        }
      },
      {
        "position": {
          "x": 1416.9,
          "y": -1561.1,
          "z": 235.3
        },
        "size": {
          "width": 192,
          "height": 192,
          "depth": 84
        }
      },
      {
        "position": {
          "x": 1304,
          "y": -1396,
          "z": 235.3
        },
        "size": {
          "width": 192,
          "height": 192,
          "depth": 164
        }
      },
      {
        "position": {
          "x": 1159.1,
          "y": -1262.9,
          "z": 235.3
        },
        "size": {
          "width": 256,
          "height": 256,
          "depth": 244
        }
      },
      {
        "position": {
          "x": 1769.1,
          "y": 916.9,
          "z": 195.4
        },
        "size": {
          "width": 192,
          "height": 192,
          "depth": 84
        }
      },
      {
        "position": {
          "x": 1604,
          "y": 804,
          "z": 195.4
        },
        "size": {
          "width": 192,
          "height": 192,
          "depth": 164
        }
      },
      {
        "position": {
          "x": 1406.9,
          "y": 659.1,
          "z": 195.4
        },
        "size": {
          "width": 256,
          "height": 256,
          "depth": 244
        }
      },
      {
        "position": {
          "x": -1908.9,
          "y": 969.1,
          "z": 145.4
        },
        "size": {
          "width": 192,
          "height": 192,
          "depth": 84
        }
      },
      {
        "position": {
          "x": -1796,
          "y": 804,
          "z": 145.4
        },
        "size": {
          "width": 192,
          "height": 192,
          "depth": 164
        }
      },
      {
        "position": {
          "x": -1715.1,
          "y": 606.9,
          "z": 145.4
        },
        "size": {
          "width": 256,
          "height": 256,
          "depth": 244
        }
      }
    ]
  },
  "flags": {
    "asset": "flag.glb",
    "positions": [
      {
        "x": -1244.9,
        "y": -1197.1,
        "z": 539.4
      },
      {
        "x": 1377.1,
        "y": -1044.9,
        "z": 479.3
      },
      {
        "x": 1624.9,
        "y": 877.1,
        "z": 439.4
      },
      {
        "x": -1497.1,
        "y": 824.9,
        "z": 389.4
      }
    ]
  },
  "mapBounds": [
    {
      "position": {
        "x": -3272,
        "y": -3272,
        "z": -500
      },
      "size": {
        "width": 6544,
        "height": 200,
        "depth": 4000
      }
    },
    {
      "position": {
        "x": -3272,
        "y": 3072,
        "z": -500
      },
      "size": {
        "width": 6544,
        "height": 200,
        "depth": 4000
      }
    },
    {
      "position": {
        "x": -3272,
        "y": -3072,
        "z": -500
      },
      "size": {
        "width": 200,
        "height": 6144,
        "depth": 4000
      }
    },
    {
      "position": {
        "x": 3072,
        "y": -3072,
        "z": -500
      },
      "size": {
        "width": 200,
        "height": 6144,
        "depth": 4000
      }
    }
  ],
  "pushableBox": {
    "position": {
      "x": 240,
      "y": 1500,
      "z": 1
    },
    "size": {
      "width": 128,
      "height": 128,
      "depth": 64
    },
    "texture": "StarterPushable.png"
  },
  "water": {
    "position": {
      "x": -900,
      "y": -800,
      "z": -42
    },
    "size": {
      "width": 1900,
      "height": 1600,
      "depth": 1
    },
    "opacity": 120,
    "color": "30;100;120",
    "crestColor": "231;248;255",
    "foam": 0.05,
    "normalMap": "WaterNormalMap.jpg",
    "normalMapSize": 600,
    "waveHeight": 2,
    "waveLength": 150,
    "waveSpeed": 1.8
  },
  "decorations": {
    "sign": {
      "position": {
        "x": -140,
        "y": 1500,
        "z": 0
      },
      "asset": "sign.glb",
      "modelSize": {
        "width": 12.3,
        "height": 56.4,
        "depth": 70
      },
      "rotationDegrees": -90
    },
    "fountain": {
      "position": {
        "x": -400.00000000000034,
        "y": 1599.9999999999993,
        "z": -0.00011698401062265606
      },
      "asset": "62f65e860e5b24e47365e23b438051fe944569daa5f8ad58fe88ff0b0e08bd28_Fountain Round.glb",
      "modelSize": {
        "width": 303,
        "height": 303,
        "depth": 303
      },
      "rotationDegrees": 0,
      "initiallyHidden": true
    },
    "bench": {
      "position": {
        "x": -720.000000348751,
        "y": 1760.0000001743747,
        "z": -0.0004418691387186868
      },
      "asset": "442e116a9fe5848bf1b307dd6cd0958b3f50128d3c6f5d034027664deba96aca_Bench.glb",
      "modelSize": {
        "width": 47,
        "height": 47,
        "depth": 47
      },
      "rotationDegrees": 0,
      "initiallyHidden": true
    },
    "flowerBed": {
      "position": {
        "x": -149.95910786101783,
        "y": 1650.0299934129382,
        "z": 0
      },
      "asset": "3f26abb97ba74b0771869d5ca6d53ce286a2f8589d6e8a71b89d2e3315a463f2_Planter Box 01.glb",
      "modelSize": {
        "width": 91,
        "height": 91,
        "depth": 91
      },
      "rotationDegrees": 0
    },
    "statue": {
      "position": {
        "x": 104.44681055907503,
        "y": 1590.7533471472923,
        "z": 1.5921216666670883
      },
      "asset": "56faea6aca44c5f11fbeb934f73a7728fc6cc89288add7cc0b7e39dfd0b3997e_Gothic Statue.glb",
      "modelSize": {
        "width": 174,
        "height": 174,
        "depth": 174
      },
      "rotationDegrees": 0
    },
    "lantern": {
      "position": {
        "x": -600.0029337331033,
        "y": 1550.0000011014572,
        "z": -0.00012652075382817672
      },
      "asset": "8763223ce5794b9e9d25a37b28b028421e3c8dc51efc8db61c12f4522bb6aca2_Lantern 01.glb",
      "modelSize": {
        "width": 29,
        "height": 29,
        "depth": 29
      },
      "rotationDegrees": 0
    },
    "gnome": {
      "position": {
        "x": 51.48872831381865,
        "y": 1749.2860190358122,
        "z": 0.006738184815344844
      },
      "asset": "f0321c19d2ccadfaf64a9219c07498d7a263fea71c1d1827c7a068160abc5eaa_Garden Gnome.glb",
      "modelSize": {
        "width": 60,
        "height": 60,
        "depth": 60
      },
      "rotationDegrees": 0
    }
  }
};

export const scatterData = {
  "oaks": {
    "model": "assets/models/woodland/temperate-forest-ecology-english-oak-mature-ac520af6.glb",
    "seed": 1,
    "size": 220,
    "density": 0.03,
    "coverage": "Everywhere",
    "edits": [
      {
        "operation": "erase",
        "center": [
          0.5,
          0.7767
        ],
        "radius": 0.0895
      },
      {
        "operation": "erase",
        "center": [
          0.5081,
          0.5
        ],
        "radius": 0.1383
      },
      {
        "operation": "erase",
        "center": [
          0.229,
          0.2538
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.2559,
          0.2721
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.2827,
          0.2905
        ],
        "radius": 0.0273
      },
      {
        "operation": "erase",
        "center": [
          0.7462,
          0.2615
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.7279,
          0.2884
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.7095,
          0.3153
        ],
        "radius": 0.0273
      },
      {
        "operation": "erase",
        "center": [
          0.8036,
          0.6649
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.7767,
          0.6465
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.7498,
          0.6281
        ],
        "radius": 0.0273
      },
      {
        "operation": "erase",
        "center": [
          0.2049,
          0.6734
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.2233,
          0.6465
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.2417,
          0.6196
        ],
        "radius": 0.0273
      }
    ],
    "maxSlopeDegrees": 32,
    "trunkCollisions": true,
    "trunkDiameter": 24
  },
  "pines": {
    "model": "assets/models/woodland/temperate-forest-ecology-scots-pine-mature-818bd1b5.glb",
    "seed": 2,
    "size": 240,
    "density": 0.03,
    "coverage": "Everywhere",
    "edits": [
      {
        "operation": "erase",
        "center": [
          0.5,
          0.7767
        ],
        "radius": 0.0895
      },
      {
        "operation": "erase",
        "center": [
          0.5081,
          0.5
        ],
        "radius": 0.1383
      },
      {
        "operation": "erase",
        "center": [
          0.229,
          0.2538
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.2559,
          0.2721
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.2827,
          0.2905
        ],
        "radius": 0.0273
      },
      {
        "operation": "erase",
        "center": [
          0.7462,
          0.2615
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.7279,
          0.2884
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.7095,
          0.3153
        ],
        "radius": 0.0273
      },
      {
        "operation": "erase",
        "center": [
          0.8036,
          0.6649
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.7767,
          0.6465
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.7498,
          0.6281
        ],
        "radius": 0.0273
      },
      {
        "operation": "erase",
        "center": [
          0.2049,
          0.6734
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.2233,
          0.6465
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.2417,
          0.6196
        ],
        "radius": 0.0273
      }
    ],
    "maxSlopeDegrees": 32,
    "trunkCollisions": true,
    "trunkDiameter": 20
  },
  "rocks": {
    "model": "rocks.glb",
    "seed": 3,
    "size": 72,
    "density": 0.08,
    "coverage": "Painted",
    "edits": [
      {
        "operation": "add",
        "center": [
          0.6514,
          0.7952
        ],
        "radius": 0.0426
      },
      {
        "operation": "add",
        "center": [
          0.1035,
          0.4268
        ],
        "radius": 0.0329
      },
      {
        "operation": "add",
        "center": [
          0.1266,
          0.8792
        ],
        "radius": 0.0443
      },
      {
        "operation": "add",
        "center": [
          0.6437,
          0.3421
        ],
        "radius": 0.0423
      },
      {
        "operation": "add",
        "center": [
          0.564,
          0.4313
        ],
        "radius": 0.042
      },
      {
        "operation": "add",
        "center": [
          0.1024,
          0.688
        ],
        "radius": 0.043
      },
      {
        "operation": "add",
        "center": [
          0.8029,
          0.3097
        ],
        "radius": 0.0459
      },
      {
        "operation": "add",
        "center": [
          0.7928,
          0.7394
        ],
        "radius": 0.0441
      },
      {
        "operation": "add",
        "center": [
          0.9017,
          0.6362
        ],
        "radius": 0.0399
      },
      {
        "operation": "add",
        "center": [
          0.0913,
          0.2126
        ],
        "radius": 0.0288
      },
      {
        "operation": "erase",
        "center": [
          0.5,
          0.7767
        ],
        "radius": 0.0895
      },
      {
        "operation": "erase",
        "center": [
          0.229,
          0.2538
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.2559,
          0.2721
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.2827,
          0.2905
        ],
        "radius": 0.0273
      },
      {
        "operation": "erase",
        "center": [
          0.7462,
          0.2615
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.7279,
          0.2884
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.7095,
          0.3153
        ],
        "radius": 0.0273
      },
      {
        "operation": "erase",
        "center": [
          0.8036,
          0.6649
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.7767,
          0.6465
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.7498,
          0.6281
        ],
        "radius": 0.0273
      },
      {
        "operation": "erase",
        "center": [
          0.2049,
          0.6734
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.2233,
          0.6465
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.2417,
          0.6196
        ],
        "radius": 0.0273
      }
    ],
    "maxSlopeDegrees": 36,
    "trunkCollisions": true,
    "trunkDiameter": 80
  },
  "stones": {
    "model": "stones.glb",
    "seed": 4,
    "size": 4,
    "density": 0.02,
    "coverage": "Everywhere",
    "edits": [
      {
        "operation": "erase",
        "center": [
          0.5,
          0.7767
        ],
        "radius": 0.0895
      },
      {
        "operation": "erase",
        "center": [
          0.229,
          0.2538
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.2559,
          0.2721
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.2827,
          0.2905
        ],
        "radius": 0.0273
      },
      {
        "operation": "erase",
        "center": [
          0.7462,
          0.2615
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.7279,
          0.2884
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.7095,
          0.3153
        ],
        "radius": 0.0273
      },
      {
        "operation": "erase",
        "center": [
          0.8036,
          0.6649
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.7767,
          0.6465
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.7498,
          0.6281
        ],
        "radius": 0.0273
      },
      {
        "operation": "erase",
        "center": [
          0.2049,
          0.6734
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.2233,
          0.6465
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.2417,
          0.6196
        ],
        "radius": 0.0273
      }
    ],
    "drawDistance": 3000,
    "castShadow": false
  },
  "flowers": {
    "model": "flowers.glb",
    "seed": 5,
    "size": 37,
    "density": 0.08,
    "coverage": "Painted",
    "edits": [
      {
        "operation": "add",
        "center": [
          0.5,
          0.5
        ],
        "radius": 0.3743
      },
      {
        "operation": "erase",
        "center": [
          0.5081,
          0.5
        ],
        "radius": 0.1383
      },
      {
        "operation": "erase",
        "center": [
          0.229,
          0.2538
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.2559,
          0.2721
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.2827,
          0.2905
        ],
        "radius": 0.0273
      },
      {
        "operation": "erase",
        "center": [
          0.7462,
          0.2615
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.7279,
          0.2884
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.7095,
          0.3153
        ],
        "radius": 0.0273
      },
      {
        "operation": "erase",
        "center": [
          0.8036,
          0.6649
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.7767,
          0.6465
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.7498,
          0.6281
        ],
        "radius": 0.0273
      },
      {
        "operation": "erase",
        "center": [
          0.2049,
          0.6734
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.2233,
          0.6465
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.2417,
          0.6196
        ],
        "radius": 0.0273
      }
    ],
    "scaleRange": {
      "min": 0.7,
      "max": 1.3
    },
    "drawDistance": 2000,
    "castShadow": false
  },
  "mushrooms": {
    "model": "mushrooms.glb",
    "seed": 6,
    "size": 23,
    "density": 0.05,
    "coverage": "Painted",
    "edits": [
      {
        "operation": "add",
        "center": [
          0.5,
          0.5
        ],
        "radius": 0.3743
      },
      {
        "operation": "erase",
        "center": [
          0.5081,
          0.5
        ],
        "radius": 0.1383
      },
      {
        "operation": "erase",
        "center": [
          0.229,
          0.2538
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.2559,
          0.2721
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.2827,
          0.2905
        ],
        "radius": 0.0273
      },
      {
        "operation": "erase",
        "center": [
          0.7462,
          0.2615
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.7279,
          0.2884
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.7095,
          0.3153
        ],
        "radius": 0.0273
      },
      {
        "operation": "erase",
        "center": [
          0.8036,
          0.6649
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.7767,
          0.6465
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.7498,
          0.6281
        ],
        "radius": 0.0273
      },
      {
        "operation": "erase",
        "center": [
          0.2049,
          0.6734
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.2233,
          0.6465
        ],
        "radius": 0.0221
      },
      {
        "operation": "erase",
        "center": [
          0.2417,
          0.6196
        ],
        "radius": 0.0273
      }
    ],
    "scaleRange": {
      "min": 0.7,
      "max": 1.3
    },
    "drawDistance": 2000,
    "castShadow": false
  }
};
