# Auftragsverarbeitungsvertrag (AVV)

> **Entwurf** — vor Launch von einem IT-Recht-Anwalt prüfen lassen und alle Platzhalter ersetzen (siehe LEGAL.md).

Vertrag über die Auftragsverarbeitung nach Art. 28 DSGVO zwischen der Kundin
bzw. dem Kunden (nachfolgend „Verantwortlicher") und

{{ANBIETER_NAME}} {{ANBIETER_RECHTSFORM_ZUSATZ}}, {{STRASSE_HAUSNUMMER}},
{{PLZ_ORT}} (nachfolgend „Auftragsverarbeiter").

**Geltung:** Dieser AVV wird Vertragsbestandteil, sobald der Verantwortliche
einen Bezahlplan von Pflichtwächter beginnt. Er ist hier dauerhaft abrufbar
und kann als PDF gespeichert werden.

## 1. Gegenstand und Dauer

Der Auftragsverarbeiter prüft und überwacht im Auftrag des Verantwortlichen
öffentlich erreichbare Websites und erstellt Berichte. Die Dauer entspricht
der Laufzeit des Hauptvertrags (AGB).

## 2. Art und Zweck der Verarbeitung, Datenkategorien, Betroffene

- **Zweck:** technische Prüfung von Websites auf Muster rechtlicher
  Pflichtangaben, Berichtserstellung, Verlaufsüberwachung.
- **Datenkategorien:** Inhalte öffentlich erreichbarer Webseiten
  (können personenbezogene Daten wie Namen, Anschriften, E-Mail-Adressen aus
  Impressen enthalten), Kontaktdaten der Nutzerinnen und Nutzer des
  Verantwortlichen (bei Agentur-Plänen: Endkunden-Domains).
- **Betroffene:** Websitebetreiber und deren im Web veröffentlichte
  Kontaktpersonen; Ansprechpartner des Verantwortlichen.

## 3. Pflichten des Auftragsverarbeiters

1. Verarbeitung nur auf dokumentierte Weisung des Verantwortlichen; die
   Nutzung der Software gilt als Weisung.
2. Vertraulichkeitsverpflichtung aller mit der Verarbeitung befassten Personen.
3. Technische und organisatorische Maßnahmen nach Art. 32 DSGVO (Anlage 1).
4. Unterstützung des Verantwortlichen bei Betroffenenrechten und bei den
   Pflichten aus Art. 32–36 DSGVO.
5. Löschung oder Rückgabe aller personenbezogenen Daten nach Vertragsende;
   Roh-Seitenquelltexte werden unabhängig davon spätestens nach 30 Tagen
   gelöscht.
6. Bereitstellung aller erforderlichen Informationen zum Nachweis der
   Pflichten aus Art. 28 DSGVO; Ermöglichung von Überprüfungen.
7. Information des Verantwortlichen bei Verletzungen des Schutzes
   personenbezogener Daten ohne unangemessene Verzögerung.

## 4. Unterauftragsverarbeiter

Der Verantwortliche erteilt die allgemeine Genehmigung zum Einsatz der in
Anlage 2 genannten Unterauftragsverarbeiter. Der Auftragsverarbeiter
informiert über beabsichtigte Änderungen; der Verantwortliche kann aus
wichtigem Grund widersprechen.

## 5. Verarbeitungsort

Die Verarbeitung findet in Mitgliedstaaten der EU bzw. des EWR statt.
Eine Übermittlung in Drittländer erfolgt nur, soweit in Anlage 2 ausgewiesen
und nach Kap. V DSGVO abgesichert.

## Anlage 1 — Technische und organisatorische Maßnahmen (Auszug)

- Transportverschlüsselung (TLS) für alle Verbindungen
- Zugriff auf Produktionssysteme nur für Berechtigte mit Schlüsselverfahren
- Speicherbegrenzung: Roh-HTML max. 30 Tage, Belegauszüge max. 500 Zeichen
- Pseudonymisierung von IP-Adressen (Hashing) für Missbrauchsschutz
- Regelmäßige Einspielung von Sicherheitsupdates, tägliche Backups

## Anlage 2 — Unterauftragsverarbeiter

| Dienstleister | Zweck | Sitz / Verarbeitungsort |
|---|---|---|
| {{HOSTER_NAME_ANSCHRIFT}} | Hosting, Datenbank | EU |
| {{STRIPE_ENTITY}} | Zahlungsabwicklung | EU (ggf. Drittlandbezug, siehe Stripe-AVV) |
| {{EMAIL_PROVIDER_NAME}} | Transaktionale E-Mails | {{Sitz ergänzen}} |

Stand: {{DATUM_STAND}}
