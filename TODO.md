# TODO – 2D-Android-Neuaufbau

## 0. Vollbild-Garten und Villa per Finger erkunden und frei dekorieren
- In der Villa und im Garten kann die Spielerin oder der Spieler die Vollbild-Szene mit dem Finger frei erkunden und die Ansicht durch Wischen verschieben.
- Gegenstände aus einer zusätzlichen Dekorationsauswahl lassen sich direkt in der Szene platzieren, mit dem Finger frei verschieben und in ihrer Position speichern.
- Die Auswahl bietet mehrere zusätzliche, passende Gegenstände für Garten und Villa; die Szenenobjekte bleiben mit den Renovierungen und gespeicherten Varianten erhalten.
- Tapeten können direkt an der Wand angebracht werden; die vorhandenen Tapetenvarianten und Sterne-/Renovierungsfortschritte bleiben erhalten.

## 1. 2D-Anwesen mit fingerbedientem Garten- und Villenausbau
- Der Nutzer wählte die Richtung „Match‑3-Gartenaufbau neu gestalten“ und ergänzte: „2 D reicht ist auch besser sichtbar...als Erfolge eben Villa und Gärten Ausbau...Möbel, Tapeten, Pflanzen und Werkzeuge“.
- Erlaubt ist, den bisherigen Three.js-Spielablauf umfassend zu ersetzen. Das aktive Spiel zeigt ein eigenes, gut sichtbares 2D-Anwesen mit Garten und Villa; keine freie 3D-Bewegung, Tastatur, Maus oder virtueller Joystick werden vorausgesetzt.
- Zum Renovieren öffnet sich der gewählte Garten oder die Villa im Vollbild; die Szene füllt nahezu das gesamte Display, und Zurück sowie der Wechsel zwischen den Bereichen bleiben erreichbar.
- Das Gesamtbild von Szene und Oberfläche wird natürlicher und realistischer mit mehr Materialdetails, Licht und Tiefe, bleibt aber eine gut lesbare, fingerbedienbare 2D-Spielwelt.
- Die Szene zeigt mehrere freischaltbare bzw. aufwertbare Elemente in beiden Bereichen: Gartenwege/Beete/Pflanzen sowie Villawände/Tapeten und Möbel; Werkzeuge sind sichtbare Spielgegenstände bzw. Match‑3-Hilfen.
- Der Nutzer bedient die App nur mit Fingern: tippt Navigation, Aufgaben und Dekorationsauswahl an und tauscht Match‑3-Steine per Tippen oder Wischen. Oberfläche und Spielfeld passen in Hochkant-Smartphone-Ansichten; Status-/Aufgabenflächen sind kompakt und nicht so groß wie die zuvor kritisierten Tablet-Buttons, während interaktive Touchflächen gut erreichbar bleiben.
- Das Ergebnis bleibt eigenständig: Name und Welt „Gertrudes Greinwald privater Garten“ bleiben erhalten; Gardenscapes ist Genre-/Ablaufinspiration, nicht eine Vorlage zum Kopieren von Figuren, Assets, Texten, Szenen oder konkretem UI.

