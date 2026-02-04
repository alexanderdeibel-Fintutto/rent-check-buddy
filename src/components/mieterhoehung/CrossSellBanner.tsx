import { Calculator, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MieterhoehungCrossSell() {
  return (
    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl p-5">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 bg-primary/10 rounded-lg p-2.5">
          <Calculator className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground">Mieterhöhungs-Rechner</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Berechnen Sie die maximal zulässige Miete nach ortsüblicher Vergleichsmiete.
          </p>
          <Button variant="link" className="h-auto p-0 mt-2 text-primary">
            Zum Rechner
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
