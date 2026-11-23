# Umsetzungsplan: „Gertrudes Greinwald privater Garten“ ohne GDevelop

## Genehmigter Umfang

Das bestehende Browser-Spiel wird als eigenständiges Three.js-Spiel neu umgesetzt. GDevelop darf weder zur Laufzeit geladen noch als Projekt-/Exportcode für den Spielstart benötigt werden. Der bestehende Spielumfang bleibt so weit wie möglich erhalten: 3D-Garten, Gartenwichtel, Sammelpfade, Tastatur- und Touchsteuerung, Interaktionen, Shop, Speicherung sowie das Match-3-Minispiel. Die vorhandenen passenden Modelle, Texturen, UI-Bilder, Schrift und der Münz-Sound werden weiterverwendet. Die Wichtel-Wippbewegung wird in die neue Spielerlogik übernommen und bleibt auf Bewegung beschränkt.

## Gestaltung

Die vom Nutzer bereitgestellte Referenz dient als Richtung für ein gemütliches, handgemalt wirkendes isometrisches Garten-Dekorationsspiel; Figuren, Layout und konkrete Bilddetails werden nicht kopiert. Der Wechsel betrifft Kamera, Szene und Präsentation, nicht die bereits vorhandenen Spielregeln: Der Wichtel bleibt beweglich und sammelbar, Münzen, Restaurierungen, Shop, Speichern, Sprachen und Match‑3 bleiben Teil des Spiels.

- **Designbewegung:** märchenhaftes, isometrisches Storybook-Gartenspiel mit leicht plastischen 3D-Modellen und sanft gemalten Materialfarben.
- **Kernprinzipien:** üppig und kurvig statt technisch-geradlinig; warme und natürliche Materialien; Dekorationen und Interaktionen auf den ersten Blick erkennbar; UI bleibt auf Touchflächen gut bedienbar.
- **Farbphilosophie:** Salbeigras und Blattgrün vermitteln Ruhe; gepflasterte Wege, Terrakotta und Holz wärmen die Szene; cremefarbene Papierflächen mit goldenen Münz-/Sternakzenten geben der Auswahl eine gemütliche Buchillustrations-Anmutung.
- **Layout-Paradigma:** fest ausgerichtete orthografische Isometrie, die dem Wichtel folgt; Status- und Markenplakette oben, Gartenfläche als Hauptmotiv, gut sichtbare Dekorationsleiste am unteren Bildschirmrand. Drag/Zoom darf den Blickwinkel begrenzt anpassen.
- **Signaturmotive:** warme unregelmäßige Steinplatten auf geschwungenen Wegen; kleine Blüten- und Beetakzente; cremefarbene, abgerundete Plaketten mit blattgrünen Knöpfen und Münzgold.
- **Interaktionsphilosophie:** Jede Aktion erklärt Kosten und Effekt direkt; Shop, Restaurierung und Platzieren bleiben ohne Verlust des Spielfortschritts erreichbar; Touchflächen werden nicht von der Dekorationsleiste überdeckt.
- **Animation:** Wichtel wippt nur während geerdeter Bewegung; Münzen schweben dezent; UI reagiert weich und kurz, ohne fortlaufend abzulenken.
- **Typografie:** „Caesar Dressing“ nur für Markenakzent/Überschriften, Georgia oder System-Serif für Status, Schaltflächen und längere Texte.
- **Markenessenz:** ein privater Märchengarten, den man beim Erkunden Stück für Stück wieder zum Leben erweckt; Persönlichkeit: herzlich, verspielt, behaglich.
- **Markensprache:** freundlich, konkret, ermutigend. Beispiele: „Ein neuer Winkel für den Garten“ und „Noch ein Stern – und der Brunnen sprudelt wieder.“
- **Wortmarke/Logo:** Name in einer kleinen, cremefarbenen Gartentafel mit stilisiertem Blatt-/Blütenzeichen, nicht als nackter Standardschriftzug.
- **Signaturfarbe:** sattes Salbeiblattgrün, aus dem sich Schaltflächen und UI-Rahmen ableiten.

Die Wichtelfigur erhält weiterhin eine weiche Laufwippe nur während geerdeter Bewegung; animiert wird ausschließlich der sichtbare Modellknoten, während Physik-/Kamerawurzel stabil bleiben.

## Architektur und Datenfluss

