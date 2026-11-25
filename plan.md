# Umsetzungsplan: „Gertrudes Greinwald privater Garten“ – 2D-Mobile-Neuaufbau

## Genehmigter Umfang

Das bestehende Spiel wird vom frei begehbaren Three.js-Garten auf ein eigenständiges 2D-Match‑3-Garten- und Villenaufbauspiel umgestellt. Die Android-Auslieferung erfolgt als direkt installierbare APK über einen lokalen Capacitor-Android-Wrapper; eine Play-Store-Veröffentlichung ist nicht Teil dieses Umfangs. Die bisherige statische GitHub-Pages-Seite bleibt als Browserfassung erhalten und verwendet denselben Spielclient.

*Gardenscapes* dient ausschließlich als Genre- und Ablaufreferenz: Match‑3-Level geben Sterne, Sterne finanzieren sichtbare Renovierungsschritte. Gertrudes Welt, Wichtel, Texte, Figuren, konkrete Szenen und Oberfläche bleiben eigenständig. Die alte freie 3D-Bewegungssteuerung und der virtuelle Joystick werden aus dem aktiven Spielfluss entfernt. Das Spiel wird für Hochkant-Smartphones gestaltet und ausschließlich durch Tippen und Wischen bedient.

## Gestaltung

- **Designbewegung:** gemütliches, isometrisches 2D-Storybook mit klaren, kontrastreichen Pixel-/Kachelmotiven. Die vorhandene warme Gartensprache bleibt als Markenanker erhalten.
- **Kernprinzipien:** Die 2D-Szene zeigt Fortschritt auf einen Blick; Renovierung ist in kurze, sichtbare Schritte gegliedert; wichtige Aktionen sind mit einer Hand erreichbar; die Spielfläche bleibt frei von übergroßen Bedienelementen.
- **Farbphilosophie:** Salbeigrün und Blattgrün verbinden die Gartenflächen; warmes Creme und Holz tragen das Anwesen; Bernstein/Gold kennzeichnet Sterne und abgeschlossene Arbeit. Farbvarianten an Wänden und Möbeln zeigen echte Auswahl, nicht bloß Statuswechsel.
- **Layout-Paradigma:** Hochkant und szenisch statt einer zentralen Bedienfeldwand: kompakte Statusleiste, große 2D-Anwesenansicht, darunter eine schmale Aufgabe-/Belohnungskarte und eine kleine Drei-Ziele-Navigation für Garten, Villa und Match‑3. Das Puzzle selbst bleibt als klar lesbares 8×8-Raster.
- **Signaturmotive:** Gertrudes Gartentafel mit Blattzeichen; ein verwilderter Garten, der sich sichtbar in ordentliche Beete und Wege verwandelt; warme, wechselbare Wand-/Bodenmuster in der Villa.
- **Interaktionsphilosophie:** Tippen wählt Szenen, Aufgaben und Dekorationen; Wischen oder Tippen zweier Nachbarsteine tauscht Puzzlefelder. Aktionen zeigen Sternkosten vor dem Ausgeben. Keine Tastatur, Maus, Joystick, Herzen, Echtgeldkäufe oder erzwungene langen Dialoge.
- **Animation:** kurze, klare Übergänge für Match-Auflösung und Kaskaden; Pflanzen dürfen dezent wippen; Renovierung verändert einzelne Szenenteile mit kurzem Einblenden. Bewegung reduziert sich bei `prefers-reduced-motion`.
- **Typografie:** gut lesbare System-Serif für Erzählton und Überschriften; system-ui für Zahlen, Status und kleine Beschriftungen. Die vorhandene Caesar-Dressing-Schrift bleibt höchstens als kurzer Markenakzent.
- **Markenessenz:** ein kleines, warmherziges Anwesen, das Spielerinnen und Spieler durch Rätselerfolge Zimmer und Garten Stück für Stück selbst gestalten lässt; Persönlichkeit: herzlich, verspielt, behaglich.
- **Markensprache:** kurze, konkrete und ermutigende deutsche Texte; brasilianisches Portugiesisch bleibt als zweite Sprache verfügbar. Beispiele: „Ein Stern, ein neuer Winkel fürs Zuhause.“ und „Der Wintergarten wartet schon auf seine Blumen.“
- **Wortmarke/Logo:** kompakte Gartentafel mit Blatt-/Fenstersymbol, eigener Name in der vorhandenen Markenfamilie.
- **Signaturfarbe:** sattes Salbeiblattgrün.

## Kernschleife und Fortschritt

