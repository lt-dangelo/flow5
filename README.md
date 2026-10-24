# Flow5 – Calisthenics Timer (PWA)

Ein lauffähiger, deutschsprachiger Prototyp einer Progressive Web App ohne Framework, Backend oder externe Abhängigkeiten.

## Funktionen
- 5 Trainingsprogramme mit jeweils 5 Übungen (insgesamt 22 austauschbare Übungen)
- Austausch einzelner Übungen, einschließlich Suche nach Übungsname und Muskelgruppe
- Frei einstellbare Belastung (5–600 s), Erholung (0–300 s) und Rundenzahl (1–20)
- Optionale Erholungsphase nach der allerletzten Übung
- Exakte Gesamtzeit, Belastungs- und Erholungsdauer
- Laufender Trainingstimer mit Übungsillustrationen, Kurzbeschreibung, nächster Übung, Pause/Fortsetzen/Weiter
- Web-Audio-Signale bei Übungswechsel; Screen Wake Lock, falls vom Gerät zugelassen
- Automatisch lokal gespeicherte Einstellungen; offline-fähig bei Installation über HTTPS
- Keine Anmeldung, kein Tracking, kein Server für persönliche Trainingsdaten

## Start auf dem Rechner

Die Website nutzt JavaScript-Module und einen Service Worker. Bitte über einen lokalen HTTP-Server und nicht direkt per `file://` öffnen:

```bash
cd flow5-pwa
python3 -m http.server 8000
```

Danach im Browser `http://localhost:8000` aufrufen.

## Auf das iPhone bringen (kostenlos, ohne Mac)

Eine PWA benötigt zur Installation und Offline-Nutzung eine **HTTPS-Adresse**. Am einfachsten über GitHub Pages:

1. Auf [github.com](https://github.com) ein kostenloses Konto verwenden und ein öffentliches Repository anlegen, z. B. `flow5`. (Die Quelldateien werden öffentlich sichtbar.)
2. **Den Inhalt** dieses Ordners (insbesondere `index.html`, `src/`, `icons/`, `sw.js`, `styles.css` und `manifest.webmanifest`) ins Stammverzeichnis des Repositories hochladen, nicht den ZIP-Ordner selbst.
3. Unter **Settings → Pages** als Quelle **Deploy from a branch** auswählen und `main / (root)` setzen.
4. Die bereitgestellte Pages-Adresse in **Safari auf dem iPhone** aufrufen, beispielsweise `https://BENUTZERNAME.github.io/flow5/`.
5. Safari: **Teilen → Zum Home-Bildschirm**. App öffnen und nach der ersten Online-Nutzung bei Bedarf erneut öffnen, damit alle Offline-Dateien zwischengespeichert sind.

Alternativ kann man einen anderen statischen HTTPS-Host verwenden. `manifest.webmanifest`, `sw.js` und alle Assets müssen vom selben Ursprung erreichbar sein.

## Timing

Die Standardeinstellungen ergeben 3 Runden × 5 Übungen × (40 s Belastung + 20 s Erholung) = **15:00 Minuten**.
Dazu ist „Erholung nach der letzten Übung“ standardmäßig eingeschaltet. Wenn man diese Option deaktiviert, endet das Training nach **14:40 Minuten** – direkt nach der letzten Belastung.

Die Engine verwendet absolute, monotone Zeitpunkte (`performance.now()`). Dadurch kumulieren sich keine Tick-Verzögerungen. Pausieren stoppt die Trainingszeit, „Weiter“ überspringt die laufende Phase.

## Grenzen des ersten Prototyps

- **Display-Wachhalten:** Die Web-App beantragt die Screen Wake Lock API. iOS kann diese Anforderung verweigern oder den Lock widerrufen, z. B. bei Stromsparmodus. Die App zeigt dann einen Hinweis an. Zur Sicherheit ggf. die automatische Displaysperre vorübergehend in iOS-Einstellungen anpassen.
- **App im Vordergrund:** Timer und Töne sind darauf ausgelegt, dass die App sichtbar bleibt. Bei Sperrbildschirm oder Wechsel zu anderen Apps kann iOS JavaScript/Audio pausieren. Beim Zurückkehren wird die Zeitposition nachgeführt, aber verpasste Tonsignale werden nicht wiederholt.
- **Sound:** Der Ton wird durch die aktive Schaltfläche gestartet; das ist erforderlich, damit Browser Audio freigeben können. Im Lautlos-Modus oder bei Browser-Einschränkungen sind Töne ggf. nicht hörbar.
- **Demos:** Die Bilder sind vereinfachte, schematische SVG-Posen; keine animierten Bewegungsanleitungen. Trainiere im eigenen Leistungsbereich und brich bei Schmerzen ab.
- **Seite neu laden:** Ein aktiver Lauf wird dadurch beendet. Konfiguration und Übungstausch bleiben erhalten.
- **Trainingsabschluss:** Die Abschlussübersicht zeigt die *geplante* Dauer, auch wenn einzelne Abschnitte übersprungen wurden.

## Tests

```bash
node tests/engine.test.mjs
```

Keine zusätzlichen Abhängigkeiten nötig.

## Struktur

- `index.html` – HTML-Einstieg
- `styles.css` – Responsive Layout, insbesondere iPhone
- `src/data.js` – Trainingssets und Übungstexte
- `src/art.js` – schematische lokale SVG-Illustrationen
- `src/engine.js` – testbare, UI-unabhängige Zeitlogik
- `src/app.js` – Oberfläche und Bedienung
- `sw.js`, `manifest.webmanifest`, `icons/` – PWA/Offline-Installation
