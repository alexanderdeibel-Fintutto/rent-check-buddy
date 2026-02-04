import { useState } from 'react';
import { Header } from '@/components/Header';
import { AuthModal } from '@/components/AuthModal';
import { MieterhoehungForm } from '@/components/mieterhoehung/MieterhoehungForm';
import { MieterhoehungResult } from '@/components/mieterhoehung/MieterhoehungResult';
import { MieterhoehungCrossSell } from '@/components/mieterhoehung/CrossSellBanner';
import { Button } from '@/components/ui/button';
import { RotateCcw, Scale } from 'lucide-react';
import { useMieterhoehungCheck, getDefaultMieterhoehungInputs } from '@/hooks/useMieterhoehungCheck';
import type { MieterhoehungInputs } from '@/types/mieterhoehung';

const MieterhoehungCheckPage = () => {
  const [inputs, setInputs] = useState<MieterhoehungInputs>(getDefaultMieterhoehungInputs());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const results = useMieterhoehungCheck(inputs);

  const handleReset = () => {
    setInputs(getDefaultMieterhoehungInputs());
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onLoginClick={() => setShowAuthModal(true)} />

      {/* Hero Section */}
      <div className="gradient-primary text-primary-foreground py-10 px-4">
        <div className="container">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-primary-foreground/20 rounded-lg p-2">
              <Scale className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium bg-primary-foreground/20 px-3 py-1 rounded-full">
              Kostenlos prüfen
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Mieterhöhungs-Check
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">
            Prüfen Sie in wenigen Schritten, ob die geforderte Mieterhöhung rechtmäßig ist – 
            Wartezeit, Kappungsgrenze und formale Anforderungen.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="container py-8">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8">
          {/* Left Column - Form */}
          <div className="space-y-5">
            <MieterhoehungForm inputs={inputs} onChange={setInputs} />
            
            <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto">
              <RotateCcw className="h-4 w-4 mr-2" />
              Zurücksetzen
            </Button>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <MieterhoehungResult results={results} />
            <MieterhoehungCrossSell />
          </div>
        </div>
      </main>

      {/* Mobile Sticky Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Status</div>
            <div className={`font-semibold ${results.ist_rechtmaessig ? 'text-success' : 'text-destructive'}`}>
              {results.ist_rechtmaessig ? 'Formal korrekt' : `${results.fehler.length} Fehler`}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Erhöhung</div>
            <div className="font-mono font-bold">
              +{results.erhoehung_betrag.toFixed(2)} €
            </div>
          </div>
        </div>
      </div>

      {/* Padding for mobile footer */}
      <div className="lg:hidden h-20" />

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default MieterhoehungCheckPage;