1. Eine Levelübersicht beziehungsweise der Anwesen-Bildschirm zeigt den nächsten Match‑3-Level und mehrere erreichbare Renovierungsaufgaben.
2. Ein erfolgreiches Match‑3 bringt Sterne; ein fehlgeschlagenes Level kann ohne Echtgeld-/Energiezwang wiederholt werden.
3. Sterne werden für Villa- und Gartenaufgaben ausgegeben. Die Aufgaben decken mindestens Wege/Beete/Pflanzen im Garten sowie Wandgestaltung/Tapeten und Möbel im Haus ab.
4. Wo es sinnvoll ist, wählt der Spieler oder die Spielerin für eine Renovierung eine von bis zu drei rein kosmetischen Varianten. Die Wahl verändert die sichtbare 2D-Szene und wird gespeichert.
5. Die Werkstatt beziehungsweise das Gartenschuppen-Upgrade kann einen begrenzten Werkzeugvorrat für Match‑3 freischalten. Bestehende Schaufel-/Gießkannen-Booster bleiben als zugfreie, limitierte Hilfen erhalten; keine Monetarisierung wird ergänzt.

## Architektur und Projektstruktur

- `index.html` bleibt der Browser-Einstieg im Repository-Root. GitHub Pages serviert weiterhin statische Dateien; keine GDevelop-Runtime und kein CDN sind zur Laufzeit erforderlich.
- `src/main.js` startet das 2D-Spiel und verbindet Oberfläche, Spielstand, Navigation und Match‑3. `src/garden.js` rendert die auswählbare isometrische Anwesen-/Zimmeransicht. `src/progression.js` enthält Renovierungsaufgaben, Sternkosten, Varianten und Fortschrittshelfer; `src/main.js` liest, migriert und speichert den lokalen Fortschritt. `src/localization.js` hält deutsche und brasilianisch-portugiesische Texte. `src/match3.js` behält die Match‑3-Regeln und ergänzt den integrierten Level-/Belohnungsfluss.
- `src/styles.css` und `src/match3.css` definieren die responsive Hochkant-Oberfläche, Safe-Area-Abstände und Touch-Eingabe. Buttons sind optisch kompakt und besitzen weiterhin ausreichende Touchflächen.
- `assets/2d/` enthält ausschließlich tatsächlich verwendete, lizenzierte Sprites/Tiles; `ASSET_CREDITS.md` hält Quelle, Assetnamen und jeweilige Lizenz fest. Die Szenen kombinieren eigene CSS-gezeichnete Dioramen mit ausgewählten CC0-2D-Sprites aus Pixor-Pflanzen-, Natur-, Innenraum- und Werkzeugpaketen; keine Screaming-Brain-Tiles sind eingebunden.
- `capacitor.config.json` und `android/` enthalten die Capacitor-Konfiguration und das native Android-Projekt. `www/` wird beim Build aus dem Browser-Build erzeugt und nicht als zweite manuell gepflegte Spielcodekopie behandelt. `scripts/prepare-capacitor.mjs` übernimmt nur vom gebündelten Client referenzierte Assetdateien.
- Capacitor verpackt den bestehenden statischen Webclient lokal für Android. Es werden keine Remote-Webseiten geladen; dadurch bleibt die App offline spielbar und nutzt dieselbe lokale Speicherung.

## Speicherung, Kompatibilität und Datenschutz

- Der Spielstand bleibt lokal im Browser/WebView gespeichert; Konto, Backend, Analyse-SDKs und Online-Pflicht sind nicht Teil des Umfangs.
- Vorhandene Werte aus `gertrudes-greinwald-garden-save-v1` werden, soweit sinnvoll, in die neue Fortschrittsstruktur migriert. Sterne, Match‑3-Level und Sprache bleiben erhalten; abgeschlossene alte Restaurierungen werden nicht stillschweigend gelöscht.
- Deutsch und brasilianisches Portugiesisch sowie Match‑3-Spezialsteine, limitierte Booster, Kaskaden und Levelziel bleiben erhalten.
- Die Android-App startet mit festem Hochkantformat. Die vorhandene Browserfassung funktioniert weiter auf Smartphone und Tablet, ohne Maus-/Tastatur- oder Joystick-Anforderung.

## Auslieferung

Ein reproduzierbarer `pnpm build` erzeugt den Browser-Build und bereitet dieselben statischen Dateien für Capacitor vor. Das Android-Projekt wird mit Capacitor synchronisiert; wenn das Android-SDK verfügbar ist, wird eine installierbare Debug-APK gebaut. Eine Debug-APK ist nicht für einen Play-Store-Release signiert. Ein APK-Artefakt wird nur dann als fertig bezeichnet, wenn der Android-Build tatsächlich erfolgreich war.
