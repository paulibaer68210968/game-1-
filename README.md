# Gertrudes Greinwald privater Garten

Eigenständiges, fingerbedientes 2D-Spiel für Hochkant-Smartphones. Match‑3-Level bringen Sterne; Sterne werden in frei wählbare Renovierungen von Garten und Villa investiert. Das Spiel enthält keine GDevelop-Laufzeit und benötigt kein Konto oder eine Internetverbindung. Die statische Browserfassung bleibt im Repository-Root für GitHub Pages verfügbar.

## Lokal bauen

Voraussetzungen: Node.js und pnpm `11.25.0`.

```sh
pnpm install --frozen-lockfile
pnpm build
```

`pnpm build` erstellt `game.bundle.js` und `game.bundle.css` für die statische Browserfassung und kopiert denselben lokalen Client nach `www/`, dem Capacitor-Webverzeichnis. Danach kann der Repository-Root über einen statischen HTTP-Server ausgeliefert werden; `index.html` direkt mit `file://` zu öffnen wird wegen ES-Modulen nicht unterstützt.

## Android-Test-App

Der Android-Wrapper basiert auf Capacitor. Mindestversion ist Android 7.0 (API 24). Zum Bauen wird Android Studio mit Android SDK sowie ein JDK benötigt. Mit installierter Android-Toolchain:

```sh
pnpm cap add android
pnpm cap sync android
pnpm android:debug
```

Das Ziel des lokalen Builds ist eine installierbare Debug-APK unter `android/app/build/outputs/apk/debug/`. Eine Debug-APK ist nicht für den Play Store signiert.

## Spielen

- Tippe auf **Match‑3 spielen**, um ein 8×8-Level zu starten. Nachbarsteine lassen sich durch Tippen oder Wischen tauschen.
- Gewinne Level, um Sterne zu erhalten. Wechsle zwischen Garten und Villa und wähle vor dem Renovieren eine verfügbare Variante. Die Sternkosten werden vor dem Ausgeben angezeigt.
- Tapeten, Möbel, Pflanzen, Wege, Brunnen und Werkzeuge lassen sich nach und nach freischalten. Der renovierte Werkzeugschuppen bringt pro Level zusätzliche Schaufel- und Gießkannen-Booster.
- Deutsch und brasilianisches Portugiesisch sind auswählbar. Fortschritt und Sprache werden lokal auf dem Gerät gespeichert.
- Alte Daten aus `gertrudes-greinwald-garden-save-v1` werden, soweit möglich, in das neue lokale Format übernommen.

## Verzeichnisstruktur

- `src/main.js`: lokaler Spielstand, Hochkant-Oberfläche und Verbindung von Match‑3 und Renovierungsfortschritt.
- `src/match3.js`: 8×8-Spielregeln, Kaskaden, Spezialsteine und Booster.
- `src/garden.js`: isometrische Garten- und Wohnzimmeransichten.
- `src/progression.js` und `src/localization.js`: Renovierungskosten, Varianten und Deutsch/PT‑BR-Texte.
- `src/art.js` und `assets/2d/`: lokal gebündelte CC0-Pixel-Art-Sprites. Die verwendeten Quellen und konkreten Dateien stehen in `ASSET_CREDITS.md`.
- `scripts/prepare-capacitor.mjs`: kopiert den statischen Client in `www/` für Capacitor.

Die verwendeten Pixor-Sprites stehen unter CC0 1.0. Es werden nur die benötigten 2D-PNG-Frames übernommen; 3D-Modelle und Blender-Dateien der Assetpakete werden nicht eingebunden.
