# Grafikquellen und Lizenzen

## Tatsächlich verwendete Sprites

Die hier aufgeführten PNGs liegen in `assets/2d/` und werden über `src/art.js` in das Spiel eingebunden. Es werden nur ausgewählte transparente Sprite-Frames, keine kompletten Assetarchive oder 3D-Modelle, verwendet.

- `bush.png`, `cherry-tree.png`, `oak-tree.png`, `flower-bed.png`, `sunflower.png` — Pflanzen, Büsche, Bäume und Blumenbeete.
- `sofa.png`, `window-frame.png`, `curtains.png`, `rug-round.png` — Möbel und Einrichtungsgegenstände. `fireplace.png` erscheint als Symbol auf der Kamin-Renovierungskarte; der Kamin in der Zimmeransicht ist aus CSS/HTML gezeichnet.
- `shovel.png`, `watering-can.png` — Gartengeräte und Match‑3-Booster.

Quelle: [Pixor Library Packs](https://pixor.art/library/packs/), Kategorien Plants, Nature, Interior und Tools; Beispiele: [Sunflower](https://pixor.art/library/plants/sunflower/), [Shovel](https://pixor.art/library/tools/shovel/) und [Watering Can](https://pixor.art/library/tools/watering-can/). Die Sprites wurden aus den jeweiligen Sheets ausgeschnitten und auf transparente Einzelbilder exportiert.

Lizenz: [Pixor Library License](https://pixor.art/library/license/) — CC0 1.0 laut Anbieter. Bearbeitung und Nutzung sind auch kommerziell erlaubt; Namensnennung ist nicht vorgeschrieben. Die Quelle ist hier vorsorglich dokumentiert.

## Markenschrift

Die bestehende Datei `f66c77b4a9335111fb8db2dc84354aeb1fc92eb0db7c7302e849c4d421eec02c_CaesarDressing-Regular.ttf` wird für kurze Überschriften verwendet. [Google Fonts – Caesar Dressing](https://fonts.google.com/specimen/Caesar+Dressing) nennt Open Window als Designer. Die Schrift steht unter der [SIL Open Font License 1.1](https://raw.githubusercontent.com/google/fonts/main/ofl/caesardressing/OFL.txt); der offizielle Lizenztext liegt als `CaesarDressing-OFL.txt` im Repository und wird mit Browser- und Android-Ausgabe gebündelt.

## Gestaltung und Technik

- [Richard Marmura – Game Design Analysis: Gardenscapes](https://richard-marmura.squarespace.com/rich-marmura/2018/12/15/game-design-analysis-gardenscapes): ausschließlich Genre-/Ablaufinspiration für die allgemeine Schleife „Match‑3 → Sterne → sichtbare Renovierung“. Figuren, Texte, Assets, Szenen und konkrete Oberfläche sind eigenständig.
- [Capacitor Android Documentation](https://capacitorjs.com/docs/android) und [Getting Started](https://capacitorjs.com/docs/getting-started): Grundlage für das lokale Android-WebView-Projekt und dessen Synchronisierung.

Andere geprüfte Gratispakete sind nicht im Spiel enthalten und werden nicht als verwendete Assets ausgewiesen.
