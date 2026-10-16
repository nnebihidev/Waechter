# Rechtliche Absicherung — Checkliste für den Anbieter

_Keine Rechtsberatung. Diese Liste beschreibt, was die App technisch und textlich bereits tut,
und was nur der Anbieter (mit Anwalt) erledigen kann. Vollständige Immunität gibt es nicht;
das Ziel ist, Risiko und Angriffsfläche so klein wie möglich zu machen._

## Was die App bereits tut

| Maßnahme | Wo |
| --- | --- |
| Erststart-Zustimmung: vier Kernhinweise (112, KI kann irren, allgemeine Informationen, alles lokal), explizites „Verstanden, weiter", Zeitpunkt und Versionsnummer lokal gespeichert; bei neuer `TERMS_VERSION` erneut abgefragt | `src/app/welcome.tsx`, `src/state/settings.ts` |
| Nutzungsbedingungen (DE/EN) mit Haftungsklausel nach deutschem AGB-Recht (unbeschränkt für Vorsatz, grobe Fahrlässigkeit, Leben/Körper/Gesundheit, ProdHaftG; sonst Kardinalpflichten, vorhersehbarer Schaden), KI-Transparenz (Art. 50 KI-VO), Sensor-Vorbehalt, Store als Vertragspartner, ODR-Hinweis | `src/legal/texts.ts`, in-App unter Mehr → Rechtliches |
| Datenschutzhinweise (DE/EN) — keine Server, keine Verarbeitung außerhalb des Geräts | `src/legal/texts.ts`, `docs/PRIVACY.md` |
| Impressum (§ 5 DDG, § 18 MStV) als Platzhalter | `src/legal/texts.ts` |
| Lizenzliste aller gebündelten Komponenten inkl. KI-Modell (Apache-2.0) und Schriften (OFL) | `src/legal/licenses.json`, `npm run licenses` |
| Haftungshinweis unter jeder KI-Antwort und jeder Anleitung; Quellenhinweis (ERC-orientiert, fachlich zu prüfen) | Screens |
| Notruf-Hinweis bei allen lebensbedrohlichen Themen und bei erkannten Notfall-Eingaben | Guides, Chat |
| Kein Medizinprodukt-Claim, keine Diagnose, keine Garantien — durch Test abgesichert | `tests/legal.test.ts` |
| Keine Datenverarbeitung außerhalb des Geräts — durch Test und Android-Manifest abgesichert | `tests/offline.test.ts`, `app.config.ts` |

## Was nur Sie erledigen können — vor der Veröffentlichung

1. **Rechtsform mit Haftungsbeschränkung** (UG/GmbH statt Einzelunternehmen). Das ist die wirksamste
   Einzelmaßnahme: Ansprüche richten sich gegen die Gesellschaft, nicht gegen Ihr Privatvermögen.
2. **Versicherung**: Betriebshaftpflicht + IT-/Vermögensschadenhaftpflicht, die Software-Produkte
   und „Informationsleistungen" ausdrücklich abdeckt. Der Versicherer will die Nutzungsbedingungen sehen.
3. **Anwalt (IT-/Medienrecht) prüfen lassen**: Nutzungsbedingungen, Datenschutz, Impressum,
   Abgrenzung zum Medizinprodukt (MDR), KI-Verordnung, Produkthaftungsrichtlinie 2024/2853
   (Software ist Produkt; nationale Umsetzung bis Ende 2026). Budget: ca. 600–1.500 €.
4. **Platzhalter füllen** (`{{ }}` in `src/legal/texts.ts`, `docs/PRIVACY.md`): Name, Anschrift,
   E-Mail, Vertretung, Register, USt-IdNr. Der Test `legal.test.ts` schlägt nicht fehl, aber
   die Platzhalter werden in der App orange angezeigt, bis sie ersetzt sind.
5. **Datenschutzerklärung öffentlich hosten** (URL in App Store Connect und Play Console).
6. **Fachliche Freigabe der Anleitungen** durch Erste-Hilfe-Ausbilder (DRK/ASB/Johanniter/Malteser
   oder ERC-Instruktor), Freigabe schriftlich dokumentieren und bei Inhaltsänderungen wiederholen.
7. **Markenrecht**: „Kompass" ist ein beschreibender Begriff und schwer schützbar; prüfen Sie vor
   dem Launch ältere Marken in Klasse 9/42 (DPMA/EUIPO-Recherche) und erwägen Sie einen
   unterscheidungskräftigen Zusatz.
8. **Store-Einstufung**: Kategorie Utilities (nicht „Medical"), Altersfreigabe mit Hinweis auf
   medizinische Informationen, Datenschutz-Label „Keine Daten erhoben".
9. **Keine Werbeaussagen** wie „rettet Leben", „zuverlässig", „ersetzt den Rettungsdienst" — auch
   nicht im Store-Text, auf der Website oder in Social Media. Erlaubt: „funktioniert ohne Netz",
   „allgemeine Erste-Hilfe-Informationen", „KI auf dem Gerät".
10. **Update-Pflicht (§ 327f BGB)**: Für digitale Produkte schulden Sie Aktualisierungen für die
    Nutzungsdauer. Planen Sie Wartungs-Releases ein (mindestens Sicherheits-/Kompatibilitätsupdates).
11. **Änderungen der Bedingungen** immer über `TERMS_VERSION` erhöhen, damit Nutzer erneut zustimmen.

## Was Sie nicht tun sollten

- Keine „abmahnfest/garantiert/100 %"-Formulierungen (der Test verbietet sie).
- Keine individuelle medizinische Beratung in Anleitungen oder System-Prompt.
- Kein Hinzufügen von Analyse-, Werbe- oder Crash-SDKs (der Offline-Test verbietet sie) — jede
  Datenverarbeitung außerhalb des Geräts würde die gesamte Datenschutzargumentation kippen.