- Eigenständiger Browser-Start über `index.html` und eigene ES-Module unter `src/`; keine GDevelop-Skripte, kein `gdjs.RuntimeGame`, kein GDevelop-Eventcode als Runtime.
- Three.js für 3D-Darstellung, GLTF-Import, Kamera und Raycasting; eine kleine eigenständige Physik-/Kollisionsschicht übernimmt Bewegung, Sprung, Hindernisse und die schiebbare Kiste. Zusätzliche Physik wird nur genutzt, falls die bestehende Kollisionslogik es erfordert.
- Projektcode wird lokal und reproduzierbar gebündelt, damit GitHub Pages weiterhin statische Dateien vom bestehenden Repository-Root ausliefern kann. Laufzeitcode und Modelle werden ohne CDN-Abhängigkeit ausgeliefert.
- Aus den GDevelop-Exportdaten werden nur benötigte Positions-, Terrain-, Streu- und UI-Werte in ein neutrales eigenes Format übertragen. Einmalige Extraktion ist erlaubt; die fertige Anwendung lädt `data.js`, `code0.js`, `code1.js` oder GDevelop-Extensions nicht.
- Die vorhandenen Weltkoordinaten sind Z-up. Die Three.js-Welt behält eine eindeutige Achsenkonvention; GLB-Modelle erhalten eine feste Korrektur am Wrapper statt laufender Einzelkorrekturen.
- Hauptmodule: Start/Renderloop, Garten/Terrain und dekorative Streuung, Spieler/Steuerung/Kamera, Interaktionen, HUD/Touch/Sprachen, lokale Speicherung und Match-3.

## Zu erhaltende Spielinhalte

1. **3D-Garten:** das Garten-Terrain mit Gras-/Weg-/Fels-/Sand-Charakter, Wasserfläche, hellem Gartenhintergrund und warmem Licht; gepflasterte Wege und ergänzte Blumenbeete; der Gartenwichtel als Spielfigur; Brunnen, Bank, Schild, Garten-Dekoration, Vegetationsstreuung, vier Markierungsflaggen, 45 Münzen, Hindernisse und Kartengrenzen. Die Ausgangsanordnung und Münzpositionen werden aus dem Export in neutrale Laufzeitdaten übertragen.
2. **Steuerung:** Desktop mit WASD und Leertaste zum Springen, Touch mit virtuellem Joystick und Sprungtaste, Umschalter zwischen Steuerungsarten, sowie isometrische Orthografiekamera, die dem Wichtel folgt und per Maus-/Touchbedienung begrenzt dreh- und zoombar bleibt.
3. **Gartenmechaniken:** Münzen sammeln und Sound abspielen; Schild öffnet Match-3; Sterne und Gartenlevel im HUD; Brunnen und Bank mit Sternen restaurieren; Stern-Shop für Beet, Statue, Laterne und Gnom; gekaufte Objekte per Boden-Raycaster platzieren. Sprache Deutsch/Brasilianisches Portugiesisch und Spielstand bleiben im Browser gespeichert.
4. **Match-3:** 8×8-Feld mit fünf Farben, Tausch benachbarter Steine, Match-Auflösung/Kaskaden und Nachrücken, Ziel-/Zugzähler, Level-Farbfolge, Sternbelohnung, Erfolg/Niederlage und Rückkehr in den Garten. Vierer-Matches erzeugen eine Zeilen- oder Spaltenrakete, Fünfer-Matches einen Regenbogenstein und L-/T-Kreuzungen eine Blumenbombe; diese Muster erzeugen auch in Nachrück-Kaskaden Spezialsteine. Aktivierte Spezialsteine lösen Ketteneffekte aus. Zwei Gartenschaufeln (entfernen ein Feld) und eine Gießkanne (räumt ein 3×3-Feld) stehen pro Match-Instanz als limitierte, zugfreie Booster zur Verfügung und bleiben auch bei null verbleibenden Zügen nutzbar. Zielsteine, die durch Spezialeffekte oder Booster abgeräumt werden, zählen zum Levelziel. Spezialsteine, Boosterzustand, Erklärungen und Effekte funktionieren auf Deutsch und brasilianischem Portugiesisch; Nachbarzüge sind per Tipp/Klick und Wisch möglich.
5. **Wichtelanimation:** dezente vertikale Wippe plus leichte Seitbewegung nur während geerdeter Bewegung; im Stillstand vollständig beruhigt, beim Springen nicht als Laufanimation aktiv; keine Änderung der Kollisions- oder Kamerawurzel.

## Umsetzung und Übergabe

Die statische Pages-Auslieferung im Repository-Root bleibt bestehen; die GitHub-Pages-Konfiguration wird nicht ohne Not umgestellt. Nach Umsetzung werden GDevelop-Runtime, Erweiterungen und generierter App-Code, die für die eigenständige Version nicht mehr benötigt werden, aus dem aktiven Projektbestand entfernt; alle tatsächlich verwendeten Spiel-Assets bleiben erhalten. Vor dem Push werden Build, Script-/Assetpfade, beide Spielmodi, Steuerung, Speichern und Abwesenheit von GDevelop-Laufzeitreferenzen geprüft. Anschließend werden die Änderungen auf `main` gepusht und die veröffentlichte Seite auf den neuen Start geprüft.

## Risiken und Grenzen

GDevelops Terrain- und Scatter-Plugins enthalten serialisierte Bearbeitungen. Diese müssen in eigene Mesh-/Höhen-/Streu-Daten übersetzt werden; Plugin-Code wird nicht übernommen. Die Zielsetzung ist eine möglichst nahe spielbare Reproduktion, keine bytegenaue Reproduktion der GDevelop-Renderergebnisse. Unveränderte visuelle Details werden nur dann angepasst, wenn es für eine lauffähige, eigenständige Umsetzung nötig ist.
