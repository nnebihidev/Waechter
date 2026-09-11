# PflichtwaechterBot — unser Crawler

Diese Seite erklärt den Web-Crawler von Pflichtwächter.

## Wer greift da zu?

User-Agent: `PflichtwaechterBot/1.0 (+https://{{DOMAIN}}/bot)`

Der Bot wird ausschließlich tätig, wenn eine Nutzerin oder ein Nutzer von
Pflichtwächter eine Prüfung für eine Domain anstößt oder eine laufende
Überwachung gebucht hat. Es findet kein flächiges Crawlen des Webs statt.

## Was ruft der Bot ab?

- die Startseite der angefragten Domain,
- verlinkte bzw. übliche Rechtsseiten (Impressum, Datenschutzerklärung, AGB,
  Widerruf, Cookie-Hinweise),
- **maximal 15 Seiten** pro Prüflauf, **maximal 2 MB** pro Seite,
  Timeout 12 Sekunden pro Abruf.

Der Bot folgt keinen Login-, Warenkorb- oder Session-Links und ruft nur
öffentlich erreichbare Seiten über http/https ab.

## robots.txt wird respektiert

Der Bot liest vor jedem Prüflauf Ihre robots.txt und hält sich an
Disallow-Regeln für `PflichtwaechterBot` und `*`.

**Erlauben** (falls Sie global blockieren, aber Pflichtwächter zulassen möchten):

```
User-agent: PflichtwaechterBot
Allow: /
```

**Blockieren:**

```
User-agent: PflichtwaechterBot
Disallow: /
```

Bitte beachten Sie: Wenn Sie den Bot blockieren, können wir für Ihre Domain
keine Prüfberichte erstellen.

## Datenumgang

Abgerufener Seitenquelltext wird spätestens nach 30 Tagen gelöscht. In
Berichten verbleiben nur kurze Textauszüge (maximal 500 Zeichen je Beleg) als
Beleg für ein Prüfergebnis. Einzelheiten: [Datenschutzerklärung](/datenschutz).

## Kontakt

Fragen zum Crawler: {{EMAIL}}
