import { useMemo } from 'react';
import type { MieterhoehungInputs, MieterhoehungResults, MieterhoehungFehler } from '@/types/mieterhoehung';

function monthsDiff(date1: Date, date2: Date): number {
  const months = (date2.getFullYear() - date1.getFullYear()) * 12;
  return months + date2.getMonth() - date1.getMonth();
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function round(value: number, decimals: number): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

export function getDefaultMieterhoehungInputs(): MieterhoehungInputs {
  const today = new Date();
  const twoYearsAgo = new Date(today);
  twoYearsAgo.setFullYear(today.getFullYear() - 2);
  
  return {
    aktuelle_kaltmiete: 800,
    neue_kaltmiete: 900,
    wohnflaeche: 65,
    letzte_erhoehung: null,
    mietbeginn: twoYearsAgo.toISOString().split('T')[0],
    erhoehung_erhalten: today.toISOString().split('T')[0],
    plz: '',
    ist_ballungsgebiet: false,
    begruendung_art: 'mietspiegel',
    mietspiegel_genannt: false,
    vergleichsmiete_genannt: null,
  };
}

export function useMieterhoehungCheck(inputs: MieterhoehungInputs): MieterhoehungResults {
  return useMemo(() => {
    const {
      aktuelle_kaltmiete,
      neue_kaltmiete,
      wohnflaeche,
      letzte_erhoehung,
      mietbeginn,
      erhoehung_erhalten,
      ist_ballungsgebiet,
      begruendung_art,
      mietspiegel_genannt,
    } = inputs;

    const fehler: MieterhoehungFehler[] = [];
    const warnungen: MieterhoehungFehler[] = [];

    const erhoehung_betrag = neue_kaltmiete - aktuelle_kaltmiete;
    const erhoehung_prozent = aktuelle_kaltmiete > 0 
      ? (erhoehung_betrag / aktuelle_kaltmiete) * 100 
      : 0;
    const aktuelle_miete_qm = wohnflaeche > 0 ? aktuelle_kaltmiete / wohnflaeche : 0;
    const neue_miete_qm = wohnflaeche > 0 ? neue_kaltmiete / wohnflaeche : 0;

    // Calculate months since last increase
    const referenzDate = letzte_erhoehung 
      ? new Date(letzte_erhoehung) 
      : new Date(mietbeginn);
    const erhaltenDate = new Date(erhoehung_erhalten);
    const monate_seit_letzter = monthsDiff(referenzDate, erhaltenDate);
    const wartezeit_ok = monate_seit_letzter >= 15;

    if (!wartezeit_ok) {
      fehler.push({
        typ: 'wartezeit',
        text: `Wartezeit nicht eingehalten! Nur ${monate_seit_letzter} statt mindestens 15 Monate seit der letzten Erhöhung.`,
        schwere: 'kritisch'
      });
    }

    // Check Kappungsgrenze
    const kappung_prozent = ist_ballungsgebiet ? 15 : 20;
    const kappung_ok = erhoehung_prozent <= kappung_prozent;

    if (!kappung_ok) {
      fehler.push({
        typ: 'kappung',
        text: `Kappungsgrenze überschritten! Die Erhöhung beträgt ${round(erhoehung_prozent, 1)}%, maximal erlaubt sind ${kappung_prozent}% in 3 Jahren.`,
        schwere: 'kritisch'
      });
    }

    // Check Begründung
    if (begruendung_art === 'mietspiegel' && !mietspiegel_genannt) {
      fehler.push({
        typ: 'begruendung',
        text: 'Der Mietspiegel muss im Erhöhungsschreiben konkret benannt werden (Name, Ausgabe, Datum).',
        schwere: 'mittel'
      });
    }

    if (begruendung_art === 'vergleich') {
      warnungen.push({
        typ: 'begruendung',
        text: 'Bei Vergleichswohnungen müssen mindestens 3 konkrete Wohnungen mit Adresse genannt sein.',
        schwere: 'gering'
      });
    }

    // Calculate deadline
    const zustimmungsfrist = addMonths(erhaltenDate, 2);
    
    // Determine if increase is lawful
    const ist_rechtmaessig = fehler.filter(f => f.schwere === 'kritisch').length === 0;

    return {
      aktuelle_kaltmiete,
      neue_kaltmiete,
      erhoehung_betrag: round(erhoehung_betrag, 2),
      erhoehung_prozent: round(erhoehung_prozent, 1),
      aktuelle_miete_qm: round(aktuelle_miete_qm, 2),
      neue_miete_qm: round(neue_miete_qm, 2),
      monate_seit_letzter,
      wartezeit_ok,
      kappung_prozent,
      kappung_ok,
      fehler,
      warnungen,
      ist_rechtmaessig,
      zustimmungsfrist: formatDate(zustimmungsfrist),
      empfehlung: ist_rechtmaessig
        ? 'Die Mieterhöhung erscheint formal korrekt. Prüfen Sie dennoch die ortsübliche Vergleichsmiete.'
        : 'Die Mieterhöhung hat formale Fehler. Sie können die Zustimmung verweigern.'
    };
  }, [inputs]);
}
