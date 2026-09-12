# RAIDLING — Strategie- und Produktpaket

> „Your chat is a living horde. Win the round, raid the next stream."

Stand: 2026-09. Alle Abschnitte sind entscheidungsreif formuliert. Kein Abschnitt
setzt voraus, dass ein anderer zuerst gelesen wird.

---

## 1. Ein-Seiten-Pitch

**Problem.** Raids sind der einzige native Wachstumskanal auf Twitch — und sie sind
inhaltsleer: 30 Sekunden Emote-Spam, dann ist der Moment weg. Chat-Games (Marbles,
Jackbox, Crowd Control) sind kanal-isoliert: Sie unterbrechen den Content, skalieren
schlecht und erzeugen null Distribution. Der Chat, das wertvollste Asset eines
Streamers, ist unsichtbar.

**Lösung.** RAIDLING macht den Chat zur sichtbaren Horde auf dem Stream: Jeder
Chatter wird per `!join` ein Raidling (Name + Profilbild), Ziel ist die Krone am
Webcam-Rahmen des Streamers. Runde: 45–90 Sekunden, der Streamer spielt währenddessen
sein Hauptgame weiter. Der Rundensieger wird Boss — und fällt beim nächsten Raid in
den Overlay des Zielstreamers ein. Jeder Raid ist ein Spielzug. Jeder Spielzug ist
Distribution.

**Warum es kein Marbles ist.** Marbles endet am Kanalrand. RAIDLING ist ein Netzwerk:
Boss-Identitäten (Narben, Titel, Skins) reisen kanalübergreifend. Ein Raid auf einen
Kanal ohne RAIDLING erzeugt eine „Pending Invasion" — einen Claim-Link, der 72 h
reserviert bleibt. Der Zielstreamer, der aktiviert, bekommt die Invasion als erste
Runde nachgespielt. Distribution ist in die Kernmechanik eingebaut, nicht ans
Marketing delegiert.

**Warum jetzt (2026).** Twitch-Discovery ist weiter kaputt; Raids und Clips sind die
einzigen organischen Kanäle. Streamer-Mittelklasse (100–2.000 Viewer) organisiert
sich in Raid-Clustern und Discord-Verbünden — exakt die Struktur, die RAIDLING als
Substrat braucht. Overlay-Tech (OBS Browser Source, EventSub-WebSockets) ist Commodity;
der Engpass ist Game- und Netzwerk-Design, nicht Infrastruktur.

**Markt.** Monetarisierbare Zielgruppe: Affiliates/Partner mit ≥50 Ø-Viewern, die
regelmäßig raiden — grob 150–250 k weltweit. SOM Jahr 1: DACH-Fokus, 2.000 zahlende
Streamer × Ø ~12 €/Monat ≈ 24 k € MRR, plus Chatter-Cosmetics (2–8 €) und Bits-Umsatz
mit deutlich größerer Basis (Chatter : Streamer ≈ 50 : 1).

**Monetarisierung.** Streamer-Abo 9,99 / 19,99 €. Bits-Spawns (Twitch-nativ).
Cosmetics für Chatter über Web-Shop. Brand-Mobs als Sponsoring-Fläche (Phase 3).
Empfangen von Raids ist für immer kostenlos — das Netzwerk darf nie an einer Paywall
sterben.

**Moat.** (1) Kanalübergreifende Boss-Identität: Wechselkosten steigen mit jeder
Narbe. (2) Raid-Graph: Wer die Raid-Beziehungen der Mittelklasse besitzt, besitzt
die Distributionskarte von Twitch. (3) Clip-Flywheel: Jede Kronen-Entscheidung ist
ein 20-Sekunden-Clip mit eingebautem „Was ist das?"-Hook.

**Status & Ask.** MVP in 3 Wochen (1 Mob, Crown-Modus, Raid-Hook, Browser Source —
keine Extension). Launch mit 20 Seed-Streamern in 2 Raid-Clustern, Abschluss-Event
„Kronenkrieg" in Woche 6. Entscheidungsmetrik: Ghost-Raid→Aktivierung ≥ 25 %.

---

## 2. GDD-light

### 2.1 Fantasy
Der Chat ist eine Goblin-artige Horde, der Streamer ein belagerter Monarch. Die Krone
sitzt sichtbar am Webcam-Rahmen. Wer sie stiehlt, herrscht — bis zum nächsten Raid.