## 2. Match‑3 als Fortschrittsschleife und sichtbare Renovierungen
- Erfolgreiche Match‑3-Level geben Sterne als Währung für sichtbare Renovierungsaufgaben an Villa und Garten; fehlgeschlagene Level können ohne Echtgeld- oder Energiezwang erneut gestartet werden.
- Renovierungsschritte zeigen ihre Sternkosten vor dem Ausgeben. Auf ausgewählten Aufgaben kann der Spieler oder die Spielerin zwischen bis zu drei kosmetischen Varianten wählen, darunter Pflanzen/Beete, Wand- bzw. Tapetenmuster und Möbel; Auswahl und Fortschritt bleiben lokal erhalten.
- Die Bereiche Garten und Villa sind in mehr als einer Reihenfolge erreichbar, statt jede Dekoration als einzigen linearen Strang vorzugeben. Ein Werkstatt-/Schuppen-Upgrade verbindet Anwesenfortschritt mit einem begrenzten Werkzeug-/Booster-Vorteil für Match‑3.
- Das bestehende 8×8-Match‑3 mit fünf Farben, Ziel-/Zugzähler, Nachrücken, Kaskaden und Sternbelohnung bleibt spielbar. Vierer-Matches erzeugen richtungsabhängige Zeilen-/Spaltenraketen; Fünfer-Matches erzeugen Regenbogensteine; L-/T-Kreuzungen erzeugen Blumenbomben. Diese Spezialsteine entstehen auch in Kaskaden und können Ketteneffekte auslösen.
- Pro Match‑3-Level stehen zwei Schaufeln und eine Gießkanne als limitierte, zugfreie Booster zur Verfügung. Die Schaufel entfernt ein Feld; die Gießkanne räumt ein 3×3-Feld. Sie bleiben bei null Zügen einsetzbar; Zielsteine zählen bei Spezialeffekten und Boostern mit.

## 3. Kostenlose, verwendbare 2D-Assets und Lizenznachweis
- Die Garten- und Innenraumszenen kombinieren eigene CSS-Dioramen mit tatsächlich verwendeten, kostenlosen CC0-Sprites aus Pixor-Pflanzen-, Natur-, Innenraum- und Werkzeugpaketen; es werden keine Screaming-Brain-Kacheln eingebunden.
- Für Pflanzen, Möbel und Gartengeräte werden passende CC0-Sprite-Dateien von Pixor oder gleichwertigen Quellen übernommen. Eine kostenlose Asset-Seite gilt nicht automatisch als kommerziell frei: Lizenzbedingungen werden pro Pack geprüft; das kostenlose Cozy Interior-Paket mit ausdrücklich nichtkommerzieller Lizenz wird nicht verwendet.
- `ASSET_CREDITS.md` nennt die Pixor-Quelle, die konkret genutzten Sprite-Dateien und die CC0-Lizenz. Nicht benötigte komplette Assetarchive, 3D-Modelle und Blender-Dateien werden nicht in die ausgelieferte Android-App kopiert.

## 4. Android-App und Browserausgabe
- Das bestehende statische Webspiel wird per Capacitor als lokales Android-WebView-Spiel in einer direkt installierbaren APK verpackt; die App lädt keine externe Website und bleibt offline spielbar.
- Die Android-App startet mit festem Hochkantformat und übernimmt denselben Spielstand, dieselben Spracheinstellungen und dieselben Touch-Abläufe wie die Browserfassung. Mindestversion und native App-Metadaten werden dokumentiert.
- Eine tatsächlich erfolgreich erzeugte Debug-APK wird dem Nutzer als Datei bereitgestellt. Sie wird klar als Test-APK, nicht als Play-Store-Release und nicht mit einem persönlichen Release-Schlüssel signiert beschrieben. Der Nutzer hat keine Play-Store-Veröffentlichung angefordert.
- Der Repository-Root und der bisherige statische GitHub-Pages-Einstieg bleiben als Browserfassung verfügbar; Build-Ausgabe, Android-Webassets und Bildpfade funktionieren in beiden Bereitstellungen.

## 5. Lokaler Fortschritt, Sprache und Upgrade-Kompatibilität
- Spielstände bleiben ohne Login oder Backend lokal gespeichert. Beim ersten Start nach dem Umbau werden, soweit kompatibel, alte Sterne, Match‑3-Level, Sprachwahl und abgeschlossene Brunnen-/Bank-Restaurierungen aus `gertrudes-greinwald-garden-save-v1` übernommen.
- Deutsch und brasilianisches Portugiesisch sind sowohl für Anwesen, Renovierungsaufgaben und Hinweise als auch für Match‑3, Spezialsteine, Booster und Ergebnisdialoge verfügbar.
- Veraltete 3D-Bewegungstexte, Desktop-Tastenhinweise und der Joystick erscheinen nicht mehr im aktiven mobilen Spielfluss.
