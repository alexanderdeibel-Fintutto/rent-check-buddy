import { CheckCircle2, XCircle, AlertTriangle, Clock, Percent, Calendar, TrendingUp } from 'lucide-react';
import type { MieterhoehungResults } from '@/types/mieterhoehung';
import { cn } from '@/lib/utils';

interface MieterhoehungResultProps {
  results: MieterhoehungResults;
}

export function MieterhoehungResult({ results }: MieterhoehungResultProps) {
  const {
    ist_rechtmaessig,
    erhoehung_betrag,
    erhoehung_prozent,
    kappung_prozent,
    monate_seit_letzter,
    zustimmungsfrist,
    fehler,
    warnungen,
    empfehlung,
  } = results;

  return (
    <div className="space-y-5">
      {/* Primary Result Card */}
      <div className={cn(
        "result-card border-2 transition-colors",
        ist_rechtmaessig 
          ? "border-success bg-success/5" 
          : "border-destructive bg-destructive/5"
      )}>
        <div className="flex items-start gap-4">
          <div className={cn(
            "flex-shrink-0 rounded-full p-3",
            ist_rechtmaessig ? "bg-success" : "bg-destructive"
          )}>
            {ist_rechtmaessig ? (
              <CheckCircle2 className="h-8 w-8 text-success-foreground" />
            ) : (
              <XCircle className="h-8 w-8 text-destructive-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className={cn(
              "text-xl font-bold",
              ist_rechtmaessig ? "text-success" : "text-destructive"
            )}>
              {ist_rechtmaessig ? 'Erhöhung formal korrekt' : 'Erhöhung fehlerhaft!'}
            </h2>
            <p className="text-muted-foreground mt-1">
              {ist_rechtmaessig 
                ? `+${erhoehung_betrag.toFixed(2)} € pro Monat` 
                : `${fehler.length} Fehler gefunden`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="stat-card">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-medium">Erhöhung</span>
          </div>
          <div className={cn(
            "text-2xl font-bold font-mono",
            erhoehung_prozent > kappung_prozent ? "text-destructive" : "text-foreground"
          )}>
            {erhoehung_prozent.toFixed(1)}%
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
            <Percent className="h-4 w-4" />
            <span className="text-xs font-medium">Kappungsgrenze</span>
          </div>
          <div className="text-2xl font-bold font-mono">
            {kappung_prozent}%
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-medium">Wartezeit</span>
          </div>
          <div className={cn(
            "text-2xl font-bold font-mono",
            monate_seit_letzter < 15 ? "text-destructive" : "text-foreground"
          )}>
            {monate_seit_letzter} Mon.
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
            <Calendar className="h-4 w-4" />
            <span className="text-xs font-medium">Frist bis</span>
          </div>
          <div className="text-lg font-bold font-mono">
            {zustimmungsfrist}
          </div>
        </div>
      </div>

      {/* Deadline Notice */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-primary">Ihre Zustimmungsfrist</p>
            <p className="text-sm text-muted-foreground mt-1">
              Sie haben bis zum <strong className="text-foreground">{zustimmungsfrist}</strong> Zeit zu reagieren. 
              Sie müssen nicht sofort zustimmen!
            </p>
          </div>
        </div>
      </div>

      {/* Errors */}
      {fehler.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-destructive flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Festgestellte Fehler
          </h3>
          <div className="space-y-2">
            {fehler.map((f, i) => (
              <div 
                key={i} 
                className={cn(
                  "rounded-lg p-3 text-sm",
                  f.schwere === 'kritisch' 
                    ? "bg-destructive/10 border border-destructive/20" 
                    : "bg-warning/10 border border-warning/20"
                )}
              >
                <div className="flex items-start gap-2">
                  {f.schwere === 'kritisch' ? (
                    <XCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                  )}
                  <span>{f.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnungen.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-warning flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Hinweise
          </h3>
          <div className="space-y-2">
            {warnungen.map((w, i) => (
              <div 
                key={i} 
                className="bg-warning/10 border border-warning/20 rounded-lg p-3 text-sm"
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                  <span>{w.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendation */}
      <div className="bg-muted rounded-lg p-4">
        <p className="font-medium mb-1">Empfehlung</p>
        <p className="text-sm text-muted-foreground">{empfehlung}</p>
      </div>
    </div>
  );
}