### 2.2 Rollen
- **Raidling** (Chatter): joint per `!join` (MVP) oder Extension-Klick (Phase 2).
  Erscheint als Mob mit Anzeigename + Profilbild-Medaillon.
- **Streamer**: verteidigt passiv (Auto-Turrets am Webcam-Rahmen) — er spielt sein
  Hauptgame weiter. Optional: 3 Hotkey-Fähigkeiten (Stream Deck) für Show-Momente.
- **Mods**: können Verteidigungen zünden und Runden starten/abbrechen — Mods sind
  die eigentlichen Operatoren, nicht der Streamer.
- **Boss**: der letzte Rundensieger. Größeres Sprite, Titel, Narben. Reist beim Raid.

### 2.3 Rundenablauf (Crown-Modus, Default)
| Phase | Dauer | Was passiert |
|---|---|---|
| Gather | 15 s | Join-Fenster, Horde sammelt sich am Bildschirmrand, Namens-Ticker |
| Assault | 45–90 s | Horde rennt Wellen gegen den Webcam-Rahmen; Fortschrittsbalken „Kronen-Griff" vs. Verteidigungs-HP |
| Verdict | 10 s | Slow-Motion-Kronenklau oder Verteidigungs-Sieg; Sieger-Card (Name, PFP, neuer Titel) — der Clip-Moment |

Sieglogik: kollektiver Fortschritt entscheidet Horde vs. Streamer; unter den
Raidlings gewinnt der höchste Beitrag (gewichtete Aktionen + Bits), Tiebreak per
seeded RNG. Alles serverseitig deterministisch — der Overlay rendert nur Zustand.

### 2.4 Delay-Design (nicht verhandelbar)
Twitch-Latenz ist 2–8 s. Deshalb: **keine Mechanik verlangt Reaktionen unter 10 s.**
Inputs sind Absichten (`!push`, `!flank`, Extension-Taps), die in 5-Sekunden-Ticks
aggregiert werden. Der Chat steuert Tendenzen, keine Einzelaktionen. Was einzeln
gewürdigt wird (Sieger, Bits-Spawns), ist rückwirkend attribuiert — nie
reaktionszeitabhängig.

### 2.5 Skalierung 8 → 80.000
- ≤ 150 Teilnehmer: jeder ist ein eigener Mob.
- > 150: Squads à n Raidlings mit rotierendem Namensschild. Garantie: **jeder
  Teilnehmer sieht seinen Namen mindestens einmal pro Runde** (Rotation ist
  Pflicht-Feature, nicht Nice-to-have — es ist der Grund zu joinen).
- > 10.000: Squad-Größe wächst logarithmisch; Bits-Spawns und Sieganwärter bleiben
  individuell. Renderbudget konstant: max ~200 bewegte Objekte, 60 fps in OBS.

### 2.6 Modi
1. **CROWN** (Default, MVP): wie oben.
2. **BOSSFIGHT**: Streamer ist Endboss mit HP-Leiste; Bits = DPS-Burst; Sub-Geschenke
   spawnen Elite-Mobs. Für Sub-Athons und Events.
3. **BETRAYAL**: Ein zufälliger Sub ist Maulwurf und sabotiert die Horde; Aufdeckung
   in der Verdict-Phase. Sozialer Modus, hoher Clip-Wert.
4. **INHERITANCE**: Letzter Sieger startet gebufft und verteidigt seinen Titel gegen
   die eigene Community. Erzeugt kanalinterne Rivalitäten.

### 2.7 Progression (kanalübergreifend — der Parasiten-Kern)
- **Narben**: permanente visuelle Marker pro gewonnener Runde (Cap: 10 sichtbar).
- **Titel**: „Kronendieb von <Kanal>", „Dreifach-Usurpator" — Titel nennen Kanäle
  und machen die Reise durch das Netzwerk sichtbar.
- **Skins**: rein kosmetisch, gekauft oder verdient. Kein Stat-Effekt, nie.
- Identität hängt an der Twitch-User-ID und reist über alle Kanäle. Ein Chatter mit
  20 Narben aus 8 Kanälen ist wandelnde Werbung.

