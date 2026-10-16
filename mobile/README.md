# Kompass — offline AI companion (iOS & Android)

An app that works where nothing else does: no signal, no Wi-Fi, no account.
Everything — the AI model, first-aid and survival guides, translator, compass and
SOS light — is inside the installed app. **It never talks to the internet.**
Sold once in the App Store / Google Play (paid app, no subscription, no in-app purchases).

| Tab | What it does | Needs the AI model? |
| --- | --- | --- |
| **Assistant** | Chat with a local LLM (Qwen2.5 1.5B, llama.cpp). Questions are matched against the built-in guides and the best matches are given to the model as reference notes, so emergency answers stay grounded. Emergency phrases ("not breathing", "bewusstlos") show a *call 112* banner before the answer. | yes |
| **Translate** | 20 languages, auto-detect source, copy result. | yes |
| **Guides** | 18 curated guides in English and German: emergency call, CPR, recovery position, bleeding, choking, burns, anaphylaxis, hypothermia, heat, fractures, bites & stings, lost, water, shelter & fire, signalling, navigation, thunderstorm, power outage. Offline full-text search. One-tap 112. | **no** |
| **Tools** | Compass (true/magnetic), GPS coordinates in decimal + DMS for the dispatcher (GNSS only, no network), full-screen SOS Morse light and Alpine distress signal. | **no** |
| **Settings** | Language (device / Deutsch / English), model status, import your own `.gguf`, GPU toggle, privacy statement. | — |

The guides and tools deliberately work without the model: on old or low-memory phones,
or before the model has loaded, the life-critical parts are still there.

## How "offline" is enforced

- **Android release builds have no `INTERNET` permission** (`app.config.ts` strips it,
  plus network-state/Wi-Fi-state). The OS refuses every socket — not a promise, a guarantee.
- **iOS** has no per-app network switch, so the code simply contains none:
  `tests/offline.test.ts` fails the build if `src/` or `modules/` use `fetch`,
  `XMLHttpRequest`, `WebSocket`, upload/download APIs, `URLSession`, `java.net`
  or contain any `http(s)://` URL, and if analytics/crash-reporting/ads/push/OTA
  dependencies appear in `package.json`. ATS arbitrary loads are off, privacy
  manifest declares no tracking and no collected data.
- No servers, accounts, licence checks or receipts. Purchase is handled by the store.
- Chats are kept in memory only and never written to disk.

## Design system

Glassmorphism over a living backdrop, light ("Morgennebel") and dark ("Nachtwald"):

- `src/ui/theme.ts` — colour tokens, glass tokens (fill, edge, blur), Manrope type scale.
- `src/ui/glass.tsx` — `Screen` (opaque root + aurora `Backdrop` with slowly drifting radial
  blobs), `Glass` (blur + translucent fill + light edge + shadow), `Press` (spring scale),
  `Reveal` (staggered slide-in), `Pulse` (expanding ring, used by SOS).
- `src/ui/icons.tsx` — hand-drawn 24-grid stroke icon set and the compass-star brand mark.
  Guide data still names Ionicons glyphs; `resolveIcon` maps them.
- `src/components/TabBar.tsx` — floating frosted tab bar with a spring-driven pill.
- Fonts: Manrope (OFL) bundled via `@expo-google-fonts/manrope`; loaded before the splash hides.
- Motion: `react-native-reanimated` v4; every animation respects Reduce Motion.
- Android: `Glass` skips the blur pass by default (`blur` prop opts in) because view blur is
  costly inside long lists; the tab bar and composer keep it. Verify on a mid-range device.

## Project layout

```
mobile/
  app.config.ts             Expo config (permissions, privacy manifest, plugins)
  model/manifest.json       pinned model: file name, size, SHA-256, licence, source
  scripts/fetch-model.mjs   build-time download + SHA-256 verification
  plugins/withOfflineModel.js  packs the model into iOS bundle / Android asset pack
  modules/bundled-model/    tiny Android Expo module: copies the model out of the asset pack
  src/app/                  screens (Expo Router)
  src/ai/                   llama.rn engine, prompts, GGUF check
  src/knowledge/            guides (en/de) + BM25 search
  src/tools/                Morse/SOS timing, coordinate formatting
  tests/                    vitest suites
```

