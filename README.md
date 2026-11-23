# Gertrudes Greinwald privater Garten

Eigenständiges 3D-Gartenspiel mit Three.js, ohne GDevelop-Laufzeit. Die Anwendung wird im Repository-Root als statische GitHub-Pages-Seite ausgeliefert.

## Lokal bauen

Voraussetzungen: Node.js und pnpm `11.25.0`.

```sh
pnpm install --frozen-lockfile
pnpm build
```

Das Build erzeugt `game.bundle.js`, `game.bundle.css` sowie gehashte Dateien für lokal eingebundene UI-Bilder und die Schrift. Anschließend den Repository-Root mit einem statischen HTTP-Server ausliefern; `index.html` direkt per `file://` zu öffnen wird wegen ES-Modulen und GLB-Assets nicht unterstützt.

## Steuerung

- Desktop: WASD oder Pfeiltasten bewegen, Leertaste springen, E interagieren, B öffnet den Laden. Ziehen mit Maus oder Touch dreht die Third-Person-Kamera; das Mausrad verändert den Abstand.
- Touch: virtueller Joystick, Aktionstaste und Sprungtaste. Über den Schalter oben rechts lässt sich der Touch-Steuerungsmodus auch auf anderen Geräten aktivieren.
- Am Gartenschild startet das 8×8-Match-3. Erfolgreiche Rätsel bringen Sterne; Brunnen, Bank und Gartendekorationen können mit Sternen restauriert bzw. gekauft werden.

Sprache (Deutsch oder brasilianisches Portugiesisch), gesammelte Münzen, Rätselstufe, Restaurierungen und platzierte Dekorationen werden lokal im Browser gespeichert.

## Projektstruktur

- `src/main.js`: Renderer, Eingabe, Kamera, Spielfortschritt und Zusammensetzen der Module.
- `src/world.js`: Terrain, Skybox, Objekte, Kollisionen und dekorative Vegetation.
- `src/ui.js`: HUD, Shop, Sprache und Touch-Steuerung.
- `src/match3.js` / `src/match3.css`: unabhängiges Match-3-Minispiel.
- `src/data/gardenData.js`: neutrales Gartenlayout und Streuparameter.
- Bestehende Modelle, Texturen, Schrift und Sounddatei liegen als statische Assets im Repository-Root bzw. unter `assets/`.
