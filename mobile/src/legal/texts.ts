import type { Lang } from '../i18n/lang';

/** Bump when the terms change materially; users are asked to accept again. */
export const TERMS_VERSION = 2;

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export interface LegalTexts {
  /** First-launch screen. */
  welcomeTitle: string;
  welcomeIntro: string;
  welcomePoints: Array<{ title: string; body: string }>;
  welcomeAccept: string;
  welcomeAcceptHint: string;
  welcomeRead: string;
  /** Formal declaration shown on the consent screen and under Legal. */
  consentTitle: string;
  consentParagraphs: string[];
  consentChecks: Array<{ id: string; label: string }>;
  consentScrollHint: string;
  consentWithdraw: string;
  consentWithdrawHint: string;
  /** Short line shown under every AI answer / guide. */
  aiNotice: string;
  guideNotice: string;
  sourcesNotice: string;
  /** Full documents. */
  termsTitle: string;
  terms: LegalSection[];
  privacyTitle: string;
  privacy: LegalSection[];
  imprintTitle: string;
  imprint: LegalSection[];
  licensesTitle: string;
  licensesIntro: string;
  legalMenu: string;
  acceptedOn: string;
}

// Placeholders in {{ }} must be filled by the publisher before release (see docs/LEGAL-CHECKLIST.md).
const PUBLISHER = '{{Name / Firma}}';
const ADDRESS = '{{Straße Nr., PLZ Ort, Land}}';
const EMAIL = '{{E-Mail}}';

