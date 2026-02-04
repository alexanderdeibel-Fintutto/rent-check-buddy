import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { MieterhoehungInputs } from '@/types/mieterhoehung';
import { Euro, Calendar, MapPin, FileText } from 'lucide-react';

interface MieterhoehungFormProps {
  inputs: MieterhoehungInputs;
  onChange: (inputs: MieterhoehungInputs) => void;
}

export function MieterhoehungForm({ inputs, onChange }: MieterhoehungFormProps) {
  const updateField = <K extends keyof MieterhoehungInputs>(
    field: K,
    value: MieterhoehungInputs[K]
  ) => {
    onChange({ ...inputs, [field]: value });
  };

  return (
    <div className="space-y-5">
      {/* Gruppe 1: Aktuelle Situation */}
      <div className="form-group">
        <div className="flex items-center gap-2 form-group-title">
          <Euro className="h-4 w-4" />
          Aktuelle Situation
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="aktuelle_kaltmiete">Aktuelle Kaltmiete</Label>
            <div className="relative">
              <Input
                id="aktuelle_kaltmiete"
                type="number"
                min={0}
                step={10}
                value={inputs.aktuelle_kaltmiete || ''}
                onChange={(e) => updateField('aktuelle_kaltmiete', parseFloat(e.target.value) || 0)}
                className="pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
            </div>
            <p className="text-xs text-muted-foreground">Vor der Erhöhung</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="neue_kaltmiete">Geforderte neue Miete</Label>
            <div className="relative">
              <Input
                id="neue_kaltmiete"
                type="number"
                min={0}
                step={10}
                value={inputs.neue_kaltmiete || ''}
                onChange={(e) => updateField('neue_kaltmiete', parseFloat(e.target.value) || 0)}
                className="pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
            </div>
            <p className="text-xs text-muted-foreground">Nach Erhöhung</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="wohnflaeche">Wohnfläche</Label>
            <div className="relative">
              <Input
                id="wohnflaeche"
                type="number"
                min={0}
                step={1}
                value={inputs.wohnflaeche || ''}
                onChange={(e) => updateField('wohnflaeche', parseFloat(e.target.value) || 0)}
                className="pr-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">m²</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gruppe 2: Zeitpunkte */}
      <div className="form-group">
        <div className="flex items-center gap-2 form-group-title">
          <Calendar className="h-4 w-4" />
          Zeitpunkte
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="mietbeginn">Mietbeginn</Label>
            <Input
              id="mietbeginn"
              type="date"
              value={inputs.mietbeginn}
              onChange={(e) => updateField('mietbeginn', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="letzte_erhoehung">Letzte Mieterhöhung</Label>
            <Input
              id="letzte_erhoehung"
              type="date"
              value={inputs.letzte_erhoehung || ''}
              onChange={(e) => updateField('letzte_erhoehung', e.target.value || null)}
            />
            <p className="text-xs text-muted-foreground">Falls keine: leer lassen</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="erhoehung_erhalten">Erhöhung erhalten am</Label>
            <Input
              id="erhoehung_erhalten"
              type="date"
              value={inputs.erhoehung_erhalten}
              onChange={(e) => updateField('erhoehung_erhalten', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Datum des Schreibens</p>
          </div>
        </div>
      </div>

      {/* Gruppe 3: Standort */}
      <div className="form-group">
        <div className="flex items-center gap-2 form-group-title">
          <MapPin className="h-4 w-4" />
          Standort
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="plz">PLZ</Label>
            <Input
              id="plz"
              type="text"
              maxLength={5}
              value={inputs.plz}
              onChange={(e) => updateField('plz', e.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="z.B. 10115"
            />
          </div>

          <div className="space-y-2">
            <Label>Ballungsgebiet?</Label>
            <div className="flex items-center gap-3 h-10">
              <Switch
                id="ist_ballungsgebiet"
                checked={inputs.ist_ballungsgebiet}
                onCheckedChange={(checked) => updateField('ist_ballungsgebiet', checked)}
              />
              <Label htmlFor="ist_ballungsgebiet" className="font-normal text-sm text-muted-foreground">
                {inputs.ist_ballungsgebiet ? '15% Kappungsgrenze' : '20% Kappungsgrenze'}
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">In Ballungsgebieten gilt 15% statt 20%</p>
          </div>
        </div>
      </div>

      {/* Gruppe 4: Begründung */}
      <div className="form-group">
        <div className="flex items-center gap-2 form-group-title">
          <FileText className="h-4 w-4" />
          Begründung der Erhöhung
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="begruendung_art">Art der Begründung</Label>
            <Select
              value={inputs.begruendung_art}
              onValueChange={(value) => updateField('begruendung_art', value as MieterhoehungInputs['begruendung_art'])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mietspiegel">Mietspiegel</SelectItem>
                <SelectItem value="vergleich">Vergleichswohnungen</SelectItem>
                <SelectItem value="gutachten">Sachverständigen-Gutachten</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {inputs.begruendung_art === 'mietspiegel' && (
            <div className="space-y-2">
              <Label>Mietspiegel angegeben?</Label>
              <div className="flex items-center gap-3 h-10">
                <Switch
                  id="mietspiegel_genannt"
                  checked={inputs.mietspiegel_genannt}
                  onCheckedChange={(checked) => updateField('mietspiegel_genannt', checked)}
                />
                <Label htmlFor="mietspiegel_genannt" className="font-normal text-sm text-muted-foreground">
                  {inputs.mietspiegel_genannt ? 'Ja, konkret benannt' : 'Nein / unklar'}
                </Label>
              </div>
            </div>
          )}

          {inputs.begruendung_art !== 'mietspiegel' && (
            <div className="space-y-2">
              <Label htmlFor="vergleichsmiete_genannt">Genannte Vergleichsmiete</Label>
              <div className="relative">
                <Input
                  id="vergleichsmiete_genannt"
                  type="number"
                  min={0}
                  step={0.1}
                  value={inputs.vergleichsmiete_genannt || ''}
                  onChange={(e) => updateField('vergleichsmiete_genannt', parseFloat(e.target.value) || null)}
                  className="pr-14"
                  placeholder="optional"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€/m²</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