## Development

Requirements: Node ≥ 22, Xcode 16+ (iOS, macOS only) / Android Studio + NDK (Android).
llama.rn requires the React Native New Architecture (default) and a **development build**
— Expo Go cannot load it.

```bash
cd mobile
npm install                 # also downloads llama.rn's prebuilt native libraries
npm run model:fetch         # ~1.1 GB, verified against the SHA-256 in model/manifest.json
npm run ios                 # or: npm run android   (expo run:*, builds a dev client)
npm test                    # vitest
npm run typecheck
npm run doctor              # expo-doctor
```

`npm run model:fetch` is the only step that downloads the model, and it runs on the
developer machine — never in the app.

Dev builds keep the `INTERNET` permission because Metro (the JS dev server) needs it.
On Android, `expo run:android` produces a plain APK that does **not** include
Play asset packs; for local testing either import the `.gguf` via *Settings → Import
model*, or `adb push model/files/*.gguf /sdcard/Download/` and import it from there.

Without `model/files/…gguf` the build still works; the app then shows *"AI model not
installed"* with the import option, and guides/tools work normally.

## Release builds

```bash
cd mobile
npm run model:fetch
npm run prebuild:release    # APP_VARIANT=release expo prebuild --clean
```

- **iOS:** open `ios/Kompass.xcworkspace`, archive, upload. The model is a bundle
  resource (~1.1 GB; App Store limit is 4 GB uncompressed).
- **Android:** `cd android && ./gradlew bundleRelease` → upload the `.aab`.
  The model ships as the install-time asset pack `kompass_model`
  (Play limits: 1.5 GB per pack, 4 GB cumulative install-time). Google Play installs it
  together with the app. On first launch the app copies it once into private storage
  (progress shown), because llama.cpp needs a real file path. To test the exact store
  install locally: `bundletool build-apks --mode=universal --bundle app-release.aab`.
- Or use EAS Build with `APP_VARIANT=release` in the build profile's `env`
  (`model/files/` must be present in the build — e.g. fetch it in an `eas-build-pre-install` hook).

Set `APP_BUNDLE_ID` to your own identifier before the first release
(default placeholder: `app.kompass.offline`).

See [`docs/STORE.md`](docs/STORE.md) for pricing, privacy labels and review notes.

## Model choice

Default: **Qwen2.5-1.5B-Instruct, Q4_K_M** (1.12 GB, Apache-2.0) — strong multilingual
coverage (good for translation) and small enough for phones with ≥ 4 GB RAM. Expected
to run at usable speed on recent iPhones and mid-range Samsung Galaxy devices — measure
on real hardware before committing to minimum requirements in the store listing. Change the model by
editing `model/manifest.json` (file name, size, SHA-256, source); everything else
reads from it. Users can also import any chat-tuned GGUF model on the device.

GPU: Metal is on by default on iOS. On Android, OpenCL acceleration is opt-in in
Settings (supported on Snapdragon/Adreno 7xx+, falls back to CPU elsewhere).

## Known limitations

- Not verified on physical devices from this repository's CI — build and test on real
  hardware (one older iPhone and one mid-range Samsung at minimum) before release.
- Android stores the model twice (asset pack + unpacked copy, ~2.2 GB total) because
  llama.rn cannot load directly from APK assets.
- A 1.5B model makes mistakes. The assistant is grounded on the guides for
  first-aid topics and the UI says so, but the guides — not the AI — are the
  authoritative content.
- The SOS light uses the screen, not the camera flash (no camera permission needed).
- iOS 16.4 or later (Expo SDK 57 minimum); Android builds for store release are arm64 only.
