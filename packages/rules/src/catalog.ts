import type { RuleId, RuleMeta } from './types';

/**
 * The MVP rule catalog. Single source of truth for all German rule copy —
 * the web UI, e-mails and the PDF render from here.
 *
 * Tone: formal (Sie), calm, no guarantees. Never claim "abmahnfest" or
 * "rechtssicher". Uncertain checks stay warns with "anwaltlich prüfen".
 */
export const CATALOG: Record<RuleId, RuleMeta> = {
  // ── A · Erreichbarkeit ────────────────────────────────────────────────
  A1: {
    id: 'A1',
    severity: 'blocker',
    title_de: 'Startseite nicht erreichbar',
    why_de:
      'Die Startseite hat nicht mit einem erfolgreichen HTTP-Status (2xx) geantwortet. Solange die Seite nicht erreichbar ist, können Pflichtangaben nicht geprüft werden — und Besucher wie Behörden sehen eine Fehlerseite.',
    fix_hint_de:
      'Prüfen Sie Hosting, DNS und Weiterleitungen. Rufen Sie die Domain im Browser auf und beheben Sie den angezeigten Fehler, bevor Sie weitere Prüfungen durchführen.',
    legal_basis_label: 'Technische Basisprüfung',
  },
  A2: {
    id: 'A2',
    severity: 'warn',
    title_de: 'Keine gültige TLS-Verschlüsselung (HTTPS)',
    why_de:
      'Die Website wird nicht über eine gültige HTTPS-Verbindung ausgeliefert. Werden personenbezogene Daten (schon ein Kontaktformular genügt) unverschlüsselt übertragen, ist das ein Verstoß gegen die Integritäts- und Vertraulichkeitspflichten der DSGVO.',
    fix_hint_de:
      'Aktivieren Sie ein TLS-Zertifikat (z. B. Let’s Encrypt, bei den meisten Hostern kostenlos) und leiten Sie HTTP dauerhaft auf HTTPS um (301-Redirect).',
    legal_basis_label: 'Art. 5, 32 DSGVO',
  },
  A3: {
    id: 'A3',
    severity: 'warn',
    title_de: 'Impressum oder Datenschutzerklärung nicht von der Startseite verlinkt',
    why_de:
      'Impressum und Datenschutzerklärung müssen leicht erkennbar und unmittelbar erreichbar sein — üblicherweise über einen ständigen Link im Footer. Wir haben auf der Startseite keinen entsprechenden Link gefunden.',
    fix_hint_de:
      'Verlinken Sie „Impressum“ und „Datenschutzerklärung“ mit genau diesen Bezeichnungen sichtbar im Footer jeder Seite.',
    legal_basis_label: '§ 5 DDG · Art. 13 DSGVO',
  },

  // ── B · Impressum ─────────────────────────────────────────────────────
  B1: {
    id: 'B1',
    severity: 'blocker',
    title_de: 'Kein Impressum gefunden',
    why_de:
      'Für geschäftsmäßige Websites ist ein Impressum mit den Pflichtangaben nach § 5 DDG verpflichtend. Ein fehlendes Impressum gehört zu den am häufigsten abgemahnten Mängeln.',
    fix_hint_de:
      'Legen Sie eine eigene Seite /impressum mit allen Pflichtangaben an (Name, ladungsfähige Anschrift, E-Mail, ggf. Vertretungsberechtigte, Registerangaben, USt-IdNr.) und verlinken Sie sie im Footer.',
    legal_basis_label: '§ 5 DDG',
  },
  B2: {
    id: 'B2',
    severity: 'warn',
    title_de: 'Kein Name im Impressum erkennbar',
    why_de:
      'Im Impressum muss der vollständige Name der Anbieterin bzw. des Anbieters stehen — bei Unternehmen die Firma laut Register, bei Einzelpersonen Vor- und Nachname. Wir konnten kein entsprechendes Muster erkennen.',
    fix_hint_de:
      'Nennen Sie den vollständigen Namen bzw. die Firma inklusive Rechtsformzusatz (z. B. „Muster GmbH“) an prominenter Stelle im Impressum. Falls der Name vorhanden ist, aber nur als Bild dargestellt wird, ersetzen Sie ihn durch Text.',
    legal_basis_label: '§ 5 Abs. 1 Nr. 1 DDG',
  },
  B3: {
    id: 'B3',
    severity: 'warn',
    title_de: 'Impressum ohne ladungsfähige Anschrift',
    why_de:
      'Wir haben im Impressum kein Muster aus Straße, Postleitzahl und Ort gefunden. Nach § 5 DDG muss die ladungsfähige Anschrift leicht erkennbar sein. Postfächer allein reichen in der Regel nicht.',
    fix_hint_de:
      'Ergänzen Sie die vollständige Anschrift mit Straße und Hausnummer, Postleitzahl und Ort. Ein reines Postfach genügt in der Regel nicht — im Zweifel anwaltlich prüfen lassen.',
    legal_basis_label: '§ 5 Abs. 1 Nr. 1 DDG',
  },
  B4: {
    id: 'B4',
    severity: 'warn',
    title_de: 'Keine E-Mail-Adresse im Impressum',
    why_de:
      'Das Impressum muss eine Adresse der elektronischen Post enthalten, die eine schnelle Kontaktaufnahme ermöglicht. Wir haben keine E-Mail-Adresse erkannt — auch nicht in verschleierter Schreibweise.',
    fix_hint_de:
      'Nennen Sie eine erreichbare E-Mail-Adresse als Text im Impressum. Falls sie aus Spam-Schutz-Gründen nur als Bild oder per JavaScript eingebunden ist, kann sie von uns (und ggf. von Gerichten) nicht als Angabe erkannt werden.',
    legal_basis_label: '§ 5 Abs. 1 Nr. 2 DDG',
  },
  B5: {
    id: 'B5',
    severity: 'warn',
    title_de: 'Gesellschaftsangaben unvollständig (Vertretung / Handelsregister)',
    why_de:
      'Das Impressum nennt eine eingetragene Gesellschaftsform (z. B. GmbH, UG, AG, e.K., KG). Dann sind zusätzlich die Vertretungsberechtigten sowie Registergericht und Registernummer anzugeben. Mindestens eine dieser Angaben konnten wir nicht finden.',
    fix_hint_de:
      'Ergänzen Sie „Vertreten durch: [Geschäftsführung/Vorstand]“ sowie Registergericht und Registernummer (z. B. „Amtsgericht München, HRB 12345“).',
    legal_basis_label: '§ 5 Abs. 1 Nr. 1, 4 DDG',
  },
  B6: {
    id: 'B6',
    severity: 'warn',
    title_de: 'Umsatzsteuer erwähnt, aber keine USt-IdNr. angegeben',
    why_de:
      'Das Impressum spricht von Umsatzsteuer, enthält aber keine Umsatzsteuer-Identifikationsnummer im Format DE + 9 Ziffern. Wer eine USt-IdNr. besitzt, muss sie im Impressum angeben.',
    fix_hint_de:
      'Tragen Sie Ihre USt-IdNr. (Format „DE123456789“) nach. Falls Sie keine besitzen (z. B. Kleinunternehmerregelung nach § 19 UStG), formulieren Sie das ausdrücklich so.',
    legal_basis_label: '§ 5 Abs. 1 Nr. 6 DDG',
  },
  B7: {
    id: 'B7',
    severity: 'warn',
    title_de: 'Keine Kontaktmöglichkeit außer einem Formular',
    why_de:
      'Neben einem Kontaktformular muss ein unmittelbarer Kommunikationsweg angegeben sein — in der Regel E-Mail, ergänzend Telefon. Wir haben im Impressum weder E-Mail-Adresse noch Telefonnummer gefunden.',
    fix_hint_de:
      'Ergänzen Sie mindestens eine E-Mail-Adresse im Klartext; eine Telefonnummer ist empfehlenswert, aber nicht zwingend.',
    legal_basis_label: '§ 5 Abs. 1 Nr. 2 DDG',
  },

  // ── C · Datenschutz ───────────────────────────────────────────────────
  C1: {
    id: 'C1',
    severity: 'blocker',
    title_de: 'Keine Datenschutzerklärung gefunden',
    why_de:
      'Jede Website, die personenbezogene Daten verarbeitet (bereits Server-Logs genügen), braucht eine Datenschutzerklärung nach Art. 12–14 DSGVO. Wir haben keine gefunden.',
    fix_hint_de:
      'Erstellen Sie eine Seite /datenschutz mit Angaben zu Verantwortlichem, Verarbeitungszwecken, Rechtsgrundlagen, Empfängern, Speicherdauer und Betroffenenrechten und verlinken Sie sie im Footer.',
    legal_basis_label: 'Art. 12–14 DSGVO',
  },
  C2: {
    id: 'C2',
    severity: 'warn',
    title_de: 'Verantwortliche Stelle in der Datenschutzerklärung nicht erkennbar',
    why_de:
      'Die Datenschutzerklärung muss die verantwortliche Stelle (Name und Kontaktdaten) benennen. Wir konnten keinen entsprechenden Abschnitt erkennen.',
    fix_hint_de:
      'Ergänzen Sie am Anfang der Datenschutzerklärung einen Abschnitt „Verantwortlicher“ mit Name, Anschrift und E-Mail-Adresse.',
    legal_basis_label: 'Art. 13 Abs. 1 lit. a DSGVO',
  },
  C3: {
    id: 'C3',
    severity: 'warn',
    title_de: 'Betroffenenrechte nicht erwähnt',
    why_de:
      'Die Datenschutzerklärung muss über die Rechte der betroffenen Personen informieren (u. a. Auskunft, Berichtigung, Löschung, Widerruf). Wir haben keinen dieser Begriffe gefunden.',
    fix_hint_de:
      'Ergänzen Sie einen Abschnitt „Ihre Rechte“, der mindestens Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch, Widerruf und das Beschwerderecht bei einer Aufsichtsbehörde nennt.',
    legal_basis_label: 'Art. 13 Abs. 2 DSGVO',
  },
  C4: {
    id: 'C4',
    severity: 'warn',
    title_de: 'Keine Rechtsgrundlagen benannt',
    why_de:
      'Für jede Verarbeitung ist die Rechtsgrundlage anzugeben (z. B. Art. 6 Abs. 1 lit. a, b oder f DSGVO). Wir haben weder das Wort „Rechtsgrundlage“ noch einen Verweis auf Art. 6 gefunden.',
    fix_hint_de:
      'Benennen Sie je Verarbeitungszweck die einschlägige Rechtsgrundlage, üblicherweise mit Verweis auf Art. 6 Abs. 1 DSGVO.',
    legal_basis_label: 'Art. 13 Abs. 1 lit. c DSGVO',
  },
  C5: {
    id: 'C5',
    severity: 'warn',
    title_de: 'Eingesetzte Dienste in der Datenschutzerklärung nicht erwähnt',
    why_de:
      'Auf der Startseite wurden Dienste von Drittanbietern erkannt (z. B. Google Analytics, Google Fonts, YouTube), die in der Datenschutzerklärung nicht erwähnt werden. Über eingesetzte Dienste und die damit verbundenen Übermittlungen muss informiert werden.',
    fix_hint_de:
      'Ergänzen Sie für jeden erkannten Dienst einen Abschnitt in der Datenschutzerklärung — oder entfernen bzw. lokalisieren Sie den Dienst (z. B. Google Fonts lokal einbinden).',
    legal_basis_label: 'Art. 13 DSGVO',
  },
  C6: {
    id: 'C6',
    severity: 'warn',
    title_de: 'Keine Angaben zur Speicherdauer',
    why_de:
      'Die Datenschutzerklärung muss die Dauer der Speicherung oder zumindest die Kriterien für deren Festlegung nennen. Wir haben keine entsprechenden Angaben gefunden.',
    fix_hint_de:
      'Ergänzen Sie je Verarbeitung eine Angabe zur Speicherdauer bzw. zu den Löschkriterien (z. B. „Server-Logs werden nach 14 Tagen gelöscht“).',
    legal_basis_label: 'Art. 13 Abs. 2 lit. a DSGVO',
  },

  // ── D · Cookies / TDDDG ───────────────────────────────────────────────
  D1: {
    id: 'D1',
    severity: 'info',
    title_de: 'Tracking- oder Marketing-Skripte erkannt',
    why_de:
      'Auf der Startseite wurden bekannte Tracking- bzw. Marketing-Skripte erkannt. Deren Einsatz ist grundsätzlich möglich, verlangt aber in der Regel eine informierte Einwilligung, bevor sie ausgeführt werden.',
    fix_hint_de:
      'Prüfen Sie, ob jeder gelistete Dienst wirklich benötigt wird, und stellen Sie sicher, dass er erst nach Einwilligung lädt (Consent-Management, serverseitiges Gating).',
    legal_basis_label: '§ 25 TDDDG · Art. 6 DSGVO',
  },
  D2: {
    id: 'D2',
    severity: 'warn',
    title_de: 'Kein Consent-Banner erkennbar',
    why_de:
      'Trotz erkannter Tracking-Skripte konnten wir kein Einwilligungs-Banner (Consent-Management) erkennen. Diese Prüfung ist bestmöglich, aber technisch begrenzt — ein vorhandenes Banner belegt umgekehrt keine vollständige Rechtskonformität.',
    fix_hint_de:
      'Setzen Sie ein Consent-Management ein (z. B. ein in der EU gehostetes CMP) und laden Sie nicht notwendige Skripte erst nach aktiver Einwilligung.',
    legal_basis_label: '§ 25 TDDDG',
  },
  D3: {
    id: 'D3',
    severity: 'blocker',
    title_de: 'Marketing-/Analyse-Skripte ohne erkennbare Einwilligung aktiv',
    why_de:
      'Marketing- bzw. Analyse-Skripte werden direkt beim Seitenaufruf geladen, ohne dass eine Einwilligungsabfrage erkennbar wäre. Das Speichern oder Auslesen von Informationen auf Endgeräten ohne Einwilligung verstößt gegen § 25 TDDDG und ist ein häufiger Abmahn- und Bußgeldanlass.',
    fix_hint_de:
      'Binden Sie die betroffenen Skripte ausschließlich nach aktiver Einwilligung ein. Ein Consent-Banner allein genügt nicht — die Skripte dürfen vorher technisch nicht ausgeführt werden.',
    legal_basis_label: '§ 25 TDDDG · Art. 6 Abs. 1 lit. a DSGVO',
  },
  D4: {
    id: 'D4',
    severity: 'warn',
    title_de: 'Vorangekreuzte Einwilligung im Cookie-Banner',
    why_de:
      'Im Consent-Banner sind nicht notwendige Kategorien bereits vorangekreuzt. Eine wirksame Einwilligung erfordert eine aktive Handlung — vorangekreuzte Kästchen genügen nach der Rechtsprechung (EuGH „Planet49“) nicht.',
    fix_hint_de:
      'Stellen Sie alle nicht notwendigen Kategorien standardmäßig auf „aus“. Nur technisch notwendige Kategorien dürfen fest aktiviert sein.',
    legal_basis_label: 'Art. 4 Nr. 11, Art. 7 DSGVO',
  },

  // ── E · Shop / Verbrauchersignale ─────────────────────────────────────
  E1: {
    id: 'E1',
    severity: 'blocker',
    title_de: 'Shop erkannt, aber keine Widerrufsbelehrung gefunden',
    why_de:
      'Die Website zeigt Shop-Merkmale (Warenkorb, Kauf-Buttons, Shop-System), aber wir haben keine Widerrufsbelehrung gefunden. Verbraucher müssen vor Vertragsschluss über ihr Widerrufsrecht informiert werden — ein Klassiker unter den Abmahngründen.',
    fix_hint_de:
      'Erstellen Sie eine Seite mit der gesetzlichen Widerrufsbelehrung inklusive Muster-Widerrufsformular und verlinken Sie sie im Footer sowie im Bestellprozess.',
    legal_basis_label: '§ 312g BGB · Art. 246a EGBGB',
  },
  E2: {
    id: 'E2',
    severity: 'warn',
    title_de: 'Preise ohne Umsatzsteuer-Hinweis',
    why_de:
      'Es wurden Preise angezeigt, aber kein Hinweis wie „inkl. MwSt.“ oder „zzgl. Versandkosten“ gefunden. Gegenüber Verbrauchern müssen Gesamtpreise mit eindeutigem Steuer- und Versandkostenhinweis angegeben werden.',
    fix_hint_de:
      'Ergänzen Sie bei jedem Preis den Hinweis „inkl. MwSt., zzgl. Versandkosten“ (bzw. Ihre zutreffende Variante) in unmittelbarer Nähe des Preises.',
    legal_basis_label: '§ 1 PAngV',
  },
  E3: {
    id: 'E3',
    severity: 'warn',
    title_de: 'Keine AGB verlinkt',
    why_de:
      'Für einen Shop sind AGB nicht gesetzlich verpflichtend, aber ohne sie gelten allein die gesetzlichen Regelungen; zudem erwarten Zahlungs- und Plattformpartner sie häufig. Wir haben keinen AGB-Link gefunden.',
    fix_hint_de:
      'Stellen Sie AGB bereit und verlinken Sie sie im Footer und im Bestellprozess. Lassen Sie AGB anwaltlich erstellen oder prüfen — kopierte AGB sind selbst ein Abmahnrisiko.',
    legal_basis_label: '§§ 305 ff. BGB',
  },

  // ── F · Barrierefreiheit (BFSG-Smoke-Test) ────────────────────────────
  F1: {
    id: 'F1',
    severity: 'warn',
    title_de: 'Keine Sprachangabe im HTML (lang-Attribut)',
    why_de:
      'Dem <html>-Element fehlt das lang-Attribut. Screenreader können die Seite dann falsch aussprechen. Für viele verbraucherorientierte Dienste gilt seit 28.06.2025 das BFSG; das lang-Attribut ist eine Grundanforderung (WCAG 3.1.1).',
    fix_hint_de: 'Ergänzen Sie <html lang="de"> (bzw. die zutreffende Sprache) im Seitengerüst.',
    legal_basis_label: 'BFSG · EN 301 549 / WCAG 3.1.1',
  },
  F2: {
    id: 'F2',
    severity: 'warn',
    title_de: 'Mehrere Bilder ohne Alternativtext',
    why_de:
      'Auf der Startseite fehlt bei mehr als drei Bildern das alt-Attribut. Ohne Alternativtexte sind Bildinhalte für blinde Nutzerinnen und Nutzer nicht zugänglich (WCAG 1.1.1). Dies ist ein Stichproben-Hinweis, kein vollständiges Audit.',
    fix_hint_de:
      'Vergeben Sie für inhaltstragende Bilder aussagekräftige alt-Texte; rein dekorative Bilder erhalten ein leeres alt-Attribut (alt="").',
    legal_basis_label: 'BFSG · WCAG 1.1.1',
  },
  F3: {
    id: 'F3',
    severity: 'info',
    title_de: 'Keine Hauptüberschrift (H1) gefunden',
    why_de:
      'Die Startseite hat keine H1-Überschrift. Eine klare Überschriftenstruktur hilft Screenreader-Nutzern und Suchmaschinen, den Seiteninhalt zu erfassen.',
    fix_hint_de: 'Geben Sie der Startseite genau eine aussagekräftige H1-Überschrift.',
    legal_basis_label: 'WCAG 1.3.1 (Best Practice)',
  },

  // ── G · Drift (bezahlte Überwachung) ─────────────────────────────────
  G1: {
    id: 'G1',
    severity: 'info',
    title_de: 'Inhalt einer Rechtsseite hat sich geändert',
    why_de:
      'Der Inhalt einer überwachten Rechtsseite (z. B. Impressum oder Datenschutzerklärung) hat sich seit dem letzten Scan geändert. Das kann gewollt sein — sollte aber bewusst geschehen sein.',
    fix_hint_de:
      'Prüfen Sie, ob die Änderung beabsichtigt war (z. B. durch ein Plugin-Update oder eine Agentur). Unbeabsichtigte Änderungen an Rechtstexten sollten Sie rückgängig machen oder prüfen lassen.',
    legal_basis_label: 'Monitoring-Hinweis',
  },
  G2: {
    id: 'G2',
    severity: 'blocker',
    title_de: 'Link auf Impressum oder Datenschutzerklärung verschwunden',
    why_de:
      'Ein zuvor vorhandener Link auf das Impressum oder die Datenschutzerklärung ist von der Startseite verschwunden — häufig die Folge eines Theme- oder Plugin-Updates. Damit sind die Pflichtseiten nicht mehr leicht erreichbar.',
    fix_hint_de:
      'Stellen Sie den Footer-Link umgehend wieder her und prüfen Sie das letzte Update (Theme, Plugin, Deployment), das ihn entfernt hat.',
    legal_basis_label: '§ 5 DDG · Art. 13 DSGVO',
  },
  G3: {
    id: 'G3',
    severity: 'warn',
    title_de: 'Neuer Tracking-Dienst erkannt',
    why_de:
      'Seit dem letzten Scan wird ein zusätzlicher Tracking- oder Drittanbieter-Dienst geladen, der zuvor nicht vorhanden war. Neue Dienste brauchen in der Regel eine Erwähnung in der Datenschutzerklärung und ggf. eine Einwilligung.',
    fix_hint_de:
      'Klären Sie, woher der neue Dienst stammt (Plugin, Tag Manager, Agentur), ergänzen Sie die Datenschutzerklärung und binden Sie ihn nur nach Einwilligung ein — oder entfernen Sie ihn.',
    legal_basis_label: '§ 25 TDDDG · Art. 13 DSGVO',
  },
};

export const ALL_RULE_IDS = Object.keys(CATALOG) as RuleId[];

/** Human group names for report rendering. */
export const RULE_GROUPS_DE: { prefix: string; name: string }[] = [
  { prefix: 'A', name: 'Erreichbarkeit' },
  { prefix: 'B', name: 'Impressum' },
  { prefix: 'C', name: 'Datenschutzerklärung' },
  { prefix: 'D', name: 'Cookies & Einwilligung' },
  { prefix: 'E', name: 'Shop & Verbraucherpflichten' },
  { prefix: 'F', name: 'Barrierefreiheit (Stichprobe)' },
  { prefix: 'G', name: 'Änderungs-Überwachung' },
];
