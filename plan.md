# Umsetzungsplan: „Gertrudes Greinwald privater Garten“ ohne GDevelop

## Genehmigter Umfang

Das bestehende Browser-Spiel wird als eigenständiges Three.js-Spiel neu umgesetzt. GDevelop darf weder zur Laufzeit geladen noch als Projekt-/Exportcode für den Spielstart benötigt werden. Der bestehende Spielumfang bleibt so weit wie möglich erhalten: 3D-Garten, Gartenwichtel, Sammelpfade, Tastatur- und Touchsteuerung, Interaktionen, Shop, Speicherung sowie das Match-3-Minispiel. Die vorhandenen passenden Modelle, Texturen, UI-Bilder, Schrift und der Münz-Sound werden weiterverwendet. Die Wichtel-Wippbewegung wird in die neue Spielerlogik übernommen und bleibt auf Bewegung beschränkt.

## Gestaltung

Die bestehende verspielte, grüne Gartenstimmung, der Titel und die vorhandenen Caesar-Dressing-/UI-Assets bleiben erhalten. Das UI bleibt gut lesbar und für Desktop sowie Touchgeräte bedienbar. Die Spielfigur erhält eine kleine, weiche Laufwippe nur während geerdeter Bewegung; animiert wird ausschließlich der sichtbare Modellknoten, während Physik-/Kamerawurzel stabil bleiben.

## Architektur und Datenfluss

- Eigenständiger Browser-Start über `index.html` und eigene ES-Module unter `src/`; keine GDevelop-Skripte, kein `gdjs.RuntimeGame`, kein GDevelop-Eventcode als Runtime.
- Three.js für 3D-Darstellung, GLTF-Import, Kamera und Raycasting; eine kleine eigenständige Physik-/Kollisionsschicht übernimmt Bewegung, Sprung, Hindernisse und die schiebbare Kiste. Zusätzliche Physik wird nur genutzt, falls die bestehende Kollisionslogik es erfordert.
- Projektcode wird lokal und reproduzierbar gebündelt, damit GitHub Pages weiterhin statische Dateien vom bestehenden Repository-Root ausliefern kann. Laufzeitcode und Modelle werden ohne CDN-Abhängigkeit ausgeliefert.
- Aus den GDevelop-Exportdaten werden nur benötigte Positions-, Terrain-, Streu- und UI-Werte in ein neutrales eigenes Format übertragen. Einmalige Extraktion ist erlaubt; die fertige Anwendung lädt `data.js`, `code0.js`, `code1.js` oder GDevelop-Extensions nicht.
- Die vorhandenen Weltkoordinaten sind Z-up. Die Three.js-Welt behält eine eindeutige Achsenkonvention; GLB-Modelle erhalten eine feste Korrektur am Wrapper statt laufender Einzelkorrekturen.
- Hauptmodule: Start/Renderloop, Garten/Terrain und dekorative Streuung, Spieler/Steuerung/Kamera, Interaktionen, HUD/Touch/Sprachen, lokale Speicherung und Match-3.

## Zu erhaltende Spielinhalte

1. **3D-Garten:** das Garten-Terrain mit Gras-/Weg-/Fels-/Sand-Charakter, Wasserfläche, Skybox und Licht; der Gartenwichtel als Spielfigur; Brunnen, Bank, Schild, Garten-Dekoration, Vegetationsstreuung, vier Markierungsflaggen, 45 Münzen, Hindernisse und Kartengrenzen. Die Ausgangsanordnung und Münzpositionen werden aus dem Export in neutrale Laufzeitdaten übertragen.
2. **Steuerung:** Desktop mit WASD und Leertaste zum Springen, Touch mit virtuellem Joystick und Sprungtaste, Umschalter zwischen Steuerungsarten, sowie Third-Person-Kamera mit Maus-/Touchbedienung.
3. **Gartenmechaniken:** Münzen sammeln und Sound abspielen; Schild öffnet Match-3; Sterne und Gartenlevel im HUD; Brunnen und Bank mit Sternen restaurieren; Stern-Shop für Beet, Statue, Laterne und Gnom; gekaufte Objekte per Boden-Raycaster platzieren. Sprache Deutsch/Brasilianisches Portugiesisch und Spielstand bleiben im Browser gespeichert.
4. **Match-3:** 8×8-Feld mit fünf Farben, Tausch benachbarter Steine, Match-Auflösung/Kaskaden und Nachrücken, Ziel-/Zugzähler, Level-Farbfolge, Sternbelohnung, Erfolg/Niederlage und Rückkehr in den Garten.
5. **Wichtelanimation:** dezente vertikale Wippe plus leichte Seitbewegung nur während geerdeter Bewegung; im Stillstand vollständig beruhigt, beim Springen nicht als Laufanimation aktiv; keine Änderung der Kollisions- oder Kamerawurzel.

## Umsetzung und Übergabe

Die statische Pages-Auslieferung im Repository-Root bleibt bestehen; die GitHub-Pages-Konfiguration wird nicht ohne Not umgestellt. Nach Umsetzung werden GDevelop-Runtime, Erweiterungen und generierter App-Code, die für die eigenständige Version nicht mehr benötigt werden, aus dem aktiven Projektbestand entfernt; alle tatsächlich verwendeten Spiel-Assets bleiben erhalten. Vor dem Push werden Build, Script-/Assetpfade, beide Spielmodi, Steuerung, Speichern und Abwesenheit von GDevelop-Laufzeitreferenzen geprüft. Anschließend werden die Änderungen auf `main` gepusht und die veröffentlichte Seite auf den neuen Start geprüft.

## Risiken und Grenzen

GDevelops Terrain- und Scatter-Plugins enthalten serialisierte Bearbeitungen. Diese müssen in eigene Mesh-/Höhen-/Streu-Daten übersetzt werden; Plugin-Code wird nicht übernommen. Die Zielsetzung ist eine möglichst nahe spielbare Reproduktion, keine bytegenaue Reproduktion der GDevelop-Renderergebnisse. Unveränderte visuelle Details werden nur dann angepasst, wenn es für eine lauffähige, eigenständige Umsetzung nötig ist.
