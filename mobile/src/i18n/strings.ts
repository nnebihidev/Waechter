import type { Lang } from './lang';

const en = {
  tabAssistant: 'Assistant',
  tabTranslate: 'Translate',
  tabGuides: 'Guides',
  tabTools: 'Tools',
  tabSettings: 'Settings',

  offlineBadge: 'Offline · nothing leaves this phone',

  // Model status
  modelLoading: 'Starting the on-device AI…',
  modelUnpacking: 'Preparing the AI model (one time only)…',
  modelMissingTitle: 'AI model not installed',
  modelMissingBody:
    'The guides, compass and SOS tools work without it. To use the assistant and translator, import a GGUF model file from this device in Settings.',
  modelError: 'The AI could not be started',
  modelLowMemory: 'This device has little memory. The AI may be slow or be closed by the system.',
  openSettings: 'Open settings',
  retry: 'Try again',

  // Assistant
  assistantPlaceholder: 'Describe your situation or ask anything…',
  assistantEmpty: 'Ask about first aid, getting lost, the weather, cooking, writing a message — anything. Everything runs on this phone.',
  assistantSuggestions: [
    'I twisted my ankle on a hike, what now?',
    'How do I make stream water safe to drink?',
    'Write a short sick note for my employer',
  ],
  send: 'Send',
  stop: 'Stop',
  newChat: 'New chat',
  basedOn: 'Based on:',
  emergencyBanner: 'Possible emergency: call 112 now (911 in North America). Then follow the steps.',
  emergencyGuides: 'Open first-aid guides',
  aiDisclaimer: 'AI answers can be wrong. In emergencies, follow the guides and call emergency services.',

  // Translate
  translateFrom: 'From',
  translateTo: 'To',
  autoDetect: 'Detect',
  translatePlaceholder: 'Text to translate…',
  translate: 'Translate',
  swap: 'Swap languages',
  copy: 'Copy',
  copied: 'Copied',
  clear: 'Clear',

  // Guides
  guidesSearch: 'Search guides (e.g. burn, tick, lost)',
  guidesEmergencyTitle: 'Emergency',
  guidesEmergencyBody: 'Call 112 — works across Europe and on many phones worldwide.',
  catEmergency: 'Emergency',
  catFirstaid: 'First aid',
  catOutdoor: 'Outdoors & survival',
  catEveryday: 'Everyday',
  noResults: 'No matching guide.',
  guideDisclaimer:
    'General first-aid information. It does not replace a first-aid course or medical advice. In an emergency, call 112.',
  askAssistant: 'Ask the assistant about this',
  callBanner: 'Life-threatening? Call 112 first.',

  // Tools
  compass: 'Compass',
  compassCalibrate: 'Low accuracy — move the phone in a figure-eight to calibrate.',
  compassMagnetic: 'magnetic',
  compassTrue: 'true north',
  location: 'My position',
  locationHint: 'From GPS satellites — works without mobile network. Read these numbers to the emergency dispatcher.',
  locationWaiting: 'Waiting for GPS fix… go outside with a clear view of the sky.',
  locationDenied: 'Location permission is off. Enable it in the system settings to see coordinates and the compass.',
  locationAllow: 'Allow location',
  accuracy: 'Accuracy',
  altitude: 'Altitude',
  sos: 'SOS light signal',
  sosBody: 'Flashes S·O·S in Morse code on the full screen at maximum contrast. Point the screen towards rescuers.',
  sosStart: 'Start SOS',
  sosStop: 'Tap anywhere to stop',
  alpine: 'Alpine distress signal',
  alpineBody: '6 flashes per minute, then one minute pause.',
  alpineStart: 'Start alpine signal',

  // Settings
  language: 'Language',
  languageAuto: 'Device language',
  aiModel: 'AI model',
  modelReady: 'Ready',
  modelNotLoaded: 'Not loaded',
  modelBundled: 'Included with the app',
  modelImported: 'Imported',
  importModel: 'Import model file (.gguf)',
  importing: 'Copying model…',
  importInvalid: 'This is not a GGUF model file.',
  removeModel: 'Remove imported model',
  gpu: 'GPU acceleration',
  gpuHint: 'Faster on most iPhones and recent Samsung devices. Turn off if the app crashes while answering.',
  privacyTitle: 'Privacy',
  privacyBody:
    'Kompass has no servers, accounts, analytics or advertising. The Android version does not even have permission to use the internet. Your questions, translations and location are processed only on this device and are never sent anywhere.',
  aboutTitle: 'About',
  aboutBody:
    'One-time purchase — no subscription, no in-app purchases. The AI model is {model} ({license}). Guide content is general information and no substitute for professional training or medical advice.',
  storage: 'Storage used by models',
} as const;

type Shape = { [K in keyof typeof en]: (typeof en)[K] extends readonly string[] ? readonly string[] : string };

