# Store release notes — one-time purchase

## Business model

Kompass is a **paid app** (upfront price) on both stores. That is the only model that
fits "never talks to the internet":

- No in-app purchases → no StoreKit/Billing calls, no receipt validation, no server.
- No subscription, no ads, no account.
- Updates are free for buyers (regular store updates).
- Family Sharing (iOS) / Play Family Library can be enabled at the developer's discretion.

Trade-off: there is no licence check at runtime (Google's LVL needs network). Paid
Play apps are still protected by Play's install-time delivery and the asset pack; accept
the residual piracy risk rather than adding a network dependency.

### App Store Connect
- Pricing and Availability → choose a price tier; no In-App Purchases.
- App Privacy → **Data Not Collected**.
- Age rating: medical/treatment information → "Infrequent/Mild Medical/Treatment Information".
- Category: Utilities (secondary: Travel or Health & Fitness — avoid "Medical", which triggers stricter review).

### Google Play Console
- Monetisation → Paid app (cannot be changed back to free later without a new listing).
- Data safety → no data collected, no data shared.
- Content rating questionnaire → answer "yes" for medical information, no user interaction.
- Upload the `.aab` produced by `./gradlew bundleRelease`; Play shows the
  `kompass_model` install-time asset pack in the bundle explorer.

## Assets

- App icon, adaptive icon (foreground / background / monochrome) and splash icon live in
  `assets/`; the source logo and a wordmark are in `docs/brand/`. iOS gets dark/tinted variants
  via `ios.icon` in `app.config.ts`.
- Store screenshots and the Play feature graphic are generated into `docs/store/` by the
  web-preview capture (sample data —
  replace with device captures before submission if the stores ask for it).
- Privacy policy text: `docs/PRIVACY.md` (fill the {{ }} placeholders, host it at a public URL,
  link it in both consoles).

## Review notes (paste into the reviewer field)

> Kompass works fully offline. The AI model is bundled in the app and runs on-device;
> the app makes no network requests (on Android it has no INTERNET permission). Location
> is used only to show coordinates and the compass on screen and never leaves the device.
> Guide content is general first-aid information with a disclaimer to call emergency
> services; the app does not diagnose or treat conditions.

## Listing copy — must stay accurate

Do:
- "Works without internet", "AI runs on your phone", "No account, no subscription".
- "General first-aid and outdoor information".

Do not:
- Claim medical accuracy, certification, or that it replaces emergency services or a
  first-aid course.
- Claim it "saves lives" or guarantees anything.
- Show screenshots of AI answers you have not reproduced on the shipped model.

## Before every release

1. `npm test && npm run typecheck && npm run doctor`
2. `npm run model:fetch` (verifies SHA-256)
3. `npm run prebuild:release` and check `android/app/src/main/AndroidManifest.xml`:
   `INTERNET` must carry `tools:node="remove"`.
4. Install the store build on a real iPhone and a real Samsung device **in airplane mode**:
   first launch (Android: unpack progress), assistant answer, translation, guide search,
   compass, GPS fix outdoors, SOS light.
5. Have the guide content reviewed by a qualified first-aid trainer when it changes.