### 2.8 Raid-Hook (die eine Mechanik, die alles trägt)
- Raid auf RAIDLING-Kanal: Boss fällt als Invasions-Runde in den Ziel-Overlay ein,
  Zielchat verteidigt gegen den fremden Boss + mitgereiste Raider.
- Raid auf Nicht-RAIDLING-Kanal (**Ghost-Raid**): Boss geht „ins Exil". System
  erzeugt automatisch: (a) Clip der Siegrunde, (b) Claim-Link
  `raidling.gg/claim/<zielkanal>`, 72 h gültig, (c) vorformatierte Nachricht, die
  Mods des raidenden Kanals im Zielchat posten können. Aktiviert der Zielstreamer
  innerhalb 72 h, wird die Invasion als seine erste Runde nachgespielt — Onboarding
  mit eingebautem Anlass statt leerem Tool.

### 2.9 Safety & Moderation (Launch-Blocker, kein Nachtrag)
Namen und Profilbilder auf dem Stream sind eine Angriffsfläche:
- Ban-Sync: gebannte/getimeoutete User fliegen sofort aus der Runde.
- Username-Filter (Denylist + Heuristik) vor jedem Render; PFP-Anzeige pro Kanal
  abschaltbar; Follower-Mindestalter als Join-Bedingung konfigurierbar.
- Mod-Command `!raidling eject <user>` mit Sofortwirkung.
- Ohne diese vier Punkte kein öffentlicher Launch — sie sind zugleich
  Voraussetzung für den späteren Extension-Review.

### 2.10 Visual-Regeln (2-Sekunden-Lesbarkeit)
Silhouetten-Test: Horde, Krone, Fortschrittsbalken müssen als Thumbnail lesbar sein.
Maximal 3 Farbfamilien; Krone ist immer der hellste Punkt des Overlays. Kein
Fullscreen-Effekt länger als 2 s (der Streamer-Content bleibt Hauptdarsteller).

---

## 3. MVP-Featureliste (3 Wochen)

**Scope-Gesetz:** 1 Mob-Typ, 1 Modus (CROWN), Raid-Hook, Browser Source. Keine
Twitch-Extension im MVP — deren Review dauert Wochen und `!join` reicht zum Beweis
der These.

### Woche 1 — Kern sichtbar
- Game-Server (Node, WebSocket), deterministische Runden-Simulation in Ticks.
- Overlay als OBS Browser Source (1920×1080, transparent, PixiJS/Canvas): Horde,
  Krone, Fortschrittsbalken, Sieger-Card.
- Chat-Anbindung über Twitch EventSub-WebSocket (`channel.chat.message`):
  `!join`, `!push`; Namens- + PFP-Rendering über Helix-API.
- Streamer-Dashboard minimal: Twitch-OAuth, Overlay-URL mit Token, Runde
  starten/stoppen.

### Woche 2 — Netzwerk funktioniert
- Persistenz (Postgres): User, Siege, Narben, Titel; Boss-Identität kanalübergreifend.
- EventSub `channel.raid` (ein- und ausgehend) → Invasions-Runde beim Ziel.
- Ghost-Raid komplett: Exil-Zustand, Claim-Link mit 72-h-Reservierung,
  Invasions-Replay nach Aktivierung, Auto-Clip via Helix.
- Safety-Basis: Ban-Sync, Username-Filter, `eject`, PFP-Toggle.

### Woche 3 — Skalierung + Seeds
- Squad-Aggregation > 150 Teilnehmer mit Namens-Rotation; Lasttest mit simulierten
  20 k Joins.
- Verdict-Polish: Slow-Motion, Sieger-Card, Sound (abschaltbar) — der Clip-Moment
  ist das Marketing, hier fließt das Polishing-Budget hin.
- Runden-Trigger konfigurierbar: manuell / Intervall / Channel-Points-Redemption.
- 5 Streamer Closed Test, tägliche Fixes; Reconnect-Robustheit (OBS-Szenenwechsel,
  Server-Restart mitten in der Runde).

### Explizit NICHT im MVP
Extension, Bits-Integration, Cosmetics-Shop, Bezahlpläne (alle Seeds fahren gratis),
Modi 2–4, Kick/YouTube, Mobile-Ansicht, öffentliche Profile/Feed.

