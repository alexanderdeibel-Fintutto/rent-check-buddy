export interface MieterhoehungInputs {
  // Gruppe 1: Aktuelle Situation
  aktuelle_kaltmiete: number;
  neue_kaltmiete: number;
  wohnflaeche: number;
  
  // Gruppe 2: Zeitpunkte
  letzte_erhoehung: string | null;
  mietbeginn: string;
  erhoehung_erhalten: string;
  
  // Gruppe 3: Standort
  plz: string;
  ist_ballungsgebiet: boolean;
  
  // Gruppe 4: Begründung
  begruendung_art: 'mietspiegel' | 'vergleich' | 'gutachten';
  mietspiegel_genannt: boolean;
  vergleichsmiete_genannt: number | null;
}

export interface MieterhoehungFehler {
  typ: 'wartezeit' | 'kappung' | 'begruendung' | 'formal';
  text: string;
  schwere: 'kritisch' | 'mittel' | 'gering';
}

export interface MieterhoehungResults {
  aktuelle_kaltmiete: number;
  neue_kaltmiete: number;
  erhoehung_betrag: number;
  erhoehung_prozent: number;
  aktuelle_miete_qm: number;
  neue_miete_qm: number;
  monate_seit_letzter: number;
  wartezeit_ok: boolean;
  kappung_prozent: number;
  kappung_ok: boolean;
  fehler: MieterhoehungFehler[];
  warnungen: MieterhoehungFehler[];
  ist_rechtmaessig: boolean;
  zustimmungsfrist: string;
  empfehlung: string;
}
