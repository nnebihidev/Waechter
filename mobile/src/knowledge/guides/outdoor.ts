import type { Guide } from '../types';

export const OUTDOOR_GUIDES: Guide[] = [
  {
    id: 'lost',
    category: 'outdoor',
    icon: 'compass',
    urgent: false,
    content: {
      en: {
        title: 'Lost in the forest or mountains',
        summary: 'S.T.O.P.: Stop, Think, Observe, Plan. Staying put is often the safest choice.',
        keywords: ['lost', 'forest', 'woods', 'mountain', 'hiking', 'trail', 'orientation', 'stuck', 'darkness', 'night'],
        sections: [
          {
            heading: 'S.T.O.P.',
            steps: [
              'STOP: stand still, sit down, drink some water. Panic causes most bad decisions.',
              'THINK: where did you last know your position? Who knows your route?',
              'OBSERVE: note your coordinates (Tools tab), the terrain, the weather, daylight left, your supplies.',
              'PLAN: decide on one clear course of action before moving.',
            ],
          },
          {
            heading: 'Stay or move?',
            steps: [
              'If someone knows your route and expects you back, staying in one visible place is usually best — rescuers search along planned routes.',
              'If you move, only follow clear features (a path, a track, a ridge) and mark your way with arrows of sticks or stones.',
              'Do not follow streams down into gorges or descend steep ground in poor visibility.',
              'Stop moving at least an hour before dark and prepare for the night: shelter, insulation, warmth.',
            ],
          },
          {
            heading: 'Phone and battery',
            steps: [
              'Try 112 from the highest open point nearby. Send a text with your coordinates to someone — texts often get through when calls fail.',
              'Then save power: airplane mode, low-power mode, dim screen. Keep the phone warm in an inner pocket.',
            ],
          },
        ],
      },
      de: {
        title: 'Verirrt im Wald oder Gebirge',
        summary: 'S.T.O.P.: Stehen bleiben, Nachdenken, Beobachten, Planen. Am Ort bleiben ist oft am sichersten.',
        keywords: ['verirrt', 'verlaufen', 'wald', 'berg', 'gebirge', 'wandern', 'weg', 'orientierung', 'festsitzen', 'dunkelheit', 'nacht'],
        sections: [
          {
            heading: 'S.T.O.P.',
            steps: [
              'STEHEN BLEIBEN: anhalten, hinsetzen, etwas trinken. Panik führt zu den meisten Fehlentscheidungen.',
              'NACHDENKEN: Wo war Ihr letzter sicher bekannter Standort? Wer kennt Ihre Route?',
              'BEOBACHTEN: Koordinaten notieren (Werkzeuge), Gelände, Wetter, verbleibendes Tageslicht, Vorräte.',
              'PLANEN: Entscheiden Sie sich für ein klares Vorgehen, bevor Sie losgehen.',
            ],
          },
          {
            heading: 'Bleiben oder gehen?',
            steps: [
              'Wenn jemand Ihre Route kennt und Sie zurückerwartet, ist es meist am besten, an einem gut sichtbaren Ort zu bleiben — gesucht wird entlang geplanter Routen.',
              'Wenn Sie gehen: nur klaren Linien folgen (Weg, Forststraße, Grat) und den Weg mit Pfeilen aus Stöcken oder Steinen markieren.',
              'Keinen Bächen in Schluchten folgen und bei schlechter Sicht kein steiles Gelände absteigen.',
              'Mindestens eine Stunde vor Dunkelheit anhalten und die Nacht vorbereiten: Unterschlupf, Isolierung, Wärme.',
            ],
          },
          {
            heading: 'Telefon und Akku',
            steps: [
              'Vom höchsten offenen Punkt in der Nähe 112 versuchen. Eine SMS mit Ihren Koordinaten an jemanden senden — SMS kommen oft durch, wenn Anrufe scheitern.',
              'Danach Strom sparen: Flugmodus, Energiesparmodus, Display dunkel. Telefon in einer Innentasche warm halten.',
            ],
          },
        ],
      },
    },
  },
  {
    id: 'water',
    category: 'outdoor',
    icon: 'beaker',
    urgent: false,
    content: {
      en: {
        title: 'Finding and purifying water',
        summary: 'Water matters far more than food. Boiling is the most reliable way to make water safe.',
        keywords: ['water', 'drink', 'thirst', 'boil', 'purify', 'filter', 'stream', 'dehydration', 'tablets', 'food', 'hunger', 'priorities'],
        sections: [
          {
            heading: 'Priorities',
            steps: [
              'Rough rule: people survive about 3 hours exposed in harsh weather, about 3 days without water, about 3 weeks without food. Shelter and water come first.',
            ],
          },
          {
            heading: 'Finding water',
            steps: [
              'Prefer flowing water from springs and streams over standing water.',
              'Avoid water downstream of farms, settlements or roads, and water with algae, foam or dead animals nearby.',
              'Collect rain with a jacket, tarp or plastic bag. Morning dew can be wiped off grass with a cloth.',
            ],
          },
          {
            heading: 'Making it safe',
            steps: [
              'If cloudy: let it settle and pour it through a cloth first.',
              'Boil: bring to a rolling boil for 1 minute (3 minutes above about 2,000 m). This is the most reliable method.',
              'Purification tablets or a filter: follow the product instructions and wait the full contact time.',
              'Only if nothing else is possible: clear water in a clear plastic bottle, left in direct sunlight for at least 6 hours, reduces germs (not chemicals).',
              'Do not drink seawater or urine.',
            ],
          },
          {
            heading: 'Wild plants and mushrooms',
            steps: [
              'Do not eat wild mushrooms or plants unless you are absolutely certain what they are. Several deadly species look like edible ones.',
              'A healthy adult can go weeks without food — it is rarely worth the risk.',
            ],
          },
        ],
      },
      de: {
        title: 'Wasser finden und aufbereiten',
        summary: 'Wasser ist viel wichtiger als Nahrung. Abkochen ist die zuverlässigste Methode.',
        keywords: ['wasser', 'trinken', 'durst', 'abkochen', 'aufbereiten', 'filtern', 'bach', 'quelle', 'tabletten', 'essen', 'hunger', 'prioritäten'],
        sections: [
          {
            heading: 'Prioritäten',
            steps: [
              'Faustregel: etwa 3 Stunden ungeschützt bei extremem Wetter, etwa 3 Tage ohne Wasser, etwa 3 Wochen ohne Nahrung. Schutz und Wasser haben Vorrang.',
            ],
          },
          {
            heading: 'Wasser finden',
            steps: [
              'Fließendes Wasser aus Quellen und Bächen ist stehendem Wasser vorzuziehen.',
              'Meiden Sie Wasser unterhalb von Höfen, Siedlungen oder Straßen sowie Wasser mit Algen, Schaum oder toten Tieren in der Nähe.',
              'Regen mit Jacke, Plane oder Plastiktüte auffangen. Morgentau mit einem Tuch vom Gras wischen.',
            ],
          },
          {
            heading: 'Trinkbar machen',
            steps: [
              'Trübes Wasser: absetzen lassen und durch ein Tuch gießen.',
              'Abkochen: 1 Minute sprudelnd kochen lassen (oberhalb von etwa 2.000 m 3 Minuten). Das ist die zuverlässigste Methode.',
              'Entkeimungstabletten oder Filter: Herstellerangaben befolgen und die volle Einwirkzeit abwarten.',
              'Nur wenn nichts anderes geht: klares Wasser in einer klaren Plastikflasche mindestens 6 Stunden in die direkte Sonne legen — reduziert Keime (keine Chemikalien).',
              'Kein Meerwasser und keinen Urin trinken.',
            ],
          },
          {
            heading: 'Wildpflanzen und Pilze',
            steps: [
              'Essen Sie keine wilden Pilze oder Pflanzen, wenn Sie sie nicht zweifelsfrei kennen. Mehrere tödliche Arten sehen essbaren zum Verwechseln ähnlich.',
              'Ein gesunder Erwachsener kommt wochenlang ohne Nahrung aus — das Risiko lohnt sich selten.',
            ],
          },
        ],
      },
    },
  },
  {
    id: 'shelter',
    category: 'outdoor',
    icon: 'home',
    urgent: false,
    content: {
      en: {
        title: 'Shelter and warmth for the night',
        summary: 'Insulate from the ground, block the wind, stay dry. Small spaces stay warmer.',
        keywords: ['shelter', 'night', 'sleep', 'camp', 'tarp', 'fire', 'warm', 'cold', 'bivouac', 'rain'],
        sections: [
          {
            heading: 'Shelter',
            steps: [
              'Pick a spot out of the wind, not in a hollow where cold air and water collect, and away from dead trees and falling rocks.',
              'Insulation from the ground matters most: a thick layer of dry leaves, branches, a backpack or mat beneath you.',
              'Build small: a lean-to of branches against a fallen tree or rock, covered with leaves, a tarp or a rescue blanket.',
              'Put on all your clothing, keep it dry, cover head and neck. Huddle together if you are a group.',
            ],
          },
          {
            heading: 'Fire',
            steps: [
              'Respect fire bans and forest-fire warnings. In dry conditions an open fire can be more dangerous than the cold.',
              'Use an existing fire ring or clear bare ground, away from overhanging branches, roots and dry grass.',
              'Start small: tinder (dry grass, birch bark), then twigs, then thicker wood. Collect enough wood before dark.',
              'Never leave a fire unattended. Put it out completely with water and soil until it is cold to the touch.',
            ],
          },
        ],
      },
      de: {
        title: 'Unterschlupf und Wärme für die Nacht',
        summary: 'Vom Boden isolieren, Wind abhalten, trocken bleiben. Kleine Räume bleiben wärmer.',
        keywords: ['unterschlupf', 'nacht', 'schlafen', 'biwak', 'plane', 'feuer', 'warm', 'kälte', 'regen', 'lager'],
        sections: [
          {
            heading: 'Unterschlupf',
            steps: [
              'Platz windgeschützt wählen, nicht in einer Senke (Kaltluft, Wasser), fern von toten Bäumen und Steinschlag.',
              'Isolierung vom Boden ist am wichtigsten: dicke Schicht trockenes Laub, Äste, Rucksack oder Matte unter sich.',
              'Klein bauen: Schrägdach aus Ästen an einem umgestürzten Baum oder Fels, bedeckt mit Laub, Plane oder Rettungsdecke.',
              'Alle Kleidung anziehen, trocken halten, Kopf und Hals bedecken. In der Gruppe eng zusammenrücken.',
            ],
          },
          {
            heading: 'Feuer',
            steps: [
              'Beachten Sie Feuerverbote und Waldbrandwarnungen. Bei Trockenheit kann offenes Feuer gefährlicher sein als die Kälte.',
              'Vorhandene Feuerstelle nutzen oder blanken Boden freiräumen, fern von überhängenden Ästen, Wurzeln und trockenem Gras.',
              'Klein beginnen: Zunder (trockenes Gras, Birkenrinde), dann Zweige, dann dickeres Holz. Genug Holz vor Dunkelheit sammeln.',
              'Feuer nie unbeaufsichtigt lassen. Vollständig mit Wasser und Erde löschen, bis alles kalt ist.',
            ],
          },
        ],
      },
    },
  },
  {
    id: 'signals',
    category: 'outdoor',
    icon: 'flashlight',
    urgent: false,
    content: {
      en: {
        title: 'Signalling for help',
        summary: 'Three of anything means distress. Alpine distress signal: 6 signals per minute.',
        keywords: ['signal', 'rescue', 'helicopter', 'whistle', 'mirror', 'sos', 'morse', 'flashlight', 'torch', 'search', 'alpine distress'],
        sections: [
          {
            heading: 'Sound and light',
            steps: [
              'Three signals in a row (three whistle blasts, three flashes, three fires) is widely understood as a call for help.',
              'Alpine distress signal: 6 signals in one minute (one every 10 seconds), then one minute pause, repeat. The answer is 3 signals per minute.',
              'SOS in Morse code: · · · — — — · · · (short-short-short, long-long-long, short-short-short). The Tools tab can flash it on your screen.',
              'A whistle carries much further than your voice and costs less energy.',
            ],
          },
          {
            heading: 'Being seen',
            steps: [
              'Move to open ground: clearings, ridges, riverbanks.',
              'Lay out bright clothing or a rescue blanket. Flash sunlight with a mirror or phone screen towards aircraft.',
              'Ground signals visible from the air: a large V means "need help", a large X means "need medical help". Make them several metres long.',
              'To a helicopter: both arms raised in a Y means "Yes, we need help". One arm up, one down (N) means "No".',
            ],
          },
        ],
      },
      de: {
        title: 'Hilfe signalisieren',
        summary: 'Drei Signale bedeuten Notlage. Alpines Notsignal: 6 Zeichen pro Minute.',
        keywords: ['signal', 'rettung', 'hubschrauber', 'pfeife', 'spiegel', 'sos', 'morse', 'taschenlampe', 'suche', 'alpines notsignal', 'bergnot'],
        sections: [
          {
            heading: 'Ton und Licht',
            steps: [
              'Drei Signale hintereinander (dreimal pfeifen, dreimal blinken, drei Feuer) werden weithin als Hilferuf verstanden.',
              'Alpines Notsignal: 6 Zeichen innerhalb einer Minute (alle 10 Sekunden), dann eine Minute Pause, wiederholen. Antwort: 3 Zeichen pro Minute.',
              'SOS im Morsecode: · · · — — — · · · (kurz-kurz-kurz, lang-lang-lang, kurz-kurz-kurz). Der Bereich Werkzeuge kann es auf dem Bildschirm blinken.',
              'Eine Pfeife ist viel weiter zu hören als Ihre Stimme und kostet weniger Kraft.',
            ],
          },
          {
            heading: 'Gesehen werden',
            steps: [
              'Auf offenes Gelände gehen: Lichtungen, Grate, Flussufer.',
              'Helle Kleidung oder Rettungsdecke auslegen. Mit Spiegel oder Handydisplay Sonnenlicht in Richtung Luftfahrzeug blitzen.',
              'Bodenzeichen aus der Luft: großes V bedeutet „brauche Hilfe", großes X bedeutet „brauche medizinische Hilfe". Mehrere Meter groß auslegen.',
              'Zum Hubschrauber: beide Arme in Y-Form hoch heißt „Ja, wir brauchen Hilfe". Ein Arm hoch, einer runter (N) heißt „Nein".',
            ],
          },
        ],
      },
    },
  },
  {
    id: 'navigation',
    category: 'outdoor',
    icon: 'navigate',
    urgent: false,
    content: {
      en: {
        title: 'Finding direction without a map',
        summary: 'Use the compass in the Tools tab — or the sun, a watch and the stars.',
        keywords: ['direction', 'north', 'south', 'compass', 'sun', 'stars', 'polaris', 'watch', 'navigation', 'orientation'],
        sections: [
          {
            heading: 'Sun',
            steps: [
              'The sun rises roughly in the east and sets roughly in the west.',
              'Northern hemisphere: around midday (about 1 pm in summer time) the sun is roughly in the south. Southern hemisphere: roughly in the north.',
              'Watch method (northern hemisphere): point the hour hand at the sun. South lies halfway between the hour hand and 12 o\'clock (use 1 o\'clock during summer time).',
            ],
          },
          {
            heading: 'Stars',
            steps: [
              'Northern hemisphere: find the Big Dipper (Plough). Extend the line through its two outer "pointer" stars about five times — you reach Polaris, the North Star, which is almost exactly north.',
            ],
          },
          {
            heading: 'Unreliable signs',
            steps: [
              'Moss on trees and the shape of anthills are not reliable direction indicators.',
              'The phone compass needs calibration: move the phone in a figure-eight, and keep it away from metal and magnets.',
            ],
          },
        ],
      },
      de: {
        title: 'Richtung finden ohne Karte',
        summary: 'Nutzen Sie den Kompass im Bereich Werkzeuge — oder Sonne, Uhr und Sterne.',
        keywords: ['richtung', 'norden', 'süden', 'kompass', 'sonne', 'sterne', 'polarstern', 'uhr', 'navigation', 'orientierung'],
        sections: [
          {
            heading: 'Sonne',
            steps: [
              'Die Sonne geht ungefähr im Osten auf und ungefähr im Westen unter.',
              'Nordhalbkugel: um die Mittagszeit (in der Sommerzeit gegen 13 Uhr) steht die Sonne ungefähr im Süden. Südhalbkugel: ungefähr im Norden.',
              'Uhrmethode (Nordhalbkugel): Stundenzeiger auf die Sonne richten. Süden liegt in der Mitte zwischen Stundenzeiger und 12 Uhr (in der Sommerzeit 13 Uhr verwenden).',
            ],
          },
          {
            heading: 'Sterne',
            steps: [
              'Nordhalbkugel: Großen Wagen suchen. Die Verbindung der beiden hinteren Kastensterne etwa fünfmal verlängern — dort steht der Polarstern, fast genau im Norden.',
            ],
          },
          {
            heading: 'Unzuverlässige Zeichen',
            steps: [
              'Moos an Bäumen und die Form von Ameisenhaufen sind keine verlässlichen Richtungsanzeiger.',
              'Der Handykompass braucht Kalibrierung: Telefon in einer Acht bewegen und von Metall und Magneten fernhalten.',
            ],
          },
        ],
      },
    },
  },
  {
    id: 'thunderstorm',
    category: 'outdoor',
    icon: 'thunderstorm',
    urgent: false,
    content: {
      en: {
        title: 'Thunderstorm outdoors',
        summary: 'Leave peaks, ridges and water. Avoid lone trees. A car or building is safe.',
        keywords: ['thunderstorm', 'lightning', 'storm', 'thunder', 'weather', 'rain'],
        sections: [
          {
            steps: [
              'If the time between flash and thunder is under about 30 seconds, seek shelter now. Wait about 30 minutes after the last thunder before going out.',
              'A building or a car with a metal roof (windows closed) is safe.',
              'Get away from summits, ridges, open fields, water and lone trees, poles and fences.',
              'In a forest, stay among lower trees of similar height, keeping distance from trunks.',
              'No shelter: crouch on an insulating item (backpack, mat), feet together, head down, hands on knees. Do not lie flat. Keep several metres from other people.',
            ],
          },
        ],
      },
      de: {
        title: 'Gewitter im Freien',
        summary: 'Gipfel, Grate und Wasser verlassen. Einzelne Bäume meiden. Auto oder Gebäude sind sicher.',
        keywords: ['gewitter', 'blitz', 'sturm', 'donner', 'unwetter', 'regen'],
        sections: [
          {
            steps: [
              'Liegen zwischen Blitz und Donner weniger als etwa 30 Sekunden: jetzt Schutz suchen. Nach dem letzten Donner etwa 30 Minuten warten.',
              'Ein Gebäude oder ein Auto mit Metalldach (Fenster zu) ist sicher.',
              'Weg von Gipfeln, Graten, freien Feldern, Wasser sowie einzeln stehenden Bäumen, Masten und Zäunen.',
              'Im Wald zwischen niedrigeren, gleich hohen Bäumen bleiben, Abstand zu Stämmen halten.',
              'Kein Schutz: auf etwas Isolierendem (Rucksack, Matte) in die Hocke gehen, Füße zusammen, Kopf einziehen, Hände auf die Knie. Nicht hinlegen. Mehrere Meter Abstand zu anderen Personen.',
            ],
          },
        ],
      },
    },
  },
  {
    id: 'power-outage',
    category: 'everyday',
    icon: 'flash-off',
    urgent: false,
    content: {
      en: {
        title: 'Power outage at home',
        summary: 'Stay informed with a battery radio, keep the fridge closed, use torches instead of candles.',
        keywords: ['power outage', 'blackout', 'electricity', 'no power', 'emergency supplies', 'radio', 'candles', 'fridge', 'heating'],
        sections: [
          {
            heading: 'During the outage',
            steps: [
              'Use torches or battery lanterns rather than candles. Never use gas grills, camping stoves or generators indoors — carbon monoxide risk.',
              'Keep fridge and freezer closed: a full freezer usually stays cold for about a day.',
              'Switch off sensitive devices so they are not damaged when power returns; leave one light on to notice it.',
              'A battery or crank radio gives official information. Check on elderly neighbours.',
              'Save your phone battery: this app works fully offline, airplane mode costs least power.',
            ],
          },
          {
            heading: 'Be prepared',
            steps: [
              'Civil-protection agencies recommend supplies for several days (in Germany: up to 10 days): drinking water (about 2 litres per person per day), long-life food, medication, torch, batteries, battery radio, power bank, cash.',
            ],
          },
        ],
      },
      de: {
        title: 'Stromausfall zu Hause',
        summary: 'Mit Batterieradio informiert bleiben, Kühlschrank geschlossen halten, Taschenlampen statt Kerzen.',
        keywords: ['stromausfall', 'blackout', 'strom', 'kein strom', 'notvorrat', 'radio', 'kerzen', 'kühlschrank', 'heizung'],
        sections: [
          {
            heading: 'Während des Ausfalls',
            steps: [
              'Taschenlampen oder Batterielaternen statt Kerzen verwenden. Gasgrills, Campingkocher oder Generatoren nie in Innenräumen betreiben — Kohlenmonoxid-Gefahr.',
              'Kühlschrank und Gefriertruhe geschlossen halten: Eine volle Truhe bleibt meist etwa einen Tag kalt.',
              'Empfindliche Geräte ausschalten, damit sie bei Rückkehr des Stroms nicht beschädigt werden; eine Lampe eingeschaltet lassen, um es zu bemerken.',
              'Ein Batterie- oder Kurbelradio liefert offizielle Informationen. Schauen Sie nach älteren Nachbarn.',
              'Handyakku sparen: Diese App funktioniert vollständig offline, der Flugmodus verbraucht am wenigsten.',
            ],
          },
          {
            heading: 'Vorsorgen',
            steps: [
              'Das Bundesamt für Bevölkerungsschutz (BBK) empfiehlt Vorräte für bis zu 10 Tage: Trinkwasser (etwa 2 Liter pro Person und Tag), haltbare Lebensmittel, Medikamente, Taschenlampe, Batterien, Batterieradio, Powerbank, Bargeld.',
            ],
          },
        ],
      },
    },
  },
];