const de: LegalTexts = {
  welcomeTitle: 'Bevor es losgeht',
  welcomeIntro: 'Kompass ist ein Werkzeug für unterwegs. Damit es Ihnen hilft und nicht schadet, vier Dinge, die Sie wissen müssen:',
  welcomePoints: [
    { title: 'Im Notfall: 112.', body: 'Kompass ersetzt keinen Notruf, keinen Arzt und keine Erste-Hilfe-Ausbildung. Bei Lebensgefahr zuerst den Rettungsdienst rufen.' },
    { title: 'Die KI kann sich irren.', body: 'Sie sprechen mit einem KI-Modell, nicht mit einem Menschen. Antworten können falsch oder unvollständig sein. Prüfen Sie sie mit gesundem Menschenverstand und den Anleitungen.' },
    { title: 'Allgemeine Informationen.', body: 'Die Anleitungen geben allgemeine Hinweise, wie sie in Erste-Hilfe-Kursen vermittelt werden. Sie sind keine medizinische, rechtliche oder sonstige Fachberatung für Ihren Einzelfall.' },
    { title: 'Alles bleibt auf dem Gerät.', body: 'Kompass hat keine Internetverbindung, keine Konten und keine Auswertung. Standort und Eingaben verlassen Ihr Telefon nicht.' },
  ],
  welcomeAccept: 'Verstanden, weiter',
  welcomeAcceptHint: 'Mit „Weiter" akzeptieren Sie die Nutzungsbedingungen und nehmen die Datenschutzhinweise zur Kenntnis.',
  welcomeRead: 'Nutzungsbedingungen lesen',
  consentTitle: 'Einwilligungs\u00ADerklärung',
  consentParagraphs: [
    'Ich nutze Kompass als Informations- und Orientierungswerkzeug auf eigene Verantwortung.',
    'Mir ist bekannt, dass Kompass kein Medizinprodukt ist, keine Diagnosen stellt und keinen Notruf, keinen Arzt, keinen Rettungsdienst und keine Erste-Hilfe-Ausbildung ersetzt. Bei Lebensgefahr wähle ich zuerst den Notruf (112).',
    'Mir ist bekannt, dass Assistent und Übersetzer von einem KI-Modell erzeugt werden, das sich irren kann. Ich prüfe KI-Ausgaben kritisch, bevor ich danach handle, und verwende Übersetzungen nicht für rechtlich oder medizinisch verbindliche Zwecke.',
    'Mir ist bekannt, dass Kompass, GPS-Koordinaten und Höhenangaben aus Gerätesensoren stammen und ungenau sein können, und dass das Lichtsignal kein zugelassenes Notsignalgerät ist.',
    'Ich habe die Nutzungsbedingungen gelesen und akzeptiere sie. Die Datenschutzhinweise habe ich zur Kenntnis genommen. Diese Erklärung wird mit Datum und Version nur auf meinem Gerät gespeichert; ich kann sie jederzeit unter „Mehr → Rechtliches" widerrufen, womit die Nutzung der App bis zu einer erneuten Zustimmung gesperrt ist.',
  ],
  consentChecks: [
    { id: 'terms', label: 'Ich habe die Nutzungsbedingungen gelesen und akzeptiere sie.' },
    { id: 'emergency', label: 'Ich habe verstanden: keine medizinische Beratung, bei Lebensgefahr zuerst 112.' },
    { id: 'ai', label: 'Ich habe verstanden: die KI kann sich irren, ich prüfe Antworten selbst.' },
  ],
  consentScrollHint: 'Bitte lesen Sie die Erklärung bis zum Ende.',
  consentWithdraw: 'Einwilligung widerrufen',
  consentWithdrawHint: 'Die App ist danach gesperrt, bis Sie erneut zustimmen.',
  aiNotice: 'KI-Antwort — kann Fehler enthalten. Keine medizinische Beratung. Im Notfall 112.',
  guideNotice: 'Allgemeine Erste-Hilfe-Informationen, keine medizinische Beratung. Ersetzen keinen Erste-Hilfe-Kurs. Im Notfall 112.',
  sourcesNotice: 'Orientiert an den Empfehlungen des European Resuscitation Council (ERC) und gängiger Erste-Hilfe-Lehrgänge. Stand: 2026. Fachlich zu prüfen durch qualifizierte Ausbilder.',
  termsTitle: 'Nutzungsbedingungen',
  terms: [
    { heading: '1. Was Kompass ist', paragraphs: ['Kompass ist eine Software für Mobilgeräte, die ohne Internetverbindung ein KI-Sprachmodell, Erste-Hilfe- und Outdoor-Anleitungen, einen Übersetzer, einen Kompass mit Koordinatenanzeige und ein Lichtsignal bereitstellt. Anbieter ist ' + PUBLISHER + ' (siehe Impressum).'] },
    { heading: '2. Kein Ersatz für Notruf, Arzt oder Ausbildung', paragraphs: ['Kompass ist kein Medizinprodukt und stellt keine Diagnosen. Alle Inhalte, einschließlich der KI-Antworten, sind allgemeine Informationen. Sie ersetzen weder einen Notruf noch ärztliche Behandlung, Rettungsdienst, Bergrettung, Polizei oder eine Erste-Hilfe-Ausbildung.', 'Bei einer lebensbedrohlichen Situation wählen Sie den Notruf (in Europa: 112). Die App zeigt diesen Hinweis an prominenter Stelle; die Verantwortung für die Entscheidung, Hilfe zu rufen, liegt bei Ihnen.'] },
    { heading: '3. KI-Inhalte', paragraphs: ['Der Assistent und der Übersetzer werden von einem KI-Modell erzeugt, das lokal auf Ihrem Gerät läuft. KI-Ausgaben können falsch, unvollständig, veraltet oder für Ihre Situation ungeeignet sein. Sie sind verpflichtet, KI-Ausgaben kritisch zu prüfen, bevor Sie danach handeln. Übersetzungen sind nicht beglaubigt und für rechtlich oder medizinisch verbindliche Zwecke ungeeignet.', 'Sie interagieren mit einem KI-System und nicht mit einem Menschen (Transparenzhinweis nach Art. 50 KI-Verordnung).'] },
    { heading: '4. Navigation und Sensoren', paragraphs: ['Kompass, GPS-Koordinaten und Höhenangaben stammen aus den Sensoren Ihres Geräts und können ungenau oder gestört sein (Magnetfelder, Abschirmung, fehlender Satellitenempfang). Verlassen Sie sich in unbekanntem Gelände nicht allein auf die App; führen Sie Karte und Kompass mit und informieren Sie jemanden über Ihre Route.'] },
    { heading: '5. Ihre Pflichten', paragraphs: ['Sie nutzen Kompass auf eigene Verantwortung, beachten geltende Gesetze (z. B. Feuerverbote, Naturschutz) und behandeln Verletzte nur im Rahmen Ihrer Fähigkeiten. Das Lichtsignal ist kein zugelassenes Notsignalgerät; führen Sie in abgelegenem Gelände geeignete Ausrüstung mit.'] },
    { heading: '6. Haftung', paragraphs: ['Wir haften unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie für Schäden aus der Verletzung von Leben, Körper oder Gesundheit und nach dem Produkthaftungsgesetz.', 'Für leichte Fahrlässigkeit haften wir nur bei Verletzung wesentlicher Vertragspflichten (Pflichten, deren Erfüllung die ordnungsgemäße Nutzung erst ermöglicht und auf deren Einhaltung Sie vertrauen dürfen), begrenzt auf den vertragstypischen, vorhersehbaren Schaden. Im Übrigen ist die Haftung ausgeschlossen.', 'Wir übernehmen keine Gewähr dafür, dass Inhalte vollständig, aktuell oder für einen bestimmten Zweck geeignet sind, oder dass die App in jeder Situation verfügbar ist (z. B. leerer Akku, defektes Gerät, unzureichender Arbeitsspeicher).'] },
    { heading: '7. Lizenz und Kauf', paragraphs: ['Mit dem Kauf im App Store oder bei Google Play erhalten Sie ein einfaches, nicht übertragbares Recht, die App auf Ihren Geräten privat zu nutzen. Der Kaufvertrag kommt mit dem jeweiligen Store-Betreiber zustande; Widerruf, Erstattung und Rechnung richten sich nach dessen Bedingungen.', 'Das enthaltene KI-Modell und weitere Komponenten stehen unter Open-Source-Lizenzen (siehe Lizenzen). Sie dürfen die App nicht dekompilieren, soweit dies nicht gesetzlich erlaubt ist.'] },
    { heading: '8. Änderungen, anwendbares Recht', paragraphs: ['Wir können diese Bedingungen bei Updates anpassen; wesentliche Änderungen werden beim nächsten Start angezeigt und müssen erneut bestätigt werden. Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts; zwingende Verbraucherschutzvorschriften Ihres Wohnsitzstaates bleiben unberührt.', 'Die EU-Kommission stellt eine Plattform zur Online-Streitbeilegung bereit (ec.europa.eu/consumers/odr). Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.'] },
  ],
  privacyTitle: 'Datenschutz',
  privacy: [
    { heading: 'Verantwortlicher', paragraphs: [`${PUBLISHER}, ${ADDRESS}, ${EMAIL}`] },
    { heading: 'Kurzfassung', paragraphs: ['Kompass verarbeitet keine personenbezogenen Daten auf Servern, weil es keine Server gibt. Die App stellt keine Internetverbindung her; die Android-Version besitzt nicht einmal die Berechtigung dazu.'] },
    { heading: 'Was die App auf Ihrem Gerät verarbeitet', paragraphs: ['Eingaben an Assistent und Übersetzer werden von einem lokal laufenden KI-Modell verarbeitet und nicht gespeichert; Unterhaltungen gehen beim Schließen der App verloren.', 'Standort und Himmelsrichtung werden nur angezeigt, wenn Sie den Bereich „Navi" öffnen und die Berechtigung erteilen; sie werden weder gespeichert noch übertragen.', 'Einstellungen (Sprache, GPU-Option, Zustimmung zu den Nutzungsbedingungen) liegen als kleine Datei im privaten App-Speicher. Importierte Modelldateien werden dorthin kopiert und können jederzeit gelöscht werden.'] },
    { heading: 'Keine Analyse, keine Werbung, keine Weitergabe', paragraphs: ['Keine Analysedienste, keine Werbung, keine Absturzberichte, keine Konten, kein Tracking, keine Weitergabe an Dritte. Der Kauf wird vollständig vom Store-Betreiber abgewickelt; wir erhalten dabei keine personenbezogenen Daten.'] },
    { heading: 'Ihre Rechte', paragraphs: ['Da wir keine Daten über Sie speichern, gibt es bei uns nichts zu berichtigen oder zu löschen. Mit der Deinstallation sind alle lokalen Daten entfernt. Fragen: ' + EMAIL + '. Beschwerden können Sie an die zuständige Datenschutzaufsichtsbehörde richten.'] },
  ],
  imprintTitle: 'Impressum',
  imprint: [
    { heading: 'Anbieter (§ 5 DDG)', paragraphs: [PUBLISHER, ADDRESS, 'E-Mail: ' + EMAIL, '{{Vertretungsberechtigte Person / Rechtsform / Registergericht und -nummer, falls vorhanden}}', '{{USt-IdNr., falls vorhanden}}'] },
    { heading: 'Verantwortlich für Inhalte', paragraphs: ['{{Name, Anschrift}} (§ 18 Abs. 2 MStV)'] },
  ],
  licensesTitle: 'Lizenzen',
  licensesIntro: 'Kompass enthält Open-Source-Software und ein offenes KI-Modell. Die jeweiligen Lizenztexte liegen den Komponenten bei.',
  legalMenu: 'Rechtliches',
  acceptedOn: 'Zugestimmt am',
};

