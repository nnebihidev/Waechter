import type { Guide } from '../types';

// General first-aid information aligned with common lay-rescuer guidance
// (European Resuscitation Council / Red Cross). Keep wording conservative:
// when in doubt, the guide tells the user to call emergency services.

export const FIRST_AID_GUIDES: Guide[] = [
  {
    id: 'emergency-call',
    category: 'emergency',
    icon: 'call',
    urgent: true,
    content: {
      en: {
        title: 'Making an emergency call',
        summary: '112 works across Europe and on many phones worldwide. What to say and how to call.',
        keywords: ['112', '911', '999', 'ambulance', 'police', 'fire brigade', 'help', 'sos', 'satellite', 'no signal'],
        sections: [
          {
            heading: 'Numbers',
            steps: [
              '112 is the emergency number in all EU countries and works in many other countries too.',
              '911 in North America, 999 in the UK (112 also works there).',
              'Mobile phones can often reach emergency services through any available network, even if your own provider has no coverage. Some countries (e.g. Germany) do not accept calls without a SIM card.',
            ],
          },
          {
            heading: 'What to say',
            steps: [
              'WHERE: your location as precisely as possible — use the coordinates from the Tools tab.',
              'WHAT happened.',
              'HOW MANY people are injured and how badly.',
              'WAIT for questions. Do not hang up until the dispatcher ends the call.',
            ],
          },
          {
            heading: 'If there is no signal',
            steps: [
              'Move to higher, open ground and try again.',
              'Some newer phones can send emergency messages via satellite — learn how yours works before you need it.',
              'Use the phone\'s built-in Emergency SOS shortcut (iPhone: hold side button and a volume button; Samsung: press the side key repeatedly, if enabled).',
              'Save battery: airplane mode between attempts, low-power mode on, screen brightness down.',
              'Use visual and sound signals — see the "Signalling for help" guide.',
            ],
          },
        ],
      },
      de: {
        title: 'Notruf absetzen',
        summary: 'Die 112 gilt in ganz Europa und funktioniert auf vielen Telefonen weltweit. Was Sie sagen sollten.',
        keywords: ['112', '911', 'notruf', 'rettungsdienst', 'krankenwagen', 'polizei', '110', 'feuerwehr', 'hilfe', 'sos', 'satellit', 'kein netz'],
        sections: [
          {
            heading: 'Nummern',
            steps: [
              '112 ist der Notruf in allen EU-Ländern und funktioniert auch in vielen anderen Ländern.',
              'Polizei in Deutschland: 110. Nordamerika: 911. Großbritannien: 999 (112 geht dort auch).',
              'Handys erreichen den Notruf oft über jedes verfügbare Netz, auch ohne Netz des eigenen Anbieters. In manchen Ländern (z. B. Deutschland) sind Notrufe ohne SIM-Karte nicht möglich.',
            ],
          },
          {
            heading: 'Was Sie sagen',
            steps: [
              'WO: Ihr Standort so genau wie möglich — nutzen Sie die Koordinaten im Bereich Werkzeuge.',
              'WAS ist passiert?',
              'WIE VIELE Verletzte, wie schwer?',
              'WARTEN auf Rückfragen. Legen Sie erst auf, wenn die Leitstelle das Gespräch beendet.',
            ],
          },
          {
            heading: 'Wenn kein Netz verfügbar ist',
            steps: [
              'Gehen Sie auf höher gelegenes, offenes Gelände und versuchen Sie es erneut.',
              'Einige neuere Telefone können Notrufnachrichten über Satellit senden — machen Sie sich vorher damit vertraut.',
              'Nutzen Sie die Notfall-SOS-Funktion des Telefons (iPhone: Seitentaste und eine Lautstärketaste halten; Samsung: Seitentaste mehrmals drücken, falls aktiviert).',
              'Akku sparen: zwischen den Versuchen Flugmodus, Energiesparmodus an, Helligkeit herunter.',
              'Nutzen Sie Licht- und Tonsignale — siehe Anleitung „Hilfe signalisieren".',
            ],
          },
        ],
      },
    },
  },
  {
    id: 'cpr',
    category: 'emergency',
    icon: 'heart',
    urgent: true,
    content: {
      en: {
        title: 'CPR — not breathing normally',
        summary: 'Unresponsive and not breathing normally: call 112, then push hard and fast in the centre of the chest.',
        keywords: ['resuscitation', 'cardiac arrest', 'heart attack', 'unconscious', 'not breathing', 'chest compressions', 'aed', 'defibrillator', 'reanimation'],
        sections: [
          {
            heading: 'Check',
            steps: [
              'Make sure the scene is safe for you.',
              'Shout and gently shake the shoulders. No response?',
              'Tilt the head back, lift the chin, and look, listen and feel for normal breathing for no more than 10 seconds. Occasional gasps are NOT normal breathing.',
            ],
          },
          {
            heading: 'Act',
            steps: [
              'Call 112 (speakerphone) or have someone call. Send someone for an AED (defibrillator) if one is nearby.',
              'Kneel beside the person. Place the heel of one hand in the centre of the chest, the other hand on top.',
              'Push straight down 5–6 cm, at 100–120 compressions per minute. Let the chest rise fully between pushes.',
              'If trained and willing: after 30 compressions give 2 rescue breaths. Otherwise keep doing continuous compressions.',
              'As soon as an AED arrives, switch it on and follow its spoken instructions.',
              'Do not stop until professional help takes over, the person starts breathing normally, or you are physically unable to continue. Swap with another helper every 2 minutes if possible.',
            ],
          },
        ],
      },
      de: {
        title: 'Wiederbelebung — keine normale Atmung',
        summary: 'Nicht ansprechbar und keine normale Atmung: 112 rufen, dann fest und schnell in der Brustmitte drücken.',
        keywords: ['reanimation', 'herzdruckmassage', 'herzstillstand', 'herzinfarkt', 'bewusstlos', 'atmet nicht', 'defibrillator', 'aed', 'beatmung'],
        sections: [
          {
            heading: 'Prüfen',
            steps: [
              'Achten Sie auf Ihre eigene Sicherheit.',
              'Laut ansprechen und an den Schultern rütteln. Keine Reaktion?',
              'Kopf überstrecken, Kinn anheben und höchstens 10 Sekunden auf normale Atmung prüfen (sehen, hören, fühlen). Vereinzelte Schnappatmung ist KEINE normale Atmung.',
            ],
          },
          {
            heading: 'Handeln',
            steps: [
              '112 rufen (Lautsprecher) oder rufen lassen. Jemanden einen AED (Defibrillator) holen lassen, falls in der Nähe.',
              'Neben der Person knien. Handballen in die Mitte des Brustkorbs, die andere Hand darauf.',
              '5–6 cm tief drücken, 100–120 Mal pro Minute. Brustkorb zwischen den Stößen vollständig entlasten.',
              'Wenn Sie es gelernt haben und bereit sind: nach 30 Kompressionen 2 Beatmungen. Sonst durchgehend drücken.',
              'Sobald ein AED da ist: einschalten und den Sprachanweisungen folgen.',
              'Nicht aufhören, bis der Rettungsdienst übernimmt, die Person wieder normal atmet oder Sie nicht mehr können. Wenn möglich alle 2 Minuten abwechseln.',
            ],
          },
        ],
      },
    },
  },
  {
    id: 'recovery-position',
    category: 'firstaid',
    icon: 'bed',
    urgent: true,
    content: {
      en: {
        title: 'Unconscious but breathing',
        summary: 'Recovery position keeps the airway open. Keep checking breathing.',
        keywords: ['recovery position', 'unconscious', 'fainted', 'passed out', 'breathing', 'side position'],
        sections: [
          {
            steps: [
              'Call 112.',
              'Kneel beside the person. Place the arm nearest you at a right angle, palm up.',
              'Bring the far arm across the chest and hold the back of that hand against their near cheek.',
              'Bend the far knee up, then pull on that knee to roll the person towards you onto their side.',
              'Tilt the head back slightly so the mouth points down and fluids can drain.',
              'Cover them to keep warm. Check breathing regularly — if it stops or becomes abnormal, start CPR.',
            ],
          },
        ],
      },
      de: {
        title: 'Bewusstlos, aber atmet',
        summary: 'Die stabile Seitenlage hält die Atemwege frei. Atmung weiter regelmäßig prüfen.',
        keywords: ['stabile seitenlage', 'bewusstlos', 'ohnmacht', 'ohnmächtig', 'atmung', 'seitenlage'],
        sections: [
          {
            steps: [
              '112 rufen.',
              'Neben der Person knien. Den nahen Arm angewinkelt nach oben legen, Handfläche nach oben.',
              'Den fernen Arm über die Brust führen, Handrücken an die nahe Wange legen und dort halten.',
              'Das ferne Knie anwinkeln und die Person daran zu sich auf die Seite ziehen.',
              'Kopf leicht überstrecken, Mund nach unten, damit Flüssigkeit abfließen kann.',
              'Zudecken und warm halten. Atmung regelmäßig prüfen — wenn sie aussetzt oder nicht normal ist: Wiederbelebung.',
            ],
          },
        ],
      },
    },
  },
  {
    id: 'bleeding',
    category: 'firstaid',
    icon: 'water',
    urgent: true,
    content: {
      en: {
        title: 'Severe bleeding',
        summary: 'Press firmly on the wound. For life-threatening limb bleeding a tourniquet may be needed.',
        keywords: ['blood', 'bleeding', 'wound', 'cut', 'tourniquet', 'pressure bandage', 'shock', 'injury'],
        sections: [
          {
            heading: 'Stop the bleeding',
            steps: [
              'Call 112 for heavy bleeding. Protect yourself with gloves or a plastic bag if available.',
              'Press directly and firmly on the wound with a clean cloth or dressing. Keep pressing — do not lift to check.',
              'If blood soaks through, add more material on top and keep pressing.',
              'Apply a firm pressure bandage over the dressing.',
              'Life-threatening bleeding from an arm or leg that pressure cannot control: apply a tourniquet (or a wide improvised band twisted tight with a stick) 5–7 cm above the wound, not on a joint. Tighten until bleeding stops. Note the time. Do not loosen it.',
            ],
          },
          {
            heading: 'Prevent shock',
            steps: [
              'Signs: pale, cold, sweaty skin, fast pulse, anxiety, confusion.',
              'Lay the person down, keep them warm, insulate from the ground, reassure them.',
              'Do not give food or drink.',
            ],
          },
        ],
      },
      de: {
        title: 'Starke Blutung',
        summary: 'Fest auf die Wunde drücken. Bei lebensbedrohlicher Blutung an Arm oder Bein kann ein Tourniquet nötig sein.',
        keywords: ['blut', 'blutung', 'wunde', 'schnitt', 'abbinden', 'tourniquet', 'druckverband', 'schock', 'verletzung'],
        sections: [
          {
            heading: 'Blutung stoppen',
            steps: [
              'Bei starker Blutung 112 rufen. Schützen Sie sich mit Handschuhen oder einer Plastiktüte, falls vorhanden.',
              'Mit sauberem Tuch oder Verband direkt und fest auf die Wunde drücken. Druck halten — nicht zum Nachsehen abheben.',
              'Wenn Blut durchsickert: weiteres Material darauflegen und weiter drücken.',
              'Einen festen Druckverband anlegen.',
              'Lebensbedrohliche Blutung an Arm oder Bein, die sich nicht durch Druck stoppen lässt: Tourniquet (oder breites Band, mit einem Stock festgedreht) 5–7 cm oberhalb der Wunde anlegen, nicht auf einem Gelenk. Festziehen, bis die Blutung steht. Uhrzeit notieren. Nicht wieder lösen.',
            ],
          },
          {
            heading: 'Schock vorbeugen',
            steps: [
              'Anzeichen: blasse, kalte, schweißige Haut, schneller Puls, Unruhe, Verwirrtheit.',
              'Hinlegen, warm halten, vom Boden isolieren, beruhigen.',
              'Nichts zu essen oder zu trinken geben.',
            ],
          },
        ],
      },
    },
  },
  {
    id: 'choking',
    category: 'emergency',
    icon: 'alert-circle',
    urgent: true,
    content: {
      en: {
        title: 'Choking (adult or child over 1 year)',
        summary: 'Encourage coughing. If that fails: 5 back blows, then 5 abdominal thrusts.',
        keywords: ['choking', 'airway', 'swallowed', 'cannot breathe', 'heimlich', 'stuck in throat'],
        sections: [
          {
            steps: [
              'If the person can cough, encourage them to keep coughing.',
              'If coughing stops working: lean them forward and give up to 5 sharp blows between the shoulder blades with the heel of your hand.',
              'Still blocked: stand behind them, place a fist just above the navel, grab it with your other hand and pull sharply inwards and upwards — up to 5 times.',
              'Alternate 5 back blows and 5 abdominal thrusts. Call 112.',
              'If they become unresponsive: lay them down and start CPR.',
              'Anyone who received abdominal thrusts should be checked by a doctor afterwards.',
            ],
          },
        ],
      },
      de: {
        title: 'Ersticken / Verschlucken (Erwachsene und Kinder über 1 Jahr)',
        summary: 'Zum Husten auffordern. Wenn das nicht hilft: 5 Rückenschläge, dann 5 Oberbauchkompressionen.',
        keywords: ['verschluckt', 'ersticken', 'atemwege', 'bekommt keine luft', 'heimlich', 'fremdkörper', 'hals'],
        sections: [
          {
            steps: [
              'Wenn die Person husten kann: zum kräftigen Husten auffordern.',
              'Wenn Husten nicht mehr hilft: Oberkörper nach vorne beugen, bis zu 5 kräftige Schläge mit dem Handballen zwischen die Schulterblätter.',
              'Weiterhin blockiert: hinter die Person stellen, Faust knapp oberhalb des Bauchnabels, mit der anderen Hand umfassen und ruckartig nach innen oben ziehen — bis zu 5 Mal.',
              'Abwechselnd 5 Rückenschläge und 5 Oberbauchkompressionen. 112 rufen.',
              'Wird die Person bewusstlos: hinlegen und mit der Wiederbelebung beginnen.',
              'Nach Oberbauchkompressionen sollte immer ein Arzt die Person untersuchen.',
            ],
          },
        ],
      },
    },
  },
  {
    id: 'burns',
    category: 'firstaid',
    icon: 'flame',
    urgent: false,
    content: {
      en: {
        title: 'Burns and scalds',
        summary: 'Cool with running water for 20 minutes, cover loosely, no creams.',
        keywords: ['burn', 'burned', 'burnt', 'scald', 'scalded', 'hot water', 'fire', 'blister', 'sunburn'],
        sections: [
          {
            steps: [
              'Stop the burning: remove from the heat source, put out flames.',
              'Cool the burn with cool (not ice-cold) running water for about 20 minutes, as soon as possible.',
              'Remove rings, watches and clothing near the burn unless stuck to the skin.',
              'Cover loosely with cling film or a clean, non-fluffy cloth.',
              'Do not use butter, oil, flour, toothpaste or ointments. Do not pop blisters.',
              'Call 112 for large burns, burns on face, hands, joints or genitals, chemical or electrical burns, and burns in children or older people.',
              'With large burns, watch for hypothermia — keep the rest of the body warm.',
            ],
          },
        ],
      },
      de: {
        title: 'Verbrennungen und Verbrühungen',
        summary: 'Etwa 20 Minuten mit fließendem Wasser kühlen, locker abdecken, keine Hausmittel.',
        keywords: ['verbrennung', 'verbrannt', 'verbrühung', 'verbrüht', 'heißes wasser', 'feuer', 'brandblase', 'sonnenbrand'],
        sections: [
          {
            steps: [
              'Ursache beenden: von der Hitzequelle entfernen, Flammen löschen.',
              'So schnell wie möglich etwa 20 Minuten mit kühlem (nicht eiskaltem) fließendem Wasser kühlen.',
              'Ringe, Uhren und Kleidung in der Nähe entfernen, sofern nicht mit der Haut verklebt.',
              'Locker mit Frischhaltefolie oder einem sauberen, fusselfreien Tuch abdecken.',
              'Keine Butter, kein Öl, Mehl, Zahnpasta oder Salben. Blasen nicht öffnen.',
              '112 rufen bei großflächigen Verbrennungen, an Gesicht, Händen, Gelenken oder Genitalien, bei Chemikalien- oder Stromunfällen sowie bei Kindern und älteren Menschen.',
              'Bei großen Flächen auf Unterkühlung achten — den restlichen Körper warm halten.',
            ],
          },
        ],
      },
    },
  },
  {
    id: 'allergy',
    category: 'emergency',
    icon: 'medkit',
    urgent: true,
    content: {
      en: {
        title: 'Severe allergic reaction (anaphylaxis)',
        summary: 'Swelling, breathing difficulty or collapse after a sting, food or medicine: call 112 and use an adrenaline auto-injector.',
        keywords: ['anaphylaxis', 'allergy', 'allergic', 'swelling', 'epipen', 'adrenaline', 'epinephrine', 'hives', 'sting', 'peanut'],
        sections: [
          {
            heading: 'Warning signs',
            steps: [
              'Swelling of lips, tongue or throat, hoarse voice, wheezing or difficulty breathing.',
              'Widespread rash or hives, dizziness, feeling faint, sudden weakness.',
            ],
          },
          {
            heading: 'Act',
            steps: [
              'Call 112 immediately.',
              'If the person has an adrenaline auto-injector, help them use it: outer thigh, through clothing if necessary.',
              'Breathing difficulty: let them sit up. Feeling faint: lay them flat with legs raised. Do not let them stand or walk.',
              'If there is no improvement after 5 minutes and a second injector is available, it may be used.',
              'If they become unresponsive and stop breathing normally, start CPR.',
            ],
          },
        ],
      },
      de: {
        title: 'Schwere allergische Reaktion (Anaphylaxie)',
        summary: 'Schwellung, Atemnot oder Kreislaufprobleme nach Stich, Lebensmittel oder Medikament: 112 rufen und Adrenalin-Autoinjektor verwenden.',
        keywords: ['anaphylaxie', 'allergie', 'allergisch', 'schwellung', 'adrenalin', 'notfallset', 'autoinjektor', 'nesselsucht', 'quaddeln', 'stich', 'erdnuss'],
        sections: [
          {
            heading: 'Warnzeichen',
            steps: [
              'Schwellung von Lippen, Zunge oder Hals, heisere Stimme, pfeifende Atmung oder Atemnot.',
              'Großflächiger Ausschlag oder Quaddeln, Schwindel, Schwächegefühl, drohende Ohnmacht.',
            ],
          },
          {
            heading: 'Handeln',
            steps: [
              'Sofort 112 rufen.',
              'Hat die Person einen Adrenalin-Autoinjektor, helfen Sie bei der Anwendung: Außenseite des Oberschenkels, notfalls durch die Kleidung.',
              'Bei Atemnot: aufrecht sitzen lassen. Bei Schwindel: flach hinlegen, Beine hoch. Nicht aufstehen oder gehen lassen.',
              'Keine Besserung nach 5 Minuten und ein zweiter Injektor vorhanden: dieser darf verwendet werden.',
              'Wird die Person bewusstlos und atmet nicht normal: Wiederbelebung.',
            ],
          },
        ],
      },
    },
  },
  {
    id: 'hypothermia',
    category: 'outdoor',
    icon: 'snow',
    urgent: false,
    content: {
      en: {
        title: 'Hypothermia and cold',
        summary: 'Get out of wind and wet, insulate from the ground, warm slowly. Handle severe cases gently.',
        keywords: ['cold', 'freezing', 'hypothermia', 'shivering', 'frostbite', 'wet', 'winter', 'snow'],
        sections: [
          {
            heading: 'Recognise',
            steps: [
              'Mild: strong shivering, cold hands, clumsiness.',
              'Serious: confusion, slurred speech, drowsiness, shivering that stops — this is an emergency.',
            ],
          },
          {
            heading: 'Act',
            steps: [
              'Get out of the wind and rain. Insulate from the ground (backpack, branches, foam mat).',
              'Replace wet clothing with dry layers; cover the head and neck. Wrap in a rescue blanket, sleeping bag or blankets.',
              'Only if fully awake and able to swallow: warm, sweet drinks. No alcohol.',
              'Do not rub the skin or limbs. Avoid direct heat sources on the skin.',
              'Severe hypothermia: call 112, keep the person lying down, move them very gently.',
            ],
          },
          {
            heading: 'Frostbite',
            steps: [
              'White, hard, numb skin. Do not rub. Rewarm only if it will not freeze again — e.g. in armpits or with body warmth.',
            ],
          },
        ],
      },
      de: {
        title: 'Unterkühlung und Kälte',
        summary: 'Raus aus Wind und Nässe, vom Boden isolieren, langsam wärmen. Schwere Fälle sehr vorsichtig bewegen.',
        keywords: ['kälte', 'frieren', 'unterkühlung', 'zittern', 'erfrierung', 'nass', 'winter', 'schnee'],
        sections: [
          {
            heading: 'Erkennen',
            steps: [
              'Leicht: starkes Zittern, kalte Hände, Ungeschicklichkeit.',
              'Schwer: Verwirrtheit, verwaschene Sprache, Schläfrigkeit, Zittern hört auf — das ist ein Notfall.',
            ],
          },
          {
            heading: 'Handeln',
            steps: [
              'Raus aus Wind und Regen. Vom Boden isolieren (Rucksack, Äste, Isomatte).',
              'Nasse Kleidung gegen trockene Schichten tauschen, Kopf und Hals bedecken. In Rettungsdecke, Schlafsack oder Decken einwickeln.',
              'Nur wenn voll wach und schluckfähig: warme, gezuckerte Getränke. Kein Alkohol.',
              'Haut und Gliedmaßen nicht reiben. Keine direkten Wärmequellen auf die Haut.',
              'Schwere Unterkühlung: 112 rufen, Person liegen lassen und nur sehr vorsichtig bewegen.',
            ],
          },
          {
            heading: 'Erfrierungen',
            steps: [
              'Weiße, harte, gefühllose Haut. Nicht reiben. Nur aufwärmen, wenn kein erneutes Einfrieren droht — z. B. in den Achseln oder mit Körperwärme.',
            ],
          },
        ],
      },
    },
  },
  {
    id: 'heat',
    category: 'outdoor',
    icon: 'sunny',
    urgent: false,
    content: {
      en: {
        title: 'Heat exhaustion and heatstroke',
        summary: 'Hot, confused, collapsing: heatstroke is an emergency. Cool down fast.',
        keywords: ['heat', 'hot', 'heatstroke', 'sunstroke', 'dehydration', 'summer', 'sun', 'dizzy'],
        sections: [
          {
            heading: 'Heat exhaustion',
            steps: [
              'Headache, dizziness, heavy sweating, nausea, weakness.',
              'Move to shade, lie down, raise the legs, loosen clothing, drink water (with a little salt or an electrolyte drink if available).',
            ],
          },
          {
            heading: 'Heatstroke — emergency',
            steps: [
              'Very hot skin, confusion, strange behaviour, seizure or collapse. Sweating may have stopped.',
              'Call 112.',
              'Cool as fast as possible: immerse in cool water if you can, or soak with water and fan constantly; cold packs on neck, armpits and groin.',
              'If unresponsive but breathing: recovery position. Not breathing normally: CPR.',
            ],
          },
        ],
      },
      de: {
        title: 'Hitzeerschöpfung und Hitzschlag',
        summary: 'Heiß, verwirrt, bricht zusammen: Ein Hitzschlag ist ein Notfall. Schnell kühlen.',
        keywords: ['hitze', 'heiß', 'hitzschlag', 'sonnenstich', 'flüssigkeitsmangel', 'dehydrierung', 'sommer', 'sonne', 'schwindel'],
        sections: [
          {
            heading: 'Hitzeerschöpfung',
            steps: [
              'Kopfschmerzen, Schwindel, starkes Schwitzen, Übelkeit, Schwäche.',
              'In den Schatten bringen, hinlegen, Beine hoch, Kleidung lockern, Wasser trinken (mit etwas Salz oder Elektrolytgetränk, falls vorhanden).',
            ],
          },
          {
            heading: 'Hitzschlag — Notfall',
            steps: [
              'Sehr heiße Haut, Verwirrtheit, auffälliges Verhalten, Krampfanfall oder Zusammenbruch. Schwitzen kann aufgehört haben.',
              '112 rufen.',
              'So schnell wie möglich kühlen: wenn möglich in kühles Wasser legen, sonst mit Wasser übergießen und ständig Luft zufächeln; Kühlpacks an Hals, Achseln und Leisten.',
              'Bewusstlos, aber atmet: stabile Seitenlage. Keine normale Atmung: Wiederbelebung.',
            ],
          },
        ],
      },
    },
  },
  {
    id: 'fractures',
    category: 'firstaid',
    icon: 'bandage',
    urgent: false,
    content: {
      en: {
        title: 'Fractures, sprains and twisted ankles',
        summary: 'Do not straighten. Support the limb as found. For sprains: rest, cool, compress, elevate.',
        keywords: ['broken bone', 'fracture', 'sprain', 'ankle', 'twisted', 'splint', 'knee', 'wrist', 'fall'],
        sections: [
          {
            heading: 'Suspected fracture',
            steps: [
              'Keep the injured part still in the position you found it. Do not try to straighten it.',
              'Pad around it (clothing, jacket) and immobilise the joints above and below — e.g. splint with sticks or a rolled mat, or strap an arm to the body.',
              'Open wound over the break: cover with a clean dressing, do not push bone back in.',
              'Check circulation beyond the injury (colour, warmth, feeling). Call 112 for leg, hip, spine or open fractures.',
              'Possible spine or neck injury (fall from height, diving): do not move the person unless they are in danger.',
            ],
          },
          {
            heading: 'Sprain',
            steps: [
              'Rest the joint.',
              'Cool for 10–20 minutes — cold water or a wrapped cold pack, never ice directly on skin.',
              'Light compression bandage, elevate the limb.',
              'If you cannot put any weight on it, assume it may be broken.',
            ],
          },
        ],
      },
      de: {
        title: 'Knochenbruch, Verstauchung, umgeknickter Knöchel',
        summary: 'Nicht gerade richten. In vorgefundener Lage ruhigstellen. Bei Verstauchung: Ruhe, Kühlen, Kompression, Hochlagern.',
        keywords: ['knochenbruch', 'bruch', 'fraktur', 'verstauchung', 'umgeknickt', 'knöchel', 'schiene', 'knie', 'handgelenk', 'sturz'],
        sections: [
          {
            heading: 'Verdacht auf Bruch',
            steps: [
              'Verletzten Körperteil in der vorgefundenen Lage ruhig halten. Nicht gerade richten.',
              'Mit Kleidung abpolstern und die Gelenke darüber und darunter ruhigstellen — z. B. mit Stöcken oder gerollter Isomatte schienen oder den Arm am Körper fixieren.',
              'Offene Wunde über dem Bruch: steril bzw. sauber abdecken, Knochen nicht zurückdrücken.',
              'Durchblutung unterhalb der Verletzung prüfen (Farbe, Wärme, Gefühl). 112 rufen bei Brüchen an Bein, Hüfte, Wirbelsäule oder offenen Brüchen.',
              'Mögliche Wirbelsäulenverletzung (Sturz aus der Höhe, Kopfsprung): Person nicht bewegen, außer bei akuter Gefahr.',
            ],
          },
          {
            heading: 'Verstauchung',
            steps: [
              'Gelenk ruhigstellen.',
              '10–20 Minuten kühlen — kaltes Wasser oder eingewickeltes Kühlpack, nie Eis direkt auf die Haut.',
              'Leichter Kompressionsverband, Gliedmaße hochlagern.',
              'Wenn gar keine Belastung möglich ist, von einem Bruch ausgehen.',
            ],
          },
        ],
      },
    },
  },
  {
    id: 'bites',
    category: 'outdoor',
    icon: 'bug',
    urgent: false,
    content: {
      en: {
        title: 'Ticks, stings and snake bites',
        summary: 'Remove ticks close to the skin. Keep snake-bite victims calm and still and get medical help.',
        keywords: ['tick', 'bee', 'wasp', 'sting', 'snake', 'adder', 'viper', 'bite', 'insect', 'lyme', 'spider', 'dog bite'],
        sections: [
          {
            heading: 'Tick',
            steps: [
              'Grip the tick as close to the skin as possible with fine tweezers or a tick card and pull out slowly and steadily.',
              'Do not crush it or cover it with oil, glue or nail polish.',
              'Disinfect the spot and note the date.',
              'See a doctor if a spreading red ring, fever or flu-like symptoms appear in the following weeks.',
            ],
          },
          {
            heading: 'Bee or wasp sting',
            steps: [
              'Scrape out a bee sting with a fingernail or card. Cool the area.',
              'Sting in the mouth or throat, or signs of an allergic reaction: call 112 — see the anaphylaxis guide.',
            ],
          },
          {
            heading: 'Snake bite',
            steps: [
              'Move away from the snake. Keep the person calm and as still as possible; keep the bitten limb still and roughly at heart level.',
              'Remove rings, watches and tight clothing near the bite before swelling starts.',
              'Do not cut, suck, burn or tie off the bite. Do not try to catch the snake — remember or photograph it from a distance.',
              'Get medical help as soon as possible and note the time of the bite.',
            ],
          },
          {
            heading: 'Animal bite',
            steps: [
              'Wash the wound thoroughly with water (and soap) for several minutes, cover it, and see a doctor — infection and rabies risk depend on the region.',
            ],
          },
        ],
      },
      de: {
        title: 'Zecken, Stiche und Schlangenbisse',
        summary: 'Zecken hautnah entfernen. Bei Schlangenbiss: Ruhe bewahren, nicht bewegen, medizinische Hilfe holen.',
        keywords: ['zecke', 'biene', 'wespe', 'stich', 'schlange', 'kreuzotter', 'viper', 'biss', 'insekt', 'borreliose', 'fsme', 'spinne', 'hundebiss'],
        sections: [
          {
            heading: 'Zecke',
            steps: [
              'Zecke möglichst hautnah mit einer feinen Pinzette oder Zeckenkarte greifen und langsam und gleichmäßig herausziehen.',
              'Nicht quetschen, nicht mit Öl, Kleber oder Nagellack behandeln.',
              'Stelle desinfizieren und Datum notieren.',
              'Zum Arzt, wenn in den folgenden Wochen eine sich ausbreitende Rötung (Wanderröte), Fieber oder grippeähnliche Beschwerden auftreten.',
            ],
          },
          {
            heading: 'Bienen- oder Wespenstich',
            steps: [
              'Bienenstachel mit Fingernagel oder Karte herausschaben. Stelle kühlen.',
              'Stich in Mund oder Rachen oder Zeichen einer allergischen Reaktion: 112 rufen — siehe Anleitung Anaphylaxie.',
            ],
          },
          {
            heading: 'Schlangenbiss',
            steps: [
              'Von der Schlange entfernen. Person beruhigen und möglichst nicht bewegen lassen; gebissene Gliedmaße ruhigstellen, etwa auf Herzhöhe.',
              'Ringe, Uhren und enge Kleidung nahe der Bissstelle entfernen, bevor sie anschwillt.',
              'Nicht einschneiden, aussaugen, ausbrennen oder abbinden. Schlange nicht fangen — aus Entfernung merken oder fotografieren.',
              'So schnell wie möglich medizinische Hilfe holen, Uhrzeit des Bisses notieren.',
            ],
          },
          {
            heading: 'Tierbiss',
            steps: [
              'Wunde mehrere Minuten gründlich mit Wasser (und Seife) spülen, abdecken und ärztlich versorgen lassen — Infektions- und Tollwutrisiko hängen von der Region ab.',
            ],
          },
        ],
      },
    },
  },
];
