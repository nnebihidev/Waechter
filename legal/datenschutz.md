# Datenschutzerklärung

> **Entwurf** — vor Launch von einem IT-Recht-Anwalt prüfen lassen und alle Platzhalter ersetzen (siehe LEGAL.md).

## 1. Verantwortlicher

Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:

{{ANBIETER_NAME}} {{ANBIETER_RECHTSFORM_ZUSATZ}}, {{STRASSE_HAUSNUMMER}},
{{PLZ_ORT}}, E-Mail: {{EMAIL}}.

Ein Datenschutzbeauftragter ist nicht benannt, da die gesetzlichen
Voraussetzungen für eine Benennungspflicht derzeit nicht vorliegen.

## 2. Verarbeitungen im Überblick

### 2.1 Server-Logfiles und Hosting

Beim Aufruf dieser Website verarbeitet unser Hosting-Anbieter
({{HOSTER_NAME_ANSCHRIFT}}, Serverstandort in der EU) automatisch technische
Zugriffsdaten (IP-Adresse, Zeitpunkt, aufgerufene Seite, User-Agent).
Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem
sicheren, stabilen Betrieb). Speicherdauer: Logs werden nach 14 Tagen gelöscht.

### 2.2 Website-Prüfung (Scan)

Wenn Sie eine Domain zur Prüfung eingeben, ruft unser Crawler
(„PflichtwaechterBot") öffentlich erreichbare Seiten dieser Domain ab und
wertet sie technisch aus. Dabei werden gespeichert: die geprüfte URL,
Prüfergebnisse mit kurzen Textauszügen (maximal 500 Zeichen je Beleg) sowie
vorübergehend der abgerufene Seitenquelltext. Rechtsgrundlage: Art. 6 Abs. 1
lit. b DSGVO (Durchführung der angefragten Prüfung). Speicherdauer: Roher
Seitenquelltext wird nach spätestens 30 Tagen gelöscht; Prüfergebnisse bleiben
für Ihren Bericht und – bei Überwachungsplänen – für Verlaufvergleiche
gespeichert. Zur Missbrauchsvermeidung speichern wir Ihre IP-Adresse in
gekürzter/gehashter Form für 24 Stunden.

### 2.3 Konto und Anmeldung (Magic Link)

Für ein Konto verarbeiten wir Ihre E-Mail-Adresse und Anmeldezeitpunkte.
Die Anmeldung erfolgt über einen einmaligen Link per E-Mail; das zugehörige
Token wird nur als Hash gespeichert. Rechtsgrundlage: Art. 6 Abs. 1 lit. b
DSGVO. Speicherdauer: Kontodaten löschen wir drei Jahre nach der letzten
Rechnung, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
Auf Wunsch löschen wir Ihr Konto samt aller Scans innerhalb von 72 Stunden.

### 2.4 Bezahlung

Die Zahlungsabwicklung erfolgt über {{STRIPE_ENTITY}} („Stripe"). Stripe
verarbeitet Ihre Zahlungsdaten als eigener Verantwortlicher bzw. als unser
Auftragsverarbeiter; wir selbst speichern keine vollständigen Zahlungsdaten,
sondern nur Referenzen (Kunden- und Transaktions-IDs) und Rechnungsdaten.
Rechtsgrundlagen: Art. 6 Abs. 1 lit. b DSGVO sowie Art. 6 Abs. 1 lit. c DSGVO
(steuerliche Aufbewahrungspflichten, 10 Jahre).

### 2.5 E-Mail-Versand

Transaktionale E-Mails (Anmeldelinks, Prüfberichte, Rechnungen,
Verschlechterungs-Hinweise) versenden wir über {{EMAIL_PROVIDER_NAME}}.
Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO. Es findet kein Newsletter-Versand
ohne gesonderte Einwilligung statt.

### 2.6 Automatische Zusammenfassungen

{{LLM_PROVIDER_ABSCHNITT}}

*Hinweis für die Befüllung: Solange `LLM_PROVIDER=none` gesetzt ist, werden
Zusammenfassungen ausschließlich regelbasiert auf unseren eigenen Servern
erzeugt — dieser Abschnitt ist dann ersatzlos zu streichen. Wird ein
LLM-Anbieter aktiviert, sind hier Anbieter, Sitz, Zweck (sprachliche
Zusammenfassung bereits erhobener Prüfbelege), Rechtsgrundlage und — bei
Drittlandbezug — der Übermittlungsmechanismus (z. B. EU-Standardvertragsklauseln
oder Angemessenheitsbeschluss) ehrlich zu benennen.*

## 3. Cookies

Diese Website verwendet ausschließlich technisch notwendige Cookies
(z. B. für die Anmeldung). Einwilligungspflichtige Analyse- oder
Marketing-Cookies setzen wir nicht ein. Rechtsgrundlage: § 25 Abs. 2 TDDDG,
Art. 6 Abs. 1 lit. b DSGVO.

## 4. Empfänger

Empfänger personenbezogener Daten sind die unter Ziffer 2 genannten
Dienstleister (Hosting, Zahlungsabwicklung, E-Mail-Versand{{ggf. LLM}}). Mit
Auftragsverarbeitern bestehen Verträge nach Art. 28 DSGVO. Eine Übermittlung
in Drittländer findet nur statt, soweit unter Ziffer 2.6 beschrieben.

## 5. Ihre Rechte

Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16),
Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18),
Datenübertragbarkeit (Art. 20) und Widerspruch gegen Verarbeitungen auf
Grundlage von Art. 6 Abs. 1 lit. f DSGVO (Art. 21). Eine erteilte Einwilligung
können Sie jederzeit mit Wirkung für die Zukunft widerrufen. Ihnen steht ein
Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde zu.

## 6. Pflicht zur Bereitstellung

Die Angabe einer E-Mail-Adresse ist für die Kontoerstellung erforderlich;
ohne sie können Bericht und Überwachung nicht bereitgestellt werden.

Stand: {{DATUM_STAND}}