### Plattform-Reihenfolge (Entscheidung, nicht Option)
Der Raid ist ein Twitch-Primitiv. Kick/YouTube haben kein gleichwertiges Event —
dort bräuchte der Transfer einen manuellen „Boss senden"-Link. Deshalb: Twitch-only
bis das Netzwerk auf Twitch nachgewiesen ist. Multi-Plattform vorher ist
Verwässerung.

---

## 4. Twitch-Extension-Spec (Phase 2)

### 4.1 Rollenteilung
- **OBS Browser Source** bleibt die Render-Ebene (volle Grafikfreiheit, keine
  Review-Abhängigkeit, funktioniert für 100 % der Viewer).
- **Extension** (Video-Component-Overlay) ist die Input- und Monetarisierungs-Ebene:
  1-Klick-Join ohne Chat-Command, Cosmetic-Ausrüsten, Bits-Aktionen.
- Konsequenz: Die Extension ist Verstärker, nie Voraussetzung. Jeder Modus muss
  chat-only spielbar bleiben (Mobile-Viewer sehen Extensions oft nicht).

### 4.2 Architektur
```
Viewer-Browser (Extension iframe, sandboxed)
   │  HTTPS + Extension-JWT (signiert mit Extension-Secret)
   ▼
EBS (Extension Backend Service)
   │  validiert JWT, mappt opaque_user_id → Twitch-ID (nur nach Identity-Consent)
   ▼
Game-Server (gleiche Runden-Engine wie Chat-Inputs)  ←— EventSub (Chat, Raid, Cheer)
   │  WebSocket: voller Zustand
   ▼
OBS Browser Source (Overlay)
```
- Extension-Frontend bekommt nur Leichtgewichts-Zustand (Rundenphase, eigener
  Join-Status) über Extension-PubSub — Broadcast ist auf ~1 Nachricht/s und kleine
  Payloads limitiert, also niemals Spielzustand darüber streamen. Voller Zustand
  läuft ausschließlich zum Overlay über eigenen WebSocket.
- Konfiguration pro Kanal über den Twitch-Configuration-Service (Broadcaster-Setup
  im Extension-Config-View), gespiegelt in eigener DB.

### 4.3 Benötigte Scopes/Events (Broadcaster-OAuth beim Onboarding)
- `channel.raid` (ein-/ausgehend), `channel.chat.message`, `channel.cheer`
  (Bits-Spawns), `channel.channel_points_custom_reward_redemption.add`
  (Runden-Trigger), Moderations-Events für Ban-Sync.
- Prinzip: minimale Scopes, jede Erweiterung erst mit dem Feature, das sie braucht —
  Scope-Hunger killt Onboarding-Conversion und Review.

### 4.4 Monetarisierung innerhalb der Extension — die Fallen
- In der Extension ist **nur Bits-in-Extensions** als Bezahlweg zulässig; Links auf
  externe Shops/Payments aus der Extension heraus sind gegen die Richtlinien.
  Konsequenz: Bits-Spawns und Impuls-Käufe laufen in der Extension, der
  Cosmetics-Shop (2–8 €) läuft auf raidling.gg (Stripe) mit Twitch-Login — beworben
  im Stream/Chat-Bot, nie per Link in der Extension.
- Der Bits-Revenue-Split ist von Twitch programmatisch vorgegeben und fließt an den
  Entwickler — **das versprochene 50 %-Bits-Share an Streamer ist damit ein eigenes
  Auszahlungsprogramm**: Payout-Infrastruktur, KYC, in der EU DAC7-Meldepflichten.
  Vor Phase 2 gegen den aktuellen Bits-in-Extensions-Vertrag modellieren; bis dahin
  keine konkrete Split-Zahl öffentlich kommunizieren.
- Identity-Linking (Klarname statt opaque ID) erfordert expliziten Viewer-Consent —
  Join ohne Consent muss als anonymer „Namenloser Raidling" trotzdem funktionieren.

### 4.5 Review-Checkliste (Erfahrungswerte, die Zeit kosten)
Datenschutzerklärung-URL, funktionierender Test-Channel für den Reviewer,
Moderations-Nachweis (4.: Safety-Punkte aus 2.9), kein Auto-Audio, Rate-Limits
dokumentiert. Puffer: 2–4 Wochen Review-Zeit einplanen, Einreichung parallel zur
Entwicklung von Phase 2, nicht danach.