const de: Shape = {
  tabAssistant: 'Assistent',
  tabTranslate: 'Übersetzen',
  tabGuides: 'Anleitungen',
  tabTools: 'Werkzeuge',
  tabSettings: 'Einstellungen',

  offlineBadge: 'Offline · nichts verlässt dieses Telefon',

  modelLoading: 'Die KI auf dem Gerät wird gestartet…',
  modelUnpacking: 'KI-Modell wird vorbereitet (nur beim ersten Start)…',
  modelMissingTitle: 'KI-Modell nicht installiert',
  modelMissingBody:
    'Anleitungen, Kompass und SOS funktionieren auch ohne. Für Assistent und Übersetzer importieren Sie in den Einstellungen eine GGUF-Modelldatei von diesem Gerät.',
  modelError: 'Die KI konnte nicht gestartet werden',
  modelLowMemory: 'Dieses Gerät hat wenig Arbeitsspeicher. Die KI kann langsam sein oder vom System beendet werden.',
  openSettings: 'Einstellungen öffnen',
  retry: 'Erneut versuchen',

  assistantPlaceholder: 'Beschreiben Sie Ihre Lage oder fragen Sie etwas…',
  assistantEmpty:
    'Fragen Sie zu Erster Hilfe, Orientierung, Wetter, Kochen, einer Nachricht — zu allem. Alles läuft auf diesem Telefon.',
  assistantSuggestions: [
    'Ich bin beim Wandern umgeknickt, was nun?',
    'Wie mache ich Bachwasser trinkbar?',
    'Schreiben Sie eine kurze Krankmeldung an meinen Arbeitgeber',
  ],
  send: 'Senden',
  stop: 'Stopp',
  newChat: 'Neuer Chat',
  basedOn: 'Grundlage:',
  emergencyBanner: 'Möglicher Notfall: Rufen Sie jetzt die 112. Folgen Sie dann den Schritten.',
  emergencyGuides: 'Erste-Hilfe-Anleitungen öffnen',
  aiDisclaimer: 'KI-Antworten können falsch sein. Im Notfall den Anleitungen folgen und den Notruf wählen.',

  translateFrom: 'Von',
  translateTo: 'Nach',
  autoDetect: 'Erkennen',
  translatePlaceholder: 'Zu übersetzender Text…',
  translate: 'Übersetzen',
  swap: 'Sprachen tauschen',
  copy: 'Kopieren',
  copied: 'Kopiert',
  clear: 'Leeren',

  guidesSearch: 'Anleitungen durchsuchen (z. B. Verbrennung, Zecke, verirrt)',
  guidesEmergencyTitle: 'Notfall',
  guidesEmergencyBody: 'Wählen Sie 112 — gilt in ganz Europa und auf vielen Telefonen weltweit.',
  catEmergency: 'Notfall',
  catFirstaid: 'Erste Hilfe',
  catOutdoor: 'Draußen & Überleben',
  catEveryday: 'Alltag',
  noResults: 'Keine passende Anleitung.',
  guideDisclaimer:
    'Allgemeine Erste-Hilfe-Informationen. Ersetzt keinen Erste-Hilfe-Kurs und keine ärztliche Beratung. Im Notfall 112 wählen.',
  askAssistant: 'Den Assistenten dazu fragen',
  callBanner: 'Lebensgefahr? Zuerst 112 wählen.',

  compass: 'Kompass',
  compassCalibrate: 'Geringe Genauigkeit — Telefon zur Kalibrierung in einer Acht bewegen.',
  compassMagnetic: 'magnetisch',
  compassTrue: 'geografisch Nord',
  location: 'Mein Standort',
  locationHint:
    'Über GPS-Satelliten — funktioniert ohne Mobilfunknetz. Lesen Sie diese Zahlen der Notrufleitstelle vor.',
  locationWaiting: 'Warte auf GPS-Signal… gehen Sie ins Freie mit freier Sicht zum Himmel.',
  locationDenied:
    'Standortzugriff ist deaktiviert. Aktivieren Sie ihn in den Systemeinstellungen für Koordinaten und Kompass.',
  locationAllow: 'Standort erlauben',
  accuracy: 'Genauigkeit',
  altitude: 'Höhe',
  sos: 'SOS-Lichtsignal',
  sosBody: 'Blinkt S·O·S im Morsecode bildschirmfüllend mit maximalem Kontrast. Bildschirm in Richtung der Retter halten.',
  sosStart: 'SOS starten',
  sosStop: 'Zum Beenden irgendwo tippen',
  alpine: 'Alpines Notsignal',
  alpineBody: '6 Blitze pro Minute, dann eine Minute Pause.',
  alpineStart: 'Alpines Notsignal starten',

  language: 'Sprache',
  languageAuto: 'Gerätesprache',
  aiModel: 'KI-Modell',
  modelReady: 'Bereit',
  modelNotLoaded: 'Nicht geladen',
  modelBundled: 'In der App enthalten',
  modelImported: 'Importiert',
  importModel: 'Modelldatei importieren (.gguf)',
  importing: 'Modell wird kopiert…',
  importInvalid: 'Dies ist keine GGUF-Modelldatei.',
  removeModel: 'Importiertes Modell entfernen',
  gpu: 'GPU-Beschleunigung',
  gpuHint:
    'Schneller auf den meisten iPhones und neueren Samsung-Geräten. Deaktivieren, falls die App beim Antworten abstürzt.',
  privacyTitle: 'Datenschutz',
  privacyBody:
    'Kompass hat keine Server, keine Konten, keine Analyse und keine Werbung. Die Android-Version hat nicht einmal die Berechtigung, das Internet zu nutzen. Ihre Fragen, Übersetzungen und Ihr Standort werden ausschließlich auf diesem Gerät verarbeitet und nirgendwohin gesendet.',
  aboutTitle: 'Über die App',
  aboutBody:
    'Einmalkauf — kein Abo, keine In-App-Käufe. Das KI-Modell ist {model} ({license}). Die Anleitungen sind allgemeine Informationen und ersetzen keine Ausbildung oder ärztliche Beratung.',
  storage: 'Speicherbedarf der Modelle',
};

export type StringKey = keyof typeof en;
export type Strings = Shape;

export const STRINGS: Record<Lang, Strings> = { en, de };