const en: LegalTexts = {
  welcomeTitle: 'Before you start',
  welcomeIntro: 'Kompass is a tool for the field. So that it helps and never harms, four things you need to know:',
  welcomePoints: [
    { title: 'In an emergency: 112.', body: 'Kompass does not replace an emergency call, a doctor or first-aid training. If life is at risk, call emergency services first.' },
    { title: 'The AI can be wrong.', body: 'You are talking to an AI model, not a person. Answers can be wrong or incomplete. Check them with common sense and the guides.' },
    { title: 'General information.', body: 'The guides give general advice as taught in first-aid courses. They are not medical, legal or other professional advice for your individual case.' },
    { title: 'Everything stays on the device.', body: 'Kompass has no internet connection, no accounts and no analytics. Location and input never leave your phone.' },
  ],
  welcomeAccept: 'Understood, continue',
  welcomeAcceptHint: 'By continuing you accept the Terms of Use and acknowledge the privacy notice.',
  welcomeRead: 'Read the Terms of Use',
  consentTitle: 'Declaration of consent',
  consentParagraphs: [
    'I use Kompass as an information and orientation tool at my own responsibility.',
    'I understand that Kompass is not a medical device, makes no diagnoses and does not replace an emergency call, a doctor, rescue services or first-aid training. If life is at risk I call emergency services (112) first.',
    'I understand that the assistant and translator are generated by an AI model that can be wrong. I check AI output critically before acting on it and do not use translations for legally or medically binding purposes.',
    'I understand that compass, GPS coordinates and altitude come from device sensors and may be inaccurate, and that the light signal is not an approved distress device.',
    'I have read and accept the Terms of Use and acknowledge the privacy notice. This declaration is stored with date and version only on my device; I can withdraw it at any time under "More → Legal", which locks the app until I consent again.',
  ],
  consentChecks: [
    { id: 'terms', label: 'I have read and accept the Terms of Use.' },
    { id: 'emergency', label: 'I understand: not medical advice; if life is at risk, call 112 first.' },
    { id: 'ai', label: 'I understand: the AI can be wrong; I check answers myself.' },
  ],
  consentScrollHint: 'Please read the declaration to the end.',
  consentWithdraw: 'Withdraw consent',
  consentWithdrawHint: 'The app is locked afterwards until you consent again.',
  aiNotice: 'AI answer — may contain errors. Not medical advice. In an emergency call 112.',
  guideNotice: 'General first-aid information, not medical advice. No substitute for a first-aid course. In an emergency call 112.',
  sourcesNotice: 'Aligned with European Resuscitation Council (ERC) recommendations and common first-aid curricula. As of 2026. To be reviewed by qualified instructors.',
  termsTitle: 'Terms of Use',
  terms: [
    { heading: '1. What Kompass is', paragraphs: ['Kompass is mobile software that provides, without an internet connection, an AI language model, first-aid and outdoor guides, a translator, a compass with coordinates and a light signal. The provider is ' + PUBLISHER + ' (see Imprint).'] },
    { heading: '2. No substitute for emergency services, doctors or training', paragraphs: ['Kompass is not a medical device and makes no diagnoses. All content, including AI answers, is general information. It does not replace an emergency call, medical treatment, rescue services, police or first-aid training.', 'In a life-threatening situation call emergency services (Europe: 112). The app shows this notice prominently; the decision to call for help is yours.'] },
    { heading: '3. AI content', paragraphs: ['The assistant and translator are generated by an AI model running locally on your device. AI output can be wrong, incomplete, outdated or unsuitable for your situation. You must check AI output critically before acting on it. Translations are not certified and unsuitable for legally or medically binding purposes.', 'You are interacting with an AI system, not a human (transparency notice under Art. 50 EU AI Act).'] },
    { heading: '4. Navigation and sensors', paragraphs: ['Compass, GPS coordinates and altitude come from your device\'s sensors and may be inaccurate or disturbed (magnetic fields, shielding, no satellite reception). Do not rely on the app alone in unfamiliar terrain; carry a map and compass and tell someone your route.'] },
    { heading: '5. Your obligations', paragraphs: ['You use Kompass at your own responsibility, observe applicable law (e.g. fire bans, nature protection) and treat injured people only within your abilities. The light signal is not an approved distress device; carry suitable equipment in remote terrain.'] },
    { heading: '6. Liability', paragraphs: ['We are liable without limitation for intent and gross negligence, for injury to life, body or health, and under product liability law.', 'For slight negligence we are liable only for breach of essential contractual duties (duties whose fulfilment makes proper use possible in the first place and on which you may rely), limited to the typical, foreseeable damage. Otherwise liability is excluded.', 'We do not warrant that content is complete, current or fit for a particular purpose, or that the app is available in every situation (e.g. empty battery, broken device, insufficient memory).'] },
    { heading: '7. Licence and purchase', paragraphs: ['With your purchase on the App Store or Google Play you receive a simple, non-transferable right to use the app privately on your devices. The purchase contract is concluded with the store operator; withdrawal, refunds and invoices follow its terms.', 'The included AI model and other components are under open-source licences (see Licences). You may not decompile the app except where permitted by law.'] },
    { heading: '8. Changes, governing law', paragraphs: ['We may adjust these terms with updates; material changes are shown at the next start and must be accepted again. German law applies, excluding the UN Convention on Contracts for the International Sale of Goods; mandatory consumer-protection rules of your country of residence remain unaffected.', 'The EU Commission provides an online dispute-resolution platform (ec.europa.eu/consumers/odr). We are neither obliged nor willing to take part in dispute-resolution proceedings before a consumer arbitration board.'] },
  ],
  privacyTitle: 'Privacy',
  privacy: [
    { heading: 'Controller', paragraphs: [`${PUBLISHER}, ${ADDRESS}, ${EMAIL}`] },
    { heading: 'In short', paragraphs: ['Kompass processes no personal data on servers, because there are none. The app never opens a network connection; the Android version does not even hold the permission.'] },
    { heading: 'What the app processes on your device', paragraphs: ['Assistant and translator input is processed by a locally running AI model and not stored; conversations are discarded when the app closes.', 'Location and heading are shown only while "Navigate" is open and permission is granted; they are neither stored nor transmitted.', 'Settings (language, GPU option, acceptance of the terms) are kept as a small file in private app storage. Imported model files are copied there and can be deleted at any time.'] },
    { heading: 'No analytics, no ads, no sharing', paragraphs: ['No analytics, no advertising, no crash reporting, no accounts, no tracking, no sharing with third parties. The purchase is handled entirely by the store operator; we receive no personal data.'] },
    { heading: 'Your rights', paragraphs: ['As we hold no data about you, there is nothing for us to correct or delete. Uninstalling removes all local data. Questions: ' + EMAIL + '. You may lodge a complaint with your data-protection authority.'] },
  ],
  imprintTitle: 'Imprint',
  imprint: [
    { heading: 'Provider', paragraphs: [PUBLISHER, ADDRESS, 'E-mail: ' + EMAIL, '{{Authorised representative / legal form / register court and number, if any}}', '{{VAT ID, if any}}'] },
    { heading: 'Responsible for content', paragraphs: ['{{Name, address}}'] },
  ],
  licensesTitle: 'Licences',
  licensesIntro: 'Kompass contains open-source software and an open AI model. The licence texts ship with the components.',
  legalMenu: 'Legal',
  acceptedOn: 'Accepted on',
};

export const LEGAL: Record<Lang, LegalTexts> = { de, en };