---

## 5. Onboarding für Streamer (Ziel: < 5 Minuten bis zur ersten Runde)

1. **Login** mit Twitch-OAuth auf raidling.gg — ein Klick, Scopes gebündelt und
   erklärt („Wir lesen Chat + Raids. Wir posten nichts ohne dich.").
2. **Overlay einbinden**: Eine URL (mit Kanal-Token) kopieren → OBS Browser Source,
   1920×1080. 15-Sekunden-GIF daneben. Dashboard zeigt Live-Häkchen, sobald der
   Overlay verbunden ist — kein „hat es geklappt?"-Rätselraten.
3. **Soloprobe**: Button „Testrunde" spawnt eine Bot-Horde mit Fantasienamen.
   Der Streamer erlebt den Kronenklau, bevor der Chat je davon weiß. Das ist der
   Aha-Moment und er darf nicht vom Chat abhängen.
4. **Defaults setzen** (alles vorbelegt): Runden-Trigger (manuell / alle X min /
   Channel Points), Runden-Cap pro Stream, PFP-Anzeige an/aus, Follower-Mindestalter.
5. **Raid-Hook aktivieren**: ein Toggle, Erklärung in einem Satz: „Dein Rundensieger
   fällt beim Raid drüben ein — und fremde Bosse bei dir."

Danach: Chat-Bot postet einmalig eine Ankündigung (vom Streamer bestätigt), erste
echte Runde per Klick. Mod-Kurzanleitung (3 Commands) als kopierbarer Text für den
Mod-Discord. Kein Schritt verlangt ein zweites Fenster für Viewer.

**Messpunkte im Funnel:** OAuth → Overlay verbunden → Testrunde → erste Live-Runde →
Runde in Stream Nr. 2. Jeder Abbruchpunkt bekommt eine eigene Mail/DM-Rettung.

---

## 6. 20 Produktnamen mit Claim

Empfehlung vorab: **RAIDLING behalten.** Der Name enthält die Mechanik (Raid) und
die Verniedlichung, die Kauf-Cosmetics emotional trägt. Alle 20 vor Nutzung auf
Marken-/Domain-Kollision prüfen (EUIPO/USPTO, .gg/.tv).

| # | Name | Claim |
|---|---|---|
| 1 | **RAIDLING** | Your chat is a living horde. |
| 2 | CROWNFALL | Die Krone hält nie lange. |
| 3 | KRONENKLAU | Klau die Krone. Erb den Stream. |
| 4 | USURP | Steal the crown. Rule the raid. |
| 5 | HORDLING | Aus Chat wird Horde. |
| 6 | THRONRAUB | Dein Chat will deinen Platz. |
| 7 | MUTINY.GG | Der Chat meutert — live. |
| 8 | OVERTHROWN | Your viewers want your crown. |
| 9 | SWARMLY | One chat. One swarm. |
| 10 | BOSSWECHSEL | Jede Runde ein neuer Herrscher. |
| 11 | VIEWERSTURM | 80.000 Namen. Ein Ziel. |
| 12 | CROWNSNATCH | Grab it. Keep it. Raid with it. |
| 13 | PLÜNDR | Raids sind erst der Anfang. |
| 14 | KINGMAKER.TV | Dein Chat krönt. Dein Chat stürzt. |
| 15 | RAIDBRUT | Gezüchtet im Chat, gefürchtet im Raid. |
| 16 | HORDE ROYALE | Der letzte Name auf dem Schirm gewinnt. |
| 17 | CROWN & CHAOS | Verteidige die Krone. Oder verlier sie schön. |
| 18 | INVADRS | Every raid is an invasion. |
| 19 | GOBLINGE | Klein, laut, unaufhaltsam. |
| 20 | STURMKRONE | Eine Krone. Tausend Hände. |

Top-3 nach Netzwerk-Story: RAIDLING (Mechanik im Namen), USURP (international,
verbreitet sich als Verb: „I got usurped"), KRONENKLAU (DACH-Launch, sofort
verständlich, clipbarer Ausruf).

---

## 7. Launch-Plan: 20 Seed-Streamer

### Grundsatz
Nicht 20 einzelne Streamer, sondern **2 Raid-Cluster à 8–12** — Streamer, die sich
heute schon täglich gegenseitig raiden. Der Raid-Hook wirkt nur, wenn Sender und
Empfänger aktiv sind; isolierte Seeds beweisen nichts und frustrieren.

### Auswahlkriterien
- 100–2.000 Ø-Viewer (groß genug für Horden-Gefühl, klein genug für persönliche
  Betreuung und echten Wachstumshunger).
- Raidet ≥ 4×/Woche, wird regelmäßig geraidet; Mitglied eines Streamer-Discords
  oder Raid-Trains (DACH Variety/Just Chatting zuerst — schnellste Meme-Kultur).
- Aktives Mod-Team ≥ 2 (Mods sind die Operatoren, siehe GDD 2.2).
- Webcam-Streamer (die Krone braucht einen Rahmen).

### Founding-Deal
12 Monate Pro gratis, Custom-Boss-Skin des Kanals, Name in den Credits, direkter
Draht (gemeinsamer Discord mit Gründern, Bug-SLA < 24 h). Gegenleistung: RAIDLING
in ≥ 3 Streams/Woche aktiv, ehrliches Feedback, Teilnahme am Abschluss-Event.

### Zeitplan
- **Woche −2 bis 0:** Handverlesene Ansprache über die Cluster-Discords (warme
  Intros, keine Kalt-DMs). 1:1-Onboarding-Calls à 20 min. Ziel: beide Cluster
  vollständig, bevor irgendwer live geht — ein halb aktives Cluster ist ein totes.
- **Woche 1–2 (Cluster A live):** Tägliche Beobachtung echter Runden, Fixes im
  24-h-Takt. Clip-Bounty: bester RAIDLING-Clip der Woche bekommt einen exklusiven
  Skin. Erste Ghost-Raids passieren organisch → Claim-Funnel scharf stellen.
- **Woche 3–4 (Cluster B dazu):** Erste Cluster-übergreifende Raids. Wöchentliche
  „Boss-Chronik" in die Discords posten (welcher Boss reiste wohin) — die
  Meta-Story ist das Retention-Werkzeug für Streamer.
- **Woche 5–6 — Event „Kronenkrieg":** 7 Tage, öffentliche Liga-Tabelle: Punkte für
  verteidigte Kronen, gestohlene Kronen, erfolgreiche Invasionen. Finale als
  Co-Stream der Tabellenführer. Das Event ist der PR-Moment und der Stichtag für
  die Auswertung.

### KPIs (wöchentlich, ein Dashboard, keine Ausreden)
| Metrik | Ziel |
|---|---|
| Streams mit ≥ 1 Runde / alle Seed-Streams | ≥ 60 % |
| Chat-Teilnahmequote (Joins / aktive Chatter) | ≥ 15 % |
| Ghost-Raid → Aktivierung binnen 72 h | ≥ 25 % |
| Streamer-Retention Woche 4 (noch aktiv) | ≥ 70 % |
| Clips mit RAIDLING-Inhalt / Woche | ≥ 30 |

### Stopp-/Kurskorrektur-Signale
- Teilnahmequote < 5 % nach Tuning → Kernloop-Problem, kein Marketing-Problem:
  Runde umbauen, nicht mehr Seeds anwerben.
- Ghost-Raid-Aktivierung < 10 % → Claim-Funnel und Exil-Inszenierung überarbeiten;
  das ist die Lebensader des Netzwerks.
- Streamer schalten den Overlay nach 2 Wochen ab → Frequenz-/Störungsproblem:
  Runden-Cap und Auto-Trigger-Defaults senken, bevor irgendein Feature dazukommt.
- Explizit **kein** Pivot zum isolierten Highscore-Chat-Game — das steht auf der
  Nicht-bauen-Liste, auch wenn die Zahlen dorthin verführen.

### Was nach den 20 kommt
Kein offener Self-Serve-Launch, solange die Ghost-Raid-Conversion trägt: Die
Warteliste wird über Claim-Links gefüllt — Wachstum folgt dem Raid-Graphen, nicht
einer Landingpage. Self-Serve öffnet erst, wenn Support-Last pro Kanal < 10 min/Woche
ist.
