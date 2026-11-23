# TODO

## 1. Eigenständiger Start ohne GDevelop
- Der Nutzer bat: „tausche doch alles von GDevelop aus ..so das da keine Abhängigkeit mehr besteht“.
- Genehmigter Umfang: das bestehende Spiel mit Garten, Wichtel, Münzen und Steuerung als eigenständiges Three.js-Spiel neu aufbauen, ohne GDevelop-Laufzeit oder GDevelop-Exportdateien als Laufzeitabhängigkeit.
- `index.html` startet nur den eigenen Three.js-Client; weder `gdjs.RuntimeGame` noch GDevelop-Runtime-/Erweiterungsskripte, `data.js`, `code0.js` oder `code1.js` sind für den Start oder das Spiel erforderlich.
- Spielcode und benötigte Bibliotheken werden lokal statisch ausgeliefert; die bestehende GitHub-Pages-Root-Auslieferung und der Spieltitel „Gertrudes Greinwald privater Garten“ bleiben erhalten.
- Nicht mehr benötigter GDevelop-Runtime-/Exportcode wird aus dem aktiven Repo entfernt; verwendete Spiel-Assets bleiben erhalten.

## 2. 3D-Garten, Figur und Steuerung erhalten
- Den vorhandenen 3D-Garten einschließlich Terrain-/Weg-/Wassercharakter, Skybox/Licht, Wichtel, Dekorationen und Vegetationsstreuung eigenständig darstellen.
- Die gespeicherte Startanordnung mit 45 Münzen, Hindernissen, Kartengrenzen, Markierungsflaggen, Schild und schiebbarer Kiste in neutrales eigenes Laufzeitformat übertragen.
- Der Wichtel ist die Spielfigur. Desktopsteuerung bleibt WASD plus Leertaste zum Springen; Touch bietet Joystick und Sprungtaste sowie einen Umschalter zwischen Steuerungsarten.
- Third-Person-Kamera folgt dem Wichtel; Maus-/Touchbedienung kann die Kamera drehen.

## 3. Garteninteraktionen, Oberfläche und Speicherung erhalten
- Münzen werden beim Annähern eingesammelt und spielen den vorhandenen Münz-Sound.
- Das Schild startet das Match-3-Minispiel. Das HUD zeigt Sterne/Gartenlevel und die situationsbezogene Interaktionsaufforderung.
- Brunnen (3 Sterne) und Bank (2 Sterne) lassen sich bei Nähe restaurieren; Shopkäufe kosten Beet 2, Statue 4, Laterne 3 und Gnom 1 Stern. Gekaufte Objekte können auf dem Terrain platziert werden.
- Sprache ist Deutsch oder brasilianisches Portugiesisch; Sprachwahl und Spielstand für Sterne, Puzzle-Level/-Fortschritt, Restaurierungen, Besitz und platzierte Objekte bleiben gespeichert.

## 4. Match-3-Minispiel erhalten
- 8×8-Raster mit fünf Farben und orthogonalem Tausch benachbarter Felder.
- Drei oder mehr horizontale/vertikale Steine bilden Matches; Kaskaden werden aufgelöst, Steine fallen nach und neue Farben erscheinen.
- Gültige Züge kosten einen Zug; Levelziel/Farbe, Erfolg/Niederlage, Sternbelohnung und Rückkehr in den Garten bleiben erhalten.

## 5. Bewegungsabhängige Wichtel-Wippe
- Der Nutzer bat: „Füge dem Wichtel eine einfache Laufanimation oder Wackel-Animation hinzu, wenn er sich bewegt.“
- Eine dezente Wipp-/Seitbewegung läuft nur bei geerdeter Bewegung, beruhigt sich im Stillstand und ist keine Laufanimation während eines Sprungs.
- Die Bewegung verändert nur das sichtbare Modell, nie Physik-/Kamerawurzel oder Kollisionsdaten.

## 6. Gemütliche isometrische Gartengestaltung nach Referenz
- Der Nutzer bat: „kann's du das Spiel in dieser Art erstellen?“; die neu angehängte Referenz zeigt eine gemütliche, detailreiche isometrische Gartenansicht mit gepflasterten Wegen, üppigen Beeten, dekorativen Objekten und sichtbarer Design-/Auswahloberfläche.
- Gestalte die bestehende Three.js-Gartenwelt in dieser visuellen Richtung: feste orthografische Isometrie, warme Storybook-Farbwelt, lesbare Wege/Beete und auffindbare Dekorationen; nutze das Bild als Stilhinweis, ohne fremde Figuren, Anordnung oder konkrete UI zu kopieren.
- Zeige eine klar erkennbare Marken-/Statusoberfläche sowie eine Dekorationsauswahl; Shop, Kosten, Platzieren und Touch-Steuerung bleiben nutzbar.
- Erhalte Gartenwichtel, Bewegung, Münzen, Shop/Restaurierungen, Speicherung, Deutsch/Brasilianisches Portugiesisch und Match‑3 aus dem bestehenden Spiel.
