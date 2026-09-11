# LEGAL.md — Platzhalter vor dem Launch ausfüllen

Alle rechtlichen Seiten unter `legal/*.md` sind **Entwürfe** mit `{{PLATZHALTER}}`-Tokens.
Vor dem Livegang: jeden Token ersetzen, dann die Texte von einer Anwältin/einem Anwalt
für IT-Recht prüfen lassen (Budget 400–900 €, nicht überspringen).

## Platzhalter-Inventar

| Token | Bedeutung | Wo |
|---|---|---|
| `{{ANBIETER_NAME}}` | Vollständiger Name (natürliche Person oder Firma lt. Register) | impressum, datenschutz, agb, widerruf, avv |
| `{{ANBIETER_RECHTSFORM_ZUSATZ}}` | z. B. leer, "e.K." — nur falls zutreffend | impressum |
| `{{STRASSE_HAUSNUMMER}}` | Ladungsfähige Anschrift, Straße + Hausnummer (kein Postfach) | impressum, datenschutz, agb, avv |
| `{{PLZ_ORT}}` | Postleitzahl und Ort | impressum, datenschutz, agb, avv |
| `{{EMAIL}}` | Erreichbare E-Mail-Adresse | impressum, datenschutz, widerruf |
| `{{TELEFON}}` | Telefonnummer (optional im Impressum, empfohlen) | impressum |
| `{{USTID_ODER_HINWEIS}}` | USt-IdNr. `DE…` **oder** der § 19-UStG-Satz (Kleinunternehmer) | impressum |
| `{{VERANTWORTLICHER_INHALTE}}` | Inhaltlich Verantwortliche/r (Name + Anschrift) | impressum |
| `{{HOSTER_NAME_ANSCHRIFT}}` | Hosting-Anbieter (z. B. Hetzner Online GmbH, Gunzenhausen) | datenschutz, avv |
| `{{EMAIL_PROVIDER_NAME}}` | Transaktions-E-Mail-Dienst (Resend/SMTP-Anbieter) + Sitz | datenschutz, avv |
| `{{LLM_PROVIDER_ABSCHNITT}}` | Ehrlicher Abschnitt zum LLM-Anbieter inkl. Drittlandtransfer — **entfällt bei LLM_PROVIDER=none** | datenschutz |
| `{{STRIPE_ENTITY}}` | Vertragsentität von Stripe (Stripe Payments Europe, Ltd.) | datenschutz, agb |
| `{{GERICHTSSTAND_ORT}}` | Gerichtsstand für B2B-Klausel | agb |
| `{{DATUM_STAND}}` | Stand-Datum der jeweiligen Fassung | alle |

## Entscheidungen, die die Gründerin/der Gründer dokumentieren muss

1. **Kleinunternehmerregelung** (§ 19 UStG) ja/nein → `VAT_MODE` in `.env` und
   `{{USTID_ODER_HINWEIS}}` konsistent setzen. Preisdarstellung folgt `VAT_MODE`.
2. **Steuernummer im Impressum**: nicht verpflichtend — Empfehlung: nur USt-IdNr. angeben.
3. **Datenschutzbeauftragte/r**: bei diesem Setup regelmäßig nicht erforderlich; der
   Satz "nicht benannt" steht im Entwurf — bei Wachstum prüfen.
4. **LLM-Anbieter**: solange `LLM_PROVIDER=none`, den Abschnitt ersatzlos streichen.
   Sonst Anbieter, Zweck, Rechtsgrundlage und Drittlandmechanismus benennen.
5. **AVV**: Vorlage unter `/avv`; tritt mit Beginn eines Bezahlplans in Kraft
   (B2B-Agenturen brauchen das).

## Checkliste vor Livegang

- [ ] Alle Tokens ersetzt (`grep -rn "{{" legal/` muss leer sein)
- [ ] `Entwurf`-Markierungen entfernt, nachdem anwaltlich geprüft
- [ ] Widerrufs-Checkbox im Checkout aktiv + Zeitstempel-Logging getestet
- [ ] robots-/Bot-Seite live unter `/bot`
- [ ] Datenlöschung (30 Tage Roh-HTML) per Job verifiziert
